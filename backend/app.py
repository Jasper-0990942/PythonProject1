from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import jwt
import datetime
from functools import wraps
import os

from backend.blueprints.users import users_bp
from backend.blueprints.sources import sources_bp

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'biem'

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.path.join(BASE_DIR, 'database', 'database.db')

app.register_blueprint(users_bp, url_prefix="/users")
app.register_blueprint(sources_bp, url_prefix="/sources")


def token_required(user_type=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                parts = request.headers['Authorization'].split(" ")
                if len(parts) == 2:
                    token = parts[1]

            if not token:
                return jsonify({'success': False, 'message': 'Token is missing'}), 401

            try:
                data = jwt.decode(token, app.secret_key, algorithms=['HS256'])
                if user_type and data.get('type') != user_type:
                    return jsonify({'success': False, 'message': 'Access denied'}), 403
                request.user = data
            except jwt.ExpiredSignatureError:
                return jsonify({'success': False, 'message': 'Token expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'success': False, 'message': 'Invalid token'}), 401

            return f(*args, **kwargs)
        return decorated_function
    return decorator


def get_db_connection():
    conn = sqlite3.connect(DATABASE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/', methods=['GET'])
def index():
    return "API is running", 200


@app.route('/', methods=['POST'])
def login():
    data = request.get_json()
    login_input = data.get('loginInput')
    password = data.get('password')

    if not login_input or not password:
        return jsonify({'success': False, 'message': 'Login and password are required'}), 400

    conn = get_db_connection()

    admin = conn.execute(
        'SELECT * FROM admins WHERE email = ? AND password = ?',
        (login_input, password)
    ).fetchone()

    if admin:
        admin_data = dict(admin)
        token = jwt.encode({
            'email': admin_data['email'],
            'type': 'admin',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.secret_key, algorithm='HS256')

        admin_data.pop('password', None)

        return jsonify({
            'success': True,
            'type': 'admin',
            'token': token,
            'user': admin_data
        })

    user = conn.execute(
        'SELECT * FROM users WHERE display_name = ? AND password = ?',
        (login_input, password)
    ).fetchone()

    conn.close()

    if user:
        user_data = dict(user)
        token = jwt.encode({
            'display_name': user_data['display_name'],
            'type': 'user',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.secret_key, algorithm='HS256')

        user_data.pop('password', None)

        return jsonify({
            'success': True,
            'type': 'user',
            'token': token,
            'user': user_data
        })

    return jsonify({"success": False, "message": "Incorrect username or password"}), 401


@app.route('/profile', methods=['GET'])
@token_required()
def profile():
    user = request.user
    conn = get_db_connection()

    if user['type'] == 'admin':
        admin = conn.execute('SELECT * FROM admins WHERE email = ?', (user['email'],)).fetchone()
        conn.close()
        if admin:
            admin_data = dict(admin)
            admin_data.pop('password', None)
            return jsonify({'success': True, 'type': 'admin', 'profile': admin_data})
        else:
            return jsonify({'success': False, 'message': 'Admin not found'}), 404

    elif user['type'] == 'user':
        usr = conn.execute('SELECT * FROM users WHERE display_name = ?', (user['display_name'],)).fetchone()
        conn.close()
        if usr:
            user_data = dict(usr)
            user_data.pop('password', None)
            return jsonify({'success': True, 'type': 'user', 'profile': user_data})
        else:
            return jsonify({'success': False, 'message': 'User not found'}), 404

    else:
        conn.close()
        return jsonify({'success': False, 'message': 'Invalid user type'}), 400


@app.route('/delete_resource', methods=['POST'])
@token_required()
def delete_resource():
    data = request.get_json()
    resource_id = data.get('resource_id')

    if not resource_id:
        return jsonify({'success': False, 'message': 'No data received'}), 400

    conn = get_db_connection()
    conn.execute("DELETE FROM resources WHERE id = ?", (resource_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Resource deleted"}), 200


@app.route('/update_resource', methods=['POST'])
@token_required()
def update_resource():
    data = request.get_json()
    resource_id = data.get('resource_id')
    new_title = data.get('title')

    if not resource_id or not new_title:
        return jsonify({"success": False, "message": "resource_id and title are required"}), 400

    conn = get_db_connection()
    try:
        conn.execute("UPDATE resources SET title = ? WHERE id = ?", (new_title, resource_id))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Resource successfully updated"}), 200
    except Exception as e:
        conn.close()
        return jsonify({"success": False, "message": f"Error updating resource: {str(e)}"}), 500


@app.route('/update_profile', methods=['POST'])
@token_required()
def update_profile():
    data = request.get_json()
    user = request.user  # Decoded JWT

    conn = get_db_connection()

    if user['type'] == 'admin':
        email = user['email']
        new_email = data.get('email')
        password = data.get('password')
        fname = data.get('fname')
        infix = data.get('infix')
        lname = data.get('lname')
        dateofbirth = data.get('dateofbirth')
        status = data.get('status')

        conn.execute(
            """UPDATE admins
               SET email = ?, password = ?, fname = ?, infix = ?, lname = ?, dateofbirth = ?, status = ?
               WHERE email = ?""",
            (new_email, password, fname, infix, lname, dateofbirth, status, email)
        )
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Admin profile updated'}), 200

    elif user['type'] == 'user':
        display_name = user['display_name']
        new_display_name = data.get('display_name')
        studentnr = data.get('studentnr')
        password = data.get('password')
        fname = data.get('fname')
        infix = data.get('infix')
        lname = data.get('lname')
        dateofbirth = data.get('dateofbirth')
        status = data.get('status')

        conn.execute(
            """UPDATE users
               SET display_name = ?, studentnr = ?, password = ?, fname = ?, infix = ?, lname = ?, dateofbirth = ?, status = ?
               WHERE display_name = ?""",
            (new_display_name, studentnr, password, fname, infix, lname, dateofbirth, status, display_name)
        )
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'User profile updated'}), 200

    return jsonify({'success': False, 'message': 'Invalid user type'}), 400


@app.route('/get_resources', methods=['POST'])
@token_required()
def get_resources():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400

    conn = get_db_connection()
    resources = conn.execute("SELECT * FROM resources WHERE email = ?", (email,)).fetchall()
    conn.close()

    resource_list = [dict(r) for r in resources]
    return jsonify({'success': True, 'resources': resource_list}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
