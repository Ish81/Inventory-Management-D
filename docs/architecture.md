# Architecture Overview

See the implementation plan for full architecture details.

## System Architecture

```
Browser (React, port 3000) → HTTP/JSON → Flask API (port 5000) → SQLAlchemy → PostgreSQL
```

## Backend Pattern: Layered Architecture

```
Route → Controller → Service → Repository → Model → Database
```

| Layer | Job | Analogy |
|-------|-----|---------|
| Route | Maps URL to controller | Phone directory |
| Controller | Handles HTTP request/response | Receptionist |
| Service | Business logic & rules | Manager |
| Repository | Database queries | Clerk fetching items |
| Model | Table definition | Blueprint of a shelf |

## Module Structure

```
app/
├── module2_inventory/    ← Your module (Inventory & Warehouses)
├── core/                 ← Shared infrastructure (config, database, exceptions)
└── shared/               ← Reusable utilities (responses, helpers, validators)
```

Future modules will follow the same pattern:
- `module1_products/` (Member 1)
- `module3_orders/` (Member 3)
- `module4_auth/` (Member 4)
