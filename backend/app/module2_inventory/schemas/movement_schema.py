"""
movement_schema.py — Marshmallow Schema for Inventory Movements
=================================================================

Movements are READ-ONLY records. They are created automatically when
stock is added, removed, or transferred. There's no "create movement"
endpoint — movements are logged by the stock service.

This schema is only used for SERIALIZATION (model → JSON for responses).
"""

from marshmallow import Schema, fields


class InventoryMovementSchema(Schema):
    """
    Serialization schema — converts an InventoryMovement model → JSON.

    Used when returning movement history in API responses.
    """
    movement_id = fields.Integer(dump_only=True)
    warehouse_id = fields.Integer()
    product_id = fields.Integer()
    movement_type = fields.String()
    quantity = fields.Integer()
    reference_type = fields.String()
    reference_id = fields.Integer()
    notes = fields.String()
    created_at = fields.DateTime()
