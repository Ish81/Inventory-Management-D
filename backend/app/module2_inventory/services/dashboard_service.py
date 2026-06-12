"""
dashboard_service.py — Dashboard KPI Aggregation
====================================================

This service gathers Key Performance Indicators (KPIs) from across
the inventory module. It queries warehouses, stock, and movements
to build a summary that the frontend dashboard can display.

KPIs Provided:
  - Total warehouses (by status)
  - Total products tracked
  - Total stock quantity
  - Low stock alerts (items below reorder level)
  - Stock by warehouse (for charts)
  - Recent movements (last 10)
"""

from sqlalchemy import func
from app.core.database.db import db
from app.module2_inventory.models.warehouse import Warehouse
from app.module2_inventory.models.stock import WarehouseStock
from app.module2_inventory.models.movement import InventoryMovement
from app.module2_inventory.schemas import WarehouseStockSchema, InventoryMovementSchema


movement_schema = InventoryMovementSchema(many=True)
stock_schema = WarehouseStockSchema(many=True)


def get_summary():
    """
    Build the dashboard summary with all KPIs.

    Returns:
        dict with all dashboard data
    """
    return {
        "warehouses": _get_warehouse_stats(),
        "stock_overview": _get_stock_overview(),
        "low_stock_alerts": _get_low_stock_alerts(),
        "stock_by_warehouse": _get_stock_by_warehouse(),
        "recent_movements": _get_recent_movements(),
    }


def _get_warehouse_stats():
    """
    Count warehouses by status.

    Returns:
        {
            "total": 5,
            "active": 3,
            "inactive": 1,
            "maintenance": 1
        }
    """
    total = Warehouse.query.count()

    # Count by status using a single query with GROUP BY
    status_counts = (
        db.session.query(Warehouse.status, func.count(Warehouse.warehouse_id))
        .group_by(Warehouse.status)
        .all()
    )

    # Convert to dict: {"active": 3, "inactive": 1, ...}
    counts = {status: count for status, count in status_counts}

    return {
        "total": total,
        "active": counts.get("active", 0),
        "inactive": counts.get("inactive", 0),
        "maintenance": counts.get("maintenance", 0),
    }


def _get_stock_overview():
    """
    Get overall stock statistics.

    Returns:
        {
            "total_products": 25,
            "total_quantity": 15000,
            "total_reserved": 500
        }
    """
    result = db.session.query(
        func.count(WarehouseStock.stock_id),
        func.coalesce(func.sum(WarehouseStock.quantity_available), 0),
        func.coalesce(func.sum(WarehouseStock.quantity_reserved), 0),
    ).first()

    return {
        "total_products": result[0] or 0,
        "total_quantity": int(result[1]),
        "total_reserved": int(result[2]),
    }


def _get_low_stock_alerts():
    """
    Find stock items where quantity_available <= reorder_level.
    These are items that need restocking.

    Returns:
        {
            "count": 3,
            "items": [ ... ]  (list of stock records)
        }
    """
    low_stock = (
        WarehouseStock.query
        .filter(WarehouseStock.quantity_available <= WarehouseStock.reorder_level)
        .all()
    )

    return {
        "count": len(low_stock),
        "items": stock_schema.dump(low_stock),
    }


def _get_stock_by_warehouse():
    """
    Get total stock quantity per warehouse (for bar/pie charts).

    Returns:
        [
            {"warehouse_id": 1, "warehouse_name": "Main WH", "total_quantity": 500},
            {"warehouse_id": 2, "warehouse_name": "Delhi Hub", "total_quantity": 300},
        ]
    """
    results = (
        db.session.query(
            Warehouse.warehouse_id,
            Warehouse.warehouse_name,
            Warehouse.warehouse_code,
            func.coalesce(func.sum(WarehouseStock.quantity_available), 0).label("total_quantity"),
            func.count(WarehouseStock.stock_id).label("product_count"),
        )
        .outerjoin(WarehouseStock, Warehouse.warehouse_id == WarehouseStock.warehouse_id)
        .group_by(Warehouse.warehouse_id, Warehouse.warehouse_name, Warehouse.warehouse_code)
        .order_by(Warehouse.warehouse_name)
        .all()
    )

    return [
        {
            "warehouse_id": r.warehouse_id,
            "warehouse_name": r.warehouse_name,
            "warehouse_code": r.warehouse_code,
            "total_quantity": int(r.total_quantity),
            "product_count": r.product_count,
        }
        for r in results
    ]


def _get_recent_movements():
    """
    Get the 10 most recent inventory movements.

    Returns:
        list of movement records (serialized)
    """
    recent = (
        InventoryMovement.query
        .order_by(InventoryMovement.created_at.desc())
        .limit(10)
        .all()
    )

    return movement_schema.dump(recent)
