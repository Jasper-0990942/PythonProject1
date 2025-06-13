from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)
app.secret_key = 'biem'
DATABASE = 'database/database.db'

def token_required(user_type=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(" ")[1]

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
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET'])
def index():
    return "API is running", 200

@app.route('/', methods=['POST'])
def login():
    data = request.get_json()
    login_input = data.get('loginInput')
    wachtwoord = data.get('wachtwoord')

    if not login_input or not wachtwoord:
        return jsonify({'success': False, 'message': 'Login en wachtwoord zijn verplicht'}), 400

    conn = get_db_connection()

    beheerder = conn.execute(
        'SELECT * FROM beheerders WHERE email = ? AND wachtwoord = ?',
        (login_input, wachtwoord)
    ).fetchone()

    if beheerder:
        conn.close()
        beheerder_data = dict(beheerder)
        token = jwt.encode({
            'email': beheerder_data['email'],
            'type': 'beheerder',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.secret_key, algorithm='HS256')
        return jsonify({
            'success': True,
            'type': 'beheerder',
            "token": token,
            **beheerder_data
        })

    gebruiker = conn.execute(
        'SELECT * FROM gebruikers WHERE display_naam = ? AND wachtwoord = ?',
        (login_input, wachtwoord)
    ).fetchone()

    conn.close()

    if gebruiker:
        gebruiker_data = dict(gebruiker)

        token = jwt.encode({
            'display_naam': gebruiker_data['display_naam'],
            'type': 'gebruiker',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.secret_key, algorithm='HS256')
        return jsonify({
            'success': True,
            'type': 'gebruiker',
            "token": token,
            **gebruiker_data
        })

    return jsonify({"success": False, "message": "Onjuiste gebruikersnaam/wachtwoord"}), 401


@app.route('/delete_resource', methods=['POST'])
@token_required()
def delete_resource():
    data = request.get_json()
    resource_id = data.get('resource_id')

    if not resource_id:
        return jsonify({'success': False, 'message': 'No data received'}), 400

    conn = get_db_connection()
    conn.execute("DELETE FROM bronnen WHERE id = ?", (resource_id,))
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
        return jsonify({"success": False, "message": "resource_id en title zijn vereist"}), 400

    conn = get_db_connection()

    try:
        conn.execute(
            "UPDATE resources SET title = ? WHERE id = ?",
            (new_title, resource_id)
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Resource succesvol bijgewerkt"}), 200
    except Exception as e:
        conn.close()
        return jsonify({"success": False, "message": f"Fout bij bijwerken van resource: {str(e)}"}), 500


@app.route('/update_profile', methods=['POST'])
@token_required()
def update_profile():
    data = request.get_json()

    original_email = data.get('original_email')
    new_email = data.get('email')

    original_display_naam = data.get('original_display_naam')
    new_display_naam = data.get('display_naam')

    voornaam = data.get('voornaam')
    achternaam = data.get('achternaam')

    conn = get_db_connection()

    if original_email:
        conn.execute(
            "UPDATE beheerders SET email = ?, voornaam = ?, achternaam = ? WHERE email = ?",
            (new_email, voornaam, achternaam, original_email)
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Beheerder profiel bijgewerkt"}), 200

    elif original_display_naam:
        conn.execute(
            "UPDATE gebruikers SET display_naam = ?, voornaam = ?, achternaam = ? WHERE display_naam = ?",
            (new_display_naam, voornaam, achternaam, original_display_naam)
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Gebruiker profiel bijgewerkt"}), 200

    else:
        conn.close()
        return jsonify({"success": False, "message": "Geen geldige identifier ontvangen"}), 400


@app.route('/get_resources', methods=['POST'])
@token_required()
def get_resources():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'success': False, 'message': 'Email is verplicht'}), 400

    conn = get_db_connection()
    resources = conn.execute("SELECT * FROM bronnen WHERE email = ?", (email,)).fetchall()
    conn.close()

    resource_list = [dict(r) for r in resources]
    return jsonify({'success': True, 'resources': resource_list}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
