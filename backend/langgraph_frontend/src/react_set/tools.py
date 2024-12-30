import os
import sys
from typing import Literal
from pydantic import BaseModel, Field
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.tools.retriever import create_retriever_tool
from langchain_openai import ChatOpenAI
from langchain.schema import Document, HumanMessage
from langchain.prompts import PromptTemplate
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from langgraph_frontend.knowledge_base.json_loader import KnowledgeLoader

# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
JSON_PATH = os.path.join(BASE_DIR, "knowledge_base/knowledge.json")

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


def process_detected(state) -> Literal["generate", "rewrite"]:
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

    print("---PROCESS DETECTION---")
    user_question = state["messages"][-1].content
    process_Steps_O2C = "0rder2Cash: Create Sales Order (SO), Approve Sales Order (SO), Delivery Creation, Goods Issue (GI), Billing Document Creation, Receive Payment",
    process_Steps_P2P = "Procure2Pay: Create Purchase Requisition (PR), Approve Purchase Requisition (PR), Create Purchase Order (PO), Approve Purchase Order (PO), Goods Receipt (GR), Create Invoice, Verify Invoice, Clear Invoice, Payment",
    # Prompt
    prompt = PromptTemplate(
        template="""You are a grader assessing if a user Query matches one of the 2 given SAP Standard Processes \n 
        The two processes are  \n\n {stepsp2p} \n\n
        and \n\n {stepso2c} \n\n
        Here is the user question: {question} \n
        If you feel like you have a good guess that this is one of the two processes\n
        Give a binary score 'yes' or 'no' score to indicate whether there is a match or not""",
        input_variables=["stepsp2p", "stepso2c", "question"],
    )
    
    model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4o")
    

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

    scored_result = chain.invoke({"stepsp2p": process_Steps_P2P, "stepso2c": process_Steps_O2C, "question": user_question})

    # Extract the score
    score = scored_result.binary_score

    # Decision based on relevance
    if score == "yes":
        print("---DECISION: DOCS RELEVANT---")
        return "give process"
    else:
        print("---DECISION: DOCS NOT RELEVANT---")
        print(score)
        return "ask for clarification"