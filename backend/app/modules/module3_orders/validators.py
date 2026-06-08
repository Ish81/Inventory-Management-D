def validate_purchase_order_data(data):
    """
    Validate incoming purchase order creation data.
    Returns list of error messages (empty list = valid).
    """
    errors = {}

    if not data.get('supplier_name', '').strip():
        errors['supplier_name'] = 'Supplier name is required'

    items = data.get('items', [])
    if not items:
        errors['items'] = 'At least one item is required'
    else:
        item_errors = []
        for i, item in enumerate(items):
            item_err = {}
            if not item.get('product_name', '').strip():
                item_err['product_name'] = 'Product name is required'
            if not item.get('quantity') or int(item.get('quantity', 0)) <= 0:
                item_err['quantity'] = 'Quantity must be greater than 0'
            if not item.get('unit_price') or float(item.get('unit_price', 0)) <= 0:
                item_err['unit_price'] = 'Unit price must be greater than 0'
            if item_err:
                item_errors.append({'index': i, 'errors': item_err})
        if item_errors:
            errors['items'] = item_errors

    return errors


def validate_sales_order_data(data):
    """Validate incoming sales order creation data."""
    errors = {}

    if not data.get('customer_name', '').strip():
        errors['customer_name'] = 'Customer name is required'

    items = data.get('items', [])
    if not items:
        errors['items'] = 'At least one item is required'
    else:
        item_errors = []
        for i, item in enumerate(items):
            item_err = {}
            if not item.get('product_name', '').strip():
                item_err['product_name'] = 'Product name is required'
            if not item.get('quantity') or int(item.get('quantity', 0)) <= 0:
                item_err['quantity'] = 'Quantity must be greater than 0'
            if not item.get('unit_price') or float(item.get('unit_price', 0)) <= 0:
                item_err['unit_price'] = 'Unit price must be greater than 0'
            if item_err:
                item_errors.append({'index': i, 'errors': item_err})
        if item_errors:
            errors['items'] = item_errors

    return errors
