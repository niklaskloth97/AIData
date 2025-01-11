from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List, Optional
from restapi.lib.db import Base

class AdapterBusinessObject(Base):
    __tablename__ = "adapterBusinessObjects"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    storage = Column(String)
    changeQuery_SQL = Column(String)
    changeQuery_explanation = Column(String)
    # adapterProcessSteps_id = Column(Integer, ForeignKey("adapterProcessSteps.id"))

    # process_step = relationship("AdapterProcessStep", back_populates="business_objects")

class AdapterBusinessObjectSchema(BaseModel):
    id: int
    name: str
    description: str
    storage: str
    changeQuery_SQL: str
    changeQuery_explanation: str
    adapterProcessSteps_id: int

    class Config:
        from_attributes = True