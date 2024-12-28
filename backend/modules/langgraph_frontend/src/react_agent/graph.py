import os
import sys
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.tools.retriever import create_retriever_tool
from langchain.schema import Document
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from knowledge_base.json_loader import KnowledgeLoader  # Assuming this exists in your project
# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
JSON_PATH = os.path.join(BASE_DIR, "knowledge_base/knowledge.json")

def process_raw_documents(raw_documents):
    """
    Process raw documents into LangChain-compatible Document objects.
    :param raw_documents: List of raw JSON objects with 'content' and 'id' fields.
    :return: List of split Document objects.
    """
    # Ensure 'content' is a string and 'id' is valid
    formatted_documents = []
    for doc in raw_documents:
        if isinstance(doc.get("content"), list):
            # Convert list to string (e.g., join with newlines)
            page_content = "\n".join(doc["content"])
        else:
            # Directly use the content if it's already a string
            page_content = doc.get("content", "")
        
        # Ensure `page_content` is a string
        if not isinstance(page_content, str):
            raise ValueError(f"Invalid content format for document ID {doc.get('id')}. Content must be a string.")
        
        # Create the LangChain Document
        formatted_documents.append(
            Document(page_content=page_content, metadata={"id": doc.get("id")})
        )

    # Split documents using a text splitter
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=500, chunk_overlap=50
    )
    split_documents = text_splitter.split_documents(formatted_documents)

    return split_documents

from knowledge_base.json_loader import KnowledgeLoader  # Assuming this exists in your project
# Load documents from knowledge.json
loader = KnowledgeLoader(json_path=JSON_PATH)
raw_documents = loader.load()  # Assuming this returns a list of `Document` objects

# Create LangChain documents
documents = [Document(page_content=doc["content"], metadata={"id": doc["id"]}) for doc in raw_documents]

# Split documents
text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(chunk_size=500, chunk_overlap=50)

doc_splits = text_splitter.split_documents(documents)

# Create the Chroma vector database
vectorstore = Chroma.from_documents(
    documents=doc_splits,
    collection_name="rag-chroma",
    embedding=OpenAIEmbeddings(),  # Use your preferred embeddings here
)

# Create a retriever
retriever = vectorstore.as_retriever()

# Create a tool for the retriever
retriever_tool = create_retriever_tool(
    retriever,
    "retrieve_knowledge",
    "Search and retrieve information from the knowledge base stored in knowledge.json.",
)

# Define the tools
tools = [retriever_tool]


from typing import Annotated, Sequence
from typing_extensions import TypedDict

from langchain_core.messages import BaseMessage

from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    # The add_messages function defines how an update should be processed
    # Default is to replace. add_messages says "append"
    messages: Annotated[Sequence[BaseMessage], add_messages]
    

from typing import Annotated, Literal, Sequence
from typing_extensions import TypedDict

from langchain import hub
from langchain_core.messages import BaseMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from pydantic import BaseModel, Field


from langgraph.prebuilt import tools_condition

### Edges

def grade_documents(state) -> Literal["generate", "rewrite"]:
    """
    Determines whether the retrieved documents are relevant to the question.

    Args:
        state (messages): The current state

    Returns:
        str: A decision for whether the documents are relevant or not
    """

    print("---CHECK RELEVANCE---")

    # Data model
    class grade(BaseModel):
        """Binary score for relevance check."""

        binary_score: str = Field(description="Relevance score 'yes' or 'no'")

    # LLM
    model = ChatOpenAI(temperature=0, model="gpt-4o", streaming=True)

    # LLM with tool and validation
    llm_with_tool = model.with_structured_output(grade)

    # Prompt
    prompt = PromptTemplate(
        template="""You are a grader assessing relevance of a retrieved document to a user question. \n 
        Here is the retrieved document: \n\n {context} \n\n
        Here is the user question: {question} \n
        If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n
        Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question.""",
        input_variables=["context", "question"],
    )

    # Chain
    chain = prompt | llm_with_tool

    # Extract the messages from the state
    messages = state["messages"]

    # Find the latest HumanMessage
    user_query = None
    for message in reversed(messages):
        if isinstance(message, HumanMessage):
            user_query = message.content
            break

    # Fallback to the first message if no HumanMessage is found
    if user_query is None:
        user_query = messages[0].content

    # Extract the last message's content for document context
    last_message = messages[-1]
    docs = last_message.content

    # Invoke the chain with the latest user query and document context
    scored_result = chain.invoke({"question": user_query, "context": docs})

    # Extract the score
    score = scored_result.binary_score

    # Decision based on relevance
    if score == "yes":
        print("---DECISION: DOCS RELEVANT---")
        return "generate"
    else:
        print("---DECISION: DOCS NOT RELEVANT---")
        print(score)
        return "rewrite"




