import sqlite3

class Database(object):
    def __init__(self, path):
        self.path = path

    def connect_db(self):
        con = sqlite3.connect(
            self.path, check_same_thread=False
        )
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con