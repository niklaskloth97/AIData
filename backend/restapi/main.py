from fastapi import FastAPI, Depends, HTTPException, Query, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from restapi.models import ProjectTable, ProjectProcess, AdapterProcessStep, AdapterBusinessObject
from restapi.models.ProjectTable import ProjectTableSchema 
from restapi.models.ProjectProcess import ProjectProcessSchema 
from restapi.models.AdapterProcessStep import AdapterProcessStepSchema 
from restapi.models.AdapterBusinessObject import AdapterBusinessObjectSchema
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from dotenv import load_dotenv
from restapi.routes import mappings, caseIds
from restapi.lib.db import get_db
from restapi.lib.db import engine
from restapi.lib.db import Base

# Load environment variables
load_dotenv()

# Database connection
DATABASE_URL = os.getenv("SQLITE_DATABASE_URL", "sqlite:///./project_metadata.db")
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



@app.on_event("startup")
async def startup():
    print(f"API Root Path: {app.root_path}")
    print(f"Available routes:")
    for route in app.routes:
        print(f"  {route.path}")

@root_router.get("/project-tables", response_model=List[ProjectTableSchema])
def get_project_tables(
    skip: int = Query(0, description="Number of records to skip"),
    limit: int = Query(10, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
):
    tables = db.query(ProjectTable).offset(skip).limit(limit).all()
    if not tables:
        raise HTTPException(status_code=404, detail="No project tables found")
    return tables

@root_router.get("/project-process", response_model=List[ProjectProcessSchema])
def get_project_process(db: Session = Depends(get_db)):
    processes = db.query(ProjectProcess).all()
    if not processes:
        raise HTTPException(status_code=404, detail="No project processes found")
    return processes

@root_router.get("/adapter-process-steps", response_model=List[AdapterProcessStepSchema])
def get_adapter_process_steps(db: Session = Depends(get_db)):
    steps = db.query(AdapterProcessStep).all()
    if not steps:
        raise HTTPException(status_code=404, detail="No adapter process steps found")
    return steps

@root_router.get("/adapter-business-objects", response_model=List[AdapterBusinessObjectSchema])
def get_adapter_business_objects(db: Session = Depends(get_db)):
    objects = db.query(AdapterBusinessObject).all()
    if not objects:
        raise HTTPException(status_code=404, detail="No adapter business objects found")
    return objects

app.include_router(root_router)
