from fastapi import APIRouter, HTTPException
import sys
import os

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from restapi.helpers.populate_projecttables import populate_projecttables
from restapi.helpers.populate_caseIDs import populate_caseids

router = APIRouter(
    prefix="/populate",
    tags=["Database Population"],
)

@router.post("/")
def populate_database():
    try:
        populate_projecttables()
        populate_caseids()
        return {"message": "Database population completed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during database population: {str(e)}")
