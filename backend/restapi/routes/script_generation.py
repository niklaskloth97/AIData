from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from restapi.models.Mapping import Mapping, MappingSchema, MappingsResponseSchema, CreateMappingSchema
from typing import List, Optional
from restapi.lib.db import get_db

router = APIRouter(
    prefix="/mappings",
)

from langgraph_sdk import get_sync_client


@router.post("/generate_sql")
def generate_sql(mapping_id: int, script: str, user_input: str) -> str:
    """
    This endpoint is called from the frontend with a `mapping_id`.
    We run our LangGraph, starting from the 'START' node, which eventually calls
    'load_mapping_node' -> 'agent' -> etc.
    """
    
    client = get_sync_client(url="http://127.0.0.1:2024", api_key="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")
    client.assistants.search()
    thread = client.threads.create()
    finalsql = client.runs.wait(
        thread_id=thread.id,
        assistant_id="sqlgenerator",
        input={
            "mapping_id": mapping_id,
            "script": script,
            "user_input": user_input,
        }
    )
    # 1) Construct initial state
    # The only required key is "mapping_id" for the first node
    # We might also have placeholders for 'messages', 'agenttask', etc.
    
    finalsql = ""

    # 3) Return something to the caller
    # For example, the final messages or the entire state
    return {
        finalsql
    }