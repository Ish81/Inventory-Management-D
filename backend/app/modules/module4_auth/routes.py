import json, time
from flask import Blueprint, request
from . import controllers

auth_bp = Blueprint('auth', __name__)

def _dbg(location, message, data, hypothesis_id):
    # #region agent log
    try:
        with open(__import__('os').path.join(__import__('os').path.dirname(__file__), '..', '..', '..', '..', 'debug-99ff6c.log'), 'a', encoding='utf-8') as f:
            f.write(json.dumps({'sessionId': '99ff6c', 'hypothesisId': hypothesis_id, 'location': location, 'message': message, 'data': data, 'timestamp': int(time.time() * 1000)}) + '\n')
    except Exception:
        pass
    # #endregion

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    _dbg('routes.py:register', 'register hit', {'path': request.path, 'email': (data or {}).get('email'), 'role': (data or {}).get('role')}, 'A')
    return controllers.register_controller(data)

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    _dbg('routes.py:login', 'login hit', {'path': request.path, 'email': (data or {}).get('email')}, 'A')
    return controllers.login_controller(data)
