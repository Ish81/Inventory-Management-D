# 📦 Smart Inventory & Warehouse Management System

A professional full-stack inventory management system built with React, Flask, and PostgreSQL.
Designed as a multi-module, multi-developer enterprise project with full Docker deployment support.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Axios, React Bootstrap, Nginx |
| Backend | Python 3.11, Flask, SQLAlchemy, Gunicorn |
| Database | PostgreSQL 15 |
| Containerization | Docker, Docker Compose |
| Web Server | Nginx (Alpine) |
| Styling | Bootstrap 5, Custom CSS |

---

## 📁 Project Structure

```
smart-inventory-system/
│
├── backend/                        → Flask REST API
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── products/           → Product routes + schemas
│   │   │   ├── categories/         → Category routes + schemas
│   │   │   └── suppliers/          → Supplier routes + schemas
│   │   ├── models/                 → SQLAlchemy models
│   │   ├── services/               → Business logic layer
│   │   ├── utils/                  → Response helpers, error handlers
│   │   └── config/                 → App settings, DB config
│   ├── migrations/                 → Flask-Migrate schema versions
│   ├── Dockerfile                  → Backend container definition
│   ├── .dockerignore
│   ├── run.py                      → Flask entry point
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                        → Local only, never committed
│
├── frontend/                       → React Application
│   ├── public/
│   │   └── index.html              → App shell with CSS design system
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             → LoadingSpinner, EmptyState, ConfirmDialog
│   │   │   └── layout/             → Sidebar, Navbar, Layout
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   └── suppliers/
│   │   ├── services/               → Axios API service layer
│   │   └── App.jsx
│   ├── Dockerfile                  → Two-stage build (Node + Nginx)
│   ├── nginx.conf                  → Nginx config with API proxy
│   ├── .dockerignore
│   └── .env
│
├── docs/
│   ├── demo_networking.sh          → Network verification script
│   └── demo_availability.sh        → Service availability script
│
├── docker-compose.yml              → Full stack orchestration
├── .env                            → Root level Docker secrets
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start — Docker (Recommended)

This runs the entire stack with one command. No manual installation of Python, Node, or PostgreSQL needed.

### Prerequisites

Install Docker Desktop:
- **macOS:** https://www.docker.com/products/docker-desktop → choose Apple Silicon or Intel
- **Windows:** https://www.docker.com/products/docker-desktop → choose Windows

Verify:
```bash
docker --version
docker compose version
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-inventory-system.git
cd smart-inventory-system
```

---

### 2. Start All Services

```bash
docker compose up --build
```

This single command:
- Pulls `postgres:15-alpine` from Docker Hub
- Builds the Flask backend image
- Builds the React + Nginx frontend image
- Creates the `inventory_network` bridge network
- Creates the `postgres_data` persistent volume
- Starts all three containers in the correct order

Wait until you see:
```
inventory_db        | database system is ready to accept connections
inventory_backend   | Listening at: http://0.0.0.0:5000
inventory_frontend  | Configuration complete; ready for start up
```

---

### 3. Run Database Migrations

Open a new terminal:

```bash
docker exec inventory_backend flask db upgrade
```

---

### 4. Open the App

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:3000 |
| Backend API | http://localhost:5000/api/health |
| PostgreSQL | localhost:5432 |

---

### 5. Stop Everything

```bash
# Stop containers (keeps data)
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove everything including database data
docker compose down -v
```

---

## 🖥️ Local Development Setup (Without Docker)

Use this if you want to run and edit the code directly.

---

### 🍎 macOS Setup

**Install prerequisites:**

```bash
brew install node python@3.11 postgresql@15
brew services start postgresql@15
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

**Create the database:**

```bash
psql postgres
```

```sql
CREATE DATABASE inventory_management_db;
CREATE USER inventory_user WITH PASSWORD 'inventory_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE inventory_management_db TO inventory_user;
\q
```

**Backend:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask db upgrade
flask run
```

**Frontend (new terminal):**

```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm start
```

---

### 🪟 Windows Setup

**Install prerequisites:**

- **Node.js:** https://nodejs.org → LTS version → check Add to PATH
- **Python:** https://www.python.org/downloads → check Add Python to PATH
- **PostgreSQL:** https://www.postgresql.org/download/windows → remember the postgres password
- **Git:** https://git-scm.com/download/windows

After installing PostgreSQL, add it to PATH:
- Search "Environment Variables" in Start Menu
- System Variables → Path → Edit → Add: `C:\Program Files\PostgreSQL\15\bin`
- Restart terminal

> Use **Git Bash** for all commands below

**Create the database:**

```bash
psql -U postgres
```

```sql
CREATE DATABASE inventory_management_db;
CREATE USER inventory_user WITH PASSWORD 'inventory_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE inventory_management_db TO inventory_user;
\q
```

**Backend:**

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
flask db upgrade
flask run
```

**Frontend (new Git Bash window):**

```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm start
```

---

## ✅ Verify Everything is Working

```bash
# API health check
curl http://localhost:5000/api/health

# Frontend check
curl -I http://localhost:3000

# All three ports open (Docker)
for port in 3000 5000 5432; do
  nc -zv localhost $port && echo "Port $port: OPEN" || echo "Port $port: CLOSED"
done
```

---

