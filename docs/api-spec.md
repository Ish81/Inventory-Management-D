# API Specification — Module 2

Base URL: `http://localhost:5000/api/v1`

## Warehouse APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /warehouses | Create warehouse |
| GET | /warehouses | List all (with search/filter/pagination) |
| GET | /warehouses/:id | Get one warehouse |
| PUT | /warehouses/:id | Update warehouse |
| DELETE | /warehouses/:id | Delete warehouse |

## Stock APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /stock/add | Stock In |
| POST | /stock/remove | Stock Out |
| POST | /stock/transfer | Transfer between warehouses |
| GET | /stock | View all stock |
| GET | /stock/:warehouse_id | View warehouse stock |

## Movement APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /movements | List movements (with filters) |
| GET | /movements/:id | Get movement details |

## Dashboard API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard/summary | KPI summary |

## Response Format

```json
{ "success": true, "message": "...", "data": { ... } }
{ "success": false, "message": "...", "errors": { ... } }
```
