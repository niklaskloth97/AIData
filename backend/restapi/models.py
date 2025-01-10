from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class ProjectTable(Base):
    __tablename__ = "projectTables"

    id = Column(Integer, primary_key=True)
    nativeTableName = Column(String, unique=True)
    primaryKeyDetected = Column(Boolean)
    description = Column(String)
    speakingName = Column(String)
    descriptionAutoGenerated = Column(Boolean)
    columnCount = Column(Integer)
    database_id = Column(Integer)
    projects_id = Column(Integer)

    # Define a relationship to ProjectTableColumn
    columns = relationship("ProjectTableColumn", back_populates="table")
    
class ProjectTableColumn(Base):
    __tablename__ = "projectTablesColumns"

    id = Column(Integer, primary_key=True)
    nativeColumnName = Column(String)
    isPrimaryKey = Column(Boolean)
    foreignKeyFor = Column(String, nullable=True)
    dataType = Column(String)
    description = Column(String)
    speakingName = Column(String)
    descriptionsAutoGenerated = Column(Boolean)
    projectTables_id = Column(Integer, ForeignKey("projectTables.id"))
    projects_id = Column(Integer)

    # Define the back-populates relationship to ProjectTable
    table = relationship("ProjectTable", back_populates="columns")
    
class ProjectProcess(Base):
    __tablename__ = "projectProcess"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    project_id = Column(Integer)

    steps = relationship("AdapterProcessStep", back_populates="process")


class AdapterProcessStep(Base):
    __tablename__ = "adapterProcessSteps"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    tablesInvolved = Column(String)
    projectProcess_id = Column(Integer, ForeignKey("projectProcess.id"))

    process = relationship("ProjectProcess", back_populates="steps")
    business_objects = relationship("AdapterBusinessObject", back_populates="process_step")


class AdapterBusinessObject(Base):
    __tablename__ = "adapterBusinessObjects"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    storage = Column(String)
    changeQuery_SQL = Column(String)
    changeQuery_explanation = Column(String)
    adapterProcessSteps_id = Column(Integer, ForeignKey("adapterProcessSteps.id"))

    process_step = relationship("AdapterProcessStep", back_populates="business_objects")
    
class CaseID(Base):
    __tablename__ = "caseID"

    id = Column(Integer, primary_key=True)
    projectTables_nativeTableName = Column(String)
    caseidkey = Column(String)
    projectTables_description = Column(String)

class Mapping(Base):
    __tablename__ = "mappings"

    id = Column(Integer, primary_key=True)
    timestamp_column = Column(String, nullable=False)  # Format: Table.Column
    eventtype = Column(String, nullable=False)
    otherAttributes = Column(JSON)  # List of Table.Column strings