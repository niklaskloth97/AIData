from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from restapi.models.CaseID import CaseID, CaseIDSchema
from typing import List
from restapi.lib.db import get_db

router = APIRouter(
    prefix="/case-ids",
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[CaseIDSchema])
def get_case_ids(db: Session = Depends(get_db)):
    case_ids = db.query(CaseID).all()
    if not case_ids:
        raise HTTPException(status_code=404, detail="No case IDs found")
    return case_ids

@router.post("/", response_model=CaseIDSchema)
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