from flask import jsonify

from models.database_connection import Database

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
        cursor, con = db.connect_db()
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
        UNION
        SELECT
        admin_id AS id,
        email,
        fname,
        infix,
        lname,
        status,
        'admin' AS role
        FROM admins
         """)
        rows = cursor.fetchall()

        # cursor.execute("""
        #     SELECT admin_id AS id, email, NULL AS display_name, NULL AS studentnr, fname, infix, lname, dateofbirth, status, 'admin' AS role FROM admins """)
        # admins = [dict(row) for row in cursor.fetchall()]

        con.close()
        return [dict(row) for row in rows]


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