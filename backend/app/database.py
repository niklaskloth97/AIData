import os
from sqlalchemy import create_engine, inspect, MetaData, Table
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

class Database:
    def __init__(self):
        self.engine = None
        self.metadata = None
        self.session = None
        self.inspector = None
        print("Initializing database")
        self.initialize()

        print("Database initialized")

    def initialize(self):
        load_dotenv()

        # Set up the database connection
        db_url = os.getenv('DATABASE_URL')
        self.engine = create_engine(db_url)
        self.metadata = MetaData()

        # Reflect all tables in the database
        self.metadata.reflect(bind=self.engine)

        # Create a session
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

        # Initialize an inspector
        self.inspector = inspect(self.engine)

    # Gather respective data from the database for AI system
    # 1. Table names
    # 2. Column names
    # 3. Column types (primary key, foreign key)
    # 4. First row of data
    def fetchData(self):
        print(self.inspector.get_table_names())
        # Fetch metadata for each table
        for table_name in self.inspector.get_table_names():
            print(f"Table: {table_name}")
            
            # Retrieve column details
            columns = self.inspector.get_columns(table_name)
            for column in columns:
                column_name = column['name']
                column_type = column['type']
                primary_key = 'Primary Key' if column['primary_key'] else ''
                foreign_keys = self.inspector.get_foreign_keys(table_name, column_name)
                foreign_key = f"Foreign Key to {foreign_keys[0]['referred_table']}.{foreign_keys[0]['referred_columns'][0]}" if foreign_keys else ''

                # Print column information
                print(f"    Column: {column_name}, Type: {column_type}, {primary_key} {foreign_key}")

            # Fetch the first row data
            table = Table(table_name, self.metadata, autoload_with=self.engine)
            first_row = self.session.query(table).first()
            print(f"First Row: {first_row}\n")