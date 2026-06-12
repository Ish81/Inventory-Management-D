"""
app/core/exceptions/handlers.py — Custom Exception Classes
============================================================

WHAT IS THIS FILE?
This file defines custom error classes for the application.

WHY CUSTOM EXCEPTIONS?
Python's built-in errors (ValueError, KeyError) are too generic.
Custom exceptions make your code clearer:

  Bad:   raise ValueError("Not found")     ← Which thing? What status code?
  Good:  raise NotFoundException("Warehouse", 42)  ← Clear! Returns 404.

HOW IT WORKS:
  1. Your SERVICE layer raises a custom exception:
       raise NotFoundException("Warehouse", warehouse_id)

  2. Your CONTROLLER catches it and returns a proper API response:
       try:
           warehouse = warehouse_service.get_by_id(id)
       except NotFoundException as e:
           return error_response(str(e), status_code=404)

COMMON HTTP STATUS CODES:
  200 — OK (success)
  201 — Created (resource created)
  400 — Bad Request (invalid input from client)
  404 — Not Found (item doesn't exist)
  409 — Conflict (duplicate entry)
  422 — Unprocessable Entity (validation failed)
  500 — Internal Server Error (something broke on the server)
"""


class AppException(Exception):
    """
    Base exception for ALL custom exceptions in this app.

    Every custom exception inherits from this class.
    This lets you catch ALL app-specific errors at once:
        except AppException as e:
            return error_response(e.message, status_code=e.status_code)

    Attributes:
        message (str):     Human-readable error description
        status_code (int): HTTP status code to return
    """

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(AppException):
    """
    Raised when a requested resource doesn't exist in the database.

    Example:
        raise NotFoundException("Warehouse", 42)
        # → "Warehouse with ID 42 not found" (HTTP 404)
    """

    def __init__(self, resource_name: str, resource_id=None):
        if resource_id is not None:
            message = f"{resource_name} with ID {resource_id} not found"
        else:
            message = f"{resource_name} not found"
        super().__init__(message, status_code=404)


class ValidationException(AppException):
    """
    Raised when input data fails validation.

    Example:
        raise ValidationException(
            "Validation failed",
            errors={"warehouse_name": "This field is required"}
        )
        # → Returns errors dict + HTTP 422
    """

    def __init__(self, message: str = "Validation failed", errors: dict = None):
        self.errors = errors or {}
        super().__init__(message, status_code=422)


class DuplicateException(AppException):
    """
    Raised when creating a resource that already exists.

    Example:
        raise DuplicateException("Warehouse", "warehouse_code", "WH-001")
        # → "Warehouse with warehouse_code 'WH-001' already exists" (HTTP 409)
    """

    def __init__(self, resource_name: str, field_name: str, field_value: str):
        message = f"{resource_name} with {field_name} '{field_value}' already exists"
        super().__init__(message, status_code=409)


class InsufficientStockException(AppException):
    """
    Raised when trying to remove or transfer more stock than available.

    Example:
        raise InsufficientStockException(
            product_id=5, warehouse_id=1, requested=100, available=50
        )
        # → "Insufficient stock..." (HTTP 400)
    """

    def __init__(self, product_id: int, warehouse_id: int, requested: int, available: int):
        message = (
            f"Insufficient stock for product {product_id} in warehouse {warehouse_id}. "
            f"Requested: {requested}, Available: {available}"
        )
        super().__init__(message, status_code=400)
