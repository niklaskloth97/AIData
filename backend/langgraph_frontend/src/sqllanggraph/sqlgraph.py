from sqlalchemy import DateTime, create_engine, MetaData, Table, Column, Integer, Numeric, ForeignKeyConstraint
from langchain_community.utilities import SQLDatabase
from typing import Any, Annotated, Literal
from langchain_core.messages import ToolMessage, AIMessage
from langchain_core.runnables import RunnableLambda, RunnableWithFallbacks
from langgraph.prebuilt import ToolNode
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing_extensions import TypedDict
from langgraph.graph import END, StateGraph, START
from langgraph.graph.message import AnyMessage, add_messages
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Ensure the OPENAI_API_KEY is set
openai_api_key = os.getenv("OPENAI_API_KEY")

# Define your database connection URI
db = SQLDatabase.from_uri("postgresql://aidatahilti_owner:YDkg5rC6jpdL@ep-flat-leaf-a20i5gog.eu-central-1.aws.neon.tech/aidatahilti?sslmode=require")

# Create SQLAlchemy engine and metadata
print(db.dialect)
print(db.get_usable_table_names())


def query_gen_node(state):
    message = query_gen.invoke(state)
    tool_messages = []
    if message.tool_calls:
        for tc in message.tool_calls:
            if tc["name"] != "SubmitFinalAnswer":
                tool_messages.append(
                    ToolMessage(
                        content=f"Error: The wrong tool was called: {tc['name']}. Please fix your mistakes.",
                        tool_call_id=tc["id"],
                    )
                )
    else:
        tool_messages = []
    return {"messages": [message] + tool_messages}

def create_tool_node_with_fallback(tools: list) -> RunnableWithFallbacks[Any, dict]:
    return ToolNode(tools).with_fallbacks(
        [RunnableLambda(handle_tool_error)], exception_key="error"
    )

def handle_tool_error(state) -> dict:
    error = state.get("error")
    tool_calls = state["messages"][-1].tool_calls
    return {
        "messages": [
            ToolMessage(
                content=f"Error: {repr(error)}\n please fix your mistakes.",
                tool_call_id=tc["id"],
            )
            for tc in tool_calls
        ]
    }
def first_tool_call(state: State) -> dict[str, list[AIMessage]]:
    return {
        "messages": [
            AIMessage(
                content="",
                tool_calls=[
                    {
                        "name": "sql_db_list_tables",
                        "args": {},
                        "id": "tool_abcd123",
                    }
                ],
            )
        ]
    }
    
def create_tool_node_with_fallback(tools: list) -> RunnableWithFallbacks[Any, dict]:
    return ToolNode(tools).with_fallbacks(
        [RunnableLambda(handle_tool_error)], exception_key="error"
    )

def handle_tool_error(state) -> dict:
    error = state.get("error")
    tool_calls = state["messages"][-1].tool_calls
    return {
        "messages": [
            ToolMessage(
                content=f"Error: {repr(error)}\n please fix your mistakes.",
                tool_call_id=tc["id"],
            )
            for tc in tool_calls
        ]
    }

toolkit = SQLDatabaseToolkit(db=db, llm=ChatOpenAI(model="gpt-4o"), api_key=openai_api_key)
tools = toolkit.get_tools()

list_tables_tool = next(tool for tool in tools if tool.name == "sql_db_list_tables")
get_schema_tool = next(tool for tool in tools if tool.name == "sql_db_schema")

print(list_tables_tool.invoke(""))
print(get_schema_tool.invoke("Artist"))

@tool
def db_query_tool(query: str) -> str:
    result = db.run_no_throw(query)
    if not result:
        return "Error: Query failed. Please rewrite your query and try again."
    return result

print(db_query_tool.invoke("""SELECT
    CDHDR.OBJECTID AS Belegnummer,
    CONCAT(CDHDR.UDATE, CDHDR.UTIME) AS Änderungszeitpunkt,
    'Änderung Beleg: Materialnummer' AS Ereignis,
    CDHDR.USERNAME AS Benutzer,
    CDHDR.TCODE AS Transaktion,
    CDPOS.VALUE_OLD AS AlterWert,
    CDPOS.VALUE_NEW AS NeuerWert
FROM
    CDHDR
JOIN
    CDPOS ON CDHDR.CHANGENR = CDPOS.CHANGENR
WHERE
    CDHDR.OBJECTCLAS = 'BELEG' 
    AND CDPOS.TABNAME = 'BKPF'
    AND CDPOS.FNAME = 'MATNR';
"""))

