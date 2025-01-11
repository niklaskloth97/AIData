from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List
from restapi.models.ProjectProcessStep import ProjectProcessStep, ProjectProcessStepSchema
from restapi.lib.db import Base

class ProjectProcess(Base):
    __tablename__ = "projectProcess"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    project_id = Column(Integer)
    steps = relationship("ProjectProcessStep", back_populates="process", cascade="all, delete-orphan")

class ProjectProcessSchema(BaseModel):
    id: int
    name: str
    description: str
    project_id: int
    steps: List[ProjectProcessStepSchema]

    class Config:
        from_attributes = True