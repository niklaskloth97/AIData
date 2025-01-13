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

router = APIRouter(prefix="/possible_mappings")


@router.get("/", response_model=PossibleMappingSchema)
def get_possible_mappings(db: Session = Depends(get_db)):
    print("Get PossibleMappings")
    possible_mappings = db.query(PossibleMapping).all()
    if not possible_mappings:
        raise HTTPException(status_code=404, detail="No PossibleMappings found")
  
    return {"possibleMappings": possible_mappings}


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
