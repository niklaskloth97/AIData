from sqlalchemy.orm import Session
from restapi.lib.db import engine
from restapi.models.ProjectProcessStep import ProjectProcessStep
from restapi.models.ProjectProcess import ProjectProcess
from restapi.helpers import populate_process, populate_mappings

if __name__ == "__main__":
    populate_process()
    populate_mappings()