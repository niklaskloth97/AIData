# Get Started

## 1. Install requirements

For developing the app, we recommend using VS Code later.


**Windows:**

Open the terminal in the folder, where you want to store the data first. Then enter these command instructions to set up everything
Do not copy the $-sign! It is just there to indicate, that you do this in the terminal. 

Ensure that you have Python already installed (Version 3.xx). If not, you can find it here: https://www.python.org/downloads/

```bash
$ # Go to the code location
$ $ cd backend
$ 
$ #Install the virtual environment modules
$ virtualenv env
$ .\env\Scripts\activate
$
$ # Install modules (database etc)
$ pip3 install -r requirements.txt
$
$ (Windows) set FLASK_APP=run.py
$
$ # Run the web application (development mode)
$ python run.py
$
$ # OR 
$ flask run --host=0.0.0.0 --port=5000
$
$ # Access the dashboard in browser: http://127.0.0.1:5000/
```

**Linux/MacOS**
```bash
$ # Go to the code location
$ cd backend
$
$ #Install the virtual environment modules
$ virtualenv env
$ source env/bin/activate
$
$ # Install modules (database etc)
$ pip install -r requirements.txt
$
$
$ # Set the FLASK_APP environment variable
$ export FLASK_APP=run.py
$
$ # Set up the DEBUG environment
$ # (Unix/Mac) export FLASK_ENV=development
$ # (Windows) set FLASK_ENV=development
$ # (Powershell) $env:FLASK_ENV = "development"
$
$ # Start the application (development mode)
$ # --host=0.0.0.0 - expose the app on all network interfaces (default 127.0.0.1)
$ # --port=5000    - specify the app port (default 5000)  
$ 
$ #Run the application
$ python run.py