# Integration Guide — How Module 2 Connects with Other Modules

## Integration Points

### Module 1 (Products) → Module 2
- `product_id` is referenced in `warehouse_stock` and `inventory_movements`
- During development: plain integer, no FK constraint
- After integration: add FK to `products.product_id`

### Module 3 (Orders) → Module 2
- Purchase Orders trigger STOCK_IN via `/stock/add`
- Sales Orders trigger STOCK_OUT via `/stock/remove`
- Linked via `reference_type` + `reference_id` in `inventory_movements`

### Module 4 (Auth) → Module 2
- JWT middleware validates tokens on all requests (future)
- `created_by` field added to movements (future)
- RBAC restricts who can perform stock operations (future)
