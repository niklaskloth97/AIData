from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List
from restapi.lib.db import Base

class ProjectProcessStep(Base):
    __tablename__ = "projectProcessSteps"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    tablesInvolved = Column(String)
    projectProcess_id = Column(Integer, ForeignKey("projectProcess.id"))
    process = relationship("ProjectProcess", back_populates="steps")
    # business_objects = relationship("AdapterBusinessObject", back_populates="process_step")

class ProjectProcessStepSchema(BaseModel):
    id: int
    name: str
    description: str
    tablesInvolved: str
    projectProcess_id: int
    # business_objects: List[AdapterBusinessObjectSchema]

    class Config:
        from_attributes = True 
