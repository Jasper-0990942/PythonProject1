from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
app.secret_key = 'biem'
DATABASE = 'database/database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data received'}), 400

    email = data.get('email')
    wachtwoord = data.get('wachtwoord')

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
        'SELECT * FROM gebruikers WHERE email = ? AND wachtwoord = ?',
        (email, wachtwoord)
    ).fetchone()
    conn.close()

    if gebruiker:
        return jsonify({"success": True, "type": "gebruiker", "message": "Login successful"})

    return jsonify({"success": False, "message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
