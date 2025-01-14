from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, Field
from typing import List
from restapi.lib.db import Base

class Mapping(Base):
    __tablename__ = "mappings"

    id = Column(Integer, primary_key=True)
    displayName = Column(String, nullable=False)
    timestampColumn = Column(String, nullable=False)  # Format: Table.Column
    eventType = Column(String, nullable=False)
    otherAttributes = Column(JSON)  # List of Table.Column strings
    tableInvolved = Column(String, nullable=False)


class MappingSchema(BaseModel):
    id: int
    displayName: str
    timestampColumn: str
    eventType: str
    otherAttributes: List[str] = Field(default_factory=list)
    tableInvolved: str

class MappingsResponseSchema(BaseModel):
    mappings: List[MappingSchema]

    class Config:
        from_attributes = True

class CreateMappingSchema(BaseModel):
    displayName: str
    timestampColumn: str
    eventtype: str
    otherAttributes: List[str]
    tableInvolved: str