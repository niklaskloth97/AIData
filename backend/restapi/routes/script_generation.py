from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from restapi.models.Mapping import Mapping, MappingSchema, MappingsResponseSchema, CreateMappingSchema
from typing import List, Optional
from restapi.lib.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text
# create_engine
from sqlalchemy import create_engine

router = APIRouter(
    prefix="/scripts",
)

from langgraph_sdk import get_sync_client

class SQLScriptRequest(BaseModel):
    sqlscript: str


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
    
POSTGRES_URI = "postgresql://aidatahilti_owner:YDkg5rC6jpdL@ep-flat-leaf-a20i5gog.eu-central-1.aws.neon.tech/aidatahilti?sslmode=require"
pg_engine = create_engine(POSTGRES_URI)

@router.post("/execute")
def execute_sql(request: SQLScriptRequest) -> dict:
    """
    This endpoint is called from the frontend with a plain SQL string as `sqlscript`.
    We run the SQL script and return the result.
    """
    # extract from json sqlscript value
    sqlscript = request.sqlscript
    try:
        # Open a connection to the database
        with pg_engine.connect() as connection:
            # Use `text` to safely execute raw SQL
            result = connection.execute(text(sqlscript))
            
            # Check if the query returns results
            if result.returns_rows:
                # Fetch all rows and convert them to a JSON-serializable format
                rows = result.fetchall()
                return {
                    "status": "success",
                    "data": [dict(row) for row in rows]  # Convert each row to a dictionary
                }
            else:
                return {
                    "status": "success",
                    "message": "SQL script executed successfully, no data returned."
                }

    except SQLAlchemyError as e:
        # Catch and return any SQL execution errors
        raise HTTPException(status_code=400, detail=f"SQL execution error: {str(e)}")
    except Exception as e:
        # Handle other unexpected errors
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
