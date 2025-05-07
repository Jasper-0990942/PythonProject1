from models.database_connection import Database

class Sources:
    def __init__(self):
        database = Database("./backend/database/database.db")
        self.cursor, self.con = database.connect_db()

    def add_sources(self, title, description, link, ISBN):
        result = self.cursor.execute(
                """INSERT INTO sources (title, description, link, ISBN) VALUES (?, ?, ?, ?)""", (title, description, link, ISBN))
        self.con.commit()
        print(result)
        return result
