from flask import Blueprint, request, jsonify
from models.user_model import Users
from backendtest.auth_token import token_required


users_bp = Blueprint('users_bp', __name__)

@users_bp.post('/register')
def create_user():
    display_name = request.json["studentnr"]
    studentnr = request.json["studentnr"]
    fname = request.json["fname"]
    infix = request.json["infix"]
    lname = request.json["lname"]
    email = request.json["email"]
    password = request.json["password"]
    dateofbirth = request.json["dateofbirth"]
    status = 'actief'
    user_model = Users()
    new_user = user_model.add_user(display_name, studentnr, fname, infix, lname, email, password, dateofbirth, status)
    return {'successfull': new_user, 'success': True}, 201

@users_bp.post('/checkmail')
def check_mail():
    data = request.get_json()
    email = data.get('email')
    user_model = Users()
    user = user_model.get_user_by_email(email)
    return jsonify({"exists": user is not None})

@users_bp.route('/<role>/<int:user_id>/block', methods=['PATCH'])
@token_required(user_type='admin')
def block_user(role, user_id):
    user_model = Users()
    if role != 'user':
        return jsonify({'success': False, 'message': 'Ongeldige rol'}), 400
    success = user_model.block_user_by_id(role, user_id)
    if success:
        return jsonify({'success': True, 'message': 'Gebruiker geblokkeerd'}), 200
    else:
        return jsonify({'success': False, 'message': 'Kon gebruiker niet blokkeren'}), 404


@users_bp.get('/apart')
def get_all_users():
    user_model = Users()
    return jsonify(user_model.get_all_users())


@users_bp.get('/<string:role>/<int:user_id>')
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

