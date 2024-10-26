from flask import Blueprint, current_app, request, jsonify
from app.models import User
from app import db

users_bp = Blueprint("users",__name__)
# db = current_app.extensions['sqlalchemy'].db

# Define Routes for User Management
@users_bp.route('/users', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')

    # Add user to the cloud database
    new_user = User(username=username, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User added successfully"}), 201

    


@users_bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    # Retrieve user from the cloud database
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"username": user.username, "email": user.email})
