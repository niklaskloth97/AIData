from sqlalchemy import create_engine
from models import Base

# SQLite database URL
DATABASE_URL = "sqlite:///./project_metadata.db"

# Create the SQLite engine
engine = create_engine(DATABASE_URL, echo=True)

# Create tables
def initialize_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    initialize_db()
    print("Database initialized successfully!")
