import os
import sys
from typing import Literal

from langgraph.types import Command
from pydantic import BaseModel, Field
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.tools.retriever import create_retriever_tool
from langchain_openai import ChatOpenAI
from langchain.schema import Document, HumanMessage, SystemMessage
from langchain.prompts import PromptTemplate
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

# Paths
def feedback_determine(state) -> Command[Literal["process_detected", "adjust_process"]]:
    if state["agenttask"] == "clarify":
        return Command(goto="process_detected")
    elif state["agenttask"] == "p2p" or state["agenttask"] == "o2c":
        return Command(goto="adjust_process")

def process_detected(state) -> Command[Literal["agent"]]:    
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
    try:
        user_question = user_question + " latest human_feedback: " + state["feedback"]
    # catch exception if human_feedback is not in state
    except:
        user_question = user_question
        
    user_question = user_question
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
        return Command(
            update={"agenttask": "p2p"},
            goto="agent"
        )
    else:
        print("---DECISION: DOCS NOT RELEVANT---")
        if scoreo2c == "yes":
            return Command(
                update={"agenttask": "o2c"},
                goto="agent"
            )
        return Command(
            update={"agenttask": "clarify"},
            goto="agent"
        )
        

def drop_process_steps_llm(steps, feedback):
    """
    Calls an LLM to figure out which steps to drop based on `human_feedback`.
    
    Returns a Python list of the final steps after dropping any that the user mentioned.
    """
    # You can replace model="gpt-4" with whichever model suits your environment
    model = ChatOpenAI(temperature=0, model="gpt-4")

    # We'll provide a short system prompt to instruct the LLM
    system_prompt = SystemMessage(content="""\
    You are an assistant that modifies process steps based on user feedback.
    You will be provided a list of steps and the user's feedback on which ones to drop.
    Return ONLY the final step list (as a Python list), with no additional commentary.\
    """)

    user_prompt_str = f"""\
    Original steps:
    {chr(10).join(f"{i+1}. {step}" for i, step in enumerate(steps))}

    User's feedback about dropping steps:
    {feedback}

    Please return a Python list of the final steps (strings) that remain after applying the user's feedback.\
    """

    # The LLM call
    response = model([
        system_prompt,
        HumanMessage(content=user_prompt_str)
    ])

    # The response should be something like `["Step 1", "Step 3", ...]`
    # We need to parse that text into a Python list safely.
    # For simplicity, you can do a quick-and-dirty `eval` if you trust your environment,
    # or use a safer parser if needed.
    final_steps_str = response.content.strip()

    try:
        final_steps = eval(final_steps_str)
        # final_steps should now be a Python list of the remaining steps
        return final_steps
    except Exception as e:
        # If parsing fails, just return the original steps or handle gracefully
        print("Error parsing LLM output as Python list:", e)
        return steps

