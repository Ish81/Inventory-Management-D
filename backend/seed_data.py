import os
import random
from datetime import datetime, timedelta, timezone
from app import create_app
from app.core.database.db import db

# Module 1
from app.modules.module1_products.models import Category, Supplier, Product
# Module 2
from app.module2_inventory.models import Warehouse, WarehouseStock, InventoryMovement
# Module 3
from app.modules.module3_orders.models import PurchaseOrder, PurchaseOrderItem, SalesOrder, SalesOrderItem
# Module 4
from app.modules.module4_auth.services import hash_password

app = create_app("development")

def seed_auth():
    print("Seeding Module 4: Auth (Roles & Users)...")
    conn = db.engine.raw_connection()
    try:
        with conn.cursor() as cur:
            # Clear old
            cur.execute("DELETE FROM users CASCADE;")
            cur.execute("DELETE FROM roles CASCADE;")
            
            # Roles
            roles_data = [('Admin',), ('Manager',), ('Staff',)]
            cur.executemany("INSERT INTO roles (name) VALUES (%s) RETURNING id;", roles_data)
            
            cur.execute("SELECT id, name FROM roles;")
            roles = cur.fetchall()
            # Fetchall returns tuples in raw psycopg2 connection, wait, let's use dictionary cursor or just index
            # Roles is a list of tuples: [(id, 'Admin'), ...]
            role_map = {r[1]: r[0] for r in roles}
            
            # Users
            pw_hash = hash_password('password123')
            users_data = [
                ('admin@smartims.com', pw_hash, role_map['Admin']),
                ('manager@smartims.com', pw_hash, role_map['Manager']),
                ('staff@smartims.com', pw_hash, role_map['Staff'])
            ]
            cur.executemany("INSERT INTO users (email, password_hash, role_id) VALUES (%s, %s, %s);", users_data)
            
            conn.commit()
            print("  Created Admin, Manager, and Staff roles & users.")
    except Exception as e:
        conn.rollback()
        print("  Error seeding auth:", e)
    finally:
        conn.close()

