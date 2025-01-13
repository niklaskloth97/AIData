import sys
import os
# Dynamically adjust the path for proper imports

# Dynamically add the project root directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from restapi.lib.db import engine, Base
from restapi.models.Mapping import Mapping

def create_tables():
    try:
        # Check if the PossibleMapping table exists
        Mapping.__table__.drop(engine)  # Drop the PossibleMapping table if it exists

        # Create any other tables that haven't been created yet
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully!")
    except SQLAlchemyError as e:
        print(f"An error occurred: {e}")

def populate_mappings():
    with Session(engine) as session:
        create_tables()

        mappings = [
                Mapping(
                    displayName="Order Creation Time",
                    timestampColumn="VBAK.ERDAT",
                    eventType="Order_Created",
                    otherAttributes=["VBAK.VBELN", "VBAK.AUART"],
                    tableInvolved="VBAK"
                ),
                Mapping(
                    displayName="Delivery Processing",
                    timestampColumn="LIKP.ERDAT",
                    eventType="Delivery_Created",
                    otherAttributes=["LIKP.VBELN", "LIKP.WADAT"],
                    tableInvolved="VBAK"
                ),
                Mapping(
                    displayName="Payment Receipt",
                    timestampColumn="BKPF.BUDAT",
                    eventType="Payment_Received",
                    otherAttributes=["BKPF.BELNR", "BSEG.WRBTR"],
                    tableInvolved="VBAK"
                )
            ]
            
        session.add_all(mappings)
        session.commit()
        print("Mappings populated successfully")

if __name__ == "__main__":
    populate_mappings()