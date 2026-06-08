from flask import jsonify


def success_response(data=None, message="Success", status_code=200):
    """
    Standard success response format.
    
    Example output:
    {
        "success": true,
        "message": "Purchase order created successfully",
        "data": { ... }
    }
    """
    response = {
        "success": True,
        "message": message,
        "data": data
    }
    return jsonify(response), status_code


def error_response(message="An error occurred", status_code=400, errors=None):
    """
    Standard error response format.
    
    Example output:
    {
        "success": false,
        "message": "Validation failed",
        "errors": { "quantity": "Must be greater than 0" }
    }
    """
    response = {
        "success": False,
        "message": message,
        "errors": errors
    }
    return jsonify(response), status_code


def paginated_response(data, total, page, per_page, message="Success"):
    """
    Response format for paginated list results.
    Used when returning lists of purchase orders, sales orders, etc.
    """
    response = {
        "success": True,
        "message": message,
        "data": data,
        "pagination": {
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page
        }
    }
    return jsonify(response), 200