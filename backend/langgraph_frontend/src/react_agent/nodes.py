from langchain_openai import ChatOpenAI
from src.react_agent.tools import tools
from langchain_core.messages import HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI


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
