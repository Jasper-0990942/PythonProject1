from flask import Flask, request, jsonify
from flask_cors import CORS

from blueprints.users import users_bp
from blueprints.sources import sources_bp
import sqlite3

app = Flask(__name__)
CORS(app)
app.secret_key = 'biem'
DATABASE = 'database/database.db'

app.register_blueprint(sources_bp, url_prefix="/sources")
app.register_blueprint(users_bp, url_prefix="/users")


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET'])
def index():
    return "API is running", 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login_input = data.get('loginInput')
    wachtwoord = data.get('wachtwoord')

    if not login_input or not wachtwoord:
        return jsonify({'success': False, 'message': 'Login en wachtwoord zijn verplicht'}), 400

    conn = get_db_connection()

    # Beheerder login
    beheerder = conn.execute(
        'SELECT * FROM beheerders WHERE email = ? AND wachtwoord = ?',
        (login_input, wachtwoord)
    ).fetchone()

    if beheerder:
        conn.close()
        beheerder_data = dict(beheerder)
        return jsonify({"success": True, "type": "beheerder", **beheerder_data})

    # Gebruiker login
    gebruiker = conn.execute(
        'SELECT * FROM gebruikers WHERE display_naam = ? AND wachtwoord = ?',
        (login_input, wachtwoord)
    ).fetchone()

    conn.close()

    if gebruiker:
        gebruiker_data = dict(gebruiker)
        return jsonify({"success": True, "type": "gebruiker", **gebruiker_data})

    return jsonify({"success": False, "message": "Onjuiste gebruikersnaam/wachtwoord"}), 401

@app.route('/delete_resource', methods=['POST'])
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

@app.route('/update_profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    email = data.get('email')
    voornaam = data.get('voornaam')
    achternaam = data.get('achternaam')

    if not email:
        return jsonify({'success': False, 'message': 'No data received'}), 400

    conn = get_db_connection()
    conn.execute("UPDATE gebruikers SET voornaam = ?, achternaam = ? WHERE email = ?",
                 (voornaam, achternaam, email))

    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Profile updated"}), 200

@app.route('/get_resources', methods=['POST'])
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
    app.run(port=5000, host='0.0.0.0', debug=True)