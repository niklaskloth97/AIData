from sqlalchemy.orm import Session
from restapi.lib.db import engine, Base
from restapi.models.ProjectProcessStep import ProjectProcessStep
from restapi.models.ProjectProcess import ProjectProcess

def create_tables():
    Base.metadata.create_all(bind=engine)

def populate_process():
    with Session(engine) as session:
        create_tables()
        # First, ensure we have a ProjectProcess to link to
        process = ProjectProcess(
            name="My Demo Process",
            description="End-to-end order processing workflow in SAP",
            project_id=1
        )
        session.add(process)
        session.flush()  # Get the ID of the process

        # Create sample process steps
        steps = [
            ProjectProcessStep(
                name="Order Creation",
                description="Initial creation of the sales order",
                tablesInvolved="VBAK, VBAP",
                projectProcess_id=process.id
            ),
            ProjectProcessStep(
                name="Delivery Processing",
                description="Creation and processing of delivery documents",
                tablesInvolved="LIKP, LIPS",
                projectProcess_id=process.id
            ),
            ProjectProcessStep(
                name="Billing",
                description="Generation of billing documents",
                tablesInvolved="VBRK, VBRP",
                projectProcess_id=process.id
            ),
            ProjectProcessStep(
                name="Payment Processing",
                description="Processing of customer payments",
                tablesInvolved="BKPF, BSEG",
                projectProcess_id=process.id
            )
        ]

        session.add_all(steps)
        session.commit()
        print("Processes and steps populated successfully")

if __name__ == "__main__":
    populate_process()