"""
warehouse_schema.py — Marshmallow Schemas for Warehouse
=========================================================

WHAT ARE SCHEMAS?
Schemas do two jobs:
  1. VALIDATION (incoming): Check if the data the client sent is valid
     "Did they provide a warehouse_name? Is it a string? Is it under 100 chars?"

  2. SERIALIZATION (outgoing): Convert a Python Warehouse object → JSON dict
     The API can't return a Python object. It must return JSON.

WHY SEPARATE SCHEMAS?
  - WarehouseSchema:        For serializing responses (full object → JSON)
  - CreateWarehouseSchema:  For validating POST /warehouses body
  - UpdateWarehouseSchema:  For validating PUT /warehouses/:id body

The Create and Update schemas have different rules:
  - Create: warehouse_name is REQUIRED
  - Update: warehouse_name is OPTIONAL (only update what's sent)
"""

from marshmallow import Schema, fields, validate, validates, ValidationError


class WarehouseSchema(Schema):
    """
    Serialization schema — converts a Warehouse model → JSON.

    Used when RETURNING data to the client.
    Every field listed here will appear in the API response.
    """
    warehouse_id = fields.Integer(dump_only=True)
    warehouse_name = fields.String()
    warehouse_code = fields.String()
    location = fields.String()
    address = fields.String()
    manager_name = fields.String()
    contact_number = fields.String()
    capacity = fields.Integer()
    status = fields.String()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class CreateWarehouseSchema(Schema):
    """
    Validation schema for POST /warehouses.

    Required fields: warehouse_name, warehouse_code, location
    Optional fields: address, manager_name, contact_number, capacity, status
    """
    warehouse_name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=100, error="Must be 1-100 characters")
    )
    warehouse_code = fields.String(
        required=True,
        validate=validate.Length(min=1, max=20, error="Must be 1-20 characters")
    )
    location = fields.String(
        required=True,
        validate=validate.Length(min=1, max=100, error="Must be 1-100 characters")
    )
    address = fields.String(
        validate=validate.Length(max=500, error="Must be 500 characters or less")
    )
    manager_name = fields.String(
        validate=validate.Length(max=100, error="Must be 100 characters or less")
    )
    contact_number = fields.String(
        validate=validate.Length(max=20, error="Must be 20 characters or less")
    )
    capacity = fields.Integer(
        validate=validate.Range(min=0, error="Capacity must be 0 or greater")
    )
    status = fields.String(
        validate=validate.OneOf(
            ["active", "inactive", "maintenance"],
            error="Status must be one of: active, inactive, maintenance"
        )
    )


class UpdateWarehouseSchema(Schema):
    """
    Validation schema for PUT /warehouses/:id.

    All fields are optional — only update what's provided.
    At least one field must be present (checked in the controller).
    """
    warehouse_name = fields.String(
        validate=validate.Length(min=1, max=100, error="Must be 1-100 characters")
    )
    warehouse_code = fields.String(
        validate=validate.Length(min=1, max=20, error="Must be 1-20 characters")
    )
    location = fields.String(
        validate=validate.Length(min=1, max=100, error="Must be 1-100 characters")
    )
    address = fields.String(
        validate=validate.Length(max=500, error="Must be 500 characters or less")
    )
    manager_name = fields.String(
        validate=validate.Length(max=100, error="Must be 100 characters or less")
    )
    contact_number = fields.String(
        validate=validate.Length(max=20, error="Must be 20 characters or less")
    )
    capacity = fields.Integer(
        validate=validate.Range(min=0, error="Capacity must be 0 or greater")
    )
    status = fields.String(
        validate=validate.OneOf(
            ["active", "inactive", "maintenance"],
            error="Status must be one of: active, inactive, maintenance"
        )
    )
