from flask import Flask, render_template, request, redirect, flash
import sqlite3

app = Flask(__name__)
app.secret_key = 'biem'

DATABASE = 'database.db'


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']

        conn = get_db_connection()
        user=conn.execute(
            'SELECT * FROM users WHERE username = ? and password = ?',
            (username, password)
        ).fetchone()
        conn.close()

        if user:
            return redirect('/dashboard')
        else:
            flash('Invalid credentials, try again.')

    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True)
