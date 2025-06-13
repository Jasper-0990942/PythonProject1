from flask import jsonify

from models.database_connection import Database


class Sources:
    def __init__(self):
        database = Database()
        self.cursor, self.con = database.connect_db()

    def add_sources(self, user_id, title, description, link, isbn, image):
        result = self.cursor.execute(
                '''INSERT INTO sources (user_id, title, description, link, ISBN, img) VALUES (?, ?, ?, ?, ?, ?)''', (user_id, title, description, link, isbn, image))
        self.con.commit()
        print(result)
        return dict(result)

    def get_all_sources(self):
        result = self.cursor.execute(
            '''SELECT sources.*, users.display_name, users.studentnr FROM sources JOIN users ON sources.user_id = users.user_id''').fetchall()
        print(result)
        sources = []
        for row in result:
            sources.append(dict(row))
            print(sources)
        return sources

    def save_rating(self, source_id, user_id, rating):
        current_rating = self.cursor.execute('''SELECT * FROM reviews WHERE user_id = ? AND source_id = ?''', (user_id, source_id)).fetchall()
        if not current_rating:
            new_rating = self.cursor.execute('''INSERT INTO reviews (source_id, user_id, stars) VALUES (?, ?, ?)''', (source_id, user_id, rating))
            self.con.commit()
            print(new_rating)
            return dict(new_rating)
        else:
            updated_rating = self.cursor.execute(
                '''UPDATE reviews SET stars = ? WHERE source_id = ? AND user_id = ?''', (rating, source_id, user_id))
            self.con.commit()
            print(updated_rating)
            return dict(updated_rating)
