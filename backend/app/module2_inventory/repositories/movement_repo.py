"""
movement_repo.py — Inventory Movement Repository (Database Layer)
====================================================================

Handles all database queries related to inventory movements.
Movements are an audit trail — they record EVERY stock change.
"""

from app.core.database.db import db
from app.module2_inventory.models.movement import InventoryMovement


def get_all(page: int = 1, per_page: int = 20, warehouse_id: int = None,
            movement_type: str = None, product_id: int = None):
    """
    Get a paginated, filtered list of inventory movements.

    Args:
        page: Page number
        per_page: Items per page
        warehouse_id: Optional filter by warehouse
        movement_type: Optional filter by type (STOCK_IN, STOCK_OUT, etc.)
        product_id: Optional filter by product

    Returns:
        SQLAlchemy Pagination object
    """
    query = InventoryMovement.query

    if warehouse_id:
        query = query.filter(InventoryMovement.warehouse_id == warehouse_id)

    if movement_type:
        query = query.filter(InventoryMovement.movement_type == movement_type)

    if product_id:
        query = query.filter(InventoryMovement.product_id == product_id)

    # Most recent movements first
    query = query.order_by(InventoryMovement.created_at.desc())

    return query.paginate(page=page, per_page=per_page, error_out=False)


def get_by_id(movement_id: int):
    """
    Get a single movement by its primary key.

    Returns:
        InventoryMovement instance or None
    """
    return InventoryMovement.query.get(movement_id)


def create(data: dict):
    """
    Insert a new movement record.

    NOTE: This is called by the stock service, NOT by an API endpoint.
    Movements are always created as a side effect of a stock operation.

    Args:
        data: Dictionary with warehouse_id, product_id, movement_type, quantity, etc.

    Returns:
        The newly created InventoryMovement instance
    """
    movement = InventoryMovement(**data)
    db.session.add(movement)
    # Don't commit here — the stock service will commit once
    # both the stock update AND the movement are staged.
    return movement