def seed_database():
    with app.app_context():
        # Clear SQLAlchemy tables
        print("Clearing Module 1, 2, 3 Data...")
        PurchaseOrderItem.query.delete()
        PurchaseOrder.query.delete()
        SalesOrderItem.query.delete()
        SalesOrder.query.delete()
        InventoryMovement.query.delete()
        WarehouseStock.query.delete()
        Warehouse.query.delete()
        Product.query.delete()
        Category.query.delete()
        Supplier.query.delete()
        db.session.commit()

        seed_auth()

        # ==========================================
        # MODULE 1: Products, Categories, Suppliers
        # ==========================================
        print("Seeding Module 1: Categories & Suppliers...")
        cats = [
            Category(name="Electronics", description="Gadgets and devices"),
            Category(name="Office Supplies", description="Everyday office items"),
            Category(name="Furniture", description="Desks, chairs, etc.")
        ]
        db.session.add_all(cats)
        
        sups = [
            Supplier(name="TechCorp Supplier", email="contact@techcorp.com", phone="555-0100"),
            Supplier(name="Global Furnishings", email="sales@globalfurnish.com", phone="555-0200"),
            Supplier(name="Stationery Direct", email="orders@stationerydirect.com", phone="555-0300")
        ]
        db.session.add_all(sups)
        db.session.commit()

        print("Seeding Module 1: Products...")
        products_data = [
            ("Wireless Mouse", "EL-001", 25.99, cats[0], sups[0]),
            ("Mechanical Keyboard", "EL-002", 89.50, cats[0], sups[0]),
            ("27-inch Monitor", "EL-003", 299.99, cats[0], sups[0]),
            ("Office Chair", "FU-001", 149.00, cats[2], sups[1]),
            ("Standing Desk", "FU-002", 399.00, cats[2], sups[1]),
            ("Gel Pens (12-pack)", "OS-001", 12.50, cats[1], sups[2]),
            ("Printer Paper (Ream)", "OS-002", 8.99, cats[1], sups[2]),
            ("Stapler", "OS-003", 15.00, cats[1], sups[2])
        ]
        
        products = []
        for name, sku, price, cat, sup in products_data:
            p = Product(name=name, sku=sku, price=price, category_id=cat.id, supplier_id=sup.id, reorder_level=random.randint(10, 50))
            db.session.add(p)
            products.append(p)
        db.session.commit()

        # ==========================================
        # MODULE 2: Inventory & Warehouses
        # ==========================================
        print("Seeding Module 2: Warehouses & Stock...")
        warehouses_data = [
            {"name": "Central Hub", "code": "WH-CEN-001", "location": "New York, NY", "capacity": 50000},
            {"name": "West Coast Facility", "code": "WH-WST-002", "location": "Los Angeles, CA", "capacity": 25000}
        ]
        
        warehouses = []
        for w in warehouses_data:
            wh = Warehouse(warehouse_name=w["name"], warehouse_code=w["code"], location=w["location"], manager_name="John Doe", capacity=w["capacity"], status="active")
            db.session.add(wh)
            warehouses.append(wh)
        db.session.commit()

        stock_records = []
        now = datetime.now(timezone.utc)
        for wh in warehouses:
            for p in products:
                qty = random.randint(20, 200)
                stock = WarehouseStock(warehouse_id=wh.warehouse_id, product_id=p.id, quantity_available=qty, quantity_reserved=random.randint(0, int(qty * 0.1)), reorder_level=p.reorder_level)
                db.session.add(stock)
                stock_records.append(stock)
                
                # Create movement history
                mov = InventoryMovement(warehouse_id=wh.warehouse_id, product_id=p.id, movement_type="STOCK_IN", quantity=qty, notes="Initial stock setup")
                db.session.add(mov)
                mov.created_at = now - timedelta(days=random.randint(1, 10))
                
        db.session.commit()

        # ==========================================
        # MODULE 3: Orders
        # ==========================================
        print("Seeding Module 3: Purchase & Sales Orders...")
        po_statuses = ['draft', 'pending', 'approved', 'received']
        so_statuses = ['draft', 'confirmed', 'processing', 'dispatched', 'completed']
        
        # 3 Purchase Orders
        for i in range(3):
            sup = random.choice(sups)
            po = PurchaseOrder(
                po_number=f"PO-20240615-A{i}F{random.randint(10,99)}",
                supplier_id=sup.id,
                supplier_name=sup.name,
                status=random.choice(po_statuses),
                total_amount=0
            )
            db.session.add(po)
            db.session.flush()
            
            total = 0
            for _ in range(random.randint(1, 4)):
                p = random.choice(products)
                qty = random.randint(10, 50)
                unit_price = float(p.price) * 0.8 # Supplier price
                line_total = qty * unit_price
                total += line_total
                
                item = PurchaseOrderItem(
                    purchase_order_id=po.id,
                    product_id=p.id,
                    product_name=p.name,
                    product_sku=p.sku,
                    quantity=qty,
                    unit_price=unit_price,
                    total_price=line_total
                )
                db.session.add(item)
            po.total_amount = total
            
        # 3 Sales Orders
        for i in range(3):
            so = SalesOrder(
                so_number=f"SO-20240615-B{i}K{random.randint(10,99)}",
                customer_name=f"Customer {i+1}",
                customer_email=f"customer{i+1}@example.com",
                status=random.choice(so_statuses),
                total_amount=0
            )
            db.session.add(so)
            db.session.flush()
            
            total = 0
            for _ in range(random.randint(1, 3)):
                p = random.choice(products)
                qty = random.randint(1, 5)
                line_total = qty * float(p.price)
                total += line_total
                
                item = SalesOrderItem(
                    sales_order_id=so.id,
                    product_id=p.id,
                    product_name=p.name,
                    product_sku=p.sku,
                    quantity=qty,
                    unit_price=p.price,
                    total_price=line_total
                )
                db.session.add(item)
            so.total_amount = total
            
        db.session.commit()
        print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
