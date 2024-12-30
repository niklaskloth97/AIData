from langgraph.graph.message import add_messages
import operator
from typing import Annotated, Sequence
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph import END, StateGraph, START
from src.react_set.nodes import adjust_process, agent
from src.react_set.tools import process_detected, need_clarification



class AgentState(TypedDict):
    # The add_messages function defines how an update should be processed
    # Default is to replace. add_messages says "append"
    messages: Annotated[Sequence[BaseMessage], add_messages]
    agenttask: Annotated[list, operator.add]

# Define a new graph
graph = StateGraph(AgentState)
# Define the nodes we will cycle between
graph.add_node("agent", agent)
graph.add_node("adjust_process", adjust_process)
# Add edges
graph.add_conditional_edges(
    START,
    process_detected
)
graph.add_conditional_edges(
    "agent",
    need_clarification,
)
graph.add_edge("adjust_process", END)



from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
graph = graph.compile(checkpointer=checkpointer,
                      interrupt_after=["agent"],
                      )