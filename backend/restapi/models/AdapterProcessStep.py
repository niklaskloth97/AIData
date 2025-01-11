from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List, Optional
from restapi.models.AdapterBusinessObject import AdapterBusinessObjectSchema
from restapi.lib.db import Base

class AdapterProcessStep(Base):
    __tablename__ = "adapterProcessSteps"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    tablesInvolved = Column(String)
    projectProcess_id = Column(Integer, ForeignKey("projectProcess.id"))

    # process = relationship("AdapterProjectProcess", back_populates="steps")
    # business_objects = relationship("AdapterBusinessObject", back_populates="process_step")

class AdapterProcessStepSchema(BaseModel):
    id: int
    name: str
    description: str
    tablesInvolved: str
    projectProcess_id: int
    business_objects: List[AdapterBusinessObjectSchema]

    class Config:
        from_attributes = True