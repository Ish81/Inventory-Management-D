from .warehouse_routes import warehouse_bp
from .stock_routes import stock_bp
from .movement_routes import movement_bp
from .dashboard_routes import dashboard_bp

__all__ = [
    'warehouse_bp',
    'stock_bp',
    'movement_bp',
    'dashboard_bp',
]
