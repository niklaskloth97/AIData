from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from models import ProjectTable, ProjectTableColumn, Base
from schemas import ProjectTableSchema
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
