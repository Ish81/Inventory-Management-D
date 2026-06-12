"""
stock_service.py — Stock Business Logic
==========================================

This is the most complex service because stock operations involve
MULTIPLE database changes that must happen TOGETHER (transactions):

  Stock In:
    1. Create or update stock record (increase quantity)
    2. Log a STOCK_IN movement

  Stock Out:
    1. Validate sufficient stock is available
    2. Update stock record (decrease quantity)
    3. Log a STOCK_OUT movement

  Transfer:
    1. Validate sufficient stock at SOURCE warehouse
    2. Decrease stock at source
    3. Increase stock at destination
    4. Log TRANSFER_OUT at source
    5. Log TRANSFER_IN at destination

If ANY step fails, ALL changes are rolled back (no partial updates).
"""

from app.core.database.db import db
from app.module2_inventory.repositories import stock_repo, movement_repo, warehouse_repo
from app.core.exceptions.handlers import (
    NotFoundException,
    InsufficientStockException,
    ValidationException,
)


def get_all_stock(page: int = 1, per_page: int = 20):
    """
    Get a paginated list of all stock records.

    Returns:
        SQLAlchemy Pagination object
    """
    return stock_repo.get_all(page=page, per_page=per_page)


def get_warehouse_stock(warehouse_id: int):
    """
    Get all stock records for a specific warehouse.

    Raises:
        NotFoundException: If the warehouse doesn't exist

    Returns:
        List of WarehouseStock instances
    """
    # Verify the warehouse exists
    warehouse = warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise NotFoundException("Warehouse", warehouse_id)

    return stock_repo.get_by_warehouse(warehouse_id)


def add_stock(data: dict):
    """
    Add stock to a warehouse (Stock In).

    If a stock record already exists for this warehouse+product, increase it.
    If not, create a new record.

    Also logs a STOCK_IN movement for the audit trail.

    Args:
        data: {warehouse_id, product_id, quantity, notes?}

    Raises:
        NotFoundException: If the warehouse doesn't exist

    Returns:
        The updated/created WarehouseStock instance
    """
    warehouse_id = data["warehouse_id"]
    product_id = data["product_id"]
    quantity = data["quantity"]
    notes = data.get("notes", "")

    # Verify the warehouse exists
    warehouse = warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise NotFoundException("Warehouse", warehouse_id)

    try:
        # Check if a stock record already exists
        stock = stock_repo.get_stock_record(warehouse_id, product_id)

        if stock:
            # Stock exists — increase the quantity
            new_quantity = stock.quantity_available + quantity
            stock_repo.update(stock, {"quantity_available": new_quantity})
        else:
            # No stock record yet — create one
            stock = stock_repo.create({
                "warehouse_id": warehouse_id,
                "product_id": product_id,
                "quantity_available": quantity,
            })

        # Log the movement (audit trail)
        movement_repo.create({
            "warehouse_id": warehouse_id,
            "product_id": product_id,
            "movement_type": "STOCK_IN",
            "quantity": quantity,
            "notes": notes,
        })

        db.session.commit()
        return stock

    except Exception:
        db.session.rollback()
        raise


def remove_stock(data: dict):
    """
    Remove stock from a warehouse (Stock Out).

    Business Rules:
      1. Stock record must exist
      2. Available quantity must be >= requested quantity

    Also logs a STOCK_OUT movement.

    Args:
        data: {warehouse_id, product_id, quantity, notes?}

    Raises:
        NotFoundException: If warehouse or stock doesn't exist
        InsufficientStockException: If not enough stock available

    Returns:
        The updated WarehouseStock instance
    """
    warehouse_id = data["warehouse_id"]
    product_id = data["product_id"]
    quantity = data["quantity"]
    notes = data.get("notes", "")

    # Verify the warehouse exists
    warehouse = warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise NotFoundException("Warehouse", warehouse_id)

    try:
        # Get the stock record
        stock = stock_repo.get_stock_record(warehouse_id, product_id)
        if not stock:
            raise NotFoundException("Stock record", f"warehouse {warehouse_id}, product {product_id}")

        # Check if enough stock is available
        if stock.quantity_available < quantity:
            raise InsufficientStockException(
                product_id=product_id,
                warehouse_id=warehouse_id,
                requested=quantity,
                available=stock.quantity_available
            )

        # Decrease the quantity
        new_quantity = stock.quantity_available - quantity
        stock_repo.update(stock, {"quantity_available": new_quantity})

        # Log the movement
        movement_repo.create({
            "warehouse_id": warehouse_id,
            "product_id": product_id,
            "movement_type": "STOCK_OUT",
            "quantity": quantity,
            "notes": notes,
        })

        db.session.commit()
        return stock

    except (NotFoundException, InsufficientStockException):
        db.session.rollback()
        raise
    except Exception:
        db.session.rollback()
        raise


