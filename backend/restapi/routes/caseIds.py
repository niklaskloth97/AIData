from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from restapi.models.CaseID import CaseID, CaseIDSchema
from restapi.models.ProjectProcessStep import ProjectProcessStep
from restapi.models.ProjectProcessStep import ProjectProcessStepSchema
from typing import List
from restapi.lib.db import get_db

router = APIRouter(
    prefix="/case-ids",
    responses={404: {"description": "Not found"}},
)

@router.get("/all", response_model=List[CaseIDSchema])
def get_case_ids_all(db: Session = Depends(get_db)):
    case_ids = db.query(CaseID).all()
    if not case_ids:
        raise HTTPException(status_code=404, detail="No case IDs found")
    
    # Build the response so it fits the schema exactly
    response_list = []
    for c in case_ids:
        # Transform ProjectTableColumn objects -> list of strings
        column_names = [col.nativeColumnName for col in c.referenceColumns]
        
        # Decide how to set "selected". Here, we'll default to False:
        response_item = CaseIDSchema(
            id=c.id,
            projectTables_nativeTableName=c.projectTables_nativeTableName,
            projectTables_description=c.projectTables_description,
            referenceColumns=column_names,
            selected=True,  # Or set this to True or some condition
        )
        response_list.append(response_item)
    
    return response_list



@router.get("/", response_model=List[CaseIDSchema])
def get_case_ids_all(db: Session = Depends(get_db)):
    """
    Return all CaseIDs. For each CaseID, set `selected = True`
    if CaseID.projectTables_nativeTableName appears in any 
    ProjectProcessStep's tablesInvolved. Otherwise, `selected = False`.
    """

    # 1. Fetch all ProjectProcessSteps
    steps = db.query(ProjectProcessStep).all()
    if not steps:
        raise HTTPException(
            status_code=404, 
            detail="No ProjectProcessSteps found."
        )

    # 2. Fetch all CaseIDs
    case_ids = db.query(CaseID).all()
    if not case_ids:
        raise HTTPException(
            status_code=404, 
            detail="No CaseIDs found."
        )

    # 3. Determine which CaseIDs are selected
    results = []
    for c in case_ids:
        # Check if projectTables_nativeTableName is in *any* step's tablesInvolved
        # If tablesInvolved might be a comma-separated string, adapt as needed.
        selected_flag = any(
            c.projectTables_nativeTableName in step.tablesInvolved
            for step in steps
        )
        
        # Convert referenceColumns (list of ProjectTableColumn objects) -> list of strings (e.g., nativeColumnName)
        reference_cols = [col.nativeColumnName for col in c.referenceColumns]

        # Build the response object matching CaseIDSchema
        schema_item = CaseIDSchema(
            id=c.id,
            projectTables_nativeTableName=c.projectTables_nativeTableName,
            projectTables_description=c.projectTables_description,
            referenceColumns=reference_cols,
            selected=selected_flag,
        )
        results.append(schema_item)

    return results


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