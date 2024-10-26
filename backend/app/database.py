from sqlalchemy import create_engine, inspect, MetaData, Table
from sqlalchemy.orm import sessionmaker

# Set up the database connection
db_url = "postgresql+psycopg2://username:password@hostname:port/dbname"
engine = create_engine(db_url)
metadata = MetaData()

# Reflect all tables in the database
metadata.reflect(bind=engine)

# Create a session
Session = sessionmaker(bind=engine)
session = Session()

# Initialize an inspector
inspector = inspect(engine)

# Fetch metadata for each table
for table_name in inspector.get_table_names():
    print(f"Table: {table_name}")
    
    # Retrieve column details
    columns = inspector.get_columns(table_name)
    for column in columns:
        column_name = column['name']
        column_type = column['type']
        primary_key = 'Primary Key' if column['primary_key'] else ''
        foreign_keys = inspector.get_foreign_keys(table_name, column_name)
        foreign_key = f"Foreign Key to {foreign_keys[0]['referred_table']}.{foreign_keys[0]['referred_columns'][0]}" if foreign_keys else ''
        
        # Print column information
        print(f"    Column: {column_name}, Type: {column_type}, {primary_key} {foreign_key}")
    
    # Fetch the first row of data
    table = Table(table_name, metadata, autoload_with=engine)
    first_row = session.query(table).first()
    print(f"    First Row: {first_row}\n")
