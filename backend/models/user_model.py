from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.database_connection import Database

class Users:
    def __init__(self):
        database = Database()
        self.cursor, self.con = database.connect_db()

    def add_user(self, display_name, studentnr, fname, lname, password, dateofbirth, status):
        result = self.cursor.execute(
            "INSERT INTO users (display_name, studentnr, fname, lname, password, dateofbirth, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (display_name, studentnr, fname, lname, generate_password_hash(password), dateofbirth, status))
        self.con.commit()
        return dict(result)

    def get_all_users(self):
        result = self.cursor.execute("SELECT user_id, studentnr, fname, lname FROM users").fetchall()
        return dict(result)

    def get_user_by_id(self, user_id):
        result = self.cursor.execute("SELECT user_id, studentnr, fname, lname, dateofbirth, status FROM users WHERE id = ?", (user_id,)).fetchone()
        return dict(result)