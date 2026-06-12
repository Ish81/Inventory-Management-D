from datetime import datetime
from app.core.database.db import db
from sqlalchemy import UniqueConstraint

class WarehouseStock(db.Model):
    """
    WarehouseStock Model
    Represents the inventory of a specific product in a specific warehouse.
    """
    __tablename__ = 'warehouse_stock'

    stock_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.warehouse_id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False) # Will eventually be FK to products
    quantity_available = db.Column(db.Integer, nullable=False, default=0)
    quantity_reserved = db.Column(db.Integer, nullable=False, default=0)
    reorder_level = db.Column(db.Integer, default=10)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('warehouse_id', 'product_id', name='uq_warehouse_product'),
    )

    # Relationships
    warehouse = db.relationship('Warehouse', back_populates='stocks')

    def __repr__(self):
        return f"<WarehouseStock w:{self.warehouse_id} p:{self.product_id} qty:{self.quantity_available}>"
