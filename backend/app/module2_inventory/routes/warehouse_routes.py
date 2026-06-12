"""
warehouse_routes.py — Warehouse URL Routes (Flask Blueprint)
================================================================

WHAT IS A BLUEPRINT?
A Blueprint is a "mini-app" — a group of related URL routes.
Instead of putting all routes in one giant file, each module
gets its own Blueprint.

This file maps URL patterns to controller functions:
  POST   /warehouses        → warehouse_controller.create_warehouse
  GET    /warehouses        → warehouse_controller.get_all_warehouses
  GET    /warehouses/<id>   → warehouse_controller.get_warehouse
  PUT    /warehouses/<id>   → warehouse_controller.update_warehouse
  DELETE /warehouses/<id>   → warehouse_controller.delete_warehouse

The Blueprint is registered in app/__init__.py with the prefix /api/v1,
so the full URL becomes: /api/v1/warehouses
"""

from flask import Blueprint
from app.module2_inventory.controllers import warehouse_controller

# Create the Blueprint
# 'warehouse_bp' is the internal name, 'warehouses' is used in url_for()
warehouse_bp = Blueprint('warehouses', __name__)

# ---- Map URLs to controller functions ----

@warehouse_bp.route('/warehouses', methods=['POST'])
def create():
    return warehouse_controller.create_warehouse()


@warehouse_bp.route('/warehouses', methods=['GET'])
def get_all():
    return warehouse_controller.get_all_warehouses()


@warehouse_bp.route('/warehouses/<int:warehouse_id>', methods=['GET'])
def get_one(warehouse_id):
    return warehouse_controller.get_warehouse(warehouse_id)


@warehouse_bp.route('/warehouses/<int:warehouse_id>', methods=['PUT'])
def update(warehouse_id):
    return warehouse_controller.update_warehouse(warehouse_id)


@warehouse_bp.route('/warehouses/<int:warehouse_id>', methods=['DELETE'])
def delete(warehouse_id):
    return warehouse_controller.delete_warehouse(warehouse_id)
