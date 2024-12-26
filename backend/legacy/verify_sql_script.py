import pandas as pd
from bs4 import BeautifulSoup
import requests
from io import StringIO
import os
import tempfile

class SAP_SQL_Information:
    # Initialization for loading centrally all SQL relevant informaiton
    def __init__(self, table_name): #pfev file_path
        self.table_name = table_name

        self.file_path = self.download_csv(table_name)#file_path
        _, file_extension = os.path.splitext(self.file_path)

        # distinguish depending on the data type, so we have a backup solution if one site is down again...
        if file_extension.lower() == '.html':
          self.dataframes = self.load_html_tables(self.file_path)
          self.file_orign = 'leanx'
          self.load_html_tables(self.file_path)
          self.mainTable, self.foreignkeys = self.cleanup_dataframe()
          self.primaryKeys = self.identify_pk_html()

        elif file_extension.lower() == '.csv':
            self.file_orign = 'sapdatasheet'
            self.mainTable = self.load_csv_table(self.file_path)
            self.primaryKeys = self.identify_pk_csv()
            self.foreignkeys = self.identify_fk_csv()
        else:
            raise ValueError("Unsupported file type: {}".format(file_extension))
    
    def download_csv(self, table_name):
    # # Downloads a CSV file for the given SAP table name.
    # The file is stored in a temporary location and downloaded only if it doesn't already exist.
    # Args:table_name (str): The name of the SAP table (e.g., "BKPF").
    # Returns:
    #     str: Path to the downloaded CSV file.
    # """
    # Define the URL with the table name
        url = f"https://www.sapdatasheet.org/download/abap-tabl-component.php?format=csv&tabname={table_name}"

        # Create a temporary directory
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, f"{table_name}.csv")

        # Check if the file already exists
        if os.path.exists(file_path):
            print(f"File '{file_path}' already exists. Skipping download.")
        else:
            # Download the file
            print(f"Downloading CSV file for table '{table_name}'...")
            response = requests.get(url)

            # Raise an error if the request failed
            response.raise_for_status()

            # Save the file to the temporary location
            with open(file_path, 'wb') as file:
                file.write(response.content)
            print(f"File downloaded and saved as '{file_path}'.")

        return file_path

    # Function to load multiple HTML tables into a list of DataFrames
    # This is especially for the html files of leanx.eu
    def load_html_tables(self, file_path):
        # Read the HTML file content
        with open(file_path, 'r', encoding='utf-8') as file:
            file_content = file.read()
        # Parse all tables from the HTML content
        tables = pd.read_html(StringIO(file_content))
        #print(tables)
        return tables  # List of DataFrames

    def load_csv_table(self, file_path):
        table = pd.read_csv(file_path)
        print(table)
        return table

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
        for index, row in self.mainTable.iterrows(): # does the same like self.dataframes.iloc[1][5], but prettier
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

    def identify_fk_csv(self):
        # Format foreign keys as ("Foreign Key", "Table it references")
        foreignKeys = []
        for index, row in self.mainTable.iterrows():
            checktable = row['CHECKTABLE'].strip()  # Remove leading/trailing whitespace
            if checktable == '' or checktable == '*':
                continue  # Skip empty or '*' entries
            foreignKeys.append((row['FIELDNAME'], checktable))
        print("Foreign Keys:")
        print(foreignKeys)
        return foreignKeys

    # Function to get specific rows based on a query for a specific table
    # Meant to be used to check, if the information matches with other input (correction approach)
    # This only prints the relevant data, "checkCollumnExistence" prints the debug format
    def query_dataframe(self, df, column_name, value):
        if column_name not in df.columns:
            print(f"Column '{column_name}' does not exist in the DataFrame.")
            return None
        # Filter rows where the specified column matches the given value
        result = df[df[column_name] == value]
        print ("error?")
        return result
    
    # def check_value_in_table(self, mainTable, value):
    #     print(mainTable['FIELDNAME'])

    #     for index in range(len(mainTable['FIELDNAME'])):
    #         if mainTable['FIELDNAME'][index] == value:
    #             return value


    # Perform the query if the selected table exists, prints out the whole collumn
    def checkCollumnExistence(self, searchForCollumn):
        if  self.file_orign == 'leanx':
            column_name = 'Field'  # Defaults to the first column, but with Field.1 we can also access the "true meaning" of the collumn -> relevant for the processLOG
        elif  self.file_orign == 'sapdatasheet':
            column_name = 'FIELDNAME'
        else:
            raise ValueError("Unsupported file origin: {}".format(self.file_orign))

        result = self.query_dataframe(self.mainTable, column_name, searchForCollumn)
        if result is not None:
            print("The Collumn exists:")
            print(result)
        else:
            print("The collumn does not exist in the HTML file.")

def run():
    # Load the tables from the HTML file
    #file_path = 'bkpf.html'
    #file_path = 'sap-table-BKPF.csv'
    #sap_sql_info = SAP_SQL_Information(file_path)

    sap_sql_info = SAP_SQL_Information("TCURC")

    sap_sql_info.display_relevantSAPdata()

    # Example query on the first table (assuming target column and value are correct)
    # Replace 'Column_Name' and 'Value' with the column name and search value you need
    #column_name = 'Field'  # Replace with the actual column name you want to query
    searchForCollumn = 'FRATH'  # Replace with the actual value you want to search for

    print("Primary Key(s):")
    print(sap_sql_info.primaryKeys)

    print("Now check, if the following collumn exists: "+ searchForCollumn)
    sap_sql_info.checkCollumnExistence(searchForCollumn)

if __name__ == "__main__":  
    run()
