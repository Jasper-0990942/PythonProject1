from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
app.secret_key = 'biem'
DATABASE = 'database/database.db'

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
    if not data:
        return jsonify({'success': False, 'message': 'No data received'}), 400

    email = data.get('email')
    wachtwoord = data.get('wachtwoord')
    display_naam = data.get('display_naam')

    print(f"Received email: {email}, wachtwoord: {wachtwoord}")

    conn = get_db_connection()

    beheerder = conn.execute(
        'SELECT * FROM beheerders WHERE email = ? AND wachtwoord = ?',
        (email, wachtwoord)
    ).fetchone()

    if beheerder:
        conn.close()
        return jsonify({"success": True, "type": "beheerder", "message": "Login successful"})

    gebruiker = conn.execute(
        'SELECT * FROM gebruikers WHERE display_naam = ? AND wachtwoord = ?',
        (email, wachtwoord)
    ).fetchone()
    conn.close()

    if gebruiker:
        return jsonify({"success": True, "type": "gebruiker", "message": "Login successful"})

    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/delete_resource', methods=['post'])
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

@app.route('/update_profile', methods=['post'])
def update_profile():
    data = request.get_json()
    email = data.get('email')
    voornaam = data.get('voornaam')
    achternaam = data.get('achternaam')

    if not email:
        return jsonify({'success': False, 'message': 'No data received'}), 400

    conn = get_db_connection()
    conn.execute("UPDATE gebruikers SET voornaam = ? WHERE email = ?",
                 (voornaam,achternaam, email))

    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Profile updated"}), 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
