from some_module import Command  # wherever you define Command
from sqlalchemy.orm import Session

def load_mapping_node(state: dict, db_session: Session) -> Command:
    """
    First node in the LangGraph that:
      - Fetches the mapping object from the DB
      - Builds an initial prompt or `agenttask` from it
      - Passes updated state on to the next node
    """
    print("---LOAD_MAPPING_NODE---")
    
    mapping_id = state.get("mapping_id")
    if not mapping_id:
        # If there's no mapping_id, raise or handle error
        return Command(interrupt="No mapping_id provided.")
    
    # 1) Fetch from DB
    mapping_obj = db_session.query(Mapping).get(mapping_id)
    if not mapping_obj:
        return Command(interrupt=f"Mapping with id {mapping_id} not found.")

    # 2) Construct a prompt based on the Mapping object
    #    For instance, you could store important info in agenttask or in messages
    prompt = (
       f"Generate an SQL statement for the event '{mapping_obj.displayName}'. "
       f"Timestamp column is '{mapping_obj.timestampColumn}'. "
       f"Attributes: {mapping_obj.possibleAttributes}. "
       f"Involved table: {mapping_obj.involvedTable}."
    )

    # 3) Update state
    #    For example, let’s store it in `agenttask`. Or you can store in `messages`.
    state["messages"] = prompt

    # 4) Return a Command to continue the flow
    return Command(
        update=state,
        goto="agent"   # e.g. next node in your graph, or whichever node you want
    )
