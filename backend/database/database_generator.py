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

    def create_table_users(self):
        create_statement = """
         CREATE TABLE IF NOT EXISTS gebruikers (
             gebruiker_id INTEGER PRIMARY KEY AUTOINCREMENT,
             display_naam TEXT NOT NULL,
             studentnr INTEGER NOT NULL,
             wachtwoord TEXT NOT NULL,
             voornaam TEXT NOT NULL,
             tussenvoegsel TEXT,
             achternaam TEXT NOT NULL,
             geboortedatum DATETIME NOT NULL,
             status TEXT NOT NULL
            );
         """
        self.__execute_transaction_statement(create_statement)
        print("✅ Users table created")

    def create_table_admins(self):
        create_statement = """
         CREATE TABLE IF NOT EXISTS beheerders (
             beheerder_id INTEGER PRIMARY KEY AUTOINCREMENT,
             email TEXT NOT NULL,
             wachtwoord TEXT NOT NULL,
             voornaam TEXT NOT NULL,
             tussenvoegsel TEXT,
             achternaam TEXT NOT NULL,
             geboortedatum DATETIME NOT NULL,
             status TEXT NOT NULL);
         """
        self.__execute_transaction_statement(create_statement)
        print("✅ admins table created")

    def create_table_sources(self):
        create_statement = """
         CREATE TABLE IF NOT EXISTS bronnen (
             bron_id INTEGER PRIMARY KEY AUTOINCREMENT,
             gebruiker_id INTEGER NOT NULL,
             brontype_id TEXT INTEGER NULL,
             titel TEXT NOT NULL,
             beschrijving TEXT,
             link TEXT,
             afbeelding_id INTEGER,
             date_created DATETIME DEFAULT CURRENT_TIMESTAMP,          
             FOREIGN KEY (gebruiker_id) REFERENCES gebruikers (gebruiker_id),
             FOREIGN KEY (brontype_id) REFERENCES brontypes (brontype_id));
         """
        self.__execute_transaction_statement(create_statement)
        print("✅ sources table created")

    def create_table_sourcetypes(self):
        create_statement = """
         CREATE TABLE IF NOT EXISTS brontypes (
             brontype_id INTEGER PRIMARY KEY AUTOINCREMENT,
             brontype TEXT);
         """
        self.__execute_transaction_statement(create_statement)
        print("✅ sourcetypes table created")

    def create_table_reviews(self):
        create_statement = """
            CREATE TABLE IF NOT EXISTS recensies (
                recensie_id INTEGER PRIMARY KEY AUTOINCREMENT,
                bron_id INTEGER NOT NULL,
                gebruiker_id INTEGER NULL,
                titel TEXT,
                omschrijving TEXT,
                sterren INTEGER NOT NULL,         
                FOREIGN KEY (gebruiker_id) REFERENCES gebruikers (gebruiker_id),
                FOREIGN KEY (bron_id) REFERENCES bronnen (bron_id));
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
               CREATE TABLE IF NOT EXISTS bronnen_tags (
                   bronnen_tags_id INTEGER PRIMARY KEY AUTOINCREMENT,
                   bron_id INTEGER NOT NULL,
                   tag_id INTEGER NULL,   
                   FOREIGN KEY (bron_id) REFERENCES bronnen (bron_id),
                   FOREIGN KEY (tag_id) REFERENCES tags (tag_id));
               """
        self.__execute_transaction_statement(create_statement)
        print("✅ source_tags table created")

    def insert_admin(self):
        admins = [
            ("john@pork.nl", "halal", "John", "pork", "19-09-2000", "actief")
        ]
        insert_statement = "INSERT INTO beheerders (email, wachtwoord, voornaam, achternaam, geboortedatum, status) VALUES (?, ?, ?, ?, ?, ?);"
        self.__execute_many_transaction_statement(insert_statement, admins)
        print("✅ Default teachers / users created")

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
    backend_root = my_path.parent
    # Deze slashes komen uit de "Path" module. Dit is een module die je kan gebruiken
    # om paden te maken. Dit is handig omdat je dan niet zelf hoeft te kijken of je
    # een / (mac) of een \ (windows) moet gebruiken.
    database_path = backend_root / "database" / "database.db"
    database_generator = WP4DatabaseGenerator(
        database_path, overwrite=True, initial_data=True
    )
    database_generator.generate_database()