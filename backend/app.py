from flask import Flask
from flask_cors import CORS
from blueprints.sources import sources_bp
import psycopg2
app = Flask(__name__)
CORS(app)

app.register_blueprint(sources_bp, url_prefix="/sources")



if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0', debug=True)