def transfer_stock(data: dict):
    """
    Transfer stock from one warehouse to another.

    This is the most complex operation — it involves:
      1. Validate source has enough stock
      2. Decrease source warehouse stock
      3. Increase destination warehouse stock
      4. Log TRANSFER_OUT at source
      5. Log TRANSFER_IN at destination

    All 5 operations happen in a SINGLE database transaction.

    Args:
        data: {from_warehouse_id, to_warehouse_id, product_id, quantity, notes?}

    Raises:
        ValidationException: If source == destination
        NotFoundException: If either warehouse or source stock doesn't exist
        InsufficientStockException: If not enough stock at source

    Returns:
        dict with source and destination stock records
    """
    from_warehouse_id = data["from_warehouse_id"]
    to_warehouse_id = data["to_warehouse_id"]
    product_id = data["product_id"]
    quantity = data["quantity"]
    notes = data.get("notes", "")

    # Can't transfer to the same warehouse
    if from_warehouse_id == to_warehouse_id:
        raise ValidationException(
            "Cannot transfer stock to the same warehouse",
            errors={"to_warehouse_id": "Must be different from source warehouse"}
        )

    # Verify both warehouses exist
    from_warehouse = warehouse_repo.get_by_id(from_warehouse_id)
    if not from_warehouse:
        raise NotFoundException("Source warehouse", from_warehouse_id)

    to_warehouse = warehouse_repo.get_by_id(to_warehouse_id)
    if not to_warehouse:
        raise NotFoundException("Destination warehouse", to_warehouse_id)

    try:
        # --- Step 1: Check source stock ---
        source_stock = stock_repo.get_stock_record(from_warehouse_id, product_id)
        if not source_stock:
            raise NotFoundException(
                "Stock record",
                f"warehouse {from_warehouse_id}, product {product_id}"
            )

        if source_stock.quantity_available < quantity:
            raise InsufficientStockException(
                product_id=product_id,
                warehouse_id=from_warehouse_id,
                requested=quantity,
                available=source_stock.quantity_available
            )

        # --- Step 2: Decrease source stock ---
        new_source_qty = source_stock.quantity_available - quantity
        stock_repo.update(source_stock, {"quantity_available": new_source_qty})

        # --- Step 3: Increase destination stock ---
        dest_stock = stock_repo.get_stock_record(to_warehouse_id, product_id)
        if dest_stock:
            new_dest_qty = dest_stock.quantity_available + quantity
            stock_repo.update(dest_stock, {"quantity_available": new_dest_qty})
        else:
            dest_stock = stock_repo.create({
                "warehouse_id": to_warehouse_id,
                "product_id": product_id,
                "quantity_available": quantity,
            })

        # --- Step 4: Log TRANSFER_OUT at source ---
        movement_repo.create({
            "warehouse_id": from_warehouse_id,
            "product_id": product_id,
            "movement_type": "TRANSFER_OUT",
            "quantity": quantity,
            "notes": notes,
        })

        # --- Step 5: Log TRANSFER_IN at destination ---
        movement_repo.create({
            "warehouse_id": to_warehouse_id,
            "product_id": product_id,
            "movement_type": "TRANSFER_IN",
            "quantity": quantity,
            "notes": notes,
        })

        db.session.commit()

        return {
            "source_stock": source_stock,
            "destination_stock": dest_stock,
        }

    except (NotFoundException, InsufficientStockException, ValidationException):
        db.session.rollback()
        raise
    except Exception:
        db.session.rollback()
        raise
