"""
movement_routes.py — Movement URL Routes (Flask Blueprint)
=============================================================

Maps movement-related URL patterns to controller functions:
  GET /movements       → movement_controller.get_all_movements
  GET /movements/<id>  → movement_controller.get_movement

Registered with prefix /api/v1, so full URLs are:
  /api/v1/movements, /api/v1/movements/<id>
"""

from flask import Blueprint
from app.module2_inventory.controllers import movement_controller

movement_bp = Blueprint('movements', __name__)


@movement_bp.route('/movements', methods=['GET'])
def get_all():
    return movement_controller.get_all_movements()


@movement_bp.route('/movements/<int:movement_id>', methods=['GET'])
def get_one(movement_id):
    return movement_controller.get_movement(movement_id)
