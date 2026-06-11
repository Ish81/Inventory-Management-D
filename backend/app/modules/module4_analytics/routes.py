from flask import Blueprint, request
from . import controllers
from app.modules.module4_auth.controllers import require_auth

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics', methods=['GET'])
@require_auth()  # Allow all authenticated users
def get_analytics():
    return controllers.analytics_controller()

@analytics_bp.route('/alerts', methods=['GET'])
@require_auth()  # Allow all authenticated users
def get_alerts():
    # Member 2: import and call check_low_stock() 
    # from app.modules.module4_analytics.services 
    # at the end of your stock removal route
    
    is_read = request.args.get('is_read')
    severity = request.args.get('severity')
    return controllers.alerts_controller(is_read=is_read, severity=severity)

@analytics_bp.route('/alerts/<int:alert_id>', methods=['PATCH'])
@require_auth()  # Allow all authenticated users
def mark_alert_read(alert_id):
    return controllers.mark_alert_read_controller(alert_id)

@analytics_bp.route('/audit-logs', methods=['GET'])
@require_auth(roles=['admin'])
def get_audit_logs():
    return controllers.audit_logs_controller()
