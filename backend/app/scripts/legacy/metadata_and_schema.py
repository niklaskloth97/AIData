import os
import pandas as pd
import json
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnableSequence
from app.config import Config
import tiktoken
import time
from openai import RateLimitError, APIError


def call_gpt_with_retry(input_data, max_retries=3, wait_time=10):
    for attempt in range(max_retries):
        try:
            response = schema_chain.invoke(input_data)
            return response
        except RateLimitError as e:
            if attempt < max_retries - 1:
                print(f"Rate limit exceeded. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                raise
        except APIError as e:
            print(f"API error occurred: {e}")
            raise

# Initialize OpenAI Model
llm = ChatOpenAI(model="gpt-4o", temperature=0.0)

# Prompt template for GPT-4o to infer schema
schema_inference_prompt = PromptTemplate(
    input_variables=["csv_metadata", "context"],
    template=(
        "You are a database schema expert. Based on the following metadata for multiple CSV files: {csv_metadata}, "
        "infer the database schema. Include primary keys, foreign keys, and relationships between tables. "
        "Use the following context for guidance: {context}. "
        "Return the schema as a structured JSON array which is sufficient as a context information for further use. The json should be directly runnable from your answer even not beginning with ```json "
    ),
)

schema_chain = RunnableSequence(schema_inference_prompt | llm)

# Analyze CSV for metadata
def analyze_csv(csv_path, delimiter=','):
    """
    Analyze a CSV file and return minimal metadata to reduce tokens.
    """
    print(f"Analyzing CSV: {csv_path} with delimiter: '{delimiter}'")
    try:
        df = pd.read_csv(csv_path, delimiter=delimiter, on_bad_lines='warn')
    except Exception as e:
        print(f"Error reading {csv_path}: {e}")
        return None  # Skip problematic files
    
    column_info = {
        "columns": list(df.columns),
        "data_types": df.dtypes.apply(lambda x: x.name).to_dict(),
        "num_samples": min(len(df), 2)
    }
    return column_info

def count_tokens(input_text, model="gpt-4"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(input_text))

# Check for duplicate schemas
def is_duplicate_schema(existing_schemas, new_metadata):
    """
    Check if a CSV's schema is already in the existing schemas.
    """
    for schema in existing_schemas:
        if schema["columns"] == new_metadata["columns"] and schema["data_types"] == new_metadata["data_types"]:
            return True
    return False


def process_csvs_in_batches(csv_dir, context, batch_size=5, delimiter=';'):
    csv_files = [f for f in os.listdir(csv_dir) if f.endswith('.csv')]
    existing_schemas = []  # Track already processed schemas
    final_schema = []  # Incrementally build the schema

    for i in range(0, len(csv_files), batch_size):
        batch_files = csv_files[i:i + batch_size]
        batch_metadata = []

        for file in batch_files:
            file_path = os.path.join(csv_dir, file)
            metadata = analyze_csv(file_path, delimiter=delimiter)
            if metadata:
                metadata["file_name"] = file
                if not is_duplicate_schema(existing_schemas, metadata):
                    batch_metadata.append(metadata)
                    existing_schemas.append(metadata)
                else:
                    print(f"Duplicate schema found for {file}. Skipping processing.")

        if batch_metadata:
            # Log input size
            input_data = {
                "csv_metadata": batch_metadata,
                "context": context
            }
            input_text = json.dumps(input_data)
            print(f"Input tokens: {count_tokens(input_text)}")

            try:
                # Use GPT-4o with retry logic
                response = call_gpt_with_retry(input_data)
                if not response.content.strip():
                    print("GPT-4o returned an empty response. Skipping this batch.")
                    continue

                batch_schema = json.loads(response.content.strip())
                final_schema.extend(batch_schema)
            except json.JSONDecodeError as e:
                print(f"Failed to decode JSON for batch: {batch_files}. Error: {e}")
                print(f"Response was: {response.content.strip()}")
                continue

    return final_schema

# Save schema to JSON file
def save_schema_to_file(schema, output_file):
    """
    Save schema to a JSON file.
    """
    with open(output_file, 'w') as f:
        json.dump(schema, f, indent=4)

# Main pipeline function
def metadata_pipeline(csv_dir, context, output_file, batch_size=4, delimiter=';'):
    """
    Pipeline to extract metadata and infer schema.
    """
    print("Starting metadata pipeline...")
    schema = process_csvs_in_batches(csv_dir, context, batch_size=batch_size, delimiter=delimiter)
    save_schema_to_file(schema, output_file)
    print(f"Schema saved to {output_file}")
