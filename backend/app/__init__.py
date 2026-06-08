from flask import Flask
from .config import config_map
from .extensions import db, migrate, cors


def create_app(config_name='development'):
    """
    Application factory function.
    Creates and configures the Flask application.
    
    Args:
        config_name: Which config to use ('development' or 'production')
    
    Returns:
        Configured Flask application instance
    """
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config_map[config_name])

    # Initialize extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={
        r"/api/*": {"origins": "http://localhost:5173"}  # React dev server
    })

    # Register blueprints (each module registers its own routes)
    from .modules.module3_orders.routes import orders_bp
    app.register_blueprint(orders_bp, url_prefix='/api/v1')

    # Placeholders for future teammates' modules
    # from .modules.module1_products.routes import products_bp
    # app.register_blueprint(products_bp, url_prefix='/api/v1')

    # Register shared error handlers
    from .shared.error_handlers import register_error_handlers
    register_error_handlers(app)

    return app