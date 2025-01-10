from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List, Optional
from restapi.models.AdapterProcessStep import AdapterProcessStepSchema
from restapi.lib.db import Base

class ProjectProcess(Base):
    __tablename__ = "projectProcess"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    project_id = Column(Integer)

    steps = relationship("AdapterProcessStep", back_populates="process")

class ProjectProcessSchema(BaseModel):
    id: int
    name: str
    description: str
    project_id: int
    steps: List[AdapterProcessStepSchema]

    class Config:
        from_attributes = True