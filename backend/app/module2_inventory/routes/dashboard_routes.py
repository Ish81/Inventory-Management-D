"""
dashboard_routes.py — Dashboard URL Routes (Flask Blueprint)
================================================================

Maps the dashboard URL to the controller:
  GET /dashboard/summary → dashboard_controller.get_summary

Registered with prefix /api/v1, so full URL is:
  /api/v1/dashboard/summary
"""

from flask import Blueprint
from app.module2_inventory.controllers import dashboard_controller

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/dashboard/summary', methods=['GET'])
def summary():
    return dashboard_controller.get_summary()
