"""
app/shared/responses/api_response.py — Standardized API Responses
===================================================================

WHAT IS THIS FILE?
Every API endpoint in the app uses these helper functions to return
responses in a CONSISTENT format. This is critical for a professional API.

WHY STANDARDIZE?
Without standardization, every developer returns data differently:
  Developer A: {"data": [...]}
  Developer B: {"result": [...], "ok": true}
  Developer C: {"warehouses": [...]}

The frontend developer goes crazy trying to parse all these formats!

WITH standardization, EVERY response looks like this:

  SUCCESS:
  {
    "success": true,
    "message": "Warehouse created successfully",
    "data": { ... }
  }

  ERROR:
  {
    "success": false,
    "message": "Validation failed",
    "errors": { "warehouse_name": "This field is required" }
  }

  PAGINATED LIST:
  {
    "success": true,
    "data": [ ... ],
    "pagination": { "page": 1, "per_page": 20, "total": 150, "pages": 8 }
  }

Now the frontend can ALWAYS check response.data.success and know what to do.
"""

import math
from flask import jsonify
from typing import Any, Optional


def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = 200
):
    """
    Return a standardized success response.

    Args:
        data: The data to return (dict, list, etc.)
        message: Human-readable success message
        status_code: HTTP status code (200=OK, 201=Created)

    Usage in a controller:
        return success_response(
            data={"warehouse_id": 1, "name": "Main Warehouse"},
            message="Warehouse created successfully",
            status_code=201
        )

    Result:
        HTTP 201
        {
            "success": true,
            "message": "Warehouse created successfully",
            "data": {"warehouse_id": 1, "name": "Main Warehouse"}
        }
    """
    response = {
        "success": True,
        "message": message,
    }
    if data is not None:
        response["data"] = data

    return jsonify(response), status_code


def error_response(
    message: str = "An error occurred",
    errors: Optional[dict] = None,
    status_code: int = 400
):
    """
    Return a standardized error response.

    Args:
        message: Human-readable error message
        errors: Optional dict of field-specific errors
        status_code: HTTP status code (400, 404, 422, 500)

    Usage in a controller:
        return error_response(
            message="Validation failed",
            errors={"warehouse_name": "This field is required"},
            status_code=422
        )
    """
    response = {
        "success": False,
        "message": message,
    }
    if errors is not None:
        response["errors"] = errors

    return jsonify(response), status_code


def paginated_response(
    data: list,
    page: int,
    per_page: int,
    total: int,
    message: str = "Success"
):
    """
    Return a standardized paginated response.

    WHY PAGINATION?
    If you have 10,000 warehouses, loading all at once is slow.
    Pagination loads them in "pages" (e.g., 20 at a time).
    The frontend shows page controls: [1] [2] [3] ... [500]

    Args:
        data: List of items for the CURRENT page
        page: Current page number (starts at 1)
        per_page: How many items per page
        total: Total number of items across ALL pages
        message: Human-readable message

    Usage in a controller:
        warehouses = warehouse_service.get_all(page=2, per_page=20)
        return paginated_response(
            data=warehouses,
            page=2,
            per_page=20,
            total=150
        )

    Result:
        {
            "success": true,
            "data": [...],
            "pagination": {
                "page": 2,
                "per_page": 20,
                "total": 150,
                "pages": 8,
                "has_next": true,
                "has_prev": true
            }
        }
    """
    total_pages = math.ceil(total / per_page) if per_page > 0 else 0

    return jsonify({
        "success": True,
        "message": message,
        "data": data,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        }
    }), 200
