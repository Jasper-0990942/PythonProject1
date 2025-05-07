from flask import jsonify
from models.database_connection import Database

class Sources:
    def __init__(self):
        database = Database()
        self.cursor, self.con = database.connect_db()

    def add_sources(self, user_id, title, description, link, isbn):
        result = self.cursor.execute(
                """INSERT INTO sources (user_id, title, description, link, ISBN) VALUES (?, ?, ?, ?,?)""", (user_id, title, description, link, isbn))
        self.con.commit()
        print(result)
        return dict(result)
