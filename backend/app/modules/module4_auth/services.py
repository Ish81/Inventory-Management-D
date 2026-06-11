import os
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

def hash_password(plain_text):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_text.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_text, hashed):
    return bcrypt.checkpw(plain_text.encode('utf-8'), hashed.encode('utf-8'))

def generate_token(user_id, email, role):
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24)
    }
    secret = os.environ.get('JWT_SECRET')
    # #region agent log
    import json, time
    try:
        with open(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'debug-99ff6c.log'), 'a', encoding='utf-8') as f:
            f.write(json.dumps({'sessionId': '99ff6c', 'hypothesisId': 'C', 'location': 'services.py:generate_token', 'message': 'JWT secret check', 'data': {'jwt_secret_set': bool(secret), 'secret_key_set': bool(os.environ.get('SECRET_KEY'))}, 'timestamp': int(time.time() * 1000)}) + '\n')
    except Exception:
        pass
    # #endregion
    if not secret:
        raise ValueError("JWT_SECRET is not set in environment variables.")
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_token(token):
    secret = os.environ.get('JWT_SECRET')
    if not secret:
        raise ValueError("JWT_SECRET is not set in environment variables.")
    return jwt.decode(token, secret, algorithms=['HS256'])
