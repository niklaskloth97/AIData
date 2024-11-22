from backend.app.scripts.legacy.schema_application import schema_application_pipeline
from backend.app.scripts.legacy.metadata_and_schema import metadata_pipeline

if __name__ == "__main__":
    # Inputs
    csv_dir = "/Users/philipnartschik/AIData/backend/app/data/"
    context = "The tables are common SAP tables and multiple csvs might belong to the same table."
    schema_file = "database_schema.json"

    # Step 1: Metadata and Schema Inference
    metadata_pipeline(csv_dir, context, schema_file)

    # Step 2: Schema Application
    schema_application_pipeline(schema_file, csv_dir)
