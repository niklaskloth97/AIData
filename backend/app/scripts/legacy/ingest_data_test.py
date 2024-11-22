import openai
import pandas as pd
from sqlalchemy import create_engine, text
from app.config import Config
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnableSequence
import os

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
        "CREATE TABLE script with correct columns, data types, primary keys. Do not include foreign keys or references. "
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
            return result.fetchone() is not None
    except Exception as e:
        print(f"Error verifying table creation: {e}")
        return False


def get_csv_columns(csv_path):
    """Load CSV and extract column names."""
    df = pd.read_csv(csv_path)
    return list(df.columns), df


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


def execute_sql_script(script):
    """Attempt to execute the provided SQL script and handle errors."""
    try:
        with engine.connect() as connection:
            connection.execute(text(script))
            return True
    except Exception as e:
        print(f"Error executing SQL script: {e}")
        return str(e)


def insert_csv_data_to_table(table_name, df):
    """Insert CSV data into the created table."""
    try:
        df.to_sql(table_name, engine, if_exists='append', index=False)
        print(f"Data successfully inserted into table '{table_name}'.")
        return True
    except Exception as e:
        print(f"Error inserting data into table '{table_name}': {e}")
        return False


def process_csv_file(csv_path, table_name):
    """Process a single CSV file: create table and insert data."""
    max_retries = 5
    retries = 0

    # Get column names and data from CSV
    csv_columns, df = get_csv_columns(csv_path)

    # Generate the initial create table script
    script = generate_create_table_script(table_name, csv_columns)

    # Retry loop for table creation
    while retries < max_retries:
        error_message = execute_sql_script(script)
        if error_message is True:
            print(f"Table '{table_name}' created successfully.")
            break

        retries += 1
        print(f"Retrying table creation... ({retries}/{max_retries})")
        script = generate_create_table_script(table_name, csv_columns, error_message=error_message)

    if retries == max_retries:
        print(f"Max retries reached. Could not create table '{table_name}'.")
        return False

    # Insert data into the table
    return insert_csv_data_to_table(table_name, df)


def main():
    csv_dir = "/Users/philipnartschik/Downloads/Demo"  # Directory containing CSV files
    csv_files = [f for f in os.listdir(csv_dir) if f.endswith('.csv')]

    if not csv_files:
        print("No CSV files found in the directory.")
        return

    for csv_file in csv_files:
        table_name = os.path.splitext(csv_file)[0]  # Use the CSV file name (without extension) as the table name
        csv_path = os.path.join(csv_dir, csv_file)
        print(f"Processing file: {csv_file}")

        success = process_csv_file(csv_path, table_name)
        if not success:
            print(f"Failed to process file: {csv_file}")
        else:
            print(f"Successfully processed file: {csv_file}")


if __name__ == "__main__":
    main()
