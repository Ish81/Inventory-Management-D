"""
stock_schema.py — Marshmallow Schemas for Warehouse Stock
============================================================

These schemas validate incoming stock operations:
  - StockAddSchema:      Validate POST /stock/add
  - StockRemoveSchema:   Validate POST /stock/remove
  - StockTransferSchema: Validate POST /stock/transfer
  - WarehouseStockSchema: Serialize stock records for API responses
"""

from marshmallow import Schema, fields, validate


class WarehouseStockSchema(Schema):
    """
    Serialization schema — converts a WarehouseStock model → JSON.
    Used when returning stock data in API responses.
    """
    stock_id = fields.Integer(dump_only=True)
    warehouse_id = fields.Integer()
    product_id = fields.Integer()
    quantity_available = fields.Integer()
    quantity_reserved = fields.Integer()
    reorder_level = fields.Integer()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class StockAddSchema(Schema):
    """
    Validation schema for POST /stock/add (Stock In).

    Required: warehouse_id, product_id, quantity
    Optional: notes
    """
    warehouse_id = fields.Integer(required=True)
    product_id = fields.Integer(required=True)
    quantity = fields.Integer(
        required=True,
        validate=validate.Range(min=1, error="Quantity must be at least 1")
    )
    notes = fields.String(
        validate=validate.Length(max=500, error="Notes must be 500 characters or less")
    )


class StockRemoveSchema(Schema):
    """
    Validation schema for POST /stock/remove (Stock Out).

    Required: warehouse_id, product_id, quantity
    Optional: notes
    """
    warehouse_id = fields.Integer(required=True)
    product_id = fields.Integer(required=True)
    quantity = fields.Integer(
        required=True,
        validate=validate.Range(min=1, error="Quantity must be at least 1")
    )
    notes = fields.String(
        validate=validate.Length(max=500, error="Notes must be 500 characters or less")
    )


class StockTransferSchema(Schema):
    """
    Validation schema for POST /stock/transfer.

    Moves stock from one warehouse to another.

    Required: from_warehouse_id, to_warehouse_id, product_id, quantity
    Optional: notes
    """
    from_warehouse_id = fields.Integer(required=True)
    to_warehouse_id = fields.Integer(required=True)
    product_id = fields.Integer(required=True)
    quantity = fields.Integer(
        required=True,
        validate=validate.Range(min=1, error="Quantity must be at least 1")
    )
    notes = fields.String(
        validate=validate.Length(max=500, error="Notes must be 500 characters or less")
    )
