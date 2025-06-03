from flask import jsonify

from database_connection import Database

class Users:
    def add_user(self, studentnr, fname, lname, password_hash, dateofbirth, status):
        db = Database()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO users (studentnr, fname, lname, password, dateofbirth, status) VALUES (?, ?, ?, ?, ?, ?)",
            (studentnr, fname, lname, password_hash, dateofbirth, status))
        db.commit()
        return cursor.lastrowid

    def get_all_users(self):
        db = Database()
        cursor = db.cursor()
        cursor.execute("SELECT user_id, studentnr, fname, lname FROM users")
        return [dict(row) for row in cursor.fetchall()]

    def get_user_by_id(self, user_id):
        db = Database()
        cursor = db.cursor()
        cursor.execute("SELECT user_id, studentnr, fname, lname, dateofbirth, status FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None