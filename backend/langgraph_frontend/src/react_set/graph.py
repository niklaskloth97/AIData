from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

def adjust_process(state):
    """
    Adjusts a predefined process model based on user interaction. Identifies a process,
    allows step customization, and updates the state with the final process.

    Args:
        state (dict): The current state

    Returns:
        dict: Updated state with the adjusted process and placeholders for logging
    """
    print("---ADJUST PROCESS---")
    
    # Extract the latest user question
    messages = state["messages"]
    question = None
    for message in reversed(messages):
        if isinstance(message, HumanMessage):
            question = message.content
            break

    if question is None:
        question = messages[0].content

    # Define available processes and steps
    sap_processes = "Order to Cash, Procure to Pay"
    process_steps = {
        "Order to Cash": [
            "Create Sales Order (SO)", "Approve Sales Order (SO)", "Delivery Creation",
            "Goods Issue (GI)", "Billing Document Creation", "Receive Payment"
        ],
        "Procure to Pay": [
            "Create Purchase Requisition (PR)", "Approve Purchase Requisition (PR)", 
            "Create Purchase Order (PO)", "Approve Purchase Order (PO)", "Goods Receipt (GR)",
            "Create Invoice", "Verify Invoice", "Clear Invoice", "Payment"
        ]
    }

    # Prompt template for process identification and customization
    prompt = PromptTemplate(
        template="""You are an expert in SAP process workflows. Based on the user question, identify
        the appropriate process from the following list: {sap_processes}.
        Provide a short description of the identified process and list its steps.
        
        User Query: {question}
        
        Available Processes and Steps:
        Order to Cash (O2C): {o2c_steps}
        Procure to Pay (P2P): {p2p_steps}

        After identifying the process, ask the user if they would like to remove any steps.
        Update the process accordingly and confirm the adjustment.

        Output the adjusted process in a JSON format as follows:
        {{
            "process_name": "*****",
            "steps": ["step1", "step2", ...],
            "dropped_steps": ["stepX", ...]
        }}""",
        input_variables=["sap_processes", "question", "o2c_steps", "p2p_steps"]
    )

    # LLM setup
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0)

    # Input data for prompt
    o2c_steps = ", ".join(process_steps["Order to Cash"])
    p2p_steps = ", ".join(process_steps["Procure to Pay"])
    input_data = {
        "sap_processes": sap_processes,
        "question": question,
        "o2c_steps": o2c_steps,
        "p2p_steps": p2p_steps,
    }

    # Generate the response
    rag_chain = prompt | llm | StrOutputParser()
    response = rag_chain.invoke(input_data)

    # Update state with the adjusted process
    state["adjusted_process"] = response

    # Placeholder for future database logging
    print("Logging to DB: Placeholder for adjusted process:", response)

    return {"messages": state["messages"], "adjusted_process": response}


