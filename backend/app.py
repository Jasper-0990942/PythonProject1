from flask import Flask
from flask_cors import CORS

from blueprints.users import users_bp
from blueprints.sources import sources_bp

app = Flask(__name__)
# CORS(app)
CORS(app, origins="*", supports_credentials=True)

app.register_blueprint(sources_bp, url_prefix="/sources")
app.register_blueprint(users_bp, url_prefix="/users")



if __name__ == '__main__':
    app.run(port=5050, host='0.0.0.0', debug=True)