### Nodes


def agent(state):
    """
    Invokes the agent model to generate a response based on the current state. Given
    the question, it will decide to retrieve using the retriever tool, or simply end.

    Args:
        state (messages): The current state

    Returns:
        dict: The updated state with the agent response appended to messages
    """
    print("---CALL AGENT---")
    messages = state["messages"]
    model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4-turbo")
    model = model.bind_tools(tools)
    response = model.invoke(messages)
    # We return a list, because this will get added to the existing list
    return {"messages": [response]}

def rewrite(state):
    """
    Transform the query to produce a better question.

    Args:
        state (messages): The current state

    Returns:
        dict: The updated state with re-phrased question
    """

    print("---TRANSFORM QUERY---")
    messages = state["messages"]

    # Find the latest HumanMessage
    question = None
    for message in reversed(messages):
        if isinstance(message, HumanMessage):
            question = message.content
            break

    # Fallback to the first message content if no HumanMessage is found
    if question is None:
        question = messages[0].content

    msg = [
        HumanMessage(
            content=f""" \n 
    Look at the input and try to reason about the underlying semantic intent / meaning. \n 
    Here is the initial question:
    \n ------- \n
    {question} 
    \n ------- \n
    Formulate an improved question: """,
        )
    ]

    # Grader
    model = ChatOpenAI(temperature=0, model="gpt-4o", streaming=True)
    response = model.invoke(msg)
    return {"messages": [response]}


def generate(state):
    """
    Generate answer

    Args:
        state (messages): The current state

    Returns:
         dict: The updated state with re-phrased question
    """
    print("---GENERATE---")
    messages = state["messages"]

    # Find the latest HumanMessage
    question = None
    for message in reversed(messages):
        if isinstance(message, HumanMessage):
            question = message.content
            break

    # Fallback to the first message content if no HumanMessage is found
    if question is None:
        question = messages[0].content

    # Use the content of the last message as document context
    last_message = messages[-1]
    docs = last_message.content

    sap_processes = ["Order to Cash", "Procure to Pay"]
    # Prompt
    prompt = PromptTemplate(
        template="""Act like an SQL Expert. You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. 
        Your goal is to find out which of the standard SAP processes {sap_process} are related to the user question.
        If you find a match, provide a 2 sentence overview of the process and then all the steps defined in the knowledge in a structured format.
        If you are not sure, ask questions to the user to clarify the context.
        Question: {question}
        Context: {context}
        Answer:""",
        input_variables=["question", "context"],
    )

    # LLM
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0, streaming=True)

    # Post-processing
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    # Chain
    rag_chain = prompt | llm | StrOutputParser()

    # Run
    response = rag_chain.invoke({"context": docs, "question": question})
    return {"messages": [response]}


print("*" * 20 + "Prompt[rlm/rag-prompt]" + "*" * 20)
prompt = hub.pull("rlm/rag-prompt").pretty_print()  # Show what the prompt looks like

from langgraph.graph import END, StateGraph, START
from langgraph.prebuilt import ToolNode

# Define a new graph
workflow = StateGraph(AgentState)

# Define the nodes we will cycle between
workflow.add_node("agent", agent)  # agent
retrieve = ToolNode([retriever_tool])
workflow.add_node("retrieve", retrieve)  # retrieval
workflow.add_node("rewrite", rewrite)  # Re-writing the question
workflow.add_node(
    "generate", generate
)  # Generating a response after we know the documents are relevant
# Call agent node to decide to retrieve or not
workflow.add_edge(START, "agent")

# Decide whether to retrieve
workflow.add_conditional_edges(
    "agent",
    # Assess agent decision
    tools_condition,
    {
        # Translate the condition outputs to nodes in our graph
        "tools": "retrieve",
        END: END,
    },
)

# Edges taken after the `action` node is called.
workflow.add_conditional_edges(
    "retrieve",
    # Assess agent decision
    grade_documents,
)
workflow.add_edge("generate", END)
workflow.add_edge("rewrite", "agent")

from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
graph = workflow.compile(checkpointer=checkpointer)