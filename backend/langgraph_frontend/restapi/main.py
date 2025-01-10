from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from models import ProjectTable, ProjectProcess, AdapterProcessStep, AdapterBusinessObject, Base, CaseID, Mapping
from schemas import ProjectTableSchema, ProjectProcessSchema, AdapterProcessStepSchema, AdapterBusinessObjectSchema, CaseIDSchema, CreateMappingSchema, MappingSchema
from fastapi.middleware.cors import CORSMiddleware

from typing import List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
DATABASE_URL = os.getenv("SQLITE_DATABASE_URL", "sqlite:///./project_metadata.db")
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    with Session(engine) as session:
        yield session

@app.get("/api/project-tables", response_model=List[ProjectTableSchema])
def get_project_tables(
    skip: int = Query(0, description="Number of records to skip"),
    limit: int = Query(10, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
):
    tables = db.query(ProjectTable).offset(skip).limit(limit).all()
    if not tables:
        raise HTTPException(status_code=404, detail="No project tables found")
    return tables

@app.get("/api/project-process", response_model=List[ProjectProcessSchema])
def get_project_process(db: Session = Depends(get_db)):
    processes = db.query(ProjectProcess).all()
    if not processes:
        raise HTTPException(status_code=404, detail="No project processes found")
    return processes

@app.get("/api/adapter-process-steps", response_model=List[AdapterProcessStepSchema])
def get_adapter_process_steps(db: Session = Depends(get_db)):
    steps = db.query(AdapterProcessStep).all()
    if not steps:
        raise HTTPException(status_code=404, detail="No adapter process steps found")
    return steps

@app.get("/api/adapter-business-objects", response_model=List[AdapterBusinessObjectSchema])
def get_adapter_business_objects(db: Session = Depends(get_db)):
    objects = db.query(AdapterBusinessObject).all()
    if not objects:
        raise HTTPException(status_code=404, detail="No adapter business objects found")
    return objects

@app.get("/api/case-ids", response_model=List[CaseIDSchema])
def get_case_ids(db: Session = Depends(get_db)):
    case_ids = db.query(CaseID).all()
    if not case_ids:
        raise HTTPException(status_code=404, detail="No case IDs found")
    return case_ids

@app.post("/api/case-ids", response_model=CaseIDSchema)
def create_case_id(case_id: CaseIDSchema, db: Session = Depends(get_db)):
    new_case_id = CaseID(
        projectTables_nativeTableName=case_id.projectTables_nativeTableName,
        caseidkey=case_id.caseidkey,
        projectTables_description=case_id.projectTables_description,
        projectTables_id=case_id.projectTables_id,
    )
    db.add(new_case_id)
    db.commit()
    db.refresh(new_case_id)
    return new_case_id

@app.get("/api/mappings", response_model=List[MappingSchema])
def get_mappings(db: Session = Depends(get_db)):
    print("Get mappings")
    mappings = db.query(Mapping).all()
    if not mappings:
        raise HTTPException(status_code=404, detail="No mappings found")
    return mappings


@app.post("/api/mappings", response_model=MappingSchema)
def create_mapping(mapping: CreateMappingSchema, db: Session = Depends(get_db)):
    new_mapping = Mapping(
        timestamp_column=mapping.timestamp_column,
        eventtype=mapping.eventtype,
        otherAttributes=mapping.otherAttributes,
    )
    db.add(new_mapping)
    db.commit()
    db.refresh(new_mapping)
    return new_mapping


@app.delete("/api/mappings/{mapping_id}", response_model=dict)
def delete_mapping(mapping_id: int, db: Session = Depends(get_db)):
    mapping = db.query(Mapping).filter_by(id=mapping_id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping not found")
    db.delete(mapping)
    db.commit()
    return {"message": "Mapping deleted successfully"}


@app.delete("/api/mappings", response_model=dict)
def delete_all_mappings(db: Session = Depends(get_db)):
    db.query(Mapping).delete()
    db.commit()
    return {"message": "All mappings deleted successfully"}