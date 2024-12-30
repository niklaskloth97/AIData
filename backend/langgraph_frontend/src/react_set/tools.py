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

# Paths


def process_detected(state) -> Literal["agent", "adjust_process"]:
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
    promptp2p = PromptTemplate(
        template="""You are a grader assessing if a user is looking for the following SAP Standard Process \n 
        The process is  \n\n {stepsp2p} \n\n
        Here is the user question: {question} \n
        If you feel like you have a good guess that this is one of the two processes\n
        Give a binary score 'yes' or 'no' score to indicate whether there is a match or not""",
        input_variables=["stepsp2p", "question"],
    )
    
    prompto2c = PromptTemplate(
        template="""You are a grader assessing if a user is looking for the following SAP Standard Process \n 
        The process is  \n\n {stepso2c} \n\n
        Here is the user question: {question} \n
        If you feel like you have a good guess that this is one of the two processes\n
        Give a binary score 'yes' or 'no' score to indicate whether there is a match or not""",
        input_variables=["stepso2c", "question"],
    )
    
    model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4o")
    

    # Chain
    chain = promptp2p | llm_with_tool
    
    chain2 = prompto2c | llm_with_tool

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

    scored_result_p2p = chain.invoke({"stepsp2p": process_Steps_P2P, "question": user_question})
    # Extract the score
    scorep2p = scored_result_p2p.binary_score
    
    scored_result_p2p = chain2.invoke({"stepso2c": process_Steps_O2C, "question": user_question})
    
    scoreo2c = scored_result_p2p.binary_score

    # Decision based on relevance
    if scorep2p == "yes":
        print("---DECISION: P2P---")
        state["agenttask"] = "p2p"
        return "agent"
    else:
        print("---DECISION: DOCS NOT RELEVANT---")
        if scoreo2c == "yes":
            print("---DECISION: O2C---")
            state["agenttask"] = "o2c"
            return "agent"
        state["agenttask"] = "clarify"
        return "agent"

def need_clarification(state) -> Literal["agent", "adjust_process"]:
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
    promptp2p = PromptTemplate(
        template="""You are a grader assessing if a user is looking for the following SAP Standard Process \n 
        The process is  \n\n {stepsp2p} \n\n
        Here is the user question: {question} \n
        If you feel like you have a good guess that this is one of the two processes\n
        Give a binary score 'yes' or 'no' score to indicate whether there is a match or not""",
        input_variables=["stepsp2p", "question"],
    )
    
    prompto2c = PromptTemplate(
        template="""You are a grader assessing if a user is looking for the following SAP Standard Process \n 
        The process is  \n\n {stepso2c} \n\n
        Here is the user question: {question} \n
        If you feel like you have a good guess that this is one of the two processes\n
        Give a binary score 'yes' or 'no' score to indicate whether there is a match or not""",
        input_variables=["stepso2c", "question"],
    )
    
    model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4o")
    

    # Chain
    chain = promptp2p | llm_with_tool
    
    chain2 = prompto2c | llm_with_tool

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

    scored_result_p2p = chain.invoke({"stepsp2p": process_Steps_P2P, "question": user_question})
    # Extract the score
    scorep2p = scored_result_p2p.binary_score
    
    scored_result_p2p = chain2.invoke({"stepso2c": process_Steps_O2C, "question": user_question})
    
    scoreo2c = scored_result_p2p.binary_score

    # Decision based on relevance
    if scorep2p == "yes":
        print("---DECISION: P2P---")
        state["agenttask"] = "p2p"
        return "adjust_process"
    else:
        print("---DECISION: DOCS NOT RELEVANT---")
        if scoreo2c == "yes":
            print("---DECISION: O2C---")
            state["agenttask"] = "o2c"
            return  "adjust_process"
        state["agenttask"] = "clarify"
        return "agent"