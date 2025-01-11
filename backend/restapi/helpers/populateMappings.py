from sqlalchemy.orm import Session
from restapi.lib.db import engine, Base
from restapi.models.Mapping import Mapping

def create_tables():
    Base.metadata.create_all(bind=engine)

def populate_mappings():
    with Session(engine) as session:
        create_tables()

        mappings = [
                Mapping(
                    displayName="Order Creation Time",
                    timestampColumn="VBAK.ERDAT",
                    eventType="Order_Created",
                    otherAttributes=["VBAK.VBELN", "VBAK.AUART"]
                ),
                Mapping(
                    displayName="Delivery Processing",
                    timestampColumn="LIKP.ERDAT",
                    eventType="Delivery_Created",
                    otherAttributes=["LIKP.VBELN", "LIKP.WADAT"]
                ),
                Mapping(
                    displayName="Payment Receipt",
                    timestampColumn="BKPF.BUDAT",
                    eventType="Payment_Received",
                    otherAttributes=["BKPF.BELNR", "BSEG.WRBTR"]
                )
            ]
            
        session.add_all(mappings)
        session.commit()
        print("Mappings populated successfully")

if __name__ == "__main__":
    populate_mappings()