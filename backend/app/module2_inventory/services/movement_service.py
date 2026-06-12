"""
movement_service.py — Movement Business Logic
=================================================

Movements are READ-ONLY from the API perspective.
They are created automatically by the stock service.

This service just handles retrieving movement records.
"""

from app.module2_inventory.repositories import movement_repo
from app.core.exceptions.handlers import NotFoundException


def get_all(page: int = 1, per_page: int = 20, warehouse_id: int = None,
            movement_type: str = None, product_id: int = None):
    """
    Get a filtered, paginated list of movements.

    Args:
        page: Page number
        per_page: Items per page
        warehouse_id: Optional filter by warehouse
        movement_type: Optional filter by type
        product_id: Optional filter by product

    Returns:
        SQLAlchemy Pagination object
    """
    return movement_repo.get_all(
        page=page,
        per_page=per_page,
        warehouse_id=warehouse_id,
        movement_type=movement_type,
        product_id=product_id,
    )


def get_by_id(movement_id: int):
    """
    Get a single movement by ID.

    Raises:
        NotFoundException: If the movement doesn't exist

    Returns:
        InventoryMovement instance
    """
    movement = movement_repo.get_by_id(movement_id)
    if not movement:
        raise NotFoundException("Movement", movement_id)
    return movement
