from sqlalchemy import create_engine, text
import json
import networkx as nx
import pandas as pd
import os

from app.config import Config

engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
#Langgraph startnode -> 1 (SQL Nodes) node pro tabelle -> 1 supervisor node die ausführung überprüft und reihenfolge bestimmt -> executor node die ausführt und fehler cached
# Load schema from JSON
def load_schema_from_file(schema_file):
    """Load schema from JSON file."""
    with open(schema_file, 'r') as f:
        return json.load(f)

# Create dependency graph
def create_dependency_graph(schema):
    """Create a dependency graph based on foreign key relationships."""
    graph = nx.DiGraph()
    for table, details in schema.items():
        graph.add_node(table)
        for fk in details.get("foreign_keys", []):
            graph.add_edge(table, fk["referred_table"])  # Child -> Parent
    return graph

# Generate and execute CREATE TABLE scripts
def execute_create_table_scripts(schema, graph):
    """Generate and execute CREATE TABLE scripts."""
    for table in nx.topological_sort(graph):
        columns = ", ".join([
            f"{col['name']} {col['type']} {'PRIMARY KEY' if col['is_primary_key'] else ''}".strip()
            for col in schema[table]["columns"]
        ])
        foreign_keys = ", ".join([
            f"FOREIGN KEY ({fk['constrained_columns'][0]}) REFERENCES {fk['referred_table']}({fk['referred_columns'][0]})"
            for fk in schema[table].get("foreign_keys", [])
        ])
        create_table_sql = f"CREATE TABLE {table} ({columns}, {foreign_keys});"
        
        try:
            with engine.connect() as connection:
                connection.execute(text(create_table_sql))
            print(f"Table {table} created successfully.")
        except Exception as e:
            print(f"Error creating table {table}: {e}")

# Insert data into tables
def insert_data_into_tables(csv_dir, schema, graph):
    """Insert data into tables in dependency-resolved order."""
    for table in nx.topological_sort(graph):
        file_name = schema[table]["file_name"]
        file_path = os.path.join(csv_dir, file_name)
        df = pd.read_csv(file_path)
        
        try:
            df.to_sql(table, engine, if_exists="append", index=False)
            print(f"Data inserted into {table}.")
        except Exception as e:
            print(f"Error inserting data into {table}: {e}")

# Main function for schema application pipeline
def schema_application_pipeline(schema_file, csv_dir):
    """Pipeline to create and populate database schema."""
    schema = load_schema_from_file(schema_file)
    graph = create_dependency_graph(schema)
    execute_create_table_scripts(schema, graph)
    insert_data_into_tables(csv_dir, schema, graph)
    


