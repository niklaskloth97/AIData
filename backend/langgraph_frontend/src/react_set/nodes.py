from langchain_openai import ChatOpenAI
from react_set.tools import tools
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
    Invokes the agent model to generate a response based on the current state. Given
    the question, it will decide to retrieve using the retriever tool, or simply end.

    Args:
        state (messages): The current state

    Returns:
        dict: The updated state with the agent response appended to messages
    """
    print("---CALL AGENT---")
    messages = state["messages"]
    model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4o")
    model = model.bind_tools(tools)
    response = model.invoke(messages)
    # We return a list, because this will get added to the existing list
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
