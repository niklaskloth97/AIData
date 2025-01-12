import random
import sys
import os
# Dynamically adjust the path for proper imports

# Dynamically add the project root directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from restapi.models.CaseID import CaseID
from restapi.models.ProjectTable import ProjectTable
from restapi.models.ProjectTableColumn import ProjectTableColumn
from restapi.lib.db import engine, Base


def delete_existing_tables():
    Base.metadata.create_all(bind=engine)

def populate_caseids():
    # Delete existing CaseIDs before generating new ones
    delete_existing_tables()
    with Session(bind=engine) as sqlite_session:
        
        sqlite_session.query(CaseID).delete()
        sqlite_session.commit()
        # Fetch all ProjectTables and their corresponding ProjectTableColumns
        project_tables = sqlite_session.query(ProjectTable).all()

        for project_table in project_tables:
            print(f"Processing table '{project_table}'...")
            # Fetch primary key columns for the current table
            primary_key_columns = (
                sqlite_session.query(ProjectTableColumn)
                .filter_by(projectTables_id=project_table.id, isPrimaryKey=True)
                .all()
            )

            if not primary_key_columns:
                print(f"No primary key columns found for table '{project_table.nativeTableName}'. Skipping.")
                continue

            # Create CaseID entries based on primary key columns
            case_id = CaseID(
                projectTables_nativeTableName=project_table.nativeTableName,
                referenceColumns=primary_key_columns,  # Many-to-many relationship
                projectTables_description=project_table.description
            )
            sqlite_session.add(case_id)
            print(f"CaseID created for table '{project_table.nativeTableName}' with primary keys {[col.nativeColumnName for col in primary_key_columns]}.")

        # Commit all CaseID entries
        sqlite_session.commit()
        
        sqlite_session.close()
        print("CaseIDs populated successfully!")

if __name__ == "__main__":
    populate_caseids()
