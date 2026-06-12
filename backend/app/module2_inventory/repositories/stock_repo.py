"""
stock_repo.py — Warehouse Stock Repository (Database Layer)
==============================================================

Handles all database queries related to stock levels.
Stock records track how much of each product is in each warehouse.
"""

from app.core.database.db import db
from app.module2_inventory.models.stock import WarehouseStock


def get_all(page: int = 1, per_page: int = 20):
    """
    Get a paginated list of all stock records.

    Returns:
        SQLAlchemy Pagination object
    """
    query = WarehouseStock.query.order_by(WarehouseStock.updated_at.desc())
    return query.paginate(page=page, per_page=per_page, error_out=False)


def get_by_warehouse(warehouse_id: int):
    """
    Get all stock records for a specific warehouse.

    Returns:
        List of WarehouseStock instances
    """
    return WarehouseStock.query.filter_by(warehouse_id=warehouse_id).all()


def get_stock_record(warehouse_id: int, product_id: int):
    """
    Get a specific stock record for a product in a warehouse.

    This is the most common query — used for stock in/out/transfer.

    Returns:
        WarehouseStock instance or None
    """
    return WarehouseStock.query.filter_by(
        warehouse_id=warehouse_id,
        product_id=product_id
    ).first()


def create(data: dict):
    """
    Insert a new stock record.

    Args:
        data: Dictionary with warehouse_id, product_id, quantity_available, etc.

    Returns:
        The newly created WarehouseStock instance
    """
    stock = WarehouseStock(**data)
    db.session.add(stock)
    db.session.commit()
    return stock


def update(stock: WarehouseStock, data: dict):
    """
    Update an existing stock record.

    Args:
        stock: The existing WarehouseStock instance
        data: Dictionary of fields to update

    Returns:
        The updated WarehouseStock instance
    """
    for key, value in data.items():
        setattr(stock, key, value)
    db.session.commit()
    return stock
