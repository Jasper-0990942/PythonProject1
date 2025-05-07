from flask import Flask
from flask_cors import CORS
from blueprints.sources import sources_bp
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:8081"}})

app.register_blueprint(sources_bp, url_prefix="/sources")



if __name__ == '__main__':
    app.run(port=5000, debug=True)