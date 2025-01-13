from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List, Optional
from restapi.lib.db import Base
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from typing import List
from restapi.lib.db import Base


class AdditionalEvent(Base):
    __tablename__ = "additional_events"

    id = Column(Integer, primary_key=True)
    business_object = Column(String)
    change_event_name = Column(String)
    change_event_count = Column(Integer)
    description = Column(String)
    nativeColumnName = Column(String)
    tablesInvolved = Column(String)
    
    
class AdditionalEventSchema(BaseModel):
    id: int
    business_object: str
    change_event_name: str
    change_event_count: int
    description: str
    nativeColumnName: str
    tablesInvolved: str

    class Config:
        from_attributes = True