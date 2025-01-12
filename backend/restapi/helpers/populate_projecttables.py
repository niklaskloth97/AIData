from sqlalchemy.orm import Session
import sys

import os

# Dynamically add the project root directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from sqlalchemy import inspect, create_engine
from restapi.models.ProjectTable import ProjectTable
from restapi.models.ProjectTableColumn import ProjectTableColumn
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from restapi.lib.db import engine, Base

# Load environment variables
load_dotenv()

# PostgreSQL connection
POSTGRES_URI = "postgresql://aidatahilti_owner:YDkg5rC6jpdL@ep-flat-leaf-a20i5gog.eu-central-1.aws.neon.tech/aidatahilti?sslmode=require"
pg_engine = create_engine(POSTGRES_URI)

sqlite_engine = engine

def create_entries():
    Base.metadata.drop_all(bind=sqlite_engine)
    Base.metadata.create_all(bind=sqlite_engine)

import json
import re

def extract_json_from_response(response_content):
    """
    Extract the JSON content enclosed between ```json and ``` markers.
    """
    try:
        # Use regex to extract content between ```json and ```
        match = re.search(r"```json\n(.*?)\n```", response_content, re.DOTALL)
        if match:
            json_content = match.group(1)
            return json.loads(json_content)  # Parse the extracted JSON
        else:
            raise ValueError("No JSON block found in the response.")
    except json.JSONDecodeError as e:
        raise ValueError(f"Error decoding JSON: {e}")
    
def fetch_and_validate_columns_with_llm(llm, table_name, columns):
        retries = 3  # Allow up to 3 retries
        # Extract column names from the dictionary
        
        while retries > 0:
            try:
                # Invoke LLM to get column names and descriptions
                column_names = [col["name"] for col in columns]

                # Invoke LLM to get column names and descriptions
                column_data_response = llm.invoke(
                    f"For the table '{table_name}', provide a JSON array where each item is an object with "
                    f"'original_name', 'speaking_name', and 'description' fields. Columns: {column_names}"
                )
                # Extract JSON content
                print(column_data_response.content)
                column_data = extract_json_from_response(column_data_response.content)

                if not isinstance(column_data, list) or not all(
                    isinstance(item, dict) and 'original_name' in item and 'speaking_name' in item and 'description' in item
                    for item in column_data
                ):
                    raise ValueError("Invalid column data format")
                return column_data  # Return validated column data
            except Exception as e:
                print(f"Error parsing column data for table '{table_name}': {e}")
                retries -= 1
                if retries > 0:
                    print(f"Retrying LLM request for table '{table_name}'...")
        raise ValueError(f"Failed to fetch and validate column data for table '{table_name}' after multiple attempts.")

def extract_and_process_column_descriptions(llm, table_name, columns):
        descriptions = []
        for col in columns:
            try:
                column_description_response = llm.invoke(
                    f"Provide a JSON object describing the column '{col.name}' in table '{table_name}' with fields: 'description' and 'context'. Context of SAP is given."
                )
                column_description = eval(column_description_response.content)
                descriptions.append({
                    "column_name": col.name,
                    "description": column_description.get("description", ""),
                    "context": column_description.get("context", "")
                })
            except Exception as e:
                print(f"Error extracting description for column '{col.name}' in table '{table_name}': {e}")
        return descriptions

# Initialize OpenAI LLM
llm = ChatOpenAI(model="gpt-4o", openai_api_key=os.getenv("OPENAI_API_KEY"))
def populate_projecttables():
    create_entries()
    # Inspect PostgreSQL schema
    inspector = inspect(pg_engine)
    table_names = inspector.get_table_names()

    with Session(sqlite_engine) as session:
        for table_name in table_names:
            # Skip if table is already in SQLite
            if session.query(ProjectTable).filter_by(nativeTableName=table_name).first():
                continue

            # Fetch table metadata
            columns = inspector.get_columns(table_name)
            # Fetch primary key information
            primary_key_info = inspector.get_pk_constraint(table_name)
            primary_keys = primary_key_info.get("constrained_columns", [])

            # Extract content from LLM responses
            table_description_response = llm.invoke(f"Provide a description for the table '{table_name}'. Use maximum 2 sentences")
            table_name_response = llm.invoke(f"Provide a speaking name for the table '{table_name}'. Please use only one word. Dont describe your answer just provide the name.")
            table_description = table_description_response.content
            table_name_speaking = table_name_response.content
            # Insert table metadata
            project_table = ProjectTable(
                nativeTableName=table_name,
                primaryKeyDetected=any(col.get("primary_key", True) for col in columns),
                description=table_description,
                table_name=table_name_speaking,
                table_nameAutoGenerated=True,
                descriptionAutoGenerated=True,
                columnCount=len(columns),
                database_id=1,  # Replace with actual database ID
                projects_id=1  # Replace with actual project ID
            )
            session.add(project_table)
            session.flush()  # To get the table ID for foreign key references
            # Insert column metadata
            
            column_data = fetch_and_validate_columns_with_llm(llm, table_name, columns)
            for col in columns:
                try:
                    # Match the column data from LLM response using col["name"]
                    col_data = next(item for item in column_data if item["original_name"] == col["name"])
                    is_primary_key = col["name"] in primary_keys
                    # Create an instance of the ORM class
                    project_table_column = ProjectTableColumn(
                        nativeColumnName=col["name"],
                        isPrimaryKey=is_primary_key,  # Adjust for primary key
                        foreignKeyFor=None,  # Update with FK logic if required
                        dataType=str(col["type"]),  # Use actual type from schema
                        description=col_data["description"],
                        column_name=col_data["speaking_name"],  # Get speaking name
                        column_nameAutoGenerated=True,
                        descriptionsAutoGenerated=True,
                        projectTables_id=project_table.id,
                        projects_id=1  # Replace with actual project ID
                    )

                    # Add the instance to the session
                    session.add(project_table_column)
                    session.commit()
                except Exception as e:
                    print(f"Error inserting column metadata for column '{col['name']}' in table '{table_name}': {e}")

        # Commit changes
        session.commit()

if __name__ == "__main__":
    populate_projecttables()
    print("Metadata populated successfully!")


