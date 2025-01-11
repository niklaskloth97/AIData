from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from restapi.models.ProjectProcess import ProjectProcessSchema, ProjectProcess
from restapi.lib.db import get_db

router = APIRouter(
    prefix="/process",
)

@router.get("/", response_model=ProjectProcessSchema)
def get_process(db: Session = Depends(get_db)):
    print("Get process")
    process = db.query(ProjectProcess).get(1)
    if not process:
        raise HTTPException(status_code=404, detail="No process found")
    return process

@router.post("/", response_model=ProjectProcessSchema)
def create_process(process: ProjectProcessSchema, db: Session = Depends(get_db)):
    print("Create process")
    new_process = ProjectProcess(
        name=process.name,
        description=process.description,
        project_id=process.project_id,
    )
    db.add(new_process)
    db.commit()
    db.refresh(new_process)
    return new_process