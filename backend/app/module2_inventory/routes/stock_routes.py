"""
stock_routes.py — Stock URL Routes (Flask Blueprint)
=======================================================

Maps stock-related URL patterns to controller functions:
  POST /stock/add              → stock_controller.add_stock
  POST /stock/remove           → stock_controller.remove_stock
  POST /stock/transfer         → stock_controller.transfer_stock
  GET  /stock                  → stock_controller.get_all_stock
  GET  /stock/<warehouse_id>   → stock_controller.get_warehouse_stock

Registered with prefix /api/v1, so full URLs are:
  /api/v1/stock/add, /api/v1/stock/remove, etc.
"""

from flask import Blueprint
from app.module2_inventory.controllers import stock_controller

stock_bp = Blueprint('stock', __name__)


@stock_bp.route('/stock/add', methods=['POST'])
def add():
    return stock_controller.add_stock()


@stock_bp.route('/stock/remove', methods=['POST'])
def remove():
    return stock_controller.remove_stock()


@stock_bp.route('/stock/transfer', methods=['POST'])
def transfer():
    return stock_controller.transfer_stock()


@stock_bp.route('/stock', methods=['GET'])
def get_all():
    return stock_controller.get_all_stock()


@stock_bp.route('/stock/<int:warehouse_id>', methods=['GET'])
def get_warehouse(warehouse_id):
    return stock_controller.get_warehouse_stock(warehouse_id)
