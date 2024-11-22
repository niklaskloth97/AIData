import os
import openai
import pandas as pd
from sqlalchemy import create_engine, text, inspect
from app.config import Config
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnableSequence
import logging

# Load environment variables
load_dotenv()

# Set up OpenAI API key and logging
openai.api_key = Config.OPENAI_API_KEY
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Database setup
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

# Initialize the chat model with ChatOpenAI
llm = ChatOpenAI(model="gpt-4o", temperature=0.0)

# Prompt templates
initial_prompt_template = PromptTemplate(
    input_variables=["table_name", "csv_columns"],
    template=(
        "You are an AI assistant that generates SQL scripts for database tables. "
        "The CSV columns are: {csv_columns}. Generate a CREATE TABLE statement for the '{table_name}' table. "
        "Ensure data types and constraints are inferred accurately from the column names. "
        "Include foreign keys if necessary. Ensure the SQL is directly executable."
    ),
)

# Runnable sequence for SQL generation
initial_chain = RunnableSequence(initial_prompt_template | llm)

def get_csv_metadata(csv_path):
    """Load CSV and infer metadata."""
    df = pd.read_csv(csv_path)
    inferred_types = df.dtypes.apply(lambda x: x.name).to_dict()
    return list(df.columns), inferred_types, df

def generate_create_table_script(table_name, csv_columns, csv_types):
    """Generate a CREATE TABLE script using OpenAI."""
    columns_with_types = [f"{col} {csv_types[col]}" for col in csv_columns]
    columns_sql = ", ".join(columns_with_types)
    prompt_data = {"table_name": table_name, "csv_columns": columns_sql}
    response = initial_chain.invoke(prompt_data)
    return response.content.strip()

def execute_sql_script(script):
    """Execute SQL script with error handling."""
    try:
        with engine.connect() as connection:
            connection.execute(text(script))
        return True
    except Exception as e:
        logging.error(f"SQL Execution Error: {e}")
        return str(e)

def insert_data_with_bulk_load(table_name, df):
    """Insert data using bulk load for performance."""
    try:
        df.to_sql(table_name, engine, if_exists='append', index=False, method='multi', chunksize=1000)
        logging.info(f"Data successfully inserted into '{table_name}'.")
        return True
    except Exception as e:
        logging.error(f"Data Insertion Error: {e}")
        return False

def process_csv_file(csv_path, table_name):
    """Process a CSV file end-to-end."""
    logging.info(f"Processing file: {csv_path}")
    
    csv_columns, csv_types, df = get_csv_metadata(csv_path)
    script = generate_create_table_script(table_name, csv_columns, csv_types)
    
    if execute_sql_script(script) is not True:
        logging.error(f"Failed to create table '{table_name}'.")
        return False
    
    return insert_data_with_bulk_load(table_name, df)

def main():
    csv_dir = "/path/to/csv/directory"
    csv_files = [f for f in os.listdir(csv_dir) if f.endswith('.csv')]
    
    for csv_file in csv_files:
        table_name = os.path.splitext(csv_file)[0]
        csv_path = os.path.join(csv_dir, csv_file)
        process_csv_file(csv_path, table_name)

if __name__ == "__main__":
    main()
