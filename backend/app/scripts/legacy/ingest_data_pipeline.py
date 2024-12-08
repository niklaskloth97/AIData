import openai
import pandas as pd
from sqlalchemy import create_engine, text
import sys
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain.schema.runnable import RunnableSequence
import time
# Add the parent directory of 'app' to the Python path, when run from the main function in this directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from app.config import Config

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = Config.OPENAI_API_KEY

# Database setup
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

# Initialize the chat model with ChatOpenAI
llm = ChatOpenAI(model="gpt-4o", temperature=0.0)

# Initial prompt for generating the first SQL script
initial_prompt_template = PromptTemplate(
    input_variables=["table_name", "csv_columns"],
    template=(
        "You are an assistant that generates SQL schema scripts. I have a CSV file with columns: {csv_columns}. "
        "Map these columns to the SAP table '{table_name}' schema and provide a raw SQL "
        "CREATE TABLE script with correct columns, data types, primary keys, Do not include foreign keys or references. "
        "Include necessary data integrity constraints. Make sure your whole answer is directly executable "
        "without any extra tokens as I want to directly feed it into a function. Do not include ```sql at beginning or end."
    ),
)

# Error-handling prompt for refining the SQL script based on errors
error_prompt_template = PromptTemplate(
    input_variables=["table_name", "csv_columns", "error_message"],
    template=(
        "I am trying to create an SQL table for the SAP table '{table_name}' "
        "based on these columns: {csv_columns}. However, there was an error: '{error_message}'. "
        "Please provide an updated SQL 'CREATE TABLE' statement with necessary corrections. Make sure your whole answer is directly executable "
        "without any extra tokens as I want to directly feed it into a function. Do not include ```sql at beginning or end."
    ),
)

# Initialize RunnableSequences separately for initial and error handling prompts
initial_chain = RunnableSequence(initial_prompt_template | llm)
error_chain = RunnableSequence(error_prompt_template | llm)

def verify_table_creation(table_name):
    """Verify if the table has been created in the database."""
    try:
        with engine.connect() as connection:
            result = connection.execute(
                text(f"SELECT table_name FROM information_schema.tables WHERE table_name = '{table_name.lower()}';")
            )
            table_exists = result.fetchone() is not None
            if table_exists:
                print(f"Table '{table_name}' exists in the database.")
            else:
                print(f"Table '{table_name}' does not exist in the database.")
            return table_exists
    except Exception as e:
        print(f"Error verifying table creation: {e}")
        raise
    
def get_csv_columns(csv_path):
    """Load CSV and extract column names."""
    df = pd.read_csv(csv_path)
    return list(df.columns)

def generate_create_table_script(table_name, csv_columns, error_message=None):
    """
    Use LangChain to generate or fix the SQL create table script.
    Uses the initial prompt if no error_message is provided,
    otherwise switches to the error-handling prompt.
    """
    if error_message is None:
        # Use initial prompt for the first attempt
        response = initial_chain.invoke({
            "table_name": table_name,
            "csv_columns": csv_columns
        })
    else:
        # Use error-handling prompt for subsequent attempts
        response = error_chain.invoke({
            "table_name": table_name,
            "csv_columns": csv_columns,
            "error_message": error_message
        })

    return response.content.strip()

# Execute the SQL script of CREATING THE TABLE!
def execute_sql_script(script):
    """Attempt to execute the provided SQL script and handle errors."""
    try:
        with engine.connect() as connection:
            result = connection.execute(text(script))
            print("db result:", result)
            return True
    except Exception as e:
        print(f"Error executing SQL script: {e}")
        return str(e)

def main():
    print(os.path.abspath(os.getcwd()))
    table_name = "BKPF"  # Example table
    csv_path = "csv-files/BKPF_1.csv" 
    max_retries = 5  # Set a maximum retry limit
    retries = 0

    # Get column names from CSV
    csv_columns = get_csv_columns(csv_path)
    
    # Generate the initial create table script without error context
    script = generate_create_table_script(table_name, csv_columns)

    # Retry loop
    while retries < max_retries:
        # Attempt to execute the script
        error_message = execute_sql_script(script)
        
        if error_message is True:
            # Success, exit loop
            break

        # Increment retry counter and ask OpenAI for a revised script
        retries += 1
        print(f"Retrying... ({retries}/{max_retries})")

        # Generate a new script with error context for subsequent attempts
        script = generate_create_table_script(table_name, csv_columns, error_message=error_message)
        verify_table_creation(table_name)

    if retries == max_retries:
        print("Max retries reached. Could not successfully create the table.")
    else:
        print("Table created successfully after retries.")

if __name__ == "__main__":
    main()
