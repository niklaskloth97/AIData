from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from restapi.models.Mapping import Mapping, MappingSchema, MappingsResponseSchema, CreateMappingSchema
from typing import List, Optional
from restapi.lib.db import get_db

router = APIRouter(
    prefix="/mappings",
)

@router.get("/", response_model=List[MappingSchema])
def get_mappings(db: Session = Depends(get_db)):
    print("Get mappings")
    mappings = db.query(Mapping).all()
    if not mappings:
        raise HTTPException(status_code=404, detail="No mappings found")
    
    return mappings


@router.post("/", response_model=MappingSchema)
def create_mapping(mapping: CreateMappingSchema, db: Session = Depends(get_db)):
    new_mapping = Mapping(
        timestampColumn=mapping.timestampColumn,
        eventType=mapping.eventType,
        otherAttributes=mapping.otherAttributes,
    )
    db.add(new_mapping)
    db.commit()
    db.refresh(new_mapping)
    return new_mapping

@router.put("/", response_model=List[MappingSchema])
def save_mappings(mappings: List[CreateMappingSchema], db: Session = Depends(get_db)):
    db.query(Mapping).delete()
    db.commit()
    new_mappings = []
    for mapping in mappings:
        new_mapping = Mapping(
            timestampColumn=mapping.timestampColumn,
            eventType=mapping.eventType,
            otherAttributes=mapping.otherAttributes,
            displayName=mapping.displayName,
            tableInvolved=mapping.tableInvolved
        )
        db.add(new_mapping)
        db.commit()
        db.refresh(new_mapping)
        new_mappings.append(new_mapping)
    return new_mappings

@router.delete("/", response_model=dict)
def delete_all_mappings(db: Session = Depends(get_db)):
    db.query(Mapping).delete()
    db.commit()
    return {"message": "All mappings deleted successfully"}

@router.delete("/{mapping_id}", response_model=dict)
def delete_mapping(mapping_id: int, db: Session = Depends(get_db)):
    mapping = db.query(Mapping).filter_by(id=mapping_id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping not found")
    db.delete(mapping)
    db.commit()
    return {"message": "Mapping deleted successfully"}
