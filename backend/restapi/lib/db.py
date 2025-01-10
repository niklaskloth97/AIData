import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

# Load environment variables
load_dotenv()

# Database connection
DATABASE_URL = os.getenv("SQLITE_DATABASE_URL", "sqlite:///./project_metadata.db")

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
