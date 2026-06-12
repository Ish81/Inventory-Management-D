# Smart Inventory & Warehouse Management System

## 📋 Project Overview

A professional, enterprise-grade **Inventory & Warehouse Management** module built with React, Flask, and PostgreSQL. Part of a 4-member team project where each member owns a separate module.

## 🏗️ Team Structure

| Module | Owner | Description | Status |
|--------|-------|-------------|--------|
| Module 1 | Member 1 | Product & Supplier Management | 🔲 Not Started |
| **Module 2** | **Member 2 (Me)** | **Inventory & Warehouse Management** | **🟡 In Progress** |
| Module 3 | Member 3 | Purchase Orders & Sales Orders | 🔲 Not Started |
| Module 4 | Member 4 | Auth, Analytics, Alerts, Docker | 🔲 Not Started |

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Material UI v5, React Router v6, Axios |
| Backend | Python 3.13, Flask, SQLAlchemy, Marshmallow |
| Database | PostgreSQL 15+ |
| IDE | VS Code |

## 📁 Project Structure

```
inventory-management/
├── backend/          # Flask REST API
│   ├── app/
│   │   ├── module2_inventory/   # All Module 2 code
│   │   ├── core/                # Config, DB, Exceptions
│   │   └── shared/              # Helpers, Responses, Validators
│   ├── tests/
│   └── run.py
├── frontend/         # React Application
│   └── src/
│       ├── features/            # Dashboard, Warehouses, Inventory, Transfers
│       ├── components/          # Reusable UI components
│       └── services/            # API configuration
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- PostgreSQL 15+

### Backend Setup (PowerShell)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env          # Then edit .env with your DB password
python run.py
```

### Frontend Setup (PowerShell)
```powershell
cd frontend
npm install
npm start
```

### URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api/v1 |
| Health Check | http://localhost:5000/api/v1/health |

## 📖 Documentation
- [Architecture](docs/architecture.md)
- [API Specification](docs/api-spec.md)
- [Database Schema](docs/database-schema.md)
- [Integration Guide](docs/integration-guide.md)

## 🤝 Git Conventions
We use [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(warehouse): add create warehouse API
fix(stock): fix quantity validation
docs(readme): update setup instructions
test(warehouse): add unit tests
```
