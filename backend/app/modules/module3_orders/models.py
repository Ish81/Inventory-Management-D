from datetime import datetime, timezone
from app.extensions import db


class PurchaseOrder(db.Model):
    """
    Represents a purchase order sent to a supplier.
    
    Future integration:
    - supplier_id will reference module1_products.suppliers table
    - Status changes will trigger inventory updates in module2
    """
    __tablename__ = 'purchase_orders'

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)

    # Order identification
    po_number = db.Column(
        db.String(50),
        unique=True,
        nullable=False,
        index=True  # Index for fast search
    )

    # supplier_id: This column exists now but references a future table.
    # When Module 1 is integrated, this becomes a real ForeignKey.
    supplier_id = db.Column(db.Integer, nullable=True)
    supplier_name = db.Column(db.String(200), nullable=False)

    # Dates
    order_date = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    expected_delivery_date = db.Column(db.DateTime(timezone=True), nullable=True)

    # Status lifecycle: draft → pending → approved → received → cancelled
    status = db.Column(
        db.String(50),
        nullable=False,
        default='draft',
        index=True  # Index because we filter by status often
    )

    # Financial
    total_amount = db.Column(db.Numeric(12, 2), nullable=False, default=0.00)

    # Notes
    notes = db.Column(db.Text, nullable=True)

    # Audit timestamps
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationship: One PO has many PO items
    items = db.relationship(
        'PurchaseOrderItem',
        backref='purchase_order',
        cascade='all, delete-orphan',  # Delete items when PO is deleted
        lazy='dynamic'
    )

    def to_dict(self, include_items=False):
        """Convert model instance to dictionary for JSON response."""
        data = {
            'id': self.id,
            'po_number': self.po_number,
            'supplier_id': self.supplier_id,
            'supplier_name': self.supplier_name,
            'order_date': self.order_date.isoformat() if self.order_date else None,
            'expected_delivery_date': self.expected_delivery_date.isoformat()
                                      if self.expected_delivery_date else None,
            'status': self.status,
            'total_amount': float(self.total_amount),
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_items:
            data['items'] = [item.to_dict() for item in self.items]
        return data

    def __repr__(self):
        return f'<PurchaseOrder {self.po_number} - {self.status}>'


class PurchaseOrderItem(db.Model):
    """
    Individual line items within a purchase order.
    
    Future integration:
    - product_id will reference module1_products.products table
    - quantity received will update module2_inventory stock levels
    """
    __tablename__ = 'purchase_order_items'

    id = db.Column(db.Integer, primary_key=True)

    # Foreign key to parent PO
    purchase_order_id = db.Column(
        db.Integer,
        db.ForeignKey('purchase_orders.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )

    # product_id: placeholder for Module 1 integration
    product_id = db.Column(db.Integer, nullable=True)
    product_name = db.Column(db.String(200), nullable=False)
    product_sku = db.Column(db.String(100), nullable=True)

    # Quantities and pricing
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(12, 2), nullable=False)

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            'id': self.id,
            'purchase_order_id': self.purchase_order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'product_sku': self.product_sku,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'total_price': float(self.total_price),
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<POItem {self.product_name} x{self.quantity}>'


class SalesOrder(db.Model):
    """
    Represents a sales order from a customer.
    
    Future integration:
    - Status 'dispatched' will trigger inventory deduction in module2
    - customer_id may reference a future customers table in module4
    """
    __tablename__ = 'sales_orders'

    id = db.Column(db.Integer, primary_key=True)

    so_number = db.Column(
        db.String(50),
        unique=True,
        nullable=False,
        index=True
    )

    # Customer info (no customer table yet — stored directly)
    customer_name = db.Column(db.String(200), nullable=False)
    customer_email = db.Column(db.String(200), nullable=True)
    customer_phone = db.Column(db.String(50), nullable=True)

    order_date = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    # Status lifecycle: draft → confirmed → processing → dispatched → completed → cancelled
    status = db.Column(
        db.String(50),
        nullable=False,
        default='draft',
        index=True
    )

    total_amount = db.Column(db.Numeric(12, 2), nullable=False, default=0.00)
    notes = db.Column(db.Text, nullable=True)

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    items = db.relationship(
        'SalesOrderItem',
        backref='sales_order',
        cascade='all, delete-orphan',
        lazy='dynamic'
    )

    def to_dict(self, include_items=False):
        data = {
            'id': self.id,
            'so_number': self.so_number,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'order_date': self.order_date.isoformat() if self.order_date else None,
            'status': self.status,
            'total_amount': float(self.total_amount),
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_items:
            data['items'] = [item.to_dict() for item in self.items]
        return data

    def __repr__(self):
        return f'<SalesOrder {self.so_number} - {self.status}>'


class SalesOrderItem(db.Model):
    """Individual line items within a sales order."""
    __tablename__ = 'sales_order_items'

    id = db.Column(db.Integer, primary_key=True)

    sales_order_id = db.Column(
        db.Integer,
        db.ForeignKey('sales_orders.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )

    product_id = db.Column(db.Integer, nullable=True)
    product_name = db.Column(db.String(200), nullable=False)
    product_sku = db.Column(db.String(100), nullable=True)

    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(12, 2), nullable=False)

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            'id': self.id,
            'sales_order_id': self.sales_order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'product_sku': self.product_sku,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'total_price': float(self.total_price),
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    