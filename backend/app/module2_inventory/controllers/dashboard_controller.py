"""
dashboard_controller.py — Dashboard HTTP Request Handler
===========================================================

Handles the dashboard summary endpoint:
  GET /dashboard/summary → Returns all KPIs for the frontend dashboard
"""

from app.module2_inventory.services import dashboard_service
from app.shared.responses.api_response import success_response, error_response
from app.core.exceptions.handlers import AppException


def get_summary():
    """
    GET /api/v1/dashboard/summary
    Returns a complete KPI summary for the dashboard.

    Response includes:
        - warehouses: count by status (total, active, inactive, maintenance)
        - stock_overview: total products, total quantity, total reserved
        - low_stock_alerts: items below reorder level
        - stock_by_warehouse: quantity per warehouse (for charts)
        - recent_movements: last 10 movements
    """
    try:
        summary = dashboard_service.get_summary()

        return success_response(
            data=summary,
            message="Dashboard summary retrieved successfully"
        )

    except AppException as e:
        return error_response(e.message, status_code=e.status_code)
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", status_code=500)
