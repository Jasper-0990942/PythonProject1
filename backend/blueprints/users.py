from flask import Blueprint, request
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash
from backend.models.user_model import Users
from flask import url_for


users_bp = Blueprint('users_bp', __name__)

@users_bp.post('/')
@cross_origin()
def create_user():
    data = request.json
    email = data.get("email")
    teller = data.get("teller")
    password = data.get("password")
    if not all([email, teller, password]):
        return {'error': 'Missing data'}, 400



@users_bp.get('/')
@cross_origin()
def get_all_users():
    user_model = Users()
    users = user_model.get_all_users()
    return {'users': users}


@users_bp.get('/<int:user_id>')
@cross_origin()
def get_user_details(user_id):
    user_model = Users()
    user = user_model.get_user_by_id(user_id)
    if not user:
        return {'error': 'User not found'}, 404
    return {'user': user}