def agent(state):
    """
    Detects the process based on the user's question or asks clarifying questions.
    If the process is detected, it updates the state with the detected process.
    Otherwise, it asks a clarifying question.

    Args:
        state (dict): The current state containing messages

    Returns:
        dict: The updated state with either the detected process or a clarifying question
    """
    print("---CALL AGENT---")
    
    messages = state["messages"]
    user_question = next((msg.content for msg in reversed(messages) if isinstance(msg, HumanMessage)), None)

    # Define process detection logic
    sap_processes = {
        "Order to Cash": ["Order", "Sales", "Invoice", "Payment"],
        "Procure to Pay": ["Purchase", "Procurement", "Requisition", "Invoice", "Goods Receipt"]
    }

    detected_process = None

    # Try to detect the process based on user input
    for process, keywords in sap_processes.items():
        if any(keyword.lower() in user_question.lower() for keyword in keywords):
            detected_process = process
            break

    # Update state if a process is detected
    if detected_process:
        print(f"Detected process: {detected_process}")
        state["detected_process"] = detected_process
        response_message = f"It seems you're referring to the '{detected_process}' process. Let me guide you through the steps."
    else:
        # Ask clarifying question if process is not detected
        response_message = (
            "I couldn't identify a specific process from your query. "
            "Could you clarify whether you're referring to 'Order to Cash' or 'Procure to Pay'?"
        )

    # Append the response message to the state
    messages.append(HumanMessage(content=response_message))

    return {"messages": messages, "detected_process": detected_process}



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

    sap_processes = "Order to Cash, Procure to Pay"
    process_Steps_O2C = "0rder2Cash: Create Sales Order (SO), Approve Sales Order (SO), Delivery Creation, Goods Issue (GI), Billing Document Creation, Receive Payment",
    process_Steps_P2P = "Procure2Pay: Create Purchase Requisition (PR), Approve Purchase Requisition (PR), Create Purchase Order (PO), Approve Purchase Order (PO), Goods Receipt (GR), Create Invoice, Verify Invoice, Clear Invoice, Payment",
    # Prompt
    prompt = PromptTemplate(
        template="""You are an expert in SAP process workflows and an assistant for guiding users through predefined tasks. Your goal is to:
            1. Identify which of the standard SAP processes from the list {sap_processes} aligns with the user's query.
            2. Once identified, provide a brief two-sentence overview of the selected process, followed by a clear numbered list of its steps.
            3. Ask the user if they want to drop any steps, update the list based on their response, and confirm the adjusted process.

            Here are the available processes and their steps:
            Order-to-Cash (O2C): 
            {process_Steps_O2C}

            Procure-to-Pay (P2P): 
            {process_Steps_P2P}

            User Question: 
            {question}

            Additional Context: 
            {context}

            Answer:
            Based on your query, it seems you are referring to the ****** process. Here's a brief overview of the process:
            This process involves the following steps:
            1. *****
            2. *****
            3. *****
            ...

            Is this the process you were looking for? If so, let me know if youd like to drop any of the steps above. I will then update the process and ask for your confirmation.""",
                input_variables=["context", "process_Steps_O2C", "process_Steps_P2P", "question", "sap_processes"],
            )


    # LLM
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0, streaming=True)

    # Chain
    rag_chain = prompt | llm | StrOutputParser()

    # Run
    response = rag_chain.invoke({"context": docs, "question": question, "sap_processes": sap_processes, "process_Steps_O2C": process_Steps_O2C, "process_Steps_P2P": process_Steps_P2P})
    return {"messages": [response]}

from langgraph.graph.message import add_messages
from typing import Annotated, Sequence
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph import END, StateGraph, START

class AgentState(TypedDict):
    # The add_messages function defines how an update should be processed
    # Default is to replace. add_messages says "append"
    messages: Annotated[Sequence[BaseMessage], add_messages]

# Define a new graph
workflow = StateGraph(AgentState)
# Define the nodes we will cycle between
workflow.add_node("agent", agent)  # Detect process or ask clarifying questions
workflow.add_node("adjust_process", adjust_process)  # Adjust process workflows
workflow.add_node("generate", generate)  # Generate response and confirm adjusted process

# Initial starting point
workflow.add_edge(START, "agent")

# Agent decides whether the process is detected or if more clarification is needed
workflow.add_conditional_edges(
    "agent",
    # Detect process or ask more questions
    lambda state: "adjust_process" if state.get("detected_process") else "agent",
    {
        # Process detected, proceed to adjustment
        "adjust_process": "adjust_process",
        # Process not yet detected, loop back for more clarification
        "agent": "agent",
    },
)

# Adjust process (e.g., remove steps and confirm changes)
workflow.add_conditional_edges(
    "adjust_process",
    # Decide if the user confirms the adjustment
    lambda state: "generate" if state.get("adjusted_process_confirmed") else "adjust_process",
    {
        # Proceed to generate the final response
        "generate": "generate",
        # Loop back if adjustments are not yet confirmed
        "adjust_process": "adjust_process",
    },
)

# End the workflow after generating the final adjusted process
workflow.add_edge("generate", END)


from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
graph = workflow.compile(checkpointer=checkpointer)