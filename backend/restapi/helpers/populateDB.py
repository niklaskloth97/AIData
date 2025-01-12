
import sys
import os

# Add the project root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from restapi.helpers import populate_projecttables, populate_caseids, populate_mappings, populate_process

if __name__ == "__main__":
    populate_projecttables()
    populate_caseids()
    populate_mappings()
    populate_caseids
    populate_process()