query_check_system = """You are a SQL expert with a strong attention to detail.
Double check the SQLite query for common mistakes..."""

query_check_prompt = ChatPromptTemplate.from_messages(
    [("system", query_check_system), ("placeholder", "{messages}")]
)
query_check = query_check_prompt | ChatOpenAI(model="gpt-4o", temperature=0).bind_tools(
    [db_query_tool], tool_choice="required"
)

query_check.invoke({"messages": [("user", """SELECT
    CDHDR.OBJECTID AS Belegnummer,
    CONCAT(CDHDR.UDATE, CDHDR.UTIME) AS Änderungszeitpunkt,
    'Änderung Beleg: Materialnummer' AS Ereignis,
    CDHDR.USERNAME AS Benutzer,
    CDHDR.TCODE AS Transaktion,
    CDPOS.VALUE_OLD AS AlterWert,
    CDPOS.VALUE_NEW AS NeuerWert
FROM
    CDHDR
JOIN
    CDPOS ON CDHDR.CHANGENR = CDPOS.CHANGENR
WHERE
    CDHDR.OBJECTCLAS = 'BELEG' 
    AND CDPOS.TABNAME = 'BKPF'
    AND CDPOS.FNAME = 'MATNR';
""")]})

# Define the state for the agent
class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]

# Define a new graph
workflow = StateGraph(State)

# Add a node for the first tool call
def first_tool_call(state: State) -> dict[str, list[AIMessage]]:
    return {
        "messages": [
            AIMessage(
                content="",
                tool_calls=[
                    {
                        "name": "sql_db_list_tables",
                        "args": {},
                        "id": "tool_abcd123",
                    }
                ],
            )
        ]
    }

def model_check_query(state: State) -> dict[str, list[AIMessage]]:
    return {"messages": [query_check.invoke({"messages": [state["messages"][-1]]})]}

workflow.add_node("first_tool_call", first_tool_call)
workflow.add_node("list_tables_tool", create_tool_node_with_fallback([list_tables_tool]))
workflow.add_node("get_schema_tool", create_tool_node_with_fallback([get_schema_tool]))

model_get_schema = ChatOpenAI(model="gpt-4o", temperature=0).bind_tools([get_schema_tool])
workflow.add_node(
    "model_get_schema",
    lambda state: {
        "messages": [model_get_schema.invoke(state["messages"])],
    },
)

class SubmitFinalAnswer(BaseModel):
    final_answer: str = Field(..., description="The final answer to the user")

query_gen_system = """You are a SQL expert with a strong attention to detail..."""
query_gen_prompt = ChatPromptTemplate.from_messages(
    [("system", query_gen_system), ("placeholder", "{messages}")]
)
query_gen = query_gen_prompt | ChatOpenAI(model="gpt-4o", temperature=0).bind_tools(
    [SubmitFinalAnswer]
)

def query_gen_node(state: State):
    message = query_gen.invoke(state)
    tool_messages = []
    if message.tool_calls:
        for tc in message.tool_calls:
            if tc["name"] != "SubmitFinalAnswer":
                tool_messages.append(
                    ToolMessage(
                        content=f"Error: The wrong tool was called: {tc['name']}. Please fix your mistakes.",
                        tool_call_id=tc["id"],
                    )
                )
    else:
        tool_messages = []
    return {"messages": [message] + tool_messages}

workflow.add_node("query_gen", query_gen_node)
workflow.add_node("correct_query", model_check_query)
workflow.add_node("execute_query", create_tool_node_with_fallback([db_query_tool]))

def should_continue(state: State) -> Literal[END, "correct_query", "query_gen"]:
    messages = state["messages"]
    last_message = messages[-1]
    if getattr(last_message, "tool_calls", None):
        return END
    if last_message.content.startswith("Error:"):
        return "query_gen"
    else:
        return "correct_query"

workflow.add_edge(START, "first_tool_call")
workflow.add_edge("first_tool_call", "list_tables_tool")
workflow.add_edge("list_tables_tool", "model_get_schema")
workflow.add_edge("model_get_schema", "get_schema_tool")
workflow.add_edge("get_schema_tool", "query_gen")
workflow.add_conditional_edges("query_gen", should_continue)
workflow.add_edge("correct_query", "execute_query")
workflow.add_edge("execute_query", "query_gen")

app = workflow.compile()
