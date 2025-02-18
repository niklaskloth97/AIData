# populate_possible_mappings.py

import sys
import os
# Dynamically adjust the path for proper imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from sqlalchemy.orm import Session
from sqlalchemy import create_engine

POSTGRES_URI = (
    "postgresql://aidatahilti_owner:YDkg5rC6jpdL"
    "@ep-flat-leaf-a20i5gog.eu-central-1.aws.neon.tech"
    "/aidatahilti?sslmode=require"
)
pg_engine = create_engine(POSTGRES_URI)

from sqlalchemy.orm import Session
from restapi.lib.db import engine, Base
from restapi.models.AdditionalEvent import AdditionalEvent
from restapi.models.PossibleMapping import PossibleMapping
from restapi.models.ProjectTable import ProjectTable
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


def get_columns_for_table(table_name, pg_engine, schema=None):
    """
    Reflects the given table_name from the DB via SQLAlchemy and returns a list of column names.
    In SQLAlchemy 2.0, do NOT pass bind=engine to MetaData(); instead,
    specify autoload_with=engine in the Table constructor.
    """
    from sqlalchemy import MetaData, Table
    metadata = MetaData()  # no bind=engine here
    # If your table names are uppercase in Postgres, consider quoting them explicitly, e.g.:
    # reflected_table = Table(quoted_name(table_name, True), metadata, autoload_with=engine, schema=schema)
    # But often just Table(table_name, ...) is enough if you physically named them uppercase.
    reflected_table = Table(table_name, metadata, autoload_with=pg_engine, schema=schema)
    return [col.name for col in reflected_table.columns]

def create_tables():
    """Create all tables (including `possible_mappings`) if not yet created.
       If the `PossibleMapping` table exists, drop and recreate it."""
    try:
        # Check if the PossibleMapping table exists
        PossibleMapping.__table__.drop(engine)  # Drop the PossibleMapping table if it exists

        # Recreate the table
        PossibleMapping.__table__.create(engine)

        # Create any other tables that haven't been created yet
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully!")
    except SQLAlchemyError as e:
        print(f"An error occurred: {e}")


def populate_possible_mappings():
    """
    1. Reads all AdditionalEvent rows from the DB.
    2. For each row:
       - Takes the 'tablesInvolved' (e.g., 'EBAN', 'BSEG', etc.)
       - Reflects column names from each involved table
       - Optionally adds columns from 'CDHDR' or 'CDPOS'
       - Creates a PossibleMapping entry with those columns.
    """
    create_tables()  # ensure table is created

    with Session(engine) as session:
        # delete table PossibleMapping
        # Get all AdditionalEvent records
        additional_events = session.query(AdditionalEvent).all()

        # Optionally reflect CDHDR / CDPOS columns (if they exist)
        try:
            cdhdr_columns = get_columns_for_table("CDHDR", pg_engine)
            cdpos_columns = get_columns_for_table("CDPOS", pg_engine)
        except Exception as ex:
            cdhdr_columns = []
            cdpos_columns = []
            print(f"Warning: Unable to reflect CDHDR or CDPOS: {ex}")

        for event in additional_events:
            # 'tablesInvolved' may have multiple tables separated by commas
            table_list = [t.strip() for t in event.tablesInvolved.split(",") if t.strip()]

            # Gather columns for all involved tables
            all_columns = []
            for tbl in table_list:
                try:
                    cols = get_columns_for_table(tbl, pg_engine)
                    all_columns.extend(cols)
                except Exception as ex:
                    print(f"Warning: Could not reflect table {tbl} -> {ex}")

            # Optionally always include CDHDR/CDPOS columns
            if cdhdr_columns:
                all_columns.extend(cdhdr_columns)
            if cdpos_columns:
                all_columns.extend(cdpos_columns)

            # Remove duplicates if multiple tables or if CDHDR/CDPOS was added
            all_columns = list(set(all_columns))
            # get the display names of the columns from the ProjectTable
            all_tables = session.query(ProjectTable).all()
            for table in all_tables:
                for column in table.columns:
                    if column.nativeColumnName in all_columns:
                        all_columns[all_columns.index(column.nativeColumnName)] = column.column_name
            # Create a display name combining business_object & change_event_name
            display_name = f"{event.business_object} - {event.change_event_name}"

            # Create a new PossibleMapping record
            mapping = PossibleMapping(
                displayName=display_name,
                # Example: set a default timestamp column (or leave it null if you want)
                timestampColumn="CDHDR.UDATE",
                eventType=event.change_event_name,
                possibleAttributes=all_columns,
                involvedTable=table_list[0]
            )

            session.add(mapping)

        session.commit()
        print("PossibleMapping records populated successfully.")
        

