import os

class Config:
    # This can cause issues, if DB is not set, , it has to be also URI
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')  # Cloud DB connection string
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')