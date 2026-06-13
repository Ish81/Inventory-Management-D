# SmartIMS — Inventory Management System

A full-stack, modular **Inventory Management System** built with a **Flask (Python)** backend and **React** frontend. The system is structured across 4 independent modules covering product management, warehouse inventory, order processing, and user authentication with analytics.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Seed Demo Data](#4-seed-demo-data)
- [Running the Project](#-running-the-project)
- [Module Overview](#-module-overview)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Running Tests](#-running-tests)
- [Default Demo Credentials](#-default-demo-credentials)

---

## ✨ Features

- 📦 **Product & Category Management** — Full CRUD for products, categories, and suppliers
- 🏭 **Warehouse & Inventory Tracking** — Multi-warehouse stock management with movement history
- 🛒 **Purchase & Sales Orders** — Complete order lifecycle management with line items
- 🔐 **Auth & Role Management** — JWT-based authentication with Admin / Manager / Staff roles
- 📊 **Analytics & Reporting** — Dashboard metrics, alerts, and audit logs
- 🔄 **Role Switcher UI** — Instantly switch roles from the profile dropdown in the top-right corner

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Material UI v9, React Router v7, Recharts, Axios |
| **Backend** | Python 3.13, Flask, SQLAlchemy, Flask-Migrate (Alembic) |
| **Database** | PostgreSQL |
| **Auth** | JWT (PyJWT), bcrypt password hashing |
| **Testing** | pytest |

---

## 📁 Project Structure

```
inventory-management/
├── README.md
├── backend/
│   ├── app/
│   │   ├── __init__.py              # Application factory
│   │   ├── core/
│   │   │   ├── config/settings.py   # Environment configs
│   │   │   └── database/db.py       # SQLAlchemy, Marshmallow, Migrate setup
│   │   ├── db.py                    # Raw psycopg2 connection helper
│   │   ├── module2_inventory/       # Module 2: Warehouse & Stock
│   │   │   ├── models.py
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── repositories/
│   │   ├── modules/
│   │   │   ├── module1_products/    # Module 1: Products, Categories, Suppliers
│   │   │   ├── module3_orders/      # Module 3: Purchase & Sales Orders
│   │   │   ├── module4_auth/        # Module 4: Auth, Users, Roles
│   │   │   └── module4_analytics/   # Module 4: Analytics, Alerts, Audit Logs
│   │   └── shared/                  # Shared utilities and error handlers
│   ├── migrations/                  # Alembic DB migrations
│   ├── seed_data.py                 # Demo data seeder (all modules)
│   ├── requirements.txt
│   ├── run.py                       # Flask entry point
│   ├── .env.example                 # Environment variable template
│   ├── test_module1.py              # Module 1 tests
│   └── test_module3.py              # Module 3 tests
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx                  # Root component & routing
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx       # Sidebar + AppBar layout with role switcher
│   │   ├── features/                # Feature-based components
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── suppliers/
│   │   │   ├── orders/
│   │   │   ├── reports/
│   │   │   └── alerts/
│   │   ├── services/                # Axios API service layer
│   │   ├── api/                     # API base configuration
│   │   └── theme/                   # MUI theme customisation
│   ├── package.json
│   └── vite.config.js
└── docs/
    ├── api-spec.md
    ├── database-schema.md
    └── integration-guide.md
```

---

## 🔧 Prerequisites

Make sure the following are installed on your system:

- **Python 3.10+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** and **npm** — [Download](https://nodejs.org/)
- **PostgreSQL 14+** — [Download](https://www.postgresql.org/download/)
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/inventory-management.git
cd inventory-management
```

---

### 2. Backend Setup

#### a. Create a Virtual Environment

```bash
cd backend
python -m venv venv
```

Activate it:
- **Windows:** `venv\Scripts\activate`
- **Mac/Linux:** `source venv/bin/activate`

#### b. Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### c. Configure Environment Variables

```bash
# Copy the template
copy .env.example .env        # Windows
# cp .env.example .env        # Mac/Linux
```

Open `.env` and update the values:

```env
FLASK_ENV=development
SECRET_KEY=your-strong-secret-key-here
JWT_SECRET=your-strong-jwt-secret-here
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smart_inventory_db
TEST_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smart_inventory_db_test
```

#### d. Create the PostgreSQL Database

Open your PostgreSQL terminal (`psql`) and run:

```sql
CREATE DATABASE smart_inventory_db;
```

#### e. Run Database Migrations

```bash
flask db upgrade
```

This creates all tables across all 4 modules.

---

### 3. Frontend Setup

Open a **new terminal** in the `frontend/` directory:

```bash
cd frontend
npm install
```

---

### 4. Seed Demo Data

With the backend virtual environment active, run the seeder from the `backend/` directory:

```bash
python seed_data.py
```

This populates all modules with realistic demo data:
- ✅ Roles: Admin, Manager, Staff
- ✅ Users: admin, manager, and staff demo accounts
- ✅ Categories: Electronics, Furniture, Office Supplies
- ✅ Suppliers: 3 suppliers
- ✅ Products: 8 products linked to categories and suppliers
- ✅ Warehouses: 2 warehouses with stock levels and movement history
- ✅ Purchase Orders: 3 orders in various statuses
- ✅ Sales Orders: 3 orders in various statuses

---

## ▶ Running the Project

You need **two terminals** running simultaneously.

### Terminal 1 — Backend (Flask API)

```bash
cd backend
venv\Scripts\activate    # Windows
# source venv/bin/activate  # Mac/Linux

python run.py
```

The API will start at: **http://localhost:5000**

You can verify it's running by visiting: http://localhost:5000/api/v1/health

### Terminal 2 — Frontend (React)

```bash
cd frontend
npm start
```

The app will open at: **http://localhost:3000**

> ⚠️ If port 3000 is in use, React will prompt you to use another port (e.g. 3001). Type `Y` to accept.

---

## 📦 Module Overview

| Module | Description | Key Entities |
|---|---|---|
| **Module 1** | Product & Supplier Management | Products, Categories, Suppliers |
| **Module 2** | Warehouse & Inventory | Warehouses, WarehouseStock, InventoryMovements |
| **Module 3** | Order Management | PurchaseOrders, SalesOrders, OrderItems |
| **Module 4** | Auth, Analytics & Alerts | Users, Roles, AuditLogs, Alerts, Analytics |

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api/v1`.

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Check if API is running |

### Products (Module 1)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/products` | List all products |
| POST | `/api/v1/products` | Create a product |
| GET | `/api/v1/products/:id` | Get single product |
| PUT | `/api/v1/products/:id` | Update a product |
| DELETE | `/api/v1/products/:id` | Delete a product |
| GET | `/api/v1/categories` | List all categories |
| POST | `/api/v1/categories` | Create a category |
| GET | `/api/v1/suppliers` | List all suppliers |
| POST | `/api/v1/suppliers` | Create a supplier |

### Inventory (Module 2)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/warehouses` | List all warehouses |
| POST | `/api/v1/warehouses` | Create a warehouse |
| GET | `/api/v1/stock` | List all stock levels |
| POST | `/api/v1/stock` | Add stock to warehouse |
| GET | `/api/v1/movements` | List movement history |
| POST | `/api/v1/movements` | Record a movement |
| GET | `/api/v1/dashboard` | Dashboard metrics |

### Orders (Module 3)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/purchase-orders` | List purchase orders |
| POST | `/api/v1/purchase-orders` | Create purchase order |
| GET | `/api/v1/purchase-orders/:id` | Get single PO |
| PUT | `/api/v1/purchase-orders/:id/status` | Update PO status |
| GET | `/api/v1/sales-orders` | List sales orders |
| POST | `/api/v1/sales-orders` | Create sales order |
| PUT | `/api/v1/sales-orders/:id/status` | Update SO status |

### Auth (Module 4)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and get JWT |
| PUT | `/api/v1/auth/update-role` | Update user role |
| GET | `/api/v1/analytics/summary` | Analytics summary |
| GET | `/api/v1/alerts` | List alerts |
| GET | `/api/v1/audit-logs` | List audit logs |

---

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `FLASK_ENV` | Environment name | `development` |
| `SECRET_KEY` | Flask secret key | `my-secret-key` |
| `JWT_SECRET` | JWT signing key | `my-jwt-secret` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@localhost:5432/smart_inventory_db` |
| `TEST_DATABASE_URL` | Test database connection string | `postgresql://postgres:pass@localhost:5432/smart_inventory_db_test` |
| `FLASK_HOST` | Host to bind to | `0.0.0.0` |
| `FLASK_PORT` | Port to listen on | `5000` |

---

## 🧪 Running Tests

With the virtual environment active from the `backend/` directory:

```bash
# Run Module 1 tests (Products, Categories, Suppliers)
python -m pytest test_module1.py -v

# Run Module 3 tests (Purchase & Sales Orders)
python -m pytest test_module3.py -v

# Run all tests
python -m pytest -v
```

> ⚠️ Tests use the `TEST_DATABASE_URL` from your `.env`. Make sure that database exists before running tests.

---

## 👤 Default Demo Credentials

After running `seed_data.py`, the following accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | admin@smartims.com | password123 |
| Manager | manager@smartims.com | password123 |
| Staff | staff@smartims.com | password123 |

> You can also switch roles directly in the UI by clicking your **profile avatar** in the top-right corner of the navigation bar.

---

## 📄 License

This project is for educational/demonstration purposes.
