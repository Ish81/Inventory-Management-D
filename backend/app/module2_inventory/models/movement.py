from datetime import datetime
from app.core.database.db import db

class InventoryMovement(db.Model):
    """
    InventoryMovement Model
    Records all movements (in/out/transfers/adjustments) of stock.
    """
    __tablename__ = 'inventory_movements'

    movement_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.warehouse_id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    movement_type = db.Column(db.String(20), nullable=False) # e.g. STOCK_IN, STOCK_OUT, TRANSFER_IN, TRANSFER_OUT, ADJUSTMENT
    quantity = db.Column(db.Integer, nullable=False)
    reference_type = db.Column(db.String(50), nullable=True) # e.g. PURCHASE_ORDER, SALES_ORDER
    reference_id = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    warehouse = db.relationship('Warehouse', back_populates='movements')

    def __repr__(self):
        return f"<InventoryMovement {self.movement_type} w:{self.warehouse_id} p:{self.product_id} qty:{self.quantity}>"
