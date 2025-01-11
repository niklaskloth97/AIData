from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List, Optional
from restapi.lib.db import Base

class CaseID(Base):
    __tablename__ = "caseID"

    id = Column(Integer, primary_key=True)
    projectTables_nativeTableName = Column(String)
    caseidkey = Column(String)
    projectTables_description = Column(String)

class CaseIDSchema(BaseModel):
    id: int
    projectTables_nativeTableName: str
    caseidkey: str
    projectTables_description: str
    projectTables_id: Optional[int]  # If you want to include FK to ProjectTable

    class Config:
        from_attributes = True