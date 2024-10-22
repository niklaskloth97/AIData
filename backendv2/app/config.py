import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')  # Cloud DB connection string
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
