from langgraph.graph.message import add_messages
from typing import Annotated, Sequence
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from src.react_agent.nodes import agent, rewrite, generate

from langgraph.prebuilt import tools_condition
from src.react_agent.tools import retriever_tool, grade_documents
from langgraph.graph import END, StateGraph, START
from langgraph.prebuilt import ToolNode

class AgentState(TypedDict):
    # The add_messages function defines how an update should be processed
    # Default is to replace. add_messages says "append"
    messages: Annotated[Sequence[BaseMessage], add_messages]
    count: int

# Define a new graph
workflow = StateGraph(AgentState)
retrieve = ToolNode([retriever_tool])

# Define the nodes we will cycle between
workflow.add_node("agent", agent)  # agent
workflow.add_node("retrieve", retrieve)  # retrieval
workflow.add_node("rewrite", rewrite)  # Re-writing the question
workflow.add_node("generate", generate)  

workflow.add_edge(START, "agent")

# Decide whether to retrieve
workflow.add_conditional_edges(
    "agent",
    # Assess agent decision
    tools_condition,
    {
        # Translate the condition outputs to nodes in our graph
        "tools": "retrieve",
        END: END,
    },
)

# Generating a response after we know the documents are relevant
# Call agent node to decide to retrieve or not
workflow.add_conditional_edges(
    "retrieve",
    grade_documents,
)

workflow.add_edge("generate", END)
workflow.add_edge("rewrite", "agent")

from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
graph = workflow.compile(checkpointer=checkpointer)