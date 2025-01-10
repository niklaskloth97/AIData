from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import List
from restapi.lib.db import Base

class Mapping(Base):
    __tablename__ = "mappings"

    id = Column(Integer, primary_key=True)
    displayName = Column(String, nullable=False)
    timestampColumn = Column(String, nullable=False)  # Format: Table.Column
    eventType = Column(String, nullable=False)
    otherAttributes = Column(JSON)  # List of Table.Column strings


class MappingSchema(BaseModel):
    id: int
    displayName: str
    timestampColumn: str
    eventType: str
    otherAttributes: List[str]

    class Config:
        from_attributes = True

class CreateMappingSchema(BaseModel):
    displayName: str
    timestamp_column: str
    eventtype: str
    otherAttributes: List[str]