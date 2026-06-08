from flask import Blueprint
from . import controllers

# Blueprint = a mini Flask app for this module
# All routes here will be prefixed with /api/v1 (set in __init__.py)
orders_bp = Blueprint('orders', __name__)

# ── Dashboard ──────────────────────────────────
orders_bp.route('/dashboard', methods=['GET'])(controllers.get_dashboard)

# ── Purchase Orders ────────────────────────────
orders_bp.route('/purchase-orders', methods=['GET'])(controllers.get_purchase_orders)
orders_bp.route('/purchase-orders', methods=['POST'])(controllers.create_purchase_order)
orders_bp.route('/purchase-orders/<int:po_id>', methods=['GET'])(controllers.get_purchase_order)
orders_bp.route('/purchase-orders/<int:po_id>/status', methods=['PATCH'])(controllers.update_purchase_order_status)
orders_bp.route('/purchase-orders/<int:po_id>', methods=['DELETE'])(controllers.delete_purchase_order)

# ── Sales Orders ───────────────────────────────
orders_bp.route('/sales-orders', methods=['GET'])(controllers.get_sales_orders)
orders_bp.route('/sales-orders', methods=['POST'])(controllers.create_sales_order)
orders_bp.route('/sales-orders/<int:so_id>', methods=['GET'])(controllers.get_sales_order)
orders_bp.route('/sales-orders/<int:so_id>/status', methods=['PATCH'])(controllers.update_sales_order_status)
orders_bp.route('/sales-orders/<int:so_id>', methods=['DELETE'])(controllers.delete_sales_order)