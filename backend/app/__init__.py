"""
app/__init__.py — Application Factory
=======================================

WHAT IS THIS FILE?
This is the "brain" of the Flask backend. It creates and configures the
entire Flask application. This pattern is called the "Application Factory".

WHAT IS AN APPLICATION FACTORY?
Instead of creating the Flask app at the top of a file (like tutorials show),
we create it inside a function. Why?

  1. TESTING:  You can create different app instances for testing vs production
  2. MULTIPLE APPS:  You could run two versions of the app at once
  3. CLEAN IMPORTS:  No circular import problems
  4. INDUSTRY STANDARD:  Every serious Flask project uses this

HOW IT WORKS:
  1. create_app() is called from run.py
  2. It creates a Flask instance
  3. Loads configuration (database URL, secret key, etc.)
  4. Initializes extensions (SQLAlchemy, Marshmallow, Migrate)
  5. Registers blueprints (groups of routes for each module)
  6. Returns the fully configured app

WHAT IS A BLUEPRINT?
Think of a blueprint as a "mini-app". Each module (inventory, products, etc.)
is a blueprint with its own routes. Blueprints prevent URL conflicts and
let team members work independently.
"""

from flask import Flask
from flask_cors import CORS

from app.core.config.settings import config_by_name
from app.core.database.db import db, ma, migrate
from app.shared.error_handlers import register_error_handlers


def create_app(config_name: str = "development") -> Flask:
    """
    Create and configure the Flask application.

    Parameters:
        config_name (str): Which config to use — "development", "testing", or "production"
                           Default is "development" (for your local machine)

    Returns:
        Flask: A fully configured Flask application ready to handle requests
    """

    # ---- Step 1: Create Flask app ----
    # __name__ tells Flask where this package is located
    # Flask uses this to find templates, static files, etc.
    app = Flask(__name__)

    # ---- Step 2: Load configuration ----
    # This loads DATABASE_URL, SECRET_KEY, DEBUG mode, etc.
    # The config_by_name dictionary maps "development" → DevelopmentConfig class
    app.config.from_object(config_by_name[config_name])

    # ---- Step 3: Enable CORS ----
    # CORS = Cross-Origin Resource Sharing
    #
    # Problem: React runs on port 3000, Flask runs on port 5000.
    # Browsers block requests between different ports by default (security).
    # CORS tells the browser: "It's okay, allow React to call Flask."
    #
    # We only allow requests from http://localhost:3000 (React dev server)
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # ---- Step 4: Initialize extensions ----
    # Connect SQLAlchemy (database), Marshmallow (validation), and
    # Migrate (database migrations) to this Flask app
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)

    # Import models so Alembic can detect them
    from app.module2_inventory import models as _module2_models  # noqa: F401
    from app.modules.module1_products import models as _module1_models  # noqa: F401
    from app.modules.module3_orders import models as _module3_models  # noqa: F401

    # ---- Step 5: Register module blueprints ----
    _register_blueprints(app)

    # ---- Step 6: Register global error handlers ----
    register_error_handlers(app)

    # ---- Step 7: Health check endpoint ----
    # A simple endpoint to verify the API is running
    # Visit: http://localhost:5000/api/v1/health
    @app.route("/api/v1/health")
    def health_check():
        return {
            "status": "healthy",
            "modules": [
                "products",
                "inventory",
                "orders",
                "auth",
                "analytics",
            ],
            "version": "1.0.0"
        }

    return app


def _register_blueprints(app: Flask) -> None:
    """
    Register all module blueprints with the app.

    Each module gets a URL prefix so routes don't conflict:
      Module 2: /api/v1/warehouses, /api/v1/stock, /api/v1/movements
      Module 1: /api/v1/products (future)
      Module 3: /api/v1/orders (future)
    """
    # ----- Module 2: Inventory & Warehouse Management -----
    from app.module2_inventory.routes.warehouse_routes import warehouse_bp
    from app.module2_inventory.routes.stock_routes import stock_bp
    from app.module2_inventory.routes.movement_routes import movement_bp
    from app.module2_inventory.routes.dashboard_routes import dashboard_bp

    app.register_blueprint(warehouse_bp, url_prefix="/api/v1")
    app.register_blueprint(stock_bp, url_prefix="/api/v1")
    app.register_blueprint(movement_bp, url_prefix="/api/v1")
    app.register_blueprint(dashboard_bp, url_prefix="/api/v1")

    # ----- Module 1: Product & Supplier Management -----
    from app.modules.module1_products.routes import products_bp

    app.register_blueprint(products_bp, url_prefix="/api/v1")

    # ----- Module 3: Purchase & Sales Orders -----
    from app.modules.module3_orders.routes import orders_bp

    app.register_blueprint(orders_bp, url_prefix="/api/v1")

    # ----- Module 4: Auth, Analytics, Alerts -----
    from app.modules.module4_auth.routes import auth_bp
    from app.modules.module4_analytics.routes import analytics_bp

    app.register_blueprint(auth_bp, url_prefix="/api/v1")
    app.register_blueprint(analytics_bp, url_prefix="/api/v1")

