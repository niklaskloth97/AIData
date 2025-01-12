import sys
import os
# Dynamically adjust the path for proper imports

# Dynamically add the project root directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import text

from restapi.lib.db import engine, Base
from restapi.models.AdditionalEvent import AdditionalEvent

POSTGRES_URI = "postgresql://aidatahilti_owner:YDkg5rC6jpdL@ep-flat-leaf-a20i5gog.eu-central-1.aws.neon.tech/aidatahilti?sslmode=require"
pg_engine = create_engine(POSTGRES_URI)


def create_tables():
    """
    Creates all tables defined in the SQLAlchemy Base metadata,
    including ProjectProcess, ProjectProcessStep, and AdditionalEvent.
    """
    Base.metadata.create_all(bind=engine)
    
    
def populate_additional_events():
    """
    Queries the CDPOSHDR table for most common change events (FNAME)
    per given business object (TABNAME) and populates the AdditionalEvent table.
    """
    # Ensure tables exist
    create_tables()

    # The mapping of table names to their business meaning
    table_descriptions = {
        "EBAN": "Purchase Requisition",
        "BSEG": "Invoice",       # More accurately "FI Document Line Items"
        "EKKO": "Purchase Order (Header)",
        "EKPO": "Purchase Order (Items)"
    }
    
    # Define the list of tables to check
    tables_to_check = ["BSEG", "EBAN", "EKKO", "EKPO"]
    
    # Source DB session (Postgres)
    pg_session = Session(pg_engine)
    
    # Target DB session
    with Session(engine) as session:
        for table_name in tables_to_check:
            # Raw SQL to count occurrences of "FNAME" grouped by "FNAME"
            query = text(f"""
                SELECT "FNAME", COUNT(*) as event_count
                FROM "CDPOS"
                WHERE "TABNAME" = :table_name
                GROUP BY "FNAME"
            """)
            
            # Execute the query against the source DB
            result = pg_session.execute(query, {"table_name": table_name})
            
            # Insert the aggregated results into our AdditionalEvent table
            for row in result:
                fname = row[0]
                event_count = row[1]
                
                # Use the descriptive name from table_descriptions for business_object
                descriptive_name = table_descriptions.get(table_name, table_name)
                
                additional_event = AdditionalEvent(
                    business_object=descriptive_name,
                    change_event_name=fname,
                    change_event_count=event_count,
                    # Short description using the descriptive name
                    description=f"Most common change event for {descriptive_name}",
                    tablesInvolved=table_name
                )
                print(
                    f"Adding event -> "
                    f"Business Object: {additional_event.business_object}, "
                    f"Change Event Name: {additional_event.change_event_name}, "
                    f"Count: {additional_event.change_event_count}"
                )
                
                # Add to target DB session
                session.add(additional_event)
        
        # Commit all inserts in the target DB
        session.commit()
        print("AdditionalEvent records populated successfully.")


if __name__ == "__main__":
    # First populate Project Process and Steps

    # Then populate Additional Events based on CDPOSHDR
    populate_additional_events()