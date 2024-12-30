from langgraph.graph.message import add_messages
from typing import Annotated, Sequence
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph import END, StateGraph, START
from src.react_set.nodes import adjust_process, agent, resume_after_interruption

class AgentState(TypedDict):
    # The add_messages function defines how an update should be processed
    # Default is to replace. add_messages says "append"
    messages: Annotated[Sequence[BaseMessage], add_messages]

# Define a new graph
graph = StateGraph(AgentState)
# Define the nodes we will cycle between
graph.add_node("agent", agent)
graph.add_node("adjust_process", adjust_process)
graph.add_node("resume_after_interruption", resume_after_interruption)

# Add edges
graph.add_edge(START, "agent")
graph.add_conditional_edges(
    "agent",
    lambda state: "adjust_process" if state.get("detected_process") else "resume_after_interruption",
    {
        "adjust_process": "adjust_process",
        "resume_after_interruption": "resume_after_interruption",
    },
)
graph.add_edge("adjust_process", END)
graph.add_edge("resume_after_interruption", "agent")



from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
graph = graph.compile(checkpointer=checkpointer)