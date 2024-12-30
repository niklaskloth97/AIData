from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, START, END
from langchain.prompts import PromptTemplate

# Define the nodes for the graph
def process_detect(state):
    """
    Detects the SAP process based on user input.
    """
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
    
    rag_chain = prompt | model | StrOutputParser()
    response = model.invoke({"stepsp2p": process_Steps_P2P, "stepso2c": process_Steps_O2C, "question": user_question})
    
    
def agent(state):
    """
    The agent node decides whether the process is detected or needs clarification.
    """
    print("---AGENT NODE---")
    messages = state["messages"]
    sap_processes = {
        "Order to Cash": ["Order", "Sales", "Invoice", "Payment"],
        "Procure to Pay": ["Purchase", "Procurement", "Requisition", "Invoice", "Goods Receipt"]
    }
    
    model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4o")
    prompt = PromptTemplate("""You are an expert in SAP process workflows and an assistant for guiding users through predefined tasks. Your goal is to:
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
        
    response = model.invoke(prompt(state["messages"][-1].content))
    # Define process detection logic
    sap_processes = {
        "Order to Cash": ["Order", "Sales", "Invoice", "Payment"],
        "Procure to Pay": ["Purchase", "Procurement", "Requisition", "Invoice", "Goods Receipt"]
    }

    detected_process = None

    # Try to detect the process
    for process, keywords in sap_processes.items():
        if any(keyword.lower() in user_question.lower() for keyword in keywords):
            detected_process = process
            break

    if detected_process:
        state["detected_process"] = detected_process
        response = f"It seems you're referring to the '{detected_process}' process. Let me guide you through the steps."
        messages.append(HumanMessage(content=response))
        return {"messages": messages, "detected_process": detected_process}
    else:
        response = (
            "I couldn't identify a specific process from your query. "
            "Could you clarify whether you're referring to 'Order to Cash' or 'Procure to Pay'?"
        )
        messages.append(HumanMessage(content=response))
        # Interrupt the graph here and wait for further user input
        state["interrupted"] = True
        return {"messages": messages, "interrupted": True}


def adjust_process(state):
    """
    Adjusts the process based on user input and confirms changes.
    """
    print("---ADJUST PROCESS---")
    detected_process = state.get("detected_process")
    if not detected_process:
        return {"messages": state["messages"], "error": "No process detected yet."}

    # Provide process steps and allow user to drop steps
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
    steps = process_steps.get(detected_process, [])
    messages = state["messages"]
    response = f"The steps for the '{detected_process}' process are:\n" + "\n".join(f"{i+1}. {step}" for i, step in enumerate(steps))
    response += "\nWould you like to drop any steps? Please specify step numbers."
    messages.append(HumanMessage(content=response))
    return {"messages": messages, "steps": steps}


def resume_after_interruption(state):
    """
    Resumes the graph execution after an interruption.
    """
    print("---RESUMING AFTER INTERRUPTION---")
    if state.get("interrupted"):
        state.pop("interrupted")  # Clear the interruption flag
        return agent(state)  # Resume the agent's logic
    return {"messages": state["messages"]}
