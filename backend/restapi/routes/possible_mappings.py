# restapi/routes/mappings.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from restapi.lib.db import get_db

# Import the SQLAlchemy model and Pydantic schemas
from restapi.models.PossibleMapping import (
    PossibleMapping,
    PossibleMappingSchema,
    # We define these separately or in the same file
)
from restapi.models.PossibleMapping import CreatePossibleMappingSchema
from restapi.models.ProjectProcessStep import ProjectProcessStep

router = APIRouter(prefix="/possible-mappings")


@router.get("/", response_model=List[PossibleMappingSchema])
def get_possible_mappings(db: Session = Depends(get_db)):
    print("Get PossibleMappings")
    possible_mappings = db.query(PossibleMapping).all()
    steps = db.query(ProjectProcessStep).all()
    if not steps:
        raise HTTPException(status_code=404, detail="No steps found")
    if not possible_mappings:
        raise HTTPException(status_code=404, detail="No PossibleMappings found")
    # Build the response so it fits the schema exactly
    response_list = []
    for p in possible_mappings:
        # Transform ProjectTableColumn objects -> list of strings
        for s in steps:
            if p.eventType is s.nativeColumnName or "standard steps" in p.eventType:
                response_list.append(p)
    
    return response_list

@router.post("/", response_model=PossibleMappingSchema)
def create_possible_mapping(
    new_mapping: CreatePossibleMappingSchema,
    db: Session = Depends(get_db),
):
    # Create new DB object from request data
    db_mapping = PossibleMapping(
        displayName=new_mapping.displayName,
        timestampColumn=new_mapping.timestampColumn,
        eventType=new_mapping.eventType,
        possibleAttributes=new_mapping.possibleAttributes,
    )
    db.add(db_mapping)
    db.commit()
    db.refresh(db_mapping)
    return db_mapping


@router.delete("/", response_model=dict)
def delete_all_possible_mappings(db: Session = Depends(get_db)):
    db.query(PossibleMapping).delete()
    db.commit()
    return {"message": "All mappings deleted successfully"}


@router.delete("/{possible_mapping_id}", response_model=dict)
def delete_mapping(possible_mapping_id: int, db: Session = Depends(get_db)):
    db_mapping = db.query(PossibleMapping).filter_by(id=possible_mapping_id).first()
    if not db_mapping:
        raise HTTPException(status_code=404, detail="PossibleMapping not found")
    db.delete(db_mapping)
    db.commit()
    return {"message": f"Mapping with id={possible_mapping_id} deleted successfully"}
