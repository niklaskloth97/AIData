
import sys
import os

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from restapi.helpers import populate_projecttables, populate_caseids, populate_additional_events, populate_possible_mappings

def populate_db():
    
    populate_projecttables()
    populate_caseids()
    populate_possible_mappings()
    populate_additional_events()
    
if __name__ == "__main__":
    populate_db()