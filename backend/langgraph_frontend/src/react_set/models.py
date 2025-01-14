from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List
from lib.db import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List

class ProjectProcess(Base):
    __tablename__ = "projectProcess"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    project_id = Column(Integer)
    steps = relationship("ProjectProcessStep", back_populates="process", cascade="all, delete-orphan")
    
class ProjectProcessStepSchema(BaseModel):
    id: int
    name: str
    description: str
    nativeColumnName: str
    tablesInvolved: str
    projectProcess_id: int
    # business_objects: List[AdapterBusinessObjectSchema]

    class Config:
        from_attributes = True 

class ProjectProcessSchema(BaseModel):
    id: int
    name: str
    description: str
    project_id: int
    steps: List[ProjectProcessStepSchema]

    class Config:
        from_attributes = True

class ProjectProcessStep(Base):
    __tablename__ = "projectProcessSteps"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    tablesInvolved = Column(String)
    projectProcess_id = Column(Integer, ForeignKey("projectProcess.id"))
    nativeColumnName = Column(String)
    process = relationship("ProjectProcess", back_populates="steps")
    # business_objects = relationship("AdapterBusinessObject", back_populates="process_step")

