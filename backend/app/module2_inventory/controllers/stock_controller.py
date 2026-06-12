"""
stock_controller.py — Stock HTTP Request Handlers
=====================================================

Handles all stock-related API endpoints:
  POST /stock/add      → Add stock to a warehouse
  POST /stock/remove   → Remove stock from a warehouse
  POST /stock/transfer → Transfer between warehouses
  GET  /stock          → List all stock
  GET  /stock/<id>     → List stock for a specific warehouse
"""

from flask import request
from marshmallow import ValidationError

from app.module2_inventory.schemas import (
    WarehouseStockSchema,
    StockAddSchema,
    StockRemoveSchema,
    StockTransferSchema,
)
from app.module2_inventory.services import stock_service
from app.shared.responses.api_response import success_response, error_response, paginated_response
from app.shared.helpers.utils import format_pagination_params
from app.core.exceptions.handlers import AppException


# Schema instances
stock_schema = WarehouseStockSchema()
stocks_schema = WarehouseStockSchema(many=True)
add_schema = StockAddSchema()
remove_schema = StockRemoveSchema()
transfer_schema = StockTransferSchema()


def get_all_stock():
    """
    GET /api/v1/stock
    List all stock records with pagination.

    Query Parameters:
        page (int): Page number (default: 1)
        per_page (int): Items per page (default: 20)
    """
    try:
        page, per_page = format_pagination_params(request.args)

        pagination = stock_service.get_all_stock(page=page, per_page=per_page)

        return paginated_response(
            data=stocks_schema.dump(pagination.items),
            page=pagination.page,
            per_page=pagination.per_page,
            total=pagination.total,
            message="Stock records retrieved successfully"
        )

    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)


def get_warehouse_stock(warehouse_id):
    """
    GET /api/v1/stock/<warehouse_id>
    Get all stock records for a specific warehouse.
    """
    try:
        stocks = stock_service.get_warehouse_stock(warehouse_id)

        return success_response(
            data=stocks_schema.dump(stocks),
            message="Warehouse stock retrieved successfully"
        )

    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)


def add_stock():
    """
    POST /api/v1/stock/add
    Add stock to a warehouse (Stock In).

    Request Body (JSON):
        warehouse_id (int): Required
        product_id (int): Required
        quantity (int): Required, must be >= 1
        notes (str): Optional
    """
    try:
        data = add_schema.load(request.get_json())
        stock = stock_service.add_stock(data)

        return success_response(
            data=stock_schema.dump(stock),
            message="Stock added successfully",
            status_code=201
        )

    except ValidationError as e:
        return error_response("Validation failed", errors=e.messages, status_code=422)
    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)


def remove_stock():
    """
    POST /api/v1/stock/remove
    Remove stock from a warehouse (Stock Out).

    Request Body (JSON):
        warehouse_id (int): Required
        product_id (int): Required
        quantity (int): Required, must be >= 1
        notes (str): Optional
    """
    try:
        data = remove_schema.load(request.get_json())
        stock = stock_service.remove_stock(data)

        return success_response(
            data=stock_schema.dump(stock),
            message="Stock removed successfully"
        )

    except ValidationError as e:
        return error_response("Validation failed", errors=e.messages, status_code=422)
    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)


def transfer_stock():
    """
    POST /api/v1/stock/transfer
    Transfer stock between warehouses.

    Request Body (JSON):
        from_warehouse_id (int): Required
        to_warehouse_id (int): Required
        product_id (int): Required
        quantity (int): Required, must be >= 1
        notes (str): Optional
    """
    try:
        data = transfer_schema.load(request.get_json())
        result = stock_service.transfer_stock(data)

        return success_response(
            data={
                "source_stock": stock_schema.dump(result["source_stock"]),
                "destination_stock": stock_schema.dump(result["destination_stock"]),
            },
            message="Stock transferred successfully"
        )

    except ValidationError as e:
        return error_response("Validation failed", errors=e.messages, status_code=422)
    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)
