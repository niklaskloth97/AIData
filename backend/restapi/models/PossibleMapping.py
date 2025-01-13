# restapi/models/PossibleMapping.py

from sqlalchemy import Column, Integer, String
from typing import List
from sqlalchemy.dialects.postgresql import JSON  # or use a generic JSON type if supported
from restapi.lib.db import Base
from pydantic import BaseModel

class PossibleMapping(Base):
    __tablename__ = "possible_mappings"
    
    id = Column(Integer, primary_key=True)
    displayName = Column(String)
    timestampColumn = Column(String)
    eventType = Column(String)
    # Storing attributes as JSON
    possibleAttributes = Column(JSON)
    involvedTable = Column(String)


class PossibleMappingSchema(BaseModel):
    id: int
    displayName: str
    timestampColumn: str
    eventType: str
    possibleAttributes: List[str]
    involvedTable: str

    class Config:
        from_attributes = True

class CreatePossibleMappingSchema(BaseModel):
    displayName: str
    timestampColumn: str
    eventType: str
    possibleAttributes: List[str]
    involvedTable: str

    class Config:
        from_attributes = True
