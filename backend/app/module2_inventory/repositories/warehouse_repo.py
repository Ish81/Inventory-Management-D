"""
warehouse_repo.py — Warehouse Repository (Database Layer)
============================================================

WHAT IS A REPOSITORY?
The repository is the ONLY layer that talks to the database directly.
It contains all SQL queries (written as SQLAlchemy Python code).

WHY A SEPARATE LAYER?
  - The service layer says WHAT to do: "Find all active warehouses"
  - The repository says HOW to do it: Warehouse.query.filter_by(status='active')

  If you ever switch databases (PostgreSQL → MySQL), you only change this file.
  The service layer doesn't change at all.

PATTERN:
  Service calls → Repository → SQLAlchemy → PostgreSQL
"""

from app.core.database.db import db
from app.module2_inventory.models.warehouse import Warehouse


def get_all(page: int = 1, per_page: int = 20, search: str = None, status: str = None):
    """
    Get a paginated list of warehouses, with optional search and status filter.

    Args:
        page: Page number (starts at 1)
        per_page: Items per page
        search: Optional search term (matches warehouse_name, warehouse_code, location)
        status: Optional status filter ('active', 'inactive', 'maintenance')

    Returns:
        SQLAlchemy Pagination object with .items, .total, .page, .per_page
    """
    query = Warehouse.query

    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                Warehouse.warehouse_name.ilike(search_term),
                Warehouse.warehouse_code.ilike(search_term),
                Warehouse.location.ilike(search_term)
            )
        )

    # Apply status filter if provided
    if status:
        query = query.filter(Warehouse.status == status)

    # Order by most recently created first
    query = query.order_by(Warehouse.created_at.desc())

    # Paginate the results
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return pagination


def get_by_id(warehouse_id: int):
    """
    Get a single warehouse by its primary key.

    Returns:
        Warehouse instance or None
    """
    return Warehouse.query.get(warehouse_id)


def get_by_code(warehouse_code: str):
    """
    Get a warehouse by its unique code.
    Used to check for duplicates before creating/updating.

    Returns:
        Warehouse instance or None
    """
    return Warehouse.query.filter_by(warehouse_code=warehouse_code).first()


def create(data: dict):
    """
    Insert a new warehouse into the database.

    Args:
        data: Dictionary of warehouse fields

    Returns:
        The newly created Warehouse instance
    """
    warehouse = Warehouse(**data)
    db.session.add(warehouse)
    db.session.commit()
    return warehouse


def update(warehouse: Warehouse, data: dict):
    """
    Update an existing warehouse with new data.

    Args:
        warehouse: The existing Warehouse instance
        data: Dictionary of fields to update

    Returns:
        The updated Warehouse instance
    """
    for key, value in data.items():
        setattr(warehouse, key, value)
    db.session.commit()
    return warehouse


def delete(warehouse: Warehouse):
    """
    Delete a warehouse from the database.
    Related stocks and movements are CASCADE deleted (see model).

    Args:
        warehouse: The Warehouse instance to delete
    """
    db.session.delete(warehouse)
    db.session.commit()
