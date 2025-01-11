from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from restapi.models.ProjectProcess import ProjectProcessSchema, ProjectProcess
from restapi.models.ProjectProcessStep import ProjectProcessStep, ProjectProcessStepSchema
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

@router.put("/{process_id}", response_model=ProjectProcessSchema)
def update_process(process_id: int, process: ProjectProcessSchema, db: Session = Depends(get_db)):
    print("Update process")
    updated_process = db.query(ProjectProcess).filter_by(id=process_id).first()
    if not updated_process:
        raise HTTPException(status_code=404, detail="Process not found")
    
    # Update basic fields
    updated_process.name = process.name
    updated_process.description = process.description
    
    # Clear existing steps and add new ones
    updated_process.steps = []
    for step in process.steps:
        new_step = ProjectProcessStep(
            name=step.name,
            description=step.description,
            projectProcess_id=step.projectProcess_id,
            tablesInvolved=step.tablesInvolved,
        )
        updated_process.steps.append(new_step)
    
    db.commit()
    db.refresh(updated_process)
    return updated_process

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