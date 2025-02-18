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

from knowledge_base.json_loader import KnowledgeLoader  # Assuming this exists in your project
# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
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
    try:
        count = state["count"][-1]
        print(count)
    except KeyError:
        count = 0
    # Decision based on relevance
    if count >= 3:
        return "generate"
    if score == "yes":
        print("---DECISION: DOCS RELEVANT---")
        return "generate"
    else:
        print("---DECISION: DOCS NOT RELEVANT---")
        print(score)
        return "rewrite"