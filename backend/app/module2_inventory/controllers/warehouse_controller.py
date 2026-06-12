"""
warehouse_controller.py — Warehouse HTTP Request Handlers
=============================================================

WHAT IS A CONTROLLER?
The controller is the "receptionist" of your API. It:
  1. Receives the HTTP request
  2. Validates the incoming data using schemas
  3. Calls the service layer to do the real work
  4. Catches any exceptions and returns proper error responses
  5. Returns a standardized success response

RULE: Controllers should be THIN.
  No business logic here — that belongs in the service.
  No database queries here — that belongs in the repository.
  The controller just coordinates between HTTP and the service.
"""

from flask import request
from marshmallow import ValidationError

from app.module2_inventory.schemas import (
    WarehouseSchema,
    CreateWarehouseSchema,
    UpdateWarehouseSchema,
)
from app.module2_inventory.services import warehouse_service
from app.shared.responses.api_response import success_response, error_response, paginated_response
from app.shared.helpers.utils import format_pagination_params
from app.core.exceptions.handlers import AppException


# Schema instances (reusable — create once, use many times)
warehouse_schema = WarehouseSchema()
warehouses_schema = WarehouseSchema(many=True)
create_schema = CreateWarehouseSchema()
update_schema = UpdateWarehouseSchema()


def get_all_warehouses():
    """
    GET /api/v1/warehouses
    List all warehouses with optional search, filter, and pagination.

    Query Parameters:
        page (int): Page number (default: 1)
        per_page (int): Items per page (default: 20, max: 100)
        search (str): Search term for name, code, or location
        status (str): Filter by status (active, inactive, maintenance)
    """
    try:
        page, per_page = format_pagination_params(request.args)
        search = request.args.get("search", None)
        status = request.args.get("status", None)

        pagination = warehouse_service.get_all(
            page=page, per_page=per_page, search=search, status=status
        )

        return paginated_response(
            data=warehouses_schema.dump(pagination.items),
            page=pagination.page,
            per_page=pagination.per_page,
            total=pagination.total,
            message="Warehouses retrieved successfully"
        )

    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)


def get_warehouse(warehouse_id):
    """
    GET /api/v1/warehouses/<warehouse_id>
    Get a single warehouse by ID.
    """
    try:
        warehouse = warehouse_service.get_by_id(warehouse_id)
        return success_response(
            data=warehouse_schema.dump(warehouse),
            message="Warehouse retrieved successfully"
        )

    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)


def create_warehouse():
    """
    POST /api/v1/warehouses
    Create a new warehouse.

    Request Body (JSON):
        warehouse_name (str): Required
        warehouse_code (str): Required, must be unique
        location (str): Required
        address (str): Optional
        manager_name (str): Optional
        contact_number (str): Optional
        capacity (int): Optional, default 0
        status (str): Optional, default 'active'
    """
    try:
        # Validate the request body
        data = create_schema.load(request.get_json())

        # Create the warehouse
        warehouse = warehouse_service.create(data)

        return success_response(
            data=warehouse_schema.dump(warehouse),
            message="Warehouse created successfully",
            status_code=201
        )

    except ValidationError as e:
        return error_response("Validation failed", errors=e.messages, status_code=422)
    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)


def update_warehouse(warehouse_id):
    """
    PUT /api/v1/warehouses/<warehouse_id>
    Update an existing warehouse.

    Request Body (JSON): Any warehouse fields to update.
    """
    try:
        json_data = request.get_json()

        # Check that at least one field is provided
        if not json_data:
            return error_response(
                "No data provided",
                errors={"body": "Request body must contain at least one field to update"},
                status_code=422
            )

        # Validate the request body
        data = update_schema.load(json_data)

        if not data:
            return error_response(
                "No valid fields provided",
                errors={"body": "At least one valid field must be provided"},
                status_code=422
            )

        # Update the warehouse
        warehouse = warehouse_service.update(warehouse_id, data)

        return success_response(
            data=warehouse_schema.dump(warehouse),
            message="Warehouse updated successfully"
        )

    except ValidationError as e:
        return error_response("Validation failed", errors=e.messages, status_code=422)
    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)


def delete_warehouse(warehouse_id):
    """
    DELETE /api/v1/warehouses/<warehouse_id>
    Delete a warehouse and all its related stock/movements (CASCADE).
    """
    try:
        warehouse_service.delete(warehouse_id)

        return success_response(
            message="Warehouse deleted successfully"
        )

    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)
