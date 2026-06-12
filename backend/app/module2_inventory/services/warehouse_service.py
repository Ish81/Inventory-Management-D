"""
warehouse_service.py — Warehouse Business Logic
===================================================

WHAT IS A SERVICE?
The service layer contains BUSINESS LOGIC — the rules of your application.
It sits between the controller (HTTP) and the repository (database).

EXAMPLES OF BUSINESS LOGIC:
  - "Warehouse code must be unique"
  - "Can't delete a warehouse that still has stock" (future enhancement)
  - "Auto-generate warehouse code if not provided" (future enhancement)

PATTERN:
  Controller → Service (validates rules) → Repository (runs query) → Database
"""

from app.module2_inventory.repositories import warehouse_repo
from app.core.exceptions.handlers import NotFoundException, DuplicateException


def get_all(page: int = 1, per_page: int = 20, search: str = None, status: str = None):
    """
    Get a paginated list of warehouses.

    Args:
        page: Page number
        per_page: Items per page
        search: Optional search term
        status: Optional status filter

    Returns:
        SQLAlchemy Pagination object
    """
    return warehouse_repo.get_all(
        page=page,
        per_page=per_page,
        search=search,
        status=status
    )


def get_by_id(warehouse_id: int):
    """
    Get a single warehouse by ID.

    Raises:
        NotFoundException: If the warehouse doesn't exist

    Returns:
        Warehouse instance
    """
    warehouse = warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise NotFoundException("Warehouse", warehouse_id)
    return warehouse


def create(data: dict):
    """
    Create a new warehouse.

    Business Rules:
      1. warehouse_code must be unique

    Raises:
        DuplicateException: If warehouse_code already exists

    Returns:
        The newly created Warehouse instance
    """
    # Rule 1: Check for duplicate warehouse_code
    existing = warehouse_repo.get_by_code(data.get("warehouse_code"))
    if existing:
        raise DuplicateException("Warehouse", "warehouse_code", data["warehouse_code"])

    return warehouse_repo.create(data)


def update(warehouse_id: int, data: dict):
    """
    Update an existing warehouse.

    Business Rules:
      1. Warehouse must exist
      2. If warehouse_code is being changed, the new code must be unique

    Raises:
        NotFoundException: If warehouse doesn't exist
        DuplicateException: If new warehouse_code already taken

    Returns:
        The updated Warehouse instance
    """
    # Rule 1: Warehouse must exist
    warehouse = warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise NotFoundException("Warehouse", warehouse_id)

    # Rule 2: If changing warehouse_code, check uniqueness
    new_code = data.get("warehouse_code")
    if new_code and new_code != warehouse.warehouse_code:
        existing = warehouse_repo.get_by_code(new_code)
        if existing:
            raise DuplicateException("Warehouse", "warehouse_code", new_code)

    return warehouse_repo.update(warehouse, data)


def delete(warehouse_id: int):
    """
    Delete a warehouse.

    Business Rules:
      1. Warehouse must exist

    Raises:
        NotFoundException: If warehouse doesn't exist
    """
    warehouse = warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise NotFoundException("Warehouse", warehouse_id)

    warehouse_repo.delete(warehouse)
