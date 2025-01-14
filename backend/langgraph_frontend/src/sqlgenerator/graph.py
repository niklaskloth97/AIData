from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from sqlalchemy.orm import Session
import re
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from langgraph.graph.message import add_messages
import operator
from typing import Annotated, Sequence, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph import END, StateGraph, START
from langgraph.types import interrupt
from src.sqlgenerator.models import Mapping
from langchain.schema import Document, HumanMessage, SystemMessage
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from lib.db import engine, Base

POSTGRES_URI = (
    "postgresql://aidatahilti_owner:YDkg5rC6jpdL"
    "@ep-flat-leaf-a20i5gog.eu-central-1.aws.neon.tech"
    "/aidatahilti?sslmode=require"
)
pg_engine = create_engine(POSTGRES_URI)

# Load environment variables
load_dotenv()

# Database connection
RESTAPI_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join("/Users/philipnartschik/AIData/backend/restapi/project_metadata.db")
DATABASE_URL = os.getenv("SQLITE_DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(DATABASE_URL)

Base = declarative_base()

class AgentState(TypedDict):
    # The add_messages function defines how an update should be processed
    # Default is to replace. add_messages says "append"
    mapping_id: int
    script: Optional[str]
    user_input: Optional[str]
    messages: Annotated[Sequence[BaseMessage], add_messages]
    finalsql: Optional[str]
    prompt: str
    
# 1. Create Graph
graph = StateGraph(AgentState)

def create_tables():
    Base.metadata.create_all(bind=engine)


def load_mapping_node(state) -> Command:
    create_tables()
    """
    First node in the LangGraph that:
      - Fetches the mapping object from the DB
      - Builds an initial prompt or `agenttask` from it
      - Passes updated state on to the next node
    """
    print("---LOAD_MAPPING_NODE---")
    with Session(pg_engine) as db_session:
        mapping_id = state["mapping_id"]
        mapping_id = int(1)
        if not mapping_id:
            # If there's no mapping_id, raise or handle error
            return Command(interrupt="No mapping_id provided.")
        
        # 1) Fetch from DB
        mapping_obj = Session(engine).query(Mapping).get(ident=mapping_id)
        if not mapping_obj:
            return Command(interrupt=f"Mapping with id {mapping_id} not found.")

        # 2) Construct a prompt based on the Mapping object
        #    For instance, you could store important info in agenttask or in messages
        prompt = (
        f"Generate an SQL statement for the event '{mapping_obj.displayName}'. "
        f"Timestamp column is '{mapping_obj.timestampColumn}'. "
        f"Event type: '{mapping_obj.eventType}'. "
        f"Other attributes: {', '.join(mapping_obj.otherAttributes)}. "
        f"Involved table: {mapping_obj.tableInvolved}."
        )

    # 4) Return a Command to continue the flow
    return Command(
        update={"prompt": prompt},
        goto="generate_sql_node"   # e.g. next node in your graph, or whichever node you want
    )
    
def generate_sql_node(state) -> Command:
    sqltemplate = """
    SELECT 
    CONCAT(
        LPAD("EBAN"."MANDT", 3, '0'), 
        LPAD("EBAN"."BANFN", 10, '0'), 
        LPAD("EBAN"."BNFPO", 5, '0')
    ) AS "CASEID",
    "CDHDR"."UDATE" AS "TIMESTAMP",
    'Order Creation Time' AS "EVENTNAME",

    -- 4th column: Build a JSON object of all additional attributes
    JSON_BUILD_OBJECT(
        'User',       "CDHDR"."USERNAME",
        'Transaction',"CDHDR"."TCODE",
        'NewValue',   "CDPOS"."VALUE_NEW",
        'OldValue',   "CDPOS"."VALUE_OLD"
    ) AS "otherAttributes"
    
    FROM "EBAN"
        INNER JOIN "CDPOS"
            ON CONCAT(
                LPAD("EBAN"."MANDT", 3, '0'),
                LPAD("EBAN"."BANFN", 10, '0'),
                LPAD("EBAN"."BNFPO", 5, '0')
            ) = "CDPOS"."TABKEY"
            
        INNER JOIN "CDHDR"
            ON "CDHDR"."OBJECTCLAS" = "CDPOS"."OBJECTCLAS"
        AND "CDHDR"."OBJECTID"   = "CDPOS"."OBJECTID"
        AND "CDHDR"."CHANGENR"   = "CDPOS"."CHANGENR"
            
    WHERE 
        "CDPOS"."FNAME"   = 'KEY'
        AND "CDPOS"."TABNAME" = 'EBAN';
    """
    try: 
        user_input = state["user_input"]
    except KeyError:
        user_input = ""
    model = ChatOpenAI(temperature=0, model="gpt-4o", streaming=False)
    # Initialize the ChatOpenAI model  # Corrected model name

    # System prompt
    system_prompt = SystemMessage(
        content=(
            "You are a SQL expert. Please adjust the following SQL statement with the information provided by the user. "
            "You should rename the Event to whatever the prompt specifies, add the information from the otherAttribute "
            "columns to the output. The CDHDR and CDPOS tables are fixed and should stay. You should adapt the JOIN so it "
            f"matches the primary key for the involvedTable instead of EBAN. The FNAME should be matching the EventType.\n\n{sqltemplate}"
        )
    )

    # Create user prompt
    user_prompt_str = HumanMessage(content=state["prompt"] + "\n" + user_input)

    # Generate the final SQL using the model
    finalsql = model([system_prompt, user_prompt_str])
    pattern = r"```sql\s*(.*?)\s*```"
    
    match = re.search(pattern, finalsql.content, flags=re.DOTALL)
    try:
        finalsql = match.group(1).strip()
    except:
        finalsql = ""  # or handle error if not found
    query_result = ""    
    #query_result = db_query_tool(finalsql)
    if "Error" in query_result:
        return Command(
            update={"finalsql": finalsql},
            goto=END
        )
    return Command(
        update={"finalsql": finalsql},
        goto=END
    )
    
from langchain_core.tools import tool


from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError

# Create a session factory using pg_engine
SessionLocal = sessionmaker(bind=pg_engine)

@tool
def db_query_tool(query: str) -> str:
    """
    Execute a SQL query against the database and get back the result.
    If the query is not correct, an error message will be returned.
    If an error is returned, rewrite the query, check the query, and try again.
    """
    # Initialize a new session
    session = SessionLocal()

    try:
        # Execute the query
        result = session.execute(query).fetchall()
        # If the result is empty
        if not result:
            return "Error: Query returned no results. Please rewrite your query and try again."
        # Convert result to a string or format as needed
        return str(result)
    except SQLAlchemyError as e:
        # Catch and return any SQL errors
        return f"Error: {str(e)}"
    finally:
        # Close the session to prevent connection leaks
        session.close()

# 2. Add Nodes
graph.add_node("load_mapping", load_mapping_node)  # your first node
# (Plus any other nodes: "human_feedback", etc.)
graph.add_node("generate_sql_node", generate_sql_node)  # your second node
# 3. Add Edges
graph.add_edge(START, "load_mapping")   # Start => load the mapping from DB

# 4. Compile
checkpointer = MemorySaver()
compiled_graph = graph.compile(checkpointer=checkpointer)
