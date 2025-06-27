from functools import wraps
from flask import request, jsonify
import jwt
from flask import current_app as app

def token_required(user_type=None):

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
            if not token:
                return jsonify({'success': False, 'message': 'Token is missing'}), 401
            try:
                decoded = jwt.decode(token, app.secret_key, algorithms=['HS256'])
                if user_type:
                    if isinstance(user_type, list):
                        if decoded.get('type') not in user_type:
                            return jsonify({'success': False, 'message': 'Access denied'}), 403
                    else:
                        if decoded.get('type') != user_type:
                            return jsonify({'success': False, 'message': 'Access denied'}), 403

                if decoded.get('type') == 'user':
                    decoded['id'] = decoded.get('id')
                elif decoded.get('type') == 'admin':
                    decoded['id'] = decoded.get('id')
                request.user = decoded
            except jwt.ExpiredSignatureError:
                return jsonify({'success': False, 'message': 'Token expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'success': False, 'message': 'Invalid token'}), 401

            return f(*args, **kwargs)
        return decorated_function
    return decorator
