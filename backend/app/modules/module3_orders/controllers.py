from flask import request
from app.shared.response_helpers import success_response, error_response, paginated_response
from . import services
from .validators import validate_purchase_order_data, validate_sales_order_data


# ─────────────────────────────────────────────
# PURCHASE ORDER CONTROLLERS
# ─────────────────────────────────────────────

def get_purchase_orders():
    """GET /api/v1/purchase-orders"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')
    search = request.args.get('search')

    result = services.get_all_purchase_orders(page, per_page, status, search)

    return paginated_response(
        data=result['orders'],
        total=result['total'],
        page=result['page'],
        per_page=result['per_page']
    )


def get_purchase_order(po_id):
    """GET /api/v1/purchase-orders/<id>"""
    order = services.get_purchase_order_by_id(po_id)
    if not order:
        return error_response("Purchase order not found", 404)
    return success_response(order)


def create_purchase_order():
    """POST /api/v1/purchase-orders"""
    data = request.get_json()
    if not data:
        return error_response("No data provided", 400)

    errors = validate_purchase_order_data(data)
    if errors:
        return error_response("Validation failed", 422, errors)

    order = services.create_purchase_order(data)
    return success_response(order, "Purchase order created successfully", 201)


def update_purchase_order_status(po_id):
    """PATCH /api/v1/purchase-orders/<id>/status"""
    data = request.get_json()
    if not data or 'status' not in data:
        return error_response("Status field is required", 400)

    order, error = services.update_purchase_order_status(po_id, data['status'])
    if error:
        return error_response(error, 400)

    return success_response(order, "Purchase order status updated")


def delete_purchase_order(po_id):
    """DELETE /api/v1/purchase-orders/<id>"""
    success, error = services.delete_purchase_order(po_id)
    if not success:
        return error_response(error, 400)
    return success_response(None, "Purchase order deleted successfully")


# ─────────────────────────────────────────────
# SALES ORDER CONTROLLERS
# ─────────────────────────────────────────────

def get_sales_orders():
    """GET /api/v1/sales-orders"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')
    search = request.args.get('search')

    result = services.get_all_sales_orders(page, per_page, status, search)
    return paginated_response(
        data=result['orders'],
        total=result['total'],
        page=result['page'],
        per_page=result['per_page']
    )


def get_sales_order(so_id):
    """GET /api/v1/sales-orders/<id>"""
    order = services.get_sales_order_by_id(so_id)
    if not order:
        return error_response("Sales order not found", 404)
    return success_response(order)


def create_sales_order():
    """POST /api/v1/sales-orders"""
    data = request.get_json()
    if not data:
        return error_response("No data provided", 400)

    errors = validate_sales_order_data(data)
    if errors:
        return error_response("Validation failed", 422, errors)

    order = services.create_sales_order(data)
    return success_response(order, "Sales order created successfully", 201)


def update_sales_order_status(so_id):
    """PATCH /api/v1/sales-orders/<id>/status"""
    data = request.get_json()
    if not data or 'status' not in data:
        return error_response("Status field is required", 400)

    order, error = services.update_sales_order_status(so_id, data['status'])
    if error:
        return error_response(error, 400)

    return success_response(order, "Sales order status updated")


def delete_sales_order(so_id):
    """DELETE /api/v1/sales-orders/<id>"""
    success, error = services.delete_sales_order(so_id)
    if not success:
        return error_response(error, 400)
    return success_response(None, "Sales order deleted successfully")


# ─────────────────────────────────────────────
# DASHBOARD CONTROLLER
# ─────────────────────────────────────────────

def get_dashboard():
    """GET /api/v1/dashboard"""
    stats = services.get_dashboard_stats()
    return success_response(stats)