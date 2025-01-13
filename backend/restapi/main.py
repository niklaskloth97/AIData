from fastapi import FastAPI, Depends, HTTPException, Query, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from restapi.models.ProjectTable import ProjectTableSchema
from restapi.models.ProjectTableColumn import ProjectTableColumnSchema
from restapi.models.ProjectProcess import ProjectProcessSchema 
from restapi.models.AdapterProcessStep import AdapterProcessStepSchema 
from restapi.models.AdapterBusinessObject import AdapterBusinessObjectSchema
from restapi.routes.scripts import router as scripts
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from dotenv import load_dotenv
from restapi.routes import mappings, caseIds, process, additional_events, projectTables, projectTableColumns, script_generation, scripts
from restapi.lib.db import get_db
from restapi.lib.db import engine
from restapi.lib.db import Base

# Load environment variables
load_dotenv()

# Database connection
RESTAPI_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(RESTAPI_DIR, "project_metadata.db")
DATABASE_URL = os.getenv("SQLITE_DATABASE_URL", "sqlite:///{DB_PATH}")

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

root_router = APIRouter(prefix="/api")

root_router.include_router(mappings.router)
root_router.include_router(caseIds.router)
root_router.include_router(process.router)
root_router.include_router(additional_events.router)
root_router.include_router(projectTables.router)
root_router.include_router(projectTableColumns.router)
root_router.include_router(script_generation.router)
root_router.include_router(scripts.router)
# Include the ProjectTable and ProjectTableColumn routers


@app.on_event("startup")
async def startup():
    print(f"API Root Path: {app.root_path}")
    print(f"Available routes:")
    for route in app.routes:
        print(f"  {route.path}")

app.include_router(root_router)
