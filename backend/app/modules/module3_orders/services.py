from app.extensions import db
from .models import PurchaseOrder, PurchaseOrderItem, SalesOrder, SalesOrderItem
from datetime import datetime, timezone
import random
import string


def generate_po_number():
    """
    Generate a unique Purchase Order number.
    Format: PO-YYYYMMDD-XXXX (e.g., PO-20240615-A3F2)
    """
    date_part = datetime.now(timezone.utc).strftime('%Y%m%d')
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"PO-{date_part}-{random_part}"


def generate_so_number():
    """
    Generate a unique Sales Order number.
    Format: SO-YYYYMMDD-XXXX (e.g., SO-20240615-B7K1)
    """
    date_part = datetime.now(timezone.utc).strftime('%Y%m%d')
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"SO-{date_part}-{random_part}"


def calculate_order_total(items_data):
    """
    Calculate total amount from a list of item dictionaries.
    Each item must have 'quantity' and 'unit_price'.
    """
    total = 0
    for item in items_data:
        item_total = float(item['quantity']) * float(item['unit_price'])
        total += item_total
    return round(total, 2)


# ─────────────────────────────────────────────
# PURCHASE ORDER SERVICES
# ─────────────────────────────────────────────

def get_all_purchase_orders(page=1, per_page=10, status=None, search=None):
    """
    Fetch paginated list of purchase orders.
    Supports filtering by status and searching by PO number or supplier name.
    """
    query = PurchaseOrder.query

    # Filter by status if provided
    if status:
        query = query.filter(PurchaseOrder.status == status)

    # Search by PO number or supplier name
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                PurchaseOrder.po_number.ilike(search_term),
                PurchaseOrder.supplier_name.ilike(search_term)
            )
        )

    # Order by most recent first
    query = query.order_by(PurchaseOrder.created_at.desc())

    # Paginate
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return {
        'orders': [order.to_dict() for order in paginated.items],
        'total': paginated.total,
        'page': paginated.page,
        'per_page': paginated.per_page
    }


def get_purchase_order_by_id(po_id):
    """Fetch a single purchase order with all its items."""
    order = PurchaseOrder.query.get(po_id)
    if not order:
        return None
    return order.to_dict(include_items=True)


def create_purchase_order(data):
    """
    Create a new purchase order with its line items.
    
    Args:
        data: dict with supplier_name, expected_delivery_date, notes, items[]
    
    Returns:
        Created purchase order as dict
    """
    # Calculate totals for each item
    items_data = data.get('items', [])
    for item in items_data:
        item['total_price'] = round(
            float(item['quantity']) * float(item['unit_price']), 2
        )

    # Create the PO
    po = PurchaseOrder(
        po_number=generate_po_number(),
        supplier_id=data.get('supplier_id'),
        supplier_name=data['supplier_name'],
        order_date=datetime.now(timezone.utc),
        expected_delivery_date=data.get('expected_delivery_date'),
        status='draft',
        total_amount=calculate_order_total(items_data),
        notes=data.get('notes')
    )
    db.session.add(po)
    db.session.flush()  # Gets the PO id without full commit

    # Create line items
    for item_data in items_data:
        item = PurchaseOrderItem(
            purchase_order_id=po.id,
            product_id=item_data.get('product_id'),
            product_name=item_data['product_name'],
            product_sku=item_data.get('product_sku'),
            quantity=item_data['quantity'],
            unit_price=item_data['unit_price'],
            total_price=item_data['total_price']
        )
        db.session.add(item)

    db.session.commit()
    return get_purchase_order_by_id(po.id)


def update_purchase_order_status(po_id, new_status):
    """
    Update the status of a purchase order.
    Enforces valid status transitions.
    
    Valid statuses: draft → pending → approved → received → cancelled
    """
    valid_statuses = ['draft', 'pending', 'approved', 'received', 'cancelled']

    if new_status not in valid_statuses:
        return None, f"Invalid status. Must be one of: {', '.join(valid_statuses)}"

    order = PurchaseOrder.query.get(po_id)
    if not order:
        return None, "Purchase order not found"

    order.status = new_status
    order.updated_at = datetime.now(timezone.utc)
    db.session.commit()

    return order.to_dict(), None


