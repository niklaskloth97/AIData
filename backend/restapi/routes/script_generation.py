from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from restapi.models.Mapping import Mapping, MappingSchema, MappingsResponseSchema, CreateMappingSchema
from typing import List, Optional
from restapi.lib.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text
from sqlalchemy.engine import CursorResult
# create_engine
from sqlalchemy import create_engine

router = APIRouter(
    prefix="/scripts",
)

from langgraph_sdk import get_sync_client

class SQLScriptRequest(BaseModel):
    sqlscript: str
    
class SQLScript(BaseModel):
    sqlscript: str

class GenerateSchema(BaseModel):
    mapping_id: int
    script: str
    user_input: str


@router.post("/generate_sql", )
def generate_sql(obj: GenerateSchema) -> SQLScript:
    """
    This endpoint is called from the frontend with a `mapping_id`.
    We run our LangGraph, starting from the 'START' node, which eventually calls
    'load_mapping_node' -> 'agent' -> etc.
    """
    mapping_id = obj.mapping_id
    script = obj.script
    user_input = obj.user_input

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

    # 3) Return something to the caller
    # For example, the final messages or the entire state
    return {
        SQLScript(
            sqlscript=finalsql
        )
    }
    
POSTGRES_URI = "postgresql://aidatahilti_owner:YDkg5rC6jpdL@ep-flat-leaf-a20i5gog.eu-central-1.aws.neon.tech/aidatahilti?sslmode=require"
pg_engine = create_engine(POSTGRES_URI)

@router.post("/execute")
def execute_sql(request: SQLScriptRequest) -> dict:
    """
    This endpoint executes a SQL script and returns the first 10 rows.
    The SQL script is provided in the JSON body (request.sqlscript).
    """
    sqlscript = request.sqlscript

    try:
        with pg_engine.connect() as connection:
            # The key change: call .mappings() to get rows as dictionaries
            result = connection.execute(text(sqlscript)).mappings()

            # fetchmany(10) still works
            rows = result.fetchmany(10)
            
            # Now each 'row' is already a dict-like mapping
            # so we can just do dict(row) to convert it to a normal Python dict
            result_data = [dict(row) for row in rows]

            return {
                "status": "success",
                "data": result_data
            }

    except SQLAlchemyError as e:
        raise HTTPException(status_code=400, detail=f"SQL execution error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
