from flask import Flask, request, jsonify, current_app
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import openai
from langchain_community.llms import OpenAI as LangChainOpenAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain

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
    db.init_app(app)

    # OpenAI Key Loading
    @app.before_request
    def load_openai_key():
        openai.api_key = app.config.get('OPENAI_API_KEY')

    # Define Routes for OpenAI completions
    @app.route('/openai/completion', methods=['POST'])
    def call_openai_completion():
        data = request.json
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=100
        )
        return jsonify(response)

    @app.route("/")
    def hello_world():
        access_db()
        return "<p>Hello, Flask!</p>"
    
    # Define Routes for LangChain integration
    @app.route('/openai/langchain', methods=['POST'])
    def call_openai_with_langchain():
        data = request.json
        input_text = data.get('input')

        if not input_text:
            return jsonify({'error': 'Input text is required'}), 400

        # LangChain logic
        template = "Create a product description for the following item: {item_name}"
        prompt = PromptTemplate(input_variables=["item_name"], template=template)

        llm = LangChainOpenAI(temperature=0.9)
        chain = LLMChain(llm=llm, prompt=prompt)

        response = chain.run(input_text)

        return jsonify({'response': response})

    # Define Routes for User Management
    @app.route('/users', methods=['POST'])
    def add_user():
        data = request.json
        username = data.get('username')
        email = data.get('email')

        # Add user to the cloud database
        new_user = User(username=username, email=email)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User added successfully"}), 201

    @app.route('/users/<int:id>', methods=['GET'])
    def get_user(id):
        # Retrieve user from the cloud database
        user = User.query.get(id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        return jsonify({"username": user.username, "email": user.email})

    return app


# Models (Usually, this would be separated into a models file)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"