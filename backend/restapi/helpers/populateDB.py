
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from restapi.lib.db import engine, Base

# Add the project root directory to sys.path
from restapi.helpers import populate_projecttables, populate_caseids, populate_additional_events, populate_possible_mappings


def populate_db():
    populate_projecttables()
    populate_caseids()
    populate_possible_mappings()
    populate_additional_events()
    
if __name__ == "__main__":
    populate_db()