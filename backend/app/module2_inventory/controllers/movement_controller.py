"""
movement_controller.py — Movement HTTP Request Handlers
==========================================================

Handles movement-related API endpoints:
  GET /movements     → List movements (with filters)
  GET /movements/:id → Get a single movement
"""

from flask import request

from app.module2_inventory.schemas import InventoryMovementSchema
from app.module2_inventory.services import movement_service
from app.shared.responses.api_response import success_response, error_response, paginated_response
from app.shared.helpers.utils import format_pagination_params
from app.core.exceptions.handlers import AppException


# Schema instances
movement_schema = InventoryMovementSchema()
movements_schema = InventoryMovementSchema(many=True)


def get_all_movements():
    """
    GET /api/v1/movements
    List all movements with optional filters and pagination.

    Query Parameters:
        page (int): Page number (default: 1)
        per_page (int): Items per page (default: 20)
        warehouse_id (int): Filter by warehouse
        movement_type (str): Filter by type (STOCK_IN, STOCK_OUT, TRANSFER_IN, TRANSFER_OUT, ADJUSTMENT)
        product_id (int): Filter by product
    """
    try:
        page, per_page = format_pagination_params(request.args)
        warehouse_id = request.args.get("warehouse_id", None, type=int)
        movement_type = request.args.get("movement_type", None)
        product_id = request.args.get("product_id", None, type=int)

        pagination = movement_service.get_all(
            page=page,
            per_page=per_page,
            warehouse_id=warehouse_id,
            movement_type=movement_type,
            product_id=product_id,
        )

        return paginated_response(
            data=movements_schema.dump(pagination.items),
            page=pagination.page,
            per_page=pagination.per_page,
            total=pagination.total,
            message="Movements retrieved successfully"
        )

    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)


def get_movement(movement_id):
    """
    GET /api/v1/movements/<movement_id>
    Get a single movement by ID.
    """
    try:
        movement = movement_service.get_by_id(movement_id)

        return success_response(
            data=movement_schema.dump(movement),
            message="Movement retrieved successfully"
        )

    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)
