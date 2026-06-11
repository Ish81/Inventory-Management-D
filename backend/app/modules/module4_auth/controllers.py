import json, time
from functools import wraps
from flask import request, g
from app.shared.response_helpers import success_response, error_response
from . import services
from . import models

def _dbg(location, message, data, hypothesis_id):
    # #region agent log
    try:
        with open(__import__('os').path.join(__import__('os').path.dirname(__file__), '..', '..', '..', '..', 'debug-99ff6c.log'), 'a', encoding='utf-8') as f:
            f.write(json.dumps({'sessionId': '99ff6c', 'hypothesisId': hypothesis_id, 'location': location, 'message': message, 'data': data, 'timestamp': int(time.time() * 1000)}) + '\n')
    except Exception:
        pass
    # #endregion

def require_auth(roles=None):
    if roles is None:
        roles = []
        
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return error_response("Missing or invalid authorization header", 401)
                
            token = auth_header.split(' ')[1]
            try:
                payload = services.decode_token(token)
            except Exception:
                return error_response("Invalid or expired token", 401)
                
            if roles and payload.get('role') not in roles:
                return error_response("Access denied: insufficient permissions", 403)
                
            g.current_user = {
                'user_id': payload.get('user_id'),
                'email': payload.get('email'),
                'role': payload.get('role')
            }
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def register_controller(data):
    if not data:
        return error_response("No data provided", 400)
        
    email = data.get('email')
    password = data.get('password')
    role_name = data.get('role', 'staff') # Default to staff if not provided

    if not email or not password:
        return error_response("Email and password are required", 400)
        
    existing_user = models.get_user_by_email(email)
    if existing_user:
        return error_response("User with this email already exists", 409)
        
    try:
        role = models.get_role_by_name(role_name)
    except Exception as e:
        _dbg('controllers.py:register', 'role lookup failed', {'role_name': role_name, 'error': type(e).__name__, 'detail': str(e)[:200]}, 'B')
        raise
    _dbg('controllers.py:register', 'role lookup result', {'role_name': role_name, 'found': bool(role)}, 'D')
    if not role:
        return error_response(f"Role '{role_name}' does not exist", 400)
        
    hashed_password = services.hash_password(password)
    user = models.create_user(email, hashed_password, role['id'])
    
    user_dict = {
        'id': user['id'],
        'email': user['email'],
        'role': role['name']
    }
    
    return success_response(user_dict, "User registered successfully", 201)

def login_controller(data):
    if not data:
        return error_response("No data provided", 400)
        
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return error_response("Email and password are required", 400)
        
    try:
        user = models.get_user_by_email(email)
    except Exception as e:
        _dbg('controllers.py:login', 'user lookup failed', {'email': email, 'error': type(e).__name__, 'detail': str(e)[:200]}, 'B')
        raise
    _dbg('controllers.py:login', 'user lookup result', {'email': email, 'found': bool(user)}, 'B')
    if not user:
        return error_response("Invalid credentials", 401)
        
    if not services.verify_password(password, user['password_hash']):
        return error_response("Invalid credentials", 401)
        
    role = models.get_role_by_id(user['role_id'])
    role_name = role['name'] if role else None
    
    try:
        token = services.generate_token(user['id'], user['email'], role_name)
        _dbg('controllers.py:login', 'token generated', {'has_token': bool(token)}, 'C')
    except Exception as e:
        _dbg('controllers.py:login', 'token generation failed', {'error': type(e).__name__, 'detail': str(e)[:200]}, 'C')
        raise
    
    response_data = {
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'role': role_name
        }
    }
    
    return success_response(response_data, "Login successful", 200)
