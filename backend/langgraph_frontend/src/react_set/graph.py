from langgraph.graph.message import add_messages
import operator
from typing import Annotated, Sequence
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph import END, StateGraph, START
from src.react_set.nodes import adjust_process, agent, human_feedback
from src.react_set.tools import process_detected
from langgraph.types import interrupt

class AgentState(TypedDict):
    # The add_messages function defines how an update should be processed
    # Default is to replace. add_messages says "append"
    messages: Annotated[Sequence[BaseMessage], add_messages]
    agenttask: str
    detected_process: str
    steps: list[str, operator.add]
    user_feedback: str

# Define a new graph
graph = StateGraph(AgentState)
# Define the nodes we will cycle between
graph.add_node("agent", agent)
graph.add_node("adjust_process", adjust_process)
graph.add_node("process_detected", process_detected)
graph.add_node("human_feedback", human_feedback)
# Add edges
graph.add_edge(START, "process_detected")
graph.add_edge("human_feedback", "adjust_process")
graph.add_edge("adjust_process", END)



from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
graph = graph.compile(checkpointer=checkpointer, 
                      interrupt_before=["adjust_process"],
                      )