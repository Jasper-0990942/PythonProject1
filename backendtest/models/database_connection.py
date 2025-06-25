import sqlite3
from pathlib import Path

root = Path(__file__).parent.parent

class Database:
    def __init__(self):
        self.path = root / 'database' / 'database.db'

    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        return cur, con