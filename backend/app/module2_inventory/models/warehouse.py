from datetime import datetime
from app.core.database.db import db

class Warehouse(db.Model):
    """
    Warehouse Model
    Represents a physical warehouse where inventory is stored.
    """
    __tablename__ = 'warehouses'

    warehouse_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    warehouse_name = db.Column(db.String(100), nullable=False)
    warehouse_code = db.Column(db.String(20), nullable=False, unique=True)
    location = db.Column(db.String(100), nullable=False)
    address = db.Column(db.Text, nullable=True)
    manager_name = db.Column(db.String(100), nullable=True)
    contact_number = db.Column(db.String(20), nullable=True)
    capacity = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='active')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    stocks = db.relationship('WarehouseStock', back_populates='warehouse', cascade='all, delete-orphan')
    movements = db.relationship('InventoryMovement', back_populates='warehouse', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Warehouse {self.warehouse_code} - {self.warehouse_name}>"
