---
noteId: "1257ab91c2fb11efa4c4335eb2d15b95"
tags: []

---

# Get Started

## 1. Install requirements
pip install -U langgraph-cli

langgraph build -t my-image

docker-compose up --build

For developing the app, we recommend using VS Code later.
fastapi-service:
        build:
            context: .
            dockerfile: ./Dockerfile
        image: fastapi-service
        ports:
            - "8001:8000"
        depends_on:
            langgraph-postgres:
                condition: service_healthy
        environment:
            SQLITE_DATABASE_URL: sqlite:///./project_metadata.db
        volumes:
            - ./fastapi_app:/app

**Windows:**

Open the terminal in the folder, where you want to store the data first. Then enter these command instructions to set up everything
Do not copy the $-sign! It is just there to indicate, that you do this in the terminal. 

Ensure that you have **Python already installed** (Version 3.xx). If not, you can find it here: https://www.python.org/downloads/

**Install postgres**: https://www.postgresql.org/download/

```bash
$ # Go to the code location
$ $ cd backend
$ 
$ #Install the virtual environment modules
$ python -m venv env
$ .\env\Scripts\activate
$
$ # Install modules (database etc)
$ pip3 install -r requirements.txt
$
$ (Windows) set FLASK_APP=run.py
$
$ # Set environment variables. 
$ # For that, create an own .env file at the same folder as this README or preferably into the backend folder "upwards". The file contains instructions to connect to databases. Therefore we do not store them on github, the files are intentionally ignored on git(hub). 
$
$
$ # Run the web application (development mode, locally)
$ python run.py
$
$ # OR 
$ flask run --host=0.0.0.0 --port=5000
$
$ # Access the dashboard in browser: http://127.0.0.1:5000/
$
$ # We recommend 
$
```

**Linux/MacOS**

Ensure that you have Python already installed (Version 3.xx). If not, you can find it here: https://www.python.org/downloads/

Install postgres: https://www.postgresql.org/download/

```bash
$ # Go to the code location
$ cd backend
$
$ #Install the virtual environment modules
$ python -m virtualenv env
$ source env/bin/activate
$
$ # Install modules (database etc)
$ pip install -r requirements.txt
$
$ # **Set environment variables.**
$ # For that, create an own .env file at the same folder as this README. The file contains instructions to connect to databases. Therefore we do not store them on github, the files are intentionally ignored on git(hub). 
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
$ # You might need to re-run the environment-command to re-activate the environment variable
$ source env/bin/activate 
$ 
$ #Run the application
$ python run.py


### Recommended! Run the application with docker

First you need to install docker and docker compose, see the [installation guide](https://docs.docker.com/engine/install/).

Then just run: `docker-compose up`

For an intital run you might need `docker-compose up --build`