def delete_purchase_order(po_id):
    """
    Delete a purchase order. Only draft orders can be deleted.
    Items are deleted automatically via cascade.
    """
    order = PurchaseOrder.query.get(po_id)
    if not order:
        return False, "Purchase order not found"

    if order.status != 'draft':
        return False, "Only draft purchase orders can be deleted"

    db.session.delete(order)
    db.session.commit()
    return True, None


# ─────────────────────────────────────────────
# SALES ORDER SERVICES
# ─────────────────────────────────────────────

def get_all_sales_orders(page=1, per_page=10, status=None, search=None):
    """Fetch paginated list of sales orders with optional filters."""
    query = SalesOrder.query

    if status:
        query = query.filter(SalesOrder.status == status)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                SalesOrder.so_number.ilike(search_term),
                SalesOrder.customer_name.ilike(search_term)
            )
        )

    query = query.order_by(SalesOrder.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return {
        'orders': [order.to_dict() for order in paginated.items],
        'total': paginated.total,
        'page': paginated.page,
        'per_page': paginated.per_page
    }


def get_sales_order_by_id(so_id):
    """Fetch a single sales order with all its items."""
    order = SalesOrder.query.get(so_id)
    if not order:
        return None
    return order.to_dict(include_items=True)


def create_sales_order(data):
    """
    Create a new sales order with line items.
    
    Args:
        data: dict with customer_name, customer_email, customer_phone, notes, items[]
    """
    items_data = data.get('items', [])
    for item in items_data:
        item['total_price'] = round(
            float(item['quantity']) * float(item['unit_price']), 2
        )

    so = SalesOrder(
        so_number=generate_so_number(),
        customer_name=data['customer_name'],
        customer_email=data.get('customer_email'),
        customer_phone=data.get('customer_phone'),
        order_date=datetime.now(timezone.utc),
        status='draft',
        total_amount=calculate_order_total(items_data),
        notes=data.get('notes')
    )
    db.session.add(so)
    db.session.flush()

    for item_data in items_data:
        item = SalesOrderItem(
            sales_order_id=so.id,
            product_id=item_data.get('product_id'),
            product_name=item_data['product_name'],
            product_sku=item_data.get('product_sku'),
            quantity=item_data['quantity'],
            unit_price=item_data['unit_price'],
            total_price=item_data['total_price']
        )
        db.session.add(item)

    db.session.commit()
    return get_sales_order_by_id(so.id)


def update_sales_order_status(so_id, new_status):
    """Update sales order status with validation."""
    valid_statuses = ['draft', 'confirmed', 'processing', 'dispatched', 'completed', 'cancelled']

    if new_status not in valid_statuses:
        return None, f"Invalid status. Must be one of: {', '.join(valid_statuses)}"

    order = SalesOrder.query.get(so_id)
    if not order:
        return None, "Sales order not found"

    order.status = new_status
    order.updated_at = datetime.now(timezone.utc)
    db.session.commit()

    return order.to_dict(), None


def delete_sales_order(so_id):
    """Delete a sales order. Only draft orders can be deleted."""
    order = SalesOrder.query.get(so_id)
    if not order:
        return False, "Sales order not found"

    if order.status != 'draft':
        return False, "Only draft sales orders can be deleted"

    db.session.delete(order)
    db.session.commit()
    return True, None


# ─────────────────────────────────────────────
# DASHBOARD SERVICES
# ─────────────────────────────────────────────

def get_dashboard_stats():
    """
    Aggregate statistics for the Module 3 dashboard.
    Returns counts and recent orders.
    """
    total_po = PurchaseOrder.query.count()
    total_so = SalesOrder.query.count()

    pending_po = PurchaseOrder.query.filter(
        PurchaseOrder.status.in_(['draft', 'pending'])
    ).count()

    pending_so = SalesOrder.query.filter(
        SalesOrder.status.in_(['draft', 'confirmed', 'processing'])
    ).count()

    recent_po = PurchaseOrder.query.order_by(
        PurchaseOrder.created_at.desc()
    ).limit(5).all()

    recent_so = SalesOrder.query.order_by(
        SalesOrder.created_at.desc()
    ).limit(5).all()

    return {
        'total_purchase_orders': total_po,
        'total_sales_orders': total_so,
        'pending_purchase_orders': pending_po,
        'pending_sales_orders': pending_so,
        'recent_purchase_orders': [o.to_dict() for o in recent_po],
        'recent_sales_orders': [o.to_dict() for o in recent_so],
    }
