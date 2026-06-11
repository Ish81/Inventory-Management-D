from flask import Flask, request
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
    
    # Manual CORS handling for development
    # Add CORS headers to all responses
    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get('Origin')
        allowed_origins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000']
        
        # Always add CORS headers if origin is from localhost
        if origin and ('localhost' in origin or '127.0.0.1' in origin):
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Max-Age'] = '3600'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response
    
    # Handle OPTIONS requests for preflight
    @app.before_request
    def handle_preflight():
        if request.method == 'OPTIONS':
            origin = request.headers.get('Origin')
            
            # Always allow OPTIONS for localhost origins
            if origin and ('localhost' in origin or '127.0.0.1' in origin):
                response = app.make_response('')
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
                response.headers['Access-Control-Max-Age'] = '3600'
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                response.status_code = 200
                return response
            # Return 200 OK for non-localhost OPTIONS as well (safer)
            return app.make_response('', 200)

    # Register blueprints (each module registers its own routes)
    from .modules.module3_orders.routes import orders_bp
    app.register_blueprint(orders_bp, url_prefix='/api/v1')

    from .modules.module1_products.routes import products_bp
    app.register_blueprint(products_bp, url_prefix='/api/v1')
    # Placeholders for future teammates' modules
    from .modules.module4_auth.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1')

    from .modules.module4_analytics.routes import analytics_bp
    app.register_blueprint(analytics_bp, url_prefix='/api/v1')

    # Register shared error handlers
    from .shared.error_handlers import register_error_handlers
    register_error_handlers(app)

    return app