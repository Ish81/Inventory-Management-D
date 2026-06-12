from flask import request, g
from app.shared.response_helpers import success_response, error_response
from app.shared.audit import log_action
from . import services


# ── CATEGORY CONTROLLERS ───────────────────────────────────

def get_categories():
    categories = services.get_all_categories()
    return success_response([c.to_dict() for c in categories])


def get_category(category_id):
    category = services.get_category_by_id(category_id)
    if not category:
        return error_response("Category not found", 404)
    return success_response(category.to_dict())


def create_category():
    data = request.get_json()
    if not data or not data.get('name', '').strip():
        return error_response("Category name is required", 400)
    category, error = services.create_category(data)
    if error:
        return error_response(error, 400)
    # Log audit action
    user_id = getattr(g, 'current_user', {}).get('user_id')
    if user_id:
        log_action(user_id, 'create', 'category', category.id, {'name': category.name})
    return success_response(category.to_dict(), "Category created successfully", 201)


def update_category(category_id):
    category = services.get_category_by_id(category_id)
    if not category:
        return error_response("Category not found", 404)
    data = request.get_json()
    if not data:
        return error_response("No data provided", 400)
    updated, error = services.update_category(category, data)
    if error:
        return error_response(error, 400)
    return success_response(updated.to_dict(), "Category updated successfully")


def delete_category(category_id):
    category = services.get_category_by_id(category_id)
    if not category:
        return error_response("Category not found", 404)
    success, error = services.delete_category(category)
    if not success:
        return error_response(error, 400)
    return success_response(None, "Category deleted successfully")


# ── SUPPLIER CONTROLLERS ───────────────────────────────────

def get_suppliers():
    suppliers = services.get_all_suppliers()
    return success_response([s.to_dict() for s in suppliers])


def get_supplier(supplier_id):
    supplier = services.get_supplier_by_id(supplier_id)
    if not supplier:
        return error_response("Supplier not found", 404)
    return success_response(supplier.to_dict())


def create_supplier():
    data = request.get_json()
    if not data:
        return error_response("No data provided", 400)
    if not data.get('name', '').strip():
        return error_response("Supplier name is required", 400)
    if not data.get('email', '').strip():
        return error_response("Email is required", 400)
    supplier, error = services.create_supplier(data)
    if error:
        return error_response(error, 400)
    # Log audit action
    user_id = getattr(g, 'current_user', {}).get('user_id')
    if user_id:
        log_action(user_id, 'create', 'supplier', supplier.id, {'name': supplier.name, 'email': supplier.email})
    return success_response(supplier.to_dict(), "Supplier created successfully", 201)


def update_supplier(supplier_id):
    supplier = services.get_supplier_by_id(supplier_id)
    if not supplier:
        return error_response("Supplier not found", 404)
    data = request.get_json()
    if not data:
        return error_response("No data provided", 400)
    updated, error = services.update_supplier(supplier, data)
    if error:
        return error_response(error, 400)
    return success_response(updated.to_dict(), "Supplier updated successfully")


def delete_supplier(supplier_id):
    supplier = services.get_supplier_by_id(supplier_id)
    if not supplier:
        return error_response("Supplier not found", 404)
    success, error = services.delete_supplier(supplier)
    if not success:
        return error_response(error, 400)
    return success_response(None, "Supplier deleted successfully")


# ── PRODUCT CONTROLLERS ────────────────────────────────────

def get_products():
    search = request.args.get('search', '').strip() or None
    category_id = request.args.get('category_id', type=int)
    supplier_id = request.args.get('supplier_id', type=int)
    products = services.get_all_products(search, category_id, supplier_id)
    return success_response([p.to_dict() for p in products])


def get_product(product_id):
    product = services.get_product_by_id(product_id)
    if not product:
        return error_response("Product not found", 404)
    return success_response(product.to_dict())


def create_product():
    data = request.get_json()
    if not data:
        return error_response("No data provided", 400)
    required = ['name', 'sku', 'price', 'category_id', 'supplier_id']
    for field in required:
        if not data.get(field):
            return error_response(f"{field} is required", 400)
    product, error = services.create_product(data)
    if error:
        return error_response(error, 400)
    # Log audit action
    user_id = getattr(g, 'current_user', {}).get('user_id')
    if user_id:
        log_action(user_id, 'create', 'product', product.id, {'name': product.name, 'sku': product.sku})
    return success_response(product.to_dict(), "Product created successfully", 201)


def update_product(product_id):
    product = services.get_product_by_id(product_id)
    if not product:
        return error_response("Product not found", 404)
    data = request.get_json()
    if not data:
        return error_response("No data provided", 400)
    updated, error = services.update_product(product, data)
    if error:
        return error_response(error, 400)
    return success_response(updated.to_dict(), "Product updated successfully")


def delete_product(product_id):
    product = services.get_product_by_id(product_id)
    if not product:
        return error_response("Product not found", 404)
    success, error = services.delete_product(product)
    if not success:
        return error_response(error, 400)
    return success_response(None, "Product deleted successfully")


def get_product_dashboard():
    stats = services.get_dashboard_stats()
    return success_response(stats)