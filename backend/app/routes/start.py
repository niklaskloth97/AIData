from flask import Blueprint, current_app, request, jsonify
from app import db

start_bp = Blueprint("start",__name__)
# db = current_app.extensions['sqlalchemy'].db

# Define Routes for  Management
@start_bp.route('/', methods=['GET'])
def start():
    print("Hello, Print!")
    return "<p>Hello, Flask!</p>"