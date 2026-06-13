import os
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

def _get_jwt_secret():
    secret = os.environ.get('JWT_SECRET') or os.environ.get('SECRET_KEY')
    if not secret:
        raise ValueError("JWT_SECRET or SECRET_KEY must be set in environment variables.")
    return secret

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
    secret = _get_jwt_secret()
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_token(token):
    secret = _get_jwt_secret()
    return jwt.decode(token, secret, algorithms=['HS256'])
