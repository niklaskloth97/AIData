import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import psycopg2 as pg # PostgreSQL adapter for Python

# Database connection
connection = pg.connect("dbname=postgres user=postgres password=postgres")
db = connection.cursor()

def importCsv(table):
    # Import data from CSV file
    data = pd.read_csv(table)
    return data
