from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

# Initialize extensions (no need to create DB locally)
db = SQLAlchemy()

def create_app():
    """Application factory function"""
    app = Flask(__name__)
    # if a database error comes up, the reason might be a missing .env file, see below

    # Load environment variables
    load_dotenv()

    # Load configurations, including cloud DB URI
    app.config.from_object('app.config.Config')
    # app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    # -> environment variables are in config, look at the README for more information

    # Initialize the database (it will connect to the cloud DB)
    with app.app_context():
        db.init_app(app)
    
    from app.routes import register_routes
    register_routes(app)

    return app
