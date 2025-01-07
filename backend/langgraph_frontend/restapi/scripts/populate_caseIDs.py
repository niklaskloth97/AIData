from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from models import ProjectTable
from typing import List, Dict
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection strings
POSTGRES_URI = "postgresql://aidatahilti_owner:YDkg5rC6jpdL@ep-flat-leaf-a20i5gog.eu-central-1.aws.neon.tech/aidatahilti?sslmode=require"
SQLITE_URI = "sqlite:///./project_metadata.db"

# Create database engines
pg_engine = create_engine(POSTGRES_URI)
sqlite_engine = create_engine(SQLITE_URI)

# Create sessions
PostgresSession = sessionmaker(bind=pg_engine)
SQLiteSession = sessionmaker(bind=sqlite_engine)

def fetch_data(table_names: List[str]) -> List[Dict]:
    """
    Fetch data from PostgreSQL based on table names and format with metadata from SQLite.
    """
    result = []
    
    # PostgreSQL session for actual data
    with PostgresSession() as pg_session:
        # SQLite session for metadata
        with SQLiteSession() as sqlite_session:
            inspector = inspect(pg_engine)

            for table_name in table_names:
                # Fetch metadata from SQLite
                metadata = (
                    sqlite_session.query(ProjectTable)
                    .filter_by(nativeTableName=table_name)
                    .first()
                )
                if not metadata:
                    print(f"Warning: Metadata for table {table_name} not found in SQLite.")
                    continue

                # Fetch primary key columns from PostgreSQL
                pk_columns = [
                    col["name"] for col in inspector.get_columns(table_name) if col.get("primary_key")
                ]
                if not pk_columns:
                    print(f"Warning: No primary keys found for table {table_name}.")
                    continue

                # Construct primary key format
                caseidkey = ", ".join([f"{table_name}.{pk}" for pk in pk_columns])

                # Fetch actual data from PostgreSQL
                query = f"SELECT {', '.join(pk_columns)} FROM {table_name} LIMIT 5"
                rows = pg_session.execute(query).fetchall()

                # Format result
                for row in rows:
                    result.append({
                        "projectTables_nativeTableName": table_name,
                        "caseidkey": caseidkey,
                        "projectTables_description": metadata.description,
                    })

    return result

if __name__ == "__main__":
    # Example table names
    table_names = ["EBAN", "BKPF", "EKPO"]
    
    # Fetch data
    data = fetch_data(table_names)
    
    # Print results
    for entry in data:
        print(entry)
