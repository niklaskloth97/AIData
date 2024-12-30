from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, START, END
from langchain.prompts import PromptTemplate

# Define the nodes for the graph
def agent(state):
    """
    The agent node decides whether the process is detected or needs clarification.
    """
    print("---AGENT NODE---")
    messages = state["messages"]
    user_question = messages[-1].content if messages else ""

    sap_processes = {
        "Order to Cash": ["Create Sales Order (SO)", "Approve Sales Order (SO)", "Delivery Creation", "Goods Issue (GI)", "Billing Document Creation", "Receive Payment"],
        "Procure to Pay": ["Create Purchase Requisition (PR)", "Approve Purchase Requisition (PR)", "Create Purchase Order (PO)", "Approve Purchase Order (PO)", "Goods Receipt (GR)", "Create Invoice", "Verify Invoice", "Clear Invoice", "Payment"]
    }

    process_steps = {
        "O2C": ["Create Sales Order (SO)", "Approve Sales Order (SO)", "Delivery Creation", "Goods Issue (GI)", "Billing Document Creation", "Receive Payment"],
        "P2P": ["Create Purchase Requisition (PR)", "Approve Purchase Requisition (PR)", "Create Purchase Order (PO)", "Approve Purchase Order (PO)", "Goods Receipt (GR)", "Create Invoice", "Verify Invoice", "Clear Invoice", "Payment"]
    }
    tasks = state["agenttask"]
    task = tasks[-1] if tasks else ""
    if task == "p2p":
        # Handle Procure-to-Pay (P2P) task
        response = (
            "You selected the Procure-to-Pay (P2P) process. Here are the steps:\n"
            "1. Create Purchase Requisition (PR)\n"
            "2. Approve Purchase Requisition (PR)\n"
            "3. Create Purchase Order (PO)\n"
            "4. Approve Purchase Order (PO)\n"
            "5. Goods Receipt (GR)\n"
            "6. Create Invoice\n"
            "7. Verify Invoice\n"
            "8. Clear Invoice\n"
            "9. Payment\n"
            "Do you want to drop any of these steps?"
        )
        messages.append({"role": "assistant", "content": response})
        state["detected_process"] = "Procure to Pay"
        return {"messages": messages, "detected_process": "Procure to Pay"}

    elif task == "o2c":
        # Handle Order-to-Cash (O2C) task
        response = (
            "You selected the Order-to-Cash (O2C) process. Here are the steps:\n"
            "1. Create Sales Order (SO)\n"
            "2. Approve Sales Order (SO)\n"
            "3. Delivery Creation\n"
            "4. Goods Issue (GI)\n"
            "5. Billing Document Creation\n"
            "6. Receive Payment\n"
            "Do you want to drop any of these steps?"
        )
        messages.append({"role": "assistant", "content": response})
        state["detected_process"] = "Order to Cash"
        return {"messages": messages, "detected_process": "Order to Cash"}

    elif task == "clarify":
        # Handle clarification task
        model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4o")
        clarification_prompt = (
            "Based on the user query: '{user_question}', generate a clarification question "
            "to determine whether the user is referring to 'Order-to-Cash (O2C)' or 'Procure-to-Pay (P2P)'."
        )
        clarification_question = model.invoke(clarification_prompt.format(user_question=user_question))
        response = clarification_question or (
            "I couldn\'t determine the process from your input. Could you clarify if you are referring to "
            "the 'Order-to-Cash (O2C)' or 'Procure-to-Pay (P2P)' process?"
        )
        messages.append({"role": "assistant", "content": response})
        state["interrupted"] = True
        return {"messages": messages, "interrupted": True}

    else:
        # Default response for unknown tasks
        response = (
            "I\'m not sure how to assist with this task. Could you specify if you are looking for "
            "information about 'Order-to-Cash (O2C)', 'Procure-to-Pay (P2P)', or need clarification?"
        )
        messages.append({"role": "assistant", "content": response})
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
