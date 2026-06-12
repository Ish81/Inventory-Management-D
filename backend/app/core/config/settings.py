"""
app/core/config/settings.py — Application Configuration
=========================================================

WHAT IS THIS FILE?
This file defines HOW the Flask app should behave in different environments.
Think of it like "modes" for your app:

  DEVELOPMENT MODE  → On your laptop. Shows detailed errors. Auto-reloads.
  TESTING MODE      → Running automated tests. Uses a separate test database.
  PRODUCTION MODE   → On a live server. Hides errors. Maximum security.

WHY DIFFERENT CONFIGS?
Imagine you're building a car:
  - Test track: You want detailed gauges and no speed limit
  - Public road: You want airbags, seatbelts, and speed limits
Same car, different settings. Same app, different configs.

HOW IT WORKS:
  1. BaseConfig has settings shared by ALL modes
  2. DevelopmentConfig, TestingConfig, ProductionConfig INHERIT from BaseConfig
     and override what's different
  3. config_by_name maps a string to the right class:
     config_by_name["development"] → DevelopmentConfig

ENVIRONMENT VARIABLES:
  Sensitive data (database password, secret key) comes from a .env file.
  python-dotenv loads the .env file so we can use os.environ.get()
  This keeps passwords OUT of your code (never commit .env to Git!)
"""

import os
from dotenv import load_dotenv

# Load the .env file into the environment
# After this, os.environ.get("DATABASE_URL") will return the value from .env
load_dotenv()


class BaseConfig:
    """
    Base configuration — settings shared by ALL environments.

    Other config classes inherit from this one.
    If a setting is the same everywhere, put it here.
    """

    # SECRET_KEY: Flask uses this to sign cookies and sessions.
    # In development, a default is fine. In production, this MUST be a random string.
    # Generate one: python -c "import secrets; print(secrets.token_hex(32))"
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")

    # SQLALCHEMY_DATABASE_URI: The connection string to your PostgreSQL database
    # Format: postgresql://username:password@host:port/database_name
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/inventory_db"
    )

    # SQLALCHEMY_TRACK_MODIFICATIONS: Disables a feature that tracks every
    # change to database objects. We don't need it and it wastes memory.
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Server settings (read from .env or use defaults)
    FLASK_HOST = os.environ.get("FLASK_HOST", "0.0.0.0")
    FLASK_PORT = int(os.environ.get("FLASK_PORT", 5000))

    # Pagination defaults — how many items per page in list APIs
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100


class DevelopmentConfig(BaseConfig):
    """
    Development configuration — for YOUR laptop.

    DEBUG = True means:
    - Flask shows detailed error pages with stack traces
    - The server auto-reloads when you save a file
    - Perfect for development, DANGEROUS in production
    """
    DEBUG = True
    FLASK_DEBUG = True


class TestingConfig(BaseConfig):
    """
    Testing configuration — for running pytest.

    Uses a SEPARATE database so tests don't corrupt your real data.
    TESTING = True tells Flask to behave differently (better error messages).
    """
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "TEST_DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/inventory_db_test"
    )


class ProductionConfig(BaseConfig):
    """
    Production configuration — for the live server.

    DEBUG = False means:
    - No detailed error pages (security risk!)
    - No auto-reload
    - Maximum performance
    """
    DEBUG = False
    FLASK_DEBUG = False


# Dictionary that maps config names to config classes
# Used in create_app(): app.config.from_object(config_by_name["development"])
config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}
