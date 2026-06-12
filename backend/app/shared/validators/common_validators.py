"""
app/shared/validators/common_validators.py — Shared Validation Helpers
========================================================================

WHAT IS THIS FILE?
Generic validation functions that any module can use.
These check common things like "is this a valid phone number?"
or "is this string too long?"

MODULE-SPECIFIC validation (like "does this warehouse exist?")
goes in the module's schema or service layer, NOT here.
"""


def validate_phone_number(phone: str) -> bool:
    """
    Check if a phone number is in a reasonable format.

    Accepts: +91-1234567890, (555) 123-4567, 1234567890
    This is a basic check — not a full phone number validator.

    Args:
        phone: The phone number string to validate

    Returns:
        True if the phone number looks reasonable, False otherwise
    """
    if not phone:
        return True  # Phone is optional

    # Remove common formatting characters
    cleaned = phone.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").replace("+", "")

    # Should be 7-15 digits
    return cleaned.isdigit() and 7 <= len(cleaned) <= 15


def validate_positive_integer(value, field_name: str = "value") -> tuple:
    """
    Validate that a value is a positive integer.

    Args:
        value: The value to validate
        field_name: Name of the field (for error messages)

    Returns:
        tuple: (is_valid: bool, error_message: str or None)

    Usage:
        is_valid, error = validate_positive_integer(capacity, "capacity")
        if not is_valid:
            raise ValidationException(errors={"capacity": error})
    """
    if value is None:
        return False, f"{field_name} is required"

    try:
        int_value = int(value)
        if int_value < 0:
            return False, f"{field_name} must be a positive number"
        return True, None
    except (ValueError, TypeError):
        return False, f"{field_name} must be a valid number"


def validate_required_string(value: str, field_name: str, max_length: int = 255) -> tuple:
    """
    Validate that a string is not empty and within max length.

    Args:
        value: The string to validate
        field_name: Name of the field (for error messages)
        max_length: Maximum allowed length

    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    """
    if not value or not value.strip():
        return False, f"{field_name} is required"

    if len(value.strip()) > max_length:
        return False, f"{field_name} must be {max_length} characters or less"

    return True, None
