"""
app/shared/helpers/utils.py — Shared Utility Functions
========================================================

WHAT IS THIS FILE?
A collection of small, reusable helper functions used across the app.
These are "tools in the toolbox" that any module can use.

RULE: Functions here must be GENERIC (not specific to any module).
If a function is only useful for warehouses, it goes in the warehouse service.
"""

from datetime import datetime, timezone


def get_current_timestamp() -> datetime:
    """
    Get the current UTC timestamp.

    WHY UTC?
    Your team might be in different time zones. If everyone uses UTC,
    there's no confusion. The frontend converts UTC to local time.

    Usage:
        from app.shared.helpers.utils import get_current_timestamp
        created_at = get_current_timestamp()
    """
    return datetime.now(timezone.utc)


def generate_warehouse_code(name: str, sequence: int) -> str:
    """
    Generate a warehouse code from the name and a sequence number.

    Example:
        generate_warehouse_code("Main Warehouse", 1)  → "WH-MAIN-001"
        generate_warehouse_code("Delhi Hub", 15)       → "WH-DELH-015"

    Args:
        name: The warehouse name
        sequence: A sequential number

    Returns:
        A formatted warehouse code like "WH-XXXX-NNN"
    """
    # Take first 4 characters of the name, uppercase
    prefix = name.replace(" ", "")[:4].upper()
    return f"WH-{prefix}-{sequence:03d}"


def format_pagination_params(args: dict) -> tuple:
    """
    Extract and validate pagination parameters from request query args.

    The frontend sends:  GET /warehouses?page=2&per_page=20
    This function extracts page and per_page with safe defaults.

    Args:
        args: Flask request.args dictionary

    Returns:
        tuple: (page, per_page) with validated values

    Usage:
        page, per_page = format_pagination_params(request.args)
    """
    try:
        page = max(1, int(args.get("page", 1)))
    except (ValueError, TypeError):
        page = 1

    try:
        per_page = min(100, max(1, int(args.get("per_page", 20))))
    except (ValueError, TypeError):
        per_page = 20

    return page, per_page
