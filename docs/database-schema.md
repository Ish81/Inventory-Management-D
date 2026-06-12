# Database Schema — Module 2

## Tables

### warehouses
| Column | Type | Constraints |
|--------|------|-------------|
| warehouse_id | SERIAL | PRIMARY KEY |
| warehouse_name | VARCHAR(100) | NOT NULL |
| warehouse_code | VARCHAR(20) | NOT NULL, UNIQUE |
| location | VARCHAR(100) | NOT NULL |
| address | TEXT | |
| manager_name | VARCHAR(100) | |
| contact_number | VARCHAR(20) | |
| capacity | INTEGER | DEFAULT 0 |
| status | VARCHAR(20) | DEFAULT 'active' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### warehouse_stock
| Column | Type | Constraints |
|--------|------|-------------|
| stock_id | SERIAL | PRIMARY KEY |
| warehouse_id | INTEGER | NOT NULL, FK → warehouses |
| product_id | INTEGER | NOT NULL |
| quantity_available | INTEGER | NOT NULL, DEFAULT 0 |
| quantity_reserved | INTEGER | NOT NULL, DEFAULT 0 |
| reorder_level | INTEGER | DEFAULT 10 |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

UNIQUE(warehouse_id, product_id)

### inventory_movements
| Column | Type | Constraints |
|--------|------|-------------|
| movement_id | SERIAL | PRIMARY KEY |
| warehouse_id | INTEGER | NOT NULL, FK → warehouses |
| product_id | INTEGER | NOT NULL |
| movement_type | VARCHAR(20) | NOT NULL |
| quantity | INTEGER | NOT NULL |
| reference_type | VARCHAR(50) | |
| reference_id | INTEGER | |
| notes | TEXT | |
| created_at | TIMESTAMP | DEFAULT NOW() |

Movement types: STOCK_IN, STOCK_OUT, TRANSFER_IN, TRANSFER_OUT, ADJUSTMENT
