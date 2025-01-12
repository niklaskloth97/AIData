from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from restapi.models.AdditionalEvent import AdditionalEvent, AdditionalEventSchema
from typing import List
from restapi.lib.db import get_db

router = APIRouter(
    prefix="/additional-events",
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[AdditionalEventSchema])
def get_additional_events(db: Session = Depends(get_db)):
    additional_events = db.query(AdditionalEvent).all()
    if not additional_events:
        raise HTTPException(status_code=404, detail="No case IDs found")
    return additional_events

@router.post("/", response_model=AdditionalEventSchema)
def create_additional_event(additional_event: AdditionalEventSchema, db: Session = Depends(get_db)):
    new_additional_event = AdditionalEvent(
        projectTables_nativeTableName=additional_event.projectTables_nativeTableName,
        AdditionalEventkey=additional_event.AdditionalEventkey,
        projectTables_description=additional_event.projectTables_description,
        projectTables_id=additional_event.projectTables_id,
    )
    db.add(new_additional_event)
    db.commit()
    db.refresh(new_additional_event)
    return new_additional_event