from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models.user_model import Users
from flask import url_for


users_bp = Blueprint('users_bp', __name__)

@users_bp.post('/register')
@cross_origin()
def create_user():
    display_name = request.json["studentnr"]
    fname = request.json["fname"]
    infix = request.json["infix"]
    lname = request.json["lname"]
    password = request.json["password"]
    dateofbirth = request.json["dateofbirth"]
    email = request.json["email"]
    studentnr = request.json["studentnr"]
    status = 'actief'
    user_model = Users()
    new_user = user_model.add_user(display_name, fname, infix, lname, email, password, dateofbirth, studentnr, status)
    return {'successfull': new_user, 'success': True}, 201

@users_bp.patch('/<string:role>/<int:user_id>/block')
@cross_origin()
def block_user(role, user_id):
    user_model = Users()
    success = user_model.block_user_by_id(role, user_id)
    if success:
        return {'message': 'Gebruiker succesvol geblokkeerd.', 'success': True}, 200
    else:
        return {'error': 'Gebruiker niet gevonden of fout bij blokkeren.'}, 404


@users_bp.get('/apart')
@cross_origin()
def get_all_users():
    user_model = Users()
    return jsonify(user_model.get_all_users())


@users_bp.get('/<string:role>/<int:user_id>')
@cross_origin()
def get_user_by_role_and_id(role, user_id):
    user_model = Users()
    if role == 'user':
        cursor = user_model.cursor
        cursor.execute("""
            SELECT user_id AS id, email, fname, infix, lname, dateofbirth, status, studentnr, 'user' AS role
            FROM users
            WHERE user_id = ? """, (user_id,))
        row = cursor.fetchone()
        user_model.con.close()
        if row:
            return jsonify({'user': dict(row)})

    elif role == 'admin':
        cursor = user_model.cursor
        cursor.execute("""
            SELECT admin_id AS id, email, fname, infix, lname, dateofbirth, status, NULL AS studentnr, 'admin' AS role
            FROM admins
            WHERE admin_id = ? """, (user_id,))
        row = cursor.fetchone()
        user_model.con.close()
        if row:
            return jsonify({'user': dict(row)})

    return {'error': 'User not found'}, 404

