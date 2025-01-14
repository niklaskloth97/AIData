from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, START, END
import sys
import os
from src.react_set.models import ProjectProcess, ProjectProcessStep
from langchain.prompts import PromptTemplate
from langgraph.types import Command, interrupt
from src.react_set.tools import drop_process_steps_llm
import sys
import os
from dotenv import load_dotenv
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))
from lib.db import engine, init_db
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
load_dotenv()


def create_tables():
    init_db()

# Define the nodes for the graph
def agent(state):
    """
    The agent node decides whether the process is detected or needs clarification.
    """
    print("---AGENT NODE---")
    messages = state["messages"]
    task = state["agenttask"]
        
    print(f"Task: {task}")
    
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
        return Command(
            update={"messages": messages, "detected_process": "Procure to Pay"},
            goto="human_feedback"
        )

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
        return Command(
            update={"messages": messages, "detected_process": "Order to Cash"},
            goto="human_feedback"
        )

    elif task == "clarify":
        # Handle clarification task
        model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4o")
        clarification_prompt = (
            "Based on the user query: '{user_question}', generate a clarification question "
            "to determine whether the user is referring to 'Order-to-Cash (O2C)' or 'Procure-to-Pay (P2P)'."
        )
        # clarification_question = model.invoke(clarification_prompt.format(user_question=user_question))
        response =  (
            "I couldn\'t determine the process from your input. Could you clarify if you are referring to "
            "the 'Order-to-Cash (O2C)' or 'Procure-to-Pay (P2P)' process?"
        )
        messages.append({"role": "assistant", "content": response})
        return Command(
            update={"messages": messages},
            goto="human_feedback"
        )

    else:
        # Default response for unknown tasks
        response = (
            "I\'m not sure how to assist with this task. Could you specify if you are looking for "
            "information about 'Order-to-Cash (O2C)', 'Procure-to-Pay (P2P)', or need clarification?"
        )
        messages.append({"role": "assistant", "content": response})
        return Command(
            update={"messages": messages},
            goto="human_feedback"
        )

def human_feedback(state):
    print("---human_feedback---")
    feedback = interrupt("Please provide feedback:")
    return {"feedback": feedback}


def adjust_process(state):
    """
    Adjusts the process based on user input (from state["human_feedback"]).
    """
    print("---ADJUST PROCESS---")
    detected_process = state["detected_process"]
    if not detected_process:
        # No process was identified previously
        return {"messages": state["messages"], "error": "No process detected yet."}

    # The known steps for each process
    process_steps = {
        "Order to Cash": [
            "Create Sales Order (SO)",
            "Approve Sales Order (SO)",
            "Delivery Creation",
            "Goods Issue (GI)",
            "Billing Document Creation",
            "Receive Payment"
        ],
        "Procure to Pay": [
            "Create Purchase Requisition (PR)",
            "Approve Purchase Requisition (PR)",
            "Create Purchase Order (PO)",
            "Approve Purchase Order (PO)",
            "Goods Receipt (GR)",
            "Create Invoice",
            "Verify Invoice",
            "Clear Invoice",
            "Payment"
        ]
    }
    steps = process_steps.get(detected_process, [])
    
        
    
        
    human_feedback_text = state["messages"][-1].content
    print(human_feedback_text)
    messages = state["messages"]

    # ---- (2) Use the LLM to remove steps based on feedback: ----
    # If the user actually typed something in `human_feedback_text` indicating which steps to remove:
    if human_feedback_text.strip():
        adjusted_steps = drop_process_steps_llm(steps, human_feedback_text)
         # create process steps in db from steps
        process = ProjectProcess(
                name=detected_process,
                description="End-to-end order processing workflow in SAP",
                project_id=1
            )
        
        process_steps = []
        for step in adjusted_steps:
            process_step = ProjectProcessStep(
                name=step,
                description="",
                nativeColumnName="",
                tablesInvolved="",
                projectProcess_id=1
            )
            process_steps.append(process_step)
        
        create_tables()
        session = Session(engine)
        session.add(process)
        session.add_all(process_steps)
        session.commit()
        # ---- (3) Display the newly adjusted steps: ----
        new_steps_msg = (
            "Here are your updated steps:\n"
            + "\n".join(f"{i+1}. {step}" for i, step in enumerate(adjusted_steps))
            +"\nDo you want to make any further adjustments? If not click on \"Process to next step\" button."
        )
        messages.append({"role": "assistant", "content": new_steps_msg})

        # Optionally store the new steps in `state`

    return {"messages": messages, "steps": adjusted_steps, "confirmable": True}
