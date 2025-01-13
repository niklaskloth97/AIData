
import sys
import os

from restapi.lib.db import engine, Base

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from restapi.helpers import populate_projecttables, populate_caseids, populate_additional_events, populate_possible_mappings

if __name__ == "__main__":
    Base.metadata.drop_all(bind=engine)
    populate_projecttables()
    populate_caseids()
    populate_possible_mappings()
    populate_additional_events()