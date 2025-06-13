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
        db = Database()
        cursor, con = db.connect_db()

        #Users ophalen
        cursor.execute("""
        SELECT
            user_id AS id,
            email,
            fname,
            infix,
            lname,
            status,
            'user' AS role
        FROM users
        """)
        users = [dict(row) for row in cursor.fetchall()]

        #Admins ophalen
        cursor.execute("""
            SELECT
            admin_id AS id,
            email,
            fname,
            infix,
            lname,
            status,
            'admin' AS role
            FROM admins""")
        admins = [dict(row) for row in cursor.fetchall()]

        con.close()
        return {'users': users, 'admins': admins}


    def get_user_by_id(self, user_id):
        result = self.cursor.execute("SELECT user_id, studentnr, fname, lname, dateofbirth, status FROM users WHERE id = ?", (user_id,)).fetchone()
        return dict(result)
def get_user_by_id(self, user_id):
    db = Database()
    cursor, con = db.connect_db()
    cursor.execute("""
        SELECT 
            user_id AS id,
            email,
            fname,
            infix,
            lname,
            dateofbirth,
            status,
            studentnr,
            'user' AS role
        FROM users
        WHERE user_id = ?

        UNION

        SELECT 
            admin_id AS id,
            email,
            fname,
            infix,
            lname,
            dateofbirth,
            status,
            NULL AS studentnr,
            'admin' AS role
        FROM admins
        WHERE admin_id = ?
    """, (user_id, user_id))
    row = cursor.fetchone()
    con.close()
    return dict(row) if row else None