def populate_possible_standard_mappings():
    """
    Creates a set of 'PossibleMapping' records for standard P2P events
    (Create PR, Approve PR, Create PO, Approve PO, Goods Receipt, Create Invoice, Verify Invoice, 
     Clear Invoice, Payment),
    but DOES NOT involve CDHDR/CDPOS change-document tables.
    """

    # 2) Define your "standard" events without CDHDR/CDPOS.
    standard_events = [
        {
            "business_object": "Purchase Requisition",
            "change_event_name": "Create PR",
            "tables": ["EBAN"],            # Basic creation data in EBAN
            "timestamp_column": "EBAN.ERDAT"
        },
        {
            "business_object": "Purchase Requisition",
            "change_event_name": "Approve PR",
            "tables": ["EBAN"],            # Approvals can also appear in EBAN (release fields)
            "timestamp_column": "EBAN.ERDAT"
        },
        {
            "business_object": "Purchase Order",
            "change_event_name": "Create PO",
            "tables": ["EKKO"],            # Basic creation data in EKKO
            "timestamp_column": "EKKO.BEDAT"
        },
        {
            "business_object": "Purchase Order",
            "change_event_name": "Approve PO",
            "tables": ["EKKO"],            # Approvals can also be tracked in EKKO (release fields)
            "timestamp_column": "EKKO.BEDAT"
        },
        {
            "business_object": "Goods Receipt",
            "change_event_name": "Goods Receipt",
            "tables": ["MKPF", "MSEG"],    # Material doc header/items
            "timestamp_column": "MKPF.BUDAT"
        },
        {
            "business_object": "Invoice",
            "change_event_name": "Create Invoice",
            "tables": ["RBKP", "RSEG"],    # Invoice doc header/items
            "timestamp_column": "RBKP.CPUDT"
        },
        {
            "business_object": "Invoice",
            "change_event_name": "Verify Invoice",
            "tables": ["RBKP"],            # If you track “verify” in the same invoice doc
            "timestamp_column": "RBKP.CPUDT"
        },
        {
            "business_object": "Invoice",
            "change_event_name": "Clear Invoice",
            "tables": ["BSEG", "BKPF"],    # Clearing info typically in BSEG (AUGBL/AUGDT)
            "timestamp_column": "BSEG.AUGDT"
        },
        {
            "business_object": "Payment",
            "change_event_name": "Payment",
            "tables": ["BKPF", "BSEG"],    # Payment doc in BKPF/BSEG
            "timestamp_column": "BKPF.BUDAT"
        },
    ]

    with Session(engine) as session:
        # 3) For each standard event, gather columns & create a PossibleMapping
        for evt in standard_events:
            bo_name = evt["business_object"]
            event_name = evt["change_event_name"]
            table_list = evt["tables"]
            timestamp_col = evt["timestamp_column"]

            # Gather columns for all involved tables
            all_columns = []
            for tbl in table_list:
                try:
                    cols = get_columns_for_table(tbl, pg_engine)
                    all_columns.extend(cols)
                except Exception as ex:
                    print(f"Warning: Could not reflect table {tbl} -> {ex}")

            # Remove duplicates
            all_columns = list(set(all_columns))

            # Create displayName
            display_name = f"{bo_name} - {event_name}"

            # Insert new PossibleMapping
            mapping = PossibleMapping(
                displayName=display_name,
                timestampColumn=timestamp_col,
                eventType=display_name + "standard event",
                possibleAttributes=all_columns,
                involvedTable=table_list[0] if table_list else None
            )
            session.add(mapping)

        session.commit()

    print("Standard P2P PossibleMapping records populated successfully!")



if __name__ == "__main__":
    populate_possible_mappings()
    populate_possible_standard_mappings()
