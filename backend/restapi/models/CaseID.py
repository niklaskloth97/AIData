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

# Association table for CaseID and ProjectTableColumn
caseid_columns_association = Table(
    'caseid_columns_association',
    Base.metadata,
    Column('case_id', Integer, ForeignKey('caseID.id'), primary_key=True),
    Column('column_id', Integer, ForeignKey('projectTablesColumns.id'), primary_key=True)
)

class CaseID(Base):
    __tablename__ = "caseID"

    id = Column(Integer, primary_key=True)
    projectTables_nativeTableName = Column(String)
    referenceColumns = relationship(
        "ProjectTableColumn",
        secondary=caseid_columns_association,
        backref="case_ids"
    )
    projectTables_description = Column(String)
class CaseIDSchema(BaseModel):
    id: int
    projectTables_nativeTableName: str
    referenceColumns: List[str]
    projectTables_description: str
    selected: bool
    #projectTables_id: Optional[int] 

    class Config:
        from_attributes = True