import sqlite3
from pathlib import Path


class WP4DatabaseGenerator:
    def __init__(self, database_file, overwrite=False, initial_data=False):
        self.database_file = Path(database_file)
        self.create_initial_data = initial_data
        self.database_overwrite = overwrite
        self.test_file_location()
        self.conn = sqlite3.connect(self.database_file)

    def generate_database(self):
        self.create_table_users()
        self.create_table_admins()
        self.create_table_sources()
        self.create_table_sourcetypes()
        self.create_table_reviews()
        self.create_table_tags()
        self.create_table_source_tags()

        if self.create_initial_data:
            self.insert_admin()
            self.insert_user()

    def create_table_users(self):
        create_statement = """
         CREATE TABLE IF NOT EXISTS users (
             user_id INTEGER PRIMARY KEY AUTOINCREMENT,
             display_name TEXT NOT NULL,
             studentnr INTEGER NOT NULL,
             password TEXT NOT NULL,
             fname TEXT NOT NULL,
             infix TEXT,
             lname TEXT NOT NULL,
             dateofbirth DATETIME NOT NULL,
             status TEXT NOT NULL
            );
         """
        self.__execute_transaction_statement(create_statement)
        print("✅ Users table created")

    def create_table_admins(self):
        create_statement = """
         CREATE TABLE IF NOT EXISTS admins (
             admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
             email TEXT NOT NULL,
             password TEXT NOT NULL,
             fname TEXT NOT NULL,
             infix TEXT,
             lname TEXT NOT NULL,
             dateofbirth DATETIME NOT NULL,
             status TEXT NOT NULL);
         """
        self.__execute_transaction_statement(create_statement)
        print("✅ admins table created")

    def create_table_sources(self):
        create_statement = """
         CREATE TABLE IF NOT EXISTS sources (
             source_id INTEGER PRIMARY KEY AUTOINCREMENT,
             user_id INTEGER NOT NULL,
             sourcetype_id TEXT INTEGER NULL,
             title TEXT NOT NULL,
             description TEXT,
             link TEXT,
             ISBN INTEGER,
             img TEXT,
             date_created DATETIME DEFAULT CURRENT_TIMESTAMP,          
             FOREIGN KEY (user_id) REFERENCES users (user_id),
             FOREIGN KEY (sourcetype_id) REFERENCES sourcetypes (sourcetype_id));
         """
        self.__execute_transaction_statement(create_statement)
        print("✅ sources table created")

    def create_table_sourcetypes(self):
        create_statement = """
         CREATE TABLE IF NOT EXISTS sourcetypes (
             sourcetype_id INTEGER PRIMARY KEY AUTOINCREMENT,
             sourcetype TEXT);
         """
        self.__execute_transaction_statement(create_statement)
        print("✅ sourcetypes table created")

    def create_table_reviews(self):
        create_statement = """
            CREATE TABLE IF NOT EXISTS reviews (
                review_id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_id INTEGER NOT NULL,
                user_id INTEGER NULL,
                title TEXT,
                description TEXT,
                stars INTEGER NOT NULL,         
                FOREIGN KEY (user_id) REFERENCES users (user_id),
                FOREIGN KEY (source_id) REFERENCES sources (source_id));
            """
        self.__execute_transaction_statement(create_statement)
        print("✅ reviews table created")

    def create_table_tags(self):
        create_statement = """
               CREATE TABLE IF NOT EXISTS tags (
                   tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
                   tag TEXT NOT NULL
                  );
               """
        self.__execute_transaction_statement(create_statement)
        print("✅ tags table created")

    def create_table_source_tags(self):
        create_statement = """
               CREATE TABLE IF NOT EXISTS source_tags (
                   source_tags_id INTEGER PRIMARY KEY AUTOINCREMENT,
                   source_id INTEGER NOT NULL,
                   tag_id INTEGER NULL,   
                   FOREIGN KEY (source_id) REFERENCES sources (source_id),
                   FOREIGN KEY (tag_id) REFERENCES tags (tag_id));
               """
        self.__execute_transaction_statement(create_statement)
        print("✅ source_tags table created")

    def insert_admin(self):
        admins = [
            ("john@pork.nl", "halal", "John", "pork", "19-09-2000", "actief")
        ]
        insert_statement = "INSERT INTO admins (email, password, fname, lname, dateofbirth, status) VALUES (?, ?, ?, ?, ?, ?);"
        self.__execute_many_transaction_statement(insert_statement, admins)
        print("✅ Default admin created")

    def insert_user(self):
        users = [
            ("jansmit", "1234567", "lol", "jan", "van", "smit", "20-03-2001", "actief")

        ]
        insert_statement = "INSERT INTO users (display_name, studentnr, password, fname, infix, lname, dateofbirth, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
        self.__execute_many_transaction_statement(insert_statement, users)
        print("✅ Default users created")

    # Transacties zijn duur, dat wil zeggen, ze kosten veel tijd en CPU kracht. Als je veel insert doet
    # bundel je ze in één transactie, of je gebruikt de SQLite executemany methode.
    def __execute_many_transaction_statement(
            self, create_statement, list_of_parameters=()
    ):
        c = self.conn.cursor()
        c.executemany(create_statement, list_of_parameters)
        self.conn.commit()

    def __execute_transaction_statement(self, create_statement, parameters=()):
        c = self.conn.cursor()
        c.execute(create_statement, parameters)
        self.conn.commit()

    def test_file_location(self):
        if not self.database_file.parent.exists():
            raise ValueError(
                f"Database file location {self.database_file.parent} does not exist"
            )
        if self.database_file.exists():
            if not self.database_overwrite:
                raise ValueError(
                    f"Database file {self.database_file} already exists, set overwrite=True to overwrite"
                )
            else:
                # Unlink verwijdert een bestand
                self.database_file.unlink()
                print("✅ Database already exists, deleted")
        if not self.database_file.exists():
            try:
                self.database_file.touch()
                print("✅ New database setup")
            except Exception as e:
                raise ValueError(
                    f"Could not create database file {self.database_file} due to error {e}"
                )


if __name__ == "__main__":
    my_path = Path(__file__).parent.resolve()
    root_backend = my_path.parent
    # Deze slashes komen uit de "Path" module. Dit is een module die je kan gebruiken
    # om paden te maken. Dit is handig omdat je dan niet zelf hoeft te kijken of je
    # een / (mac) of een \ (windows) moet gebruiken.
    database_path = root_backend / "database" / "database.db"
    database_generator = WP4DatabaseGenerator(
        database_path, overwrite=True, initial_data=True
    )
    database_generator.generate_database()