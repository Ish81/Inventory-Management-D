# Smart Inventory & Warehouse Management System

## Team Development Guide

### Project Overview

We are building a **Dockerized Smart Inventory & Warehouse Management System** using a microservices architecture.

The primary goal of this project is not only to build the application but also to gain hands-on experience with:

* Docker
* Docker Compose
* Container Networking
* PostgreSQL
* Linux Administration
* Troubleshooting
* Service-to-Service Communication

Each team member will be responsible for developing, containerizing, testing, and deploying their own service.

---

# Overall Architecture

```text
                    Frontend Container
                           │
 ┌─────────────┬─────────────┬─────────────┬
 │             │             │             │
 ▼             ▼             ▼             ▼
Product     Inventory     Order       User & Analytics
Service     Service       Service         Service
 │             │             │             │
 └─────────────┴─────────────┴─────────────┘
                           │
                           ▼
                    PostgreSQL Database
```

---

# Technology Stack

## Frontend

* React
* Bootstrap

## Backend

* Python Flask

## Database

* PostgreSQL

## Containerization

* Docker
* Docker Compose

## Networking & Linux

* Ubuntu
* SSH
* UFW
* Ping
* Curl
* Nslookup
* Netstat

---

# Team Responsibilities

---

## Member 1 – Product Service

### Service Name

```text
product-service
```

### Responsibilities

Manage:

* Products
* Categories
* Suppliers

### Database Tables

```text
Products
Categories
Suppliers
```

### Required Features

#### Products

* Add Product
* Update Product
* Delete Product
* Search Product
* View Products

#### Categories

* Add Category
* View Categories

#### Suppliers

* Add Supplier
* Update Supplier
* View Suppliers

### APIs

```http
GET    /products
POST   /products
PUT    /products/<id>
DELETE /products/<id>

GET    /categories
POST   /categories

GET    /suppliers
POST   /suppliers
```

### Deliverables

* Flask Application
* Dockerfile
* API Documentation
* Database Scripts

---

## Member 2 – Inventory Service

### Service Name

```text
inventory-service
```

### Responsibilities

Manage:

* Warehouses
* Inventory
* Stock Transfers
* Inventory Logs

### Database Tables

```text
Warehouses
Warehouse_Stock
Inventory_Movements
```

### Required Features

#### Warehouses

* Create Warehouse
* Update Warehouse
* View Warehouses

#### Inventory

* Stock In
* Stock Out
* Transfer Stock

#### Logs

* Track every inventory movement

### APIs

```http
POST /stock/add

POST /stock/remove

POST /stock/transfer

GET  /warehouse

GET  /inventory
```

### Deliverables

* Flask Application
* Dockerfile
* API Documentation
* Database Scripts

---

## Member 3 – Order Service

### Service Name

```text
order-service
```

### Responsibilities

Manage:

* Purchase Orders
* Sales Orders

### Database Tables

```text
Purchase_Orders
Purchase_Order_Items

Sales_Orders
Sales_Order_Items
```

### Required Features

#### Purchase Orders

* Create Purchase Order
* Approve Purchase Order
* Receive Goods

#### Sales Orders

* Create Sales Order
* Dispatch Order
* Complete Order

### APIs

```http
POST /purchase-order

GET  /purchase-order

POST /sales-order

GET  /sales-order
```

### Deliverables

* Flask Application
* Dockerfile
* API Documentation
* Database Scripts

---

## Member 4 – User & Analytics Service

### Service Name

```text
user-service
```

### Responsibilities

Manage:

* Authentication
* Authorization
* Alerts
* Reports
* Dashboard

### Database Tables

```text
Users
Roles

Alerts

Audit_Logs
```

### Required Features

#### Authentication

* Login
* Register
* Logout

#### Alerts

* Low Stock Alerts

#### Dashboard

Display:

* Total Products
* Total Warehouses
* Total Orders
* Low Stock Items

#### Audit Logs

Track:

* Product Changes
* Inventory Updates
* Order Activities

### APIs

```http
POST /register

POST /login

GET  /analytics

GET  /alerts

GET  /audit-logs
```

### Deliverables

* Flask Application
* Dockerfile
* API Documentation
* Database Scripts

---

# Common Rules for Everyone

## Folder Structure

Each service should follow:

```text
service-name/

├── app.py
├── requirements.txt
├── Dockerfile
├── routes/
├── models/
├── services/
└── README.md
```

---

## Docker Requirements

Every member must create their own:

```text
Dockerfile
```

Requirements:

* Use Python 3.11
* Install dependencies
* Expose service port
* Run Flask application

---

## API Standards

### Response Format

Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Database Rules

### Shared PostgreSQL Database

We will use:

```text
1 PostgreSQL Container
```

All services will connect to:

```text
postgres-db
```

Database Name:

```text
inventory_db
```

---

## Git Workflow

### Create Feature Branch

```bash
git checkout -b feature/product-service
```

Example:

```bash
git checkout -b feature/inventory-service
```

### Push Changes

```bash
git add .
git commit -m "Implemented Product APIs"
git push origin feature/product-service
```

### Merge

Only merge after:

* Testing completed
* Docker container working
* APIs documented

---

# Final Docker Architecture

Containers:

```text
frontend

product-service

inventory-service

order-service

user-service

postgres-db

linux-tools
```

Total:

```text
7 Containers
```

---

# Testing Responsibilities

Each member must test:

### API Testing

Using:

```text
Postman
```

### Container Testing

Commands:

```bash
docker build

docker run

docker ps

docker logs
```

### Database Testing

Verify:

* Connection
* CRUD Operations
* Error Handling

---

# Final Deliverables From Each Member

Each member must submit:

1. Source Code
2. Dockerfile
3. Database Scripts
4. API Documentation
5. Postman Collection
6. Screenshots
7. Test Results

---

# Project Timeline

## Phase 1

Database Design

Deadline: Week 1

---

## Phase 2

Service Development

Deadline: Week 2

---

## Phase 3

Dockerization

Deadline: Week 3

---

## Phase 4

Integration Testing

Deadline: Week 4

---

## Phase 5

Failure Simulation & Troubleshooting

Deadline: Week 5

---

# Success Criteria

The project will be considered complete when:

✓ All containers run successfully

✓ Services communicate properly

✓ PostgreSQL is connected

✓ CRUD operations work

✓ Docker Compose deployment works

✓ SSH connectivity works

✓ DNS testing completed

✓ Firewall testing completed

✓ Failure simulations demonstrated

✓ Final presentation prepared
