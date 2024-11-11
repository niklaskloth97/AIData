import pandas as pd
from bs4 import BeautifulSoup
import requests
from io import StringIO
import os

class SAP_SQL_Information:
    def __init__(self, file_path):
        self.file_path = file_path
        self.dataframes = self.load_file(file_path)
        #self.mainTable, self.foreignkeys = self.cleanup_dataframe()
        #self.primaryKeys = self.identify_pk_html()
        self.primaryKeys = self.identify_pk_csv()

    
    # Function to load multiple HTML tables into a list of DataFrames
    # This is especially for the html files of leanx.eu
    def load_html_tables(self, file_path):
        # Read the HTML file content
        with open(file_path, 'r', encoding='utf-8') as file:
            file_content = file.read()
        # Parse all tables from the HTML content
        tables = pd.read_html(StringIO(file_content))
        print(tables)
        return tables  # List of DataFrames

    def loadCSV(self, file_path):
        table = pd.read_csv(file_path)
        print(table)
        return table

    # Function to distinguish file type and load accordingly
    def load_file(self, file_path):
        _, file_extension = os.path.splitext(file_path)
        if file_extension.lower() == '.html':
            return self.load_html_tables(file_path)
        elif file_extension.lower() == '.csv':
            return self.loadCSV(file_path)

        else:
            raise ValueError("Unsupported file type: {}".format(file_extension))

    # Returns the primary key or keys of the table
    # How it works: Function loads and prints only the first <td> entry after each <tr class="info">
    # This is how the columns are displayed as primary keys in the html files of leanx.eu
    def identify_pk_html(self):
        # Read and parse the HTML file with BeautifulSoup
        with open(self.file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
        # Your logic to identify primary keys goes here
        # For example:
        primary_keys = []
        for tr in soup.find_all('tr', class_='info'):
            td = tr.find('td')
            if td:
                primary_keys.append(td.text.strip())
        return primary_keys
    
    #Identify the PK based on the csv file of sapdatasheet.org
    def identify_pk_csv(self):
        primaryKeys = []
        for index, row in self.dataframes.iterrows(): # does the same liek self.dataframes.iloc[1][5], but prettier
            if "X" in row['KEYFLAG']:
                primaryKeys.append(row['FIELDNAME'])
        print ("Primary Keys:")
        print(primaryKeys)
        return primaryKeys

    # Placeholder for cleanup_dataframe function
    def cleanup_dataframe(self):
        # Your logic to clean up the dataframe goes here
        # For example:
        main_table = self.dataframes[0]  # Assuming the first table is the main table
        foreignkeys = self.dataframes[-1]  # Assuming the last table contains foreign keys
        return main_table, foreignkeys

    # Function to display each DataFrame, just for debugging purposes
    def display_all_raw_dataframes(self):
        for element, df in enumerate(self.dataframes):
            print(f"Table {element + 1}")
            print(df)
            print("\n" + "=" * 40 + "\n") #just a separator

    def display_relevantSAPdata(self):
        print("Main Table:")
        print(self.mainTable)
        print("Foreign Keys:")
        print(self.foreignkeys)

    # We only need the first and last tables, as the first gives the collums as entries
    # with their respective information about datatypes,
    def cleanup_dataframe(self):
        # Store first and last dataframe, as the first includes the important collumn information
        # The last one contains the foreign keys
        mainTable = self.dataframes[0]
        foreignkeys = self.dataframes[-1] # TIL this is the last element in a list
        return mainTable, foreignkeys


    # Function to get specific rows based on a query for a specific table
    # Meant to be used to check, if the information matches with other input (correction approach)
    # This only prints the relevant data, "checkCollumnExistence" prints the debug format
    def query_dataframe(self, df, column_name, value):
        if column_name not in df.columns:
            print(f"Column '{column_name}' does not exist in the DataFrame.")
            return None
        # Filter rows where the specified column matches the given value
        result = df[df[column_name] == value]
        return result

    # Perform the query if the selected table exists, prints out the whole collumn
    def checkCollumnExistence(self, collumnName):
        column_name = 'Field'  # Defaults to the first column, but with Field.1 we can also access the "true meaning" of the collumn -> relevant for the processLOG
        result = self.query_dataframe(self.mainTable, column_name, collumnName)
        if result is not None:
            print("The Collumn exists:")
            print(result)
        else:
            print("The collumn does not exist in the HTML file.")

def run():
    # Load the tables from the HTML file
    #file_path = 'bkpf.html'
    file_path = 'sap-table-BKPF.csv'
    sap_sql_info = SAP_SQL_Information(file_path)

    sap_sql_info.display_relevantSAPdata()


    # Example query on the first table (assuming target column and value are correct)
    # Replace 'Column_Name' and 'Value' with the column name and search value you need
    #column_name = 'Field'  # Replace with the actual column name you want to query
    collumnName = 'FRATH'  # Replace with the actual value you want to search for


    print("Primary Key(s):")
    sap_sql_info.identifyPK()   

    print("Now check, if the following collumn exists:"+ collumnName)
    sap_sql_info.checkCollumnExistence(collumnName)

if __name__ == "__main__":  
    run()
