from functools import wraps
from flask import Flask, request, jsonify
import jwt

app = Flask(__name__)

def token_required(user_type=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                parts = request.headers['Authorization'].split(" ")
                if len(parts) == 2:
                    token = parts[1]

            if not token:
                return jsonify({'success': False, 'message': 'Token is missing'}), 401

            try:
                data = jwt.decode(token, app.secret_key, algorithms=['HS256'])
                if user_type and data.get('type') != user_type:
                    return jsonify({'success': False, 'message': 'Access denied'}), 403
                request.user = data
            except jwt.ExpiredSignatureError:
                return jsonify({'success': False, 'message': 'Token expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'success': False, 'message': 'Invalid token'}), 401

            return f(*args, **kwargs)
        return decorated_function
    return decorator