from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
app.secret_key = 'biem'
DATABASE = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data received'}), 400

    username = data.get('username')
    password = data.get('password')

    print(f"Received username: {username}, password: {password}")

    conn = get_db_connection()

    beheerder = conn.execute(
        'SELECT * FROM beheerders WHERE username = ? AND password = ?',
        (username, password)
    ).fetchone()

    if beheerder:
        conn.close()
        return jsonify({"success": True, "type": "beheerder", "message": "Login successful"})

    gebruiker = conn.execute(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        (username, password)
    ).fetchone()
    conn.close()

    if gebruiker:
        return jsonify({"success": True, "type": "gebruiker", "message": "Login successful"})

    return jsonify({"success": False, "message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

