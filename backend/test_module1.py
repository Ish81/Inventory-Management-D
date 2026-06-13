"""
test_module1.py - Module 1 (Products & Suppliers) Test Suite
=============================================================
Usage:
    cd backend
    .\\venv\\Scripts\\activate
    python test_module1.py
"""

import json
from app import create_app
from app.core.database.db import db
from sqlalchemy import text

passed = 0
failed = 0

def check(test_name, condition, detail=""):
    global passed, failed
    if condition:
        passed += 1
        status = "[PASS]"
    else:
        failed += 1
        status = "[FAIL]"
    print(f"  {status} {test_name}")
    if detail and not condition:
        print(f"         -> {detail}")

def test_module1():
    global passed, failed

    print("\n======================================================================")
    print("  MODULE 1 -- Products, Categories & Suppliers Tests")
    print("======================================================================\n")

    app = create_app("development")
    client = app.test_client()

    with app.app_context():
        # Clean up database
        db.session.execute(text("DROP SCHEMA public CASCADE; CREATE SCHEMA public;"))
        db.session.commit()
        db.create_all()

    # --- CATEGORIES ---
    print("\n-- Categories CRUD --")
    
    # Create category
    resp = client.post("/api/v1/categories",
        data=json.dumps({"name": "Electronics", "description": "Electronic items"}),
        content_type="application/json"
    )
    data = resp.get_json()
    check("POST /categories -> 201", resp.status_code == 201)
    check("Category created", data.get("success") == True)
    cat_id = data.get("data", {}).get("id")

    # Missing name
    resp = client.post("/api/v1/categories",
        data=json.dumps({"description": "No name"}),
        content_type="application/json"
    )
    check("POST /categories missing name -> 400", resp.status_code == 400)

    # Get categories
    resp = client.get("/api/v1/categories")
    data = resp.get_json()
    check("GET /categories -> 200", resp.status_code == 200)
    check("Categories list length", len(data.get("data", [])) == 1)

    # Update category
    resp = client.put(f"/api/v1/categories/{cat_id}",
        data=json.dumps({"name": "Electronics Updated"}),
        content_type="application/json"
    )
    check("PUT /categories/<id> -> 200", resp.status_code == 200)
    check("Category name updated", resp.get_json().get("data", {}).get("name") == "Electronics Updated")

    # --- SUPPLIERS ---
    print("\n-- Suppliers CRUD --")

    # Create supplier
    resp = client.post("/api/v1/suppliers",
        data=json.dumps({
            "name": "Global Tech",
            "email": "contact@globaltech.com",
            "phone": "1234567890",
            "contact_person": "Jane Doe"
        }),
        content_type="application/json"
    )
    data = resp.get_json()
    check("POST /suppliers -> 201", resp.status_code == 201)
    check("Supplier created", data.get("success") == True)
    sup_id = data.get("data", {}).get("id")

    # Missing email
    resp = client.post("/api/v1/suppliers",
        data=json.dumps({"name": "No Email"}),
        content_type="application/json"
    )
    check("POST /suppliers missing email -> 400", resp.status_code == 400)

    # Get suppliers
    resp = client.get("/api/v1/suppliers")
    data = resp.get_json()
    check("GET /suppliers -> 200", resp.status_code == 200)
    check("Suppliers list length", len(data.get("data", [])) == 1)

    # Update supplier
    resp = client.put(f"/api/v1/suppliers/{sup_id}",
        data=json.dumps({"phone": "0987654321"}),
        content_type="application/json"
    )
    check("PUT /suppliers/<id> -> 200", resp.status_code == 200)
    check("Supplier phone updated", resp.get_json().get("data", {}).get("phone") == "0987654321")

    # --- PRODUCTS ---
    print("\n-- Products CRUD --")

    # Create product
    resp = client.post("/api/v1/products",
        data=json.dumps({
            "name": "Smartphone X",
            "sku": "SM-X-001",
            "price": 699.99,
            "category_id": cat_id,
            "supplier_id": sup_id,
            "reorder_level": 50
        }),
        content_type="application/json"
    )
    data = resp.get_json()
    check("POST /products -> 201", resp.status_code == 201)
    check("Product created", data.get("success") == True)
    prod_id = data.get("data", {}).get("id")

    # Create missing category error check (optional, let's see if standard constraint works)

    # Get products
    resp = client.get("/api/v1/products")
    data = resp.get_json()
    check("GET /products -> 200", resp.status_code == 200)
    check("Products list length", len(data.get("data", [])) == 1)

    # Search products
    resp = client.get("/api/v1/products?search=Smartphone")
    data = resp.get_json()
    check("GET /products?search=Smartphone -> 1 result", len(data.get("data", [])) == 1)

    # Update product
    resp = client.put(f"/api/v1/products/{prod_id}",
        data=json.dumps({"price": 749.99}),
        content_type="application/json"
    )
    check("PUT /products/<id> -> 200", resp.status_code == 200)
    check("Product price updated", resp.get_json().get("data", {}).get("price") == 749.99)

    # --- DASHBOARD ---
    print("\n-- Dashboard API --")
    resp = client.get("/api/v1/products/dashboard")
    data = resp.get_json()
    check("GET /products/dashboard -> 200", resp.status_code == 200)
    stats = data.get("data", {})
    check("Dashboard has total_products", "total_products" in stats)
    check("Dashboard has total_categories", "total_categories" in stats)
    check("Dashboard has total_suppliers", "total_suppliers" in stats)

    # --- DELETIONS ---
    print("\n-- Deletions --")
    resp = client.delete(f"/api/v1/products/{prod_id}")
    check("DELETE /products/<id> -> 200", resp.status_code == 200)

    resp = client.delete(f"/api/v1/categories/{cat_id}")
    check("DELETE /categories/<id> -> 200", resp.status_code == 200)

    resp = client.delete(f"/api/v1/suppliers/{sup_id}")
    check("DELETE /suppliers/<id> -> 200", resp.status_code == 200)

    print("\n======================================================================")
    total = passed + failed
    if failed == 0:
        print(f"  ALL {total} TESTS PASSED FOR MODULE 1!")
    else:
        print(f"  {passed}/{total} tests passed, {failed} FAILED")
    print("======================================================================\n")

if __name__ == "__main__":
    test_module1()
