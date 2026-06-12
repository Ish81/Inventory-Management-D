import os
from app import create_app, db
from app.module2_inventory.models import Warehouse, WarehouseStock, InventoryMovement
from datetime import datetime, timedelta
import random

app = create_app()

def seed_database():
    with app.app_context():
        # Check if we already have warehouses to avoid duplicates
        if Warehouse.query.count() > 0:
            print("Database already contains data. Clearing old data...")
            InventoryMovement.query.delete()
            WarehouseStock.query.delete()
            Warehouse.query.delete()
            db.session.commit()

        print("Seeding dummy data...")

        # 1. Create Warehouses
        warehouses_data = [
            {"name": "Central Hub", "code": "WH-CEN-001", "location": "New York, NY", "manager": "John Doe", "capacity": 50000},
            {"name": "West Coast Facility", "code": "WH-WST-002", "location": "Los Angeles, CA", "manager": "Jane Smith", "capacity": 25000},
            {"name": "Midwest Distribution", "code": "WH-MID-003", "location": "Chicago, IL", "manager": "Bob Johnson", "capacity": 30000},
            {"name": "South Regional", "code": "WH-SOU-004", "location": "Atlanta, GA", "manager": "Alice Davis", "capacity": 15000},
            {"name": "North Annex", "code": "WH-NOR-005", "location": "Seattle, WA", "manager": "Charlie Brown", "capacity": 10000},
        ]

        warehouses = []
        for w_data in warehouses_data:
            wh = Warehouse(
                warehouse_name=w_data["name"],
                warehouse_code=w_data["code"],
                location=w_data["location"],
                manager_name=w_data["manager"],
                capacity=w_data["capacity"],
                status="active"
            )
            db.session.add(wh)
            warehouses.append(wh)
        
        db.session.commit()
        print(f"Created {len(warehouses)} warehouses.")

        # 2. Add Stock
        # Assume product IDs are 1 to 20
        stock_records = []
        for wh in warehouses:
            num_products = random.randint(5, 15)
            products = random.sample(range(1, 21), num_products)
            
            for prod_id in products:
                qty_avail = random.randint(50, 1000)
                reorder = random.randint(20, 100)
                
                # Make some items low stock
                if random.random() < 0.2:
                    qty_avail = random.randint(0, reorder)

                stock = WarehouseStock(
                    warehouse_id=wh.warehouse_id,
                    product_id=prod_id,
                    quantity_available=qty_avail,
                    quantity_reserved=random.randint(0, int(qty_avail * 0.2)),
                    reorder_level=reorder
                )
                db.session.add(stock)
                stock_records.append(stock)
                
        db.session.commit()
        print(f"Added {len(stock_records)} stock records.")

        # 3. Create Inventory Movements (History)
        now = datetime.utcnow()
        movement_types = ['STOCK_IN', 'STOCK_OUT', 'TRANSFER_IN', 'TRANSFER_OUT']
        
        movements_count = 0
        for stock in stock_records:
            num_movements = random.randint(1, 5)
            for _ in range(num_movements):
                m_type = random.choice(movement_types)
                qty = random.randint(10, 100)
                
                # Randomize date within the last 30 days
                days_ago = random.randint(0, 30)
                hours_ago = random.randint(0, 23)
                m_date = now - timedelta(days=days_ago, hours=hours_ago)
                
                notes = "Initial stock" if m_type == 'STOCK_IN' else "Routine movement"
                
                mov = InventoryMovement(
                    warehouse_id=stock.warehouse_id,
                    product_id=stock.product_id,
                    movement_type=m_type,
                    quantity=qty,
                    notes=notes
                )
                # Override created_at after adding to session
                db.session.add(mov)
                mov.created_at = m_date
                movements_count += 1
                
        db.session.commit()
        print(f"Generated {movements_count} movement logs.")
        print("Done!")

if __name__ == '__main__':
    seed_database()
