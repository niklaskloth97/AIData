import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

# Load environment variables
load_dotenv()

# Database connection
RESTAPI_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(RESTAPI_DIR, "project_metadata.db")
DATABASE_URL = os.getenv("SQLITE_DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(DATABASE_URL)

Base = declarative_base()

SessionLocal = sessionmaker(engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
