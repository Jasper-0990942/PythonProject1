from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash
from models.user_model import Users
from flask import url_for


users_bp = Blueprint('users_bp', __name__)

@users_bp.post('/')
@cross_origin()
def create_user():
    display_name = 'jannie'
    studentnr = request.json["studentnr"]
    fname = request.json["fname"]
    lname = request.json["lname"]
    password = request.json["password"]
    dateofbirth = request.json["dateofbirth"]
    status = 'active'
    user_model = Users()
    new_user = user_model.add_user(display_name, studentnr, fname, lname, password, dateofbirth, status)
    return {'successfull': new_user, 'success': True}, 201



@users_bp.get('/')
@cross_origin()
def get_all_users():
    user_model = Users()
    users = user_model.get_all_users()
    print("gebruikers uit database", users)
    return jsonify ({'users': users})

@users_bp.get('/<int:user_id>')
@cross_origin()
def get_user_details(user_id):
    user_model = Users()
    user = user_model.get_user_by_id(user_id)
    if not user:
        return {'error': 'User not found'}, 404
    return {'user': user}
