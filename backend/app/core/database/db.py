"""
app/core/database/db.py — Database Extensions Setup
=====================================================

WHAT IS THIS FILE?
This file creates the database-related "tools" (extensions) that the
entire Flask app uses. Think of it as setting up the tools in a workshop
BEFORE you start building anything.

WHY A SEPARATE FILE?
Python has a common problem called "circular imports":
  - __init__.py needs to import db to set up the app
  - models need to import db to define tables
  - If both import from __init__.py, Python gets confused

Solution: Put db in its OWN file. Both __init__.py and models import from here.

WHAT ARE THESE EXTENSIONS?

  db (SQLAlchemy):
    An ORM (Object-Relational Mapper). Instead of writing raw SQL:
      SELECT * FROM warehouses WHERE status = 'active'
    You write Python:
      Warehouse.query.filter_by(status='active').all()
    Benefits: No SQL injection, easier to read, database-agnostic.

  ma (Marshmallow):
    Handles two things:
    1. VALIDATION: Checks if incoming data is valid
       "Is warehouse_name a string? Is capacity a positive number?"
    2. SERIALIZATION: Converts Python objects → JSON for API responses

  migrate (Flask-Migrate):
    Tracks changes to your database schema over time.
    Like Git, but for your database structure.
    Commands:
      flask db init     → First-time setup
      flask db migrate  → "I changed a model, generate a migration"
      flask db upgrade  → "Apply the migration to the database"
"""

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate

# Create extension instances (not connected to any app yet)
# They get connected in __init__.py via db.init_app(app)

db = SQLAlchemy()       # Database ORM
ma = Marshmallow()      # Validation & Serialization
migrate = Migrate()     # Database migrations