## 🔌 API Endpoints

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/categories/` | List all categories |
| POST | `/api/v1/categories/` | Create category |
| GET | `/api/v1/categories/<id>` | Get by ID |
| PUT | `/api/v1/categories/<id>` | Update |
| DELETE | `/api/v1/categories/<id>` | Delete |

### Suppliers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/suppliers/` | List all suppliers |
| POST | `/api/v1/suppliers/` | Create supplier |
| GET | `/api/v1/suppliers/<id>` | Get by ID |
| PUT | `/api/v1/suppliers/<id>` | Update |
| DELETE | `/api/v1/suppliers/<id>` | Delete |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/products/` | List all products |
| GET | `/api/v1/products/?search=keyboard` | Search by name or SKU |
| GET | `/api/v1/products/?category_id=1` | Filter by category |
| GET | `/api/v1/products/?supplier_id=1` | Filter by supplier |
| POST | `/api/v1/products/` | Create product |
| GET | `/api/v1/products/<id>` | Get by ID |
| PUT | `/api/v1/products/<id>` | Update |
| DELETE | `/api/v1/products/<id>` | Delete |
| GET | `/api/v1/products/dashboard/stats` | Dashboard summary |

---

## 🐳 Docker Architecture

```
Your Machine (host)
    │
    ├── localhost:3000 ──→ [inventory_frontend] Nginx:80
    ├── localhost:5000 ──→ [inventory_backend]  Gunicorn:5000
    └── localhost:5432 ──→ [inventory_db]       PostgreSQL:5432
                                │
                    inventory_network (bridge)
                         172.18.0.0/16
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                  ▼
         172.18.0.4        172.18.0.3         172.18.0.2
         frontend           backend               db
                                │                  │
                                └──── db:5432 ─────┘
                                   (DNS resolution)
```

### Container Summary

| Container | Image | Port | Purpose |
|---|---|---|---|
| inventory_frontend | node:20 + nginx:alpine | 3000→80 | Serves compiled React app |
| inventory_backend | python:3.11-slim | 5000→5000 | Flask REST API via Gunicorn |
| inventory_db | postgres:15-alpine | 5432→5432 | PostgreSQL database |

### Key Docker Concepts Used

| Concept | Where Used |
|---|---|
| Two-stage build | Frontend Dockerfile |
| Named volumes | postgres_data for DB persistence |
| Bridge network | inventory_network for DNS |
| Healthcheck | PostgreSQL readiness before Flask starts |
| depends_on | Service startup ordering |
| restart: unless-stopped | Auto-recovery on crash |

---

## 🗄️ Database Schema

```
categories              suppliers
──────────              ─────────
id (PK)                 id (PK)
name (unique)           name
description             contact_person
created_at              email (unique)
updated_at              phone
                        address
                        created_at
                        updated_at
        \                   /
         \                 /
          ──── products ────
               ──────────
               id (PK)
               category_id (FK)
               supplier_id (FK)
               name
               sku (unique)
               price (Numeric)
               description
               reorder_level
               created_at
               updated_at
```

---

## 🛠️ Daily Development Workflow

### Docker workflow

```bash
# Start everything
docker compose up -d

# View logs
docker compose logs -f backend

# Rebuild after code changes
docker compose up -d --build backend

# Enter a container
docker exec -it inventory_backend /bin/bash

# Check all services
docker compose ps

# Stop everything
docker compose down
```

### Local workflow (macOS)

```bash
# Terminal 1 — Backend
cd backend && source venv/bin/activate && flask run

# Terminal 2 — Frontend
cd frontend && npm start
```

### Local workflow (Windows Git Bash)

```bash
# Terminal 1 — Backend
cd backend && source venv/Scripts/activate && flask run

# Terminal 2 — Frontend
cd frontend && npm start
```

---

## ⚠️ Common Issues and Fixes

**`flask: command not found`**
```bash
# macOS
source venv/bin/activate
# Windows
source venv/Scripts/activate
```

**`psycopg2` error on Windows**
```bash
pip install psycopg2-binary --force-reinstall
```

**CORS error in browser**
Confirm `backend/.env` has:
```
FRONTEND_URL=http://localhost:3000
```
Then restart Flask.

**`relation does not exist` error**
```bash
flask db upgrade
# or in Docker:
docker exec inventory_backend flask db upgrade
```

**Port 5000 already in use (macOS)**
```bash
# Disable AirPlay Receiver:
# System Preferences → Sharing → uncheck AirPlay Receiver
# Or run Flask on a different port:
flask run --port 5001
```

**Docker containers not starting**
```bash
docker compose down
docker compose up --build
```

**Database data lost after `docker compose down -v`**
The `-v` flag deletes volumes. Use `docker compose down` (without `-v`) to keep data.

**Frontend shows blank page**
```bash
docker logs inventory_frontend
docker exec inventory_frontend nginx -t
```

**Backend cannot connect to database in Docker**
```bash
# Check DATABASE_URL in docker-compose.yml uses 'db' not 'localhost'
DATABASE_URL=postgresql://inventory_user:inventory_pass_2024@db:5432/inventory_management_db
```

---

## 👥 Team Module Structure

| Module | Responsibility | Status |
|---|---|---|
| Module 1 | Products, Categories, Suppliers | ✅ Complete |
| Module 2 | Inventory & Warehouse Management | 🔄 In Progress |
| Module 3 | Purchase Orders & Sales Orders | 🔄 In Progress |
| Module 4 | Auth, Analytics, Alerts, Docker | 🔄 In Progress |

---

## 📄 License

This project is developed for educational and portfolio purposes.