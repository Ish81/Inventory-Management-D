"""
test_progress.py - Full Backend Test Suite (Phase 1 -> Phase 3)
================================================================

Runs all tests without needing pytest or any external test runner.
Uses Flask's built-in test client to simulate real HTTP requests.

Usage:
    cd backend
    .\\venv\\Scripts\\activate
    python test_progress.py
"""

import json
from app import create_app
from app.core.database.db import db
from app.core.exceptions.handlers import (
    NotFoundException, ValidationException,
    DuplicateException, InsufficientStockException
)
from app.shared.responses.api_response import success_response, error_response
from app.shared.helpers.utils import generate_warehouse_code, format_pagination_params, get_current_timestamp
from app.shared.validators.common_validators import validate_phone_number, validate_positive_integer, validate_required_string
import importlib

passed = 0
failed = 0


def check(test_name, condition, detail=""):
    """Helper to track pass/fail counts."""
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


def test_backend():
    global passed, failed

    # ============================================================
    # PHASE 1 -- Project Setup & Infrastructure
    # ============================================================
    print()
    print("=" * 70)
    print("  PHASE 1 -- Project Setup & Infrastructure")
    print("=" * 70)

    # --- Test 1.1: App creation ---
    print("\n-- Test 1.1: Flask App Creation --")
    try:
        app = create_app("development")
        check("Flask app created successfully", app is not None)
    except Exception as e:
        check("Flask app created successfully", False, str(e))
        return

    # --- Test 1.2: Configuration ---
    print("\n-- Test 1.2: Configuration --")
    check("DEBUG is True in development mode", app.config["DEBUG"] == True)
    check("TRACK_MODIFICATIONS is False", app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] == False)
    check("DATABASE_URI is set", "postgresql" in app.config["SQLALCHEMY_DATABASE_URI"])

    # --- Test 1.3: Health check ---
    print("\n-- Test 1.3: Health Check Endpoint --")
    client = app.test_client()
    resp = client.get("/api/v1/health")
    data = resp.get_json()
    check("GET /api/v1/health returns 200", resp.status_code == 200)
    check("Response has status=healthy", data.get("status") == "healthy")
    check("Response has version", data.get("version") is not None)

    # --- Test 1.4: CORS ---
    print("\n-- Test 1.4: CORS Configuration --")
    resp = client.options("/api/v1/health", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    check("OPTIONS preflight returns 200", resp.status_code == 200)

    # --- Test 1.5: Custom Exceptions ---
    print("\n-- Test 1.5: Custom Exceptions --")
    try:
        raise NotFoundException("Warehouse", 42)
    except NotFoundException as e:
        check("NotFoundException message", "42" in e.message and e.status_code == 404)

    try:
        raise DuplicateException("Warehouse", "warehouse_code", "WH-001")
    except DuplicateException as e:
        check("DuplicateException message", "WH-001" in e.message and e.status_code == 409)

    try:
        raise InsufficientStockException(5, 1, 100, 50)
    except InsufficientStockException as e:
        check("InsufficientStockException message", "100" in e.message and e.status_code == 400)

    try:
        raise ValidationException("Bad data", errors={"name": "required"})
    except ValidationException as e:
        check("ValidationException errors dict", e.errors.get("name") == "required" and e.status_code == 422)

    # --- Test 1.6: Shared Utilities ---
    print("\n-- Test 1.6: Shared Utilities --")
    check("generate_warehouse_code('Main Warehouse', 1) == 'WH-MAIN-001'",
          generate_warehouse_code("Main Warehouse", 1) == "WH-MAIN-001")

    ts = get_current_timestamp()
    check("get_current_timestamp returns datetime", ts is not None)

    page, per_page = format_pagination_params({"page": "3", "per_page": "50"})
    check("format_pagination_params parses correctly", page == 3 and per_page == 50)

    page, per_page = format_pagination_params({"page": "-1", "per_page": "999"})
    check("format_pagination_params clamps values", page == 1 and per_page == 100)

    # --- Test 1.7: Validators ---
    print("\n-- Test 1.7: Validators --")
    check("Phone: valid +91-9876543210", validate_phone_number("+91-9876543210") == True)
    check("Phone: empty is OK (optional)", validate_phone_number("") == True)
    check("Phone: invalid 'abc'", validate_phone_number("abc") == False)

    ok, err = validate_positive_integer(100, "qty")
    check("Positive int: 100 is valid", ok == True)
    ok, err = validate_positive_integer(-5, "qty")
    check("Positive int: -5 is invalid", ok == False)

    ok, err = validate_required_string("", "name")
    check("Required string: empty is invalid", ok == False)
    ok, err = validate_required_string("Main", "name")
    check("Required string: 'Main' is valid", ok == True)

    # --- Test 1.8: Module imports ---
    print("\n-- Test 1.8: Module Structure --")
    modules = [
        "app.module2_inventory",
        "app.module2_inventory.models",
        "app.module2_inventory.schemas",
        "app.module2_inventory.repositories",
        "app.module2_inventory.services",
        "app.module2_inventory.controllers",
        "app.module2_inventory.routes",
    ]
    for mod in modules:
        try:
            importlib.import_module(mod)
            check(f"import {mod}", True)
        except Exception as e:
            check(f"import {mod}", False, str(e))

    # ============================================================
    # PHASE 2 -- Database Models & Migration
    # ============================================================
    print()
    print("=" * 70)
    print("  PHASE 2 -- Database Models & Migration")
    print("=" * 70)

    # --- Test 2.1: Models import ---
    print("\n-- Test 2.1: Model Imports --")
    from app.module2_inventory.models import Warehouse, WarehouseStock, InventoryMovement
    check("Warehouse model imported", Warehouse is not None)
    check("WarehouseStock model imported", WarehouseStock is not None)
    check("InventoryMovement model imported", InventoryMovement is not None)

    # --- Test 2.2: Table names ---
    print("\n-- Test 2.2: Table Names --")
    check("Warehouse table = 'warehouses'", Warehouse.__tablename__ == "warehouses")
    check("WarehouseStock table = 'warehouse_stock'", WarehouseStock.__tablename__ == "warehouse_stock")
    check("InventoryMovement table = 'inventory_movements'", InventoryMovement.__tablename__ == "inventory_movements")

    # --- Test 2.3: Column existence ---
    print("\n-- Test 2.3: Model Columns --")
    wh_cols = [c.name for c in Warehouse.__table__.columns]
    check("Warehouse has warehouse_id", "warehouse_id" in wh_cols)
    check("Warehouse has warehouse_name", "warehouse_name" in wh_cols)
    check("Warehouse has warehouse_code", "warehouse_code" in wh_cols)
    check("Warehouse has location", "location" in wh_cols)
    check("Warehouse has status", "status" in wh_cols)
    check("Warehouse has capacity", "capacity" in wh_cols)
    check("Warehouse has created_at", "created_at" in wh_cols)

    st_cols = [c.name for c in WarehouseStock.__table__.columns]
    check("Stock has stock_id", "stock_id" in st_cols)
    check("Stock has warehouse_id (FK)", "warehouse_id" in st_cols)
    check("Stock has product_id", "product_id" in st_cols)
    check("Stock has quantity_available", "quantity_available" in st_cols)
    check("Stock has quantity_reserved", "quantity_reserved" in st_cols)
    check("Stock has reorder_level", "reorder_level" in st_cols)

    mv_cols = [c.name for c in InventoryMovement.__table__.columns]
    check("Movement has movement_id", "movement_id" in mv_cols)
    check("Movement has movement_type", "movement_type" in mv_cols)
    check("Movement has quantity", "quantity" in mv_cols)
    check("Movement has notes", "notes" in mv_cols)

    # --- Test 2.4: Relationships ---
    print("\n-- Test 2.4: Relationships --")
    check("Warehouse has 'stocks' relationship", hasattr(Warehouse, "stocks"))
    check("Warehouse has 'movements' relationship", hasattr(Warehouse, "movements"))
    check("WarehouseStock has 'warehouse' relationship", hasattr(WarehouseStock, "warehouse"))
    check("InventoryMovement has 'warehouse' relationship", hasattr(InventoryMovement, "warehouse"))

    # --- Test 2.5: Database tables exist ---
    print("\n-- Test 2.5: Database Tables --")
    tables = list(db.metadata.tables.keys())
    check("'warehouses' table registered", "warehouses" in tables)
    check("'warehouse_stock' table registered", "warehouse_stock" in tables)
    check("'inventory_movements' table registered", "inventory_movements" in tables)

    # ============================================================
    # PHASE 3 -- API Routes, Business Logic & Validation
    # ============================================================
    print()
    print("=" * 70)
    print("  PHASE 3 -- API Routes, Business Logic & Validation")
    print("=" * 70)

    # --- Test 3.1: Schema imports ---
    print("\n-- Test 3.1: Schema Imports --")
    from app.module2_inventory.schemas import (
        WarehouseSchema, CreateWarehouseSchema, UpdateWarehouseSchema,
        WarehouseStockSchema, StockAddSchema, StockRemoveSchema, StockTransferSchema,
        InventoryMovementSchema,
    )
    check("WarehouseSchema imported", WarehouseSchema is not None)
    check("CreateWarehouseSchema imported", CreateWarehouseSchema is not None)
    check("UpdateWarehouseSchema imported", UpdateWarehouseSchema is not None)
    check("WarehouseStockSchema imported", WarehouseStockSchema is not None)
    check("StockAddSchema imported", StockAddSchema is not None)
    check("StockRemoveSchema imported", StockRemoveSchema is not None)
    check("StockTransferSchema imported", StockTransferSchema is not None)
    check("InventoryMovementSchema imported", InventoryMovementSchema is not None)

    # --- Test 3.2: Schema validation ---
    print("\n-- Test 3.2: Schema Validation --")
    from marshmallow import ValidationError

    # Valid create
    try:
        result = CreateWarehouseSchema().load({
            "warehouse_name": "Test WH",
            "warehouse_code": "WH-TEST-001",
            "location": "Test City"
        })
        check("CreateWarehouseSchema: valid data passes", True)
    except ValidationError:
        check("CreateWarehouseSchema: valid data passes", False)

    # Missing required field
    try:
        CreateWarehouseSchema().load({"warehouse_name": "Test"})
        check("CreateWarehouseSchema: missing fields rejected", False)
    except ValidationError as e:
        check("CreateWarehouseSchema: missing fields rejected",
              "warehouse_code" in e.messages or "location" in e.messages)

    # Invalid status value
    try:
        CreateWarehouseSchema().load({
            "warehouse_name": "Test",
            "warehouse_code": "WH-001",
            "location": "City",
            "status": "INVALID"
        })
        check("CreateWarehouseSchema: invalid status rejected", False)
    except ValidationError:
        check("CreateWarehouseSchema: invalid status rejected", True)

    # Stock add validation
    try:
        StockAddSchema().load({"warehouse_id": 1, "product_id": 1, "quantity": 0})
        check("StockAddSchema: quantity=0 rejected", False)
    except ValidationError:
        check("StockAddSchema: quantity=0 rejected", True)

    try:
        StockAddSchema().load({"warehouse_id": 1, "product_id": 1, "quantity": 50})
        check("StockAddSchema: valid data passes", True)
    except ValidationError:
        check("StockAddSchema: valid data passes", False)

    # Transfer validation
    try:
        StockTransferSchema().load({
            "from_warehouse_id": 1, "to_warehouse_id": 2,
            "product_id": 1, "quantity": 10
        })
        check("StockTransferSchema: valid data passes", True)
    except ValidationError:
        check("StockTransferSchema: valid data passes", False)

    # --- Test 3.3: Routes registered ---
    print("\n-- Test 3.3: Route Registration --")
    rules = [str(r) for r in app.url_map.iter_rules()]

    expected_routes = [
        "/api/v1/warehouses",
        "/api/v1/stock",
        "/api/v1/stock/add",
        "/api/v1/stock/remove",
        "/api/v1/stock/transfer",
        "/api/v1/movements",
    ]
    for route in expected_routes:
        check(f"Route {route} registered", route in rules)

    # --- Test 3.4: Warehouse CRUD via HTTP ---
    print("\n-- Test 3.4: Warehouse CRUD (HTTP) --")

    with app.app_context():
        # Clean up any existing test data by recreating tables
        db.drop_all()
        db.create_all()

    # CREATE
    resp = client.post("/api/v1/warehouses",
        data=json.dumps({
            "warehouse_name": "Main Warehouse",
            "warehouse_code": "WH-MAIN-001",
            "location": "Mumbai",
            "address": "123 Industrial Area",
            "manager_name": "Raj Kumar",
            "contact_number": "9876543210",
            "capacity": 5000
        }),
        content_type="application/json"
    )
    data = resp.get_json()
    check("POST /warehouses -> 201 Created", resp.status_code == 201)
    check("Response has success=true", data.get("success") == True)
    check("Response has warehouse_id", data.get("data", {}).get("warehouse_id") is not None)
    wh1_id = data.get("data", {}).get("warehouse_id")

    # CREATE 2nd warehouse
    resp = client.post("/api/v1/warehouses",
        data=json.dumps({
            "warehouse_name": "Delhi Hub",
            "warehouse_code": "WH-DELH-002",
            "location": "Delhi",
            "capacity": 3000
        }),
        content_type="application/json"
    )
    check("POST /warehouses (2nd) -> 201", resp.status_code == 201)
    wh2_id = resp.get_json().get("data", {}).get("warehouse_id")

    # DUPLICATE code
    resp = client.post("/api/v1/warehouses",
        data=json.dumps({
            "warehouse_name": "Duplicate",
            "warehouse_code": "WH-MAIN-001",
            "location": "Test"
        }),
        content_type="application/json"
    )
    check("POST /warehouses duplicate code -> 409", resp.status_code == 409)

    # VALIDATION error (missing required)
    resp = client.post("/api/v1/warehouses",
        data=json.dumps({"warehouse_name": "No Code"}),
        content_type="application/json"
    )
    check("POST /warehouses missing fields -> 422", resp.status_code == 422)

    # LIST
    resp = client.get("/api/v1/warehouses")
    data = resp.get_json()
    check("GET /warehouses -> 200", resp.status_code == 200)
    check("Response has pagination", "pagination" in data)
    check("Pagination total = 2", data.get("pagination", {}).get("total") == 2)
    check("Data has 2 warehouses", len(data.get("data", [])) == 2)

    # SEARCH
    resp = client.get("/api/v1/warehouses?search=Mumbai")
    data = resp.get_json()
    check("GET /warehouses?search=Mumbai -> 1 result", data.get("pagination", {}).get("total") == 1)

    # FILTER by status
    resp = client.get("/api/v1/warehouses?status=active")
    data = resp.get_json()
    check("GET /warehouses?status=active -> 2 results", data.get("pagination", {}).get("total") == 2)

    # GET ONE
    resp = client.get(f"/api/v1/warehouses/{wh1_id}")
    data = resp.get_json()
    check(f"GET /warehouses/{wh1_id} -> 200", resp.status_code == 200)
    check("Response has warehouse_name", data.get("data", {}).get("warehouse_name") == "Main Warehouse")

    # GET ONE -- not found
    resp = client.get("/api/v1/warehouses/999")
    check("GET /warehouses/999 -> 404", resp.status_code == 404)

    # UPDATE
    resp = client.put(f"/api/v1/warehouses/{wh1_id}",
        data=json.dumps({"capacity": 8000, "manager_name": "Updated Manager"}),
        content_type="application/json"
    )
    data = resp.get_json()
    check(f"PUT /warehouses/{wh1_id} -> 200", resp.status_code == 200)
    check("Capacity updated to 8000", data.get("data", {}).get("capacity") == 8000)
    check("Manager name updated", data.get("data", {}).get("manager_name") == "Updated Manager")

    # UPDATE -- not found
    resp = client.put("/api/v1/warehouses/999",
        data=json.dumps({"capacity": 100}),
        content_type="application/json"
    )
    check("PUT /warehouses/999 -> 404", resp.status_code == 404)

    # --- Test 3.5: Stock Operations via HTTP ---
    print("\n-- Test 3.5: Stock Operations (HTTP) --")

    # STOCK IN -- add 100
    resp = client.post("/api/v1/stock/add",
        data=json.dumps({
            "warehouse_id": wh1_id, "product_id": 1,
            "quantity": 100, "notes": "Initial stock"
        }),
        content_type="application/json"
    )
    data = resp.get_json()
    check("POST /stock/add -> 201", resp.status_code == 201)
    check("Stock quantity = 100", data.get("data", {}).get("quantity_available") == 100)

    # STOCK IN -- add 50 more (same product, same warehouse)
    resp = client.post("/api/v1/stock/add",
        data=json.dumps({
            "warehouse_id": wh1_id, "product_id": 1,
            "quantity": 50, "notes": "Restock"
        }),
        content_type="application/json"
    )
    data = resp.get_json()
    check("POST /stock/add (restock) -> 201", resp.status_code == 201)
    check("Stock quantity = 150 (100+50)", data.get("data", {}).get("quantity_available") == 150)

    # STOCK OUT -- remove 30
    resp = client.post("/api/v1/stock/remove",
        data=json.dumps({
            "warehouse_id": wh1_id, "product_id": 1,
            "quantity": 30, "notes": "Sold"
        }),
        content_type="application/json"
    )
    data = resp.get_json()
    check("POST /stock/remove -> 200", resp.status_code == 200)
    check("Stock quantity = 120 (150-30)", data.get("data", {}).get("quantity_available") == 120)

    # STOCK OUT -- insufficient
    resp = client.post("/api/v1/stock/remove",
        data=json.dumps({
            "warehouse_id": wh1_id, "product_id": 1,
            "quantity": 9999
        }),
        content_type="application/json"
    )
    check("POST /stock/remove insufficient -> 400", resp.status_code == 400)

    # STOCK OUT -- warehouse not found
    resp = client.post("/api/v1/stock/add",
        data=json.dumps({
            "warehouse_id": 999, "product_id": 1, "quantity": 10
        }),
        content_type="application/json"
    )
    check("POST /stock/add bad warehouse -> 404", resp.status_code == 404)

    # TRANSFER -- 40 from WH1 to WH2
    resp = client.post("/api/v1/stock/transfer",
        data=json.dumps({
            "from_warehouse_id": wh1_id,
            "to_warehouse_id": wh2_id,
            "product_id": 1,
            "quantity": 40,
            "notes": "Redistribution"
        }),
        content_type="application/json"
    )
    data = resp.get_json()
    check("POST /stock/transfer -> 200", resp.status_code == 200)
    check("Source stock = 80 (120-40)",
          data.get("data", {}).get("source_stock", {}).get("quantity_available") == 80)
    check("Destination stock = 40",
          data.get("data", {}).get("destination_stock", {}).get("quantity_available") == 40)

    # TRANSFER -- same warehouse error
    resp = client.post("/api/v1/stock/transfer",
        data=json.dumps({
            "from_warehouse_id": wh1_id,
            "to_warehouse_id": wh1_id,
            "product_id": 1,
            "quantity": 10
        }),
        content_type="application/json"
    )
    check("POST /stock/transfer same warehouse -> 422", resp.status_code == 422)

    # LIST ALL STOCK
    resp = client.get("/api/v1/stock")
    data = resp.get_json()
    check("GET /stock -> 200", resp.status_code == 200)
    check("Stock has 2 records", data.get("pagination", {}).get("total") == 2)

    # GET WAREHOUSE STOCK
    resp = client.get(f"/api/v1/stock/{wh1_id}")
    data = resp.get_json()
    check(f"GET /stock/{wh1_id} -> 200", resp.status_code == 200)
    check("Warehouse 1 has 1 stock record", len(data.get("data", [])) == 1)

    # --- Test 3.6: Movement History via HTTP ---
    print("\n-- Test 3.6: Movement History (HTTP) --")

    # LIST ALL
    resp = client.get("/api/v1/movements")
    data = resp.get_json()
    check("GET /movements -> 200", resp.status_code == 200)
    total_movements = data.get("pagination", {}).get("total", 0)
    check("5 movements logged (2 in + 1 out + 2 transfer)", total_movements == 5)

    # FILTER by type
    resp = client.get("/api/v1/movements?movement_type=STOCK_IN")
    data = resp.get_json()
    check("GET /movements?type=STOCK_IN -> 2 results",
          data.get("pagination", {}).get("total") == 2)

    resp = client.get("/api/v1/movements?movement_type=TRANSFER_OUT")
    data = resp.get_json()
    check("GET /movements?type=TRANSFER_OUT -> 1 result",
          data.get("pagination", {}).get("total") == 1)

    # FILTER by warehouse
    resp = client.get(f"/api/v1/movements?warehouse_id={wh2_id}")
    data = resp.get_json()
    check(f"GET /movements?warehouse_id={wh2_id} -> 1 result",
          data.get("pagination", {}).get("total") == 1)

    # GET ONE movement
    resp = client.get("/api/v1/movements/1")
    data = resp.get_json()
    check("GET /movements/1 -> 200", resp.status_code == 200)
    check("Movement 1 is STOCK_IN", data.get("data", {}).get("movement_type") == "STOCK_IN")

    # GET ONE -- not found
    resp = client.get("/api/v1/movements/999")
    check("GET /movements/999 -> 404", resp.status_code == 404)

    # --- Test 3.7: Delete Warehouse (CASCADE) ---
    print("\n-- Test 3.7: Delete Warehouse (CASCADE) --")

    # Create a temp warehouse, add stock, then delete
    resp = client.post("/api/v1/warehouses",
        data=json.dumps({
            "warehouse_name": "Temp WH", "warehouse_code": "WH-TEMP-999", "location": "Temp"
        }),
        content_type="application/json"
    )
    temp_id = resp.get_json().get("data", {}).get("warehouse_id")

    client.post("/api/v1/stock/add",
        data=json.dumps({"warehouse_id": temp_id, "product_id": 99, "quantity": 10}),
        content_type="application/json"
    )

    resp = client.delete(f"/api/v1/warehouses/{temp_id}")
    check(f"DELETE /warehouses/{temp_id} -> 200", resp.status_code == 200)

    resp = client.get(f"/api/v1/warehouses/{temp_id}")
    check("Deleted warehouse returns 404", resp.status_code == 404)

    # DELETE -- not found
    resp = client.delete("/api/v1/warehouses/999")
    check("DELETE /warehouses/999 -> 404", resp.status_code == 404)

    # ============================================================
    # PHASE 4 -- Dashboard API
    # ============================================================
    print()
    print("=" * 70)
    print("  PHASE 4 -- Dashboard API")
    print("=" * 70)

    print("\n-- Test 4.1: Dashboard Summary Endpoint --")
    
    # First, let's create some data so the dashboard has something to show
    with app.app_context():
        db.drop_all()
        db.create_all()

    # Create a warehouse and some stock
    resp = client.post("/api/v1/warehouses",
        data=json.dumps({
            "warehouse_name": "Dashboard WH",
            "warehouse_code": "WH-DASH-001",
            "location": "Test"
        }),
        content_type="application/json"
    )
    wh_id = resp.get_json().get("data", {}).get("warehouse_id")

    client.post("/api/v1/stock/add",
        data=json.dumps({
            "warehouse_id": wh_id, "product_id": 1, "quantity": 100
        }),
        content_type="application/json"
    )

    # Call the dashboard summary
    resp = client.get("/api/v1/dashboard/summary")
    data = resp.get_json()
    
    check("GET /dashboard/summary -> 200", resp.status_code == 200)
    
    dash_data = data.get("data", {})
    check("Dashboard includes 'warehouses' stats", "warehouses" in dash_data)
    check("Dashboard includes 'stock_overview' stats", "stock_overview" in dash_data)
    check("Dashboard includes 'low_stock_alerts'", "low_stock_alerts" in dash_data)
    check("Dashboard includes 'stock_by_warehouse'", "stock_by_warehouse" in dash_data)
    check("Dashboard includes 'recent_movements'", "recent_movements" in dash_data)

    check("Warehouse total = 1", dash_data.get("warehouses", {}).get("total") == 1)
    check("Total quantity = 100", dash_data.get("stock_overview", {}).get("total_quantity") == 100)
    check("Total products = 1", dash_data.get("stock_overview", {}).get("total_products") == 1)
    check("Recent movements logged", len(dash_data.get("recent_movements", [])) > 0)

    # ============================================================
    # FINAL SUMMARY
    # ============================================================
    print()
    print("=" * 70)
    total = passed + failed
    if failed == 0:
        print(f"  ALL {total} TESTS PASSED -- Phase 1 through Phase 3 complete!")
    else:
        print(f"  {passed}/{total} tests passed, {failed} FAILED")
    print("=" * 70)
    print()


if __name__ == "__main__":
    test_backend()
