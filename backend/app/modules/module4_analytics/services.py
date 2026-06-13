from . import models

# --- ANALYTICS ---

def get_analytics_summary():
    total_products = models.get_total_products()
    low_stock_count = models.get_low_stock_count()
    inventory_valuation = models.get_inventory_valuation()
    monthly_orders = models.get_monthly_orders(months=6)
    
    return {
        'total_products': total_products,
        'low_stock_count': low_stock_count,
        'inventory_valuation': round(inventory_valuation, 2),
        'monthly_orders': monthly_orders
    }

# --- ALERTS ---

def check_low_stock():
    try:
        low_stock_items = models.get_low_stock_items()
        
        for item in low_stock_items:
            product_id = item['product_id']
            existing_alert = models.get_existing_low_stock_alert_today(product_id)
            
            if existing_alert:
                continue
                
            quantity = item['quantity_available']
            reorder_level = item['reorder_level']
            product_name = item['product_name']
            warehouse_id = item['warehouse_id']
            
            severity = 'critical' if quantity == 0 else 'warning'
            message = f"{product_name} is low on stock ({quantity} remaining, reorder at {reorder_level})"
            
            models.create_alert(
                alert_type='low_stock',
                severity=severity,
                message=message,
                product_id=product_id,
                warehouse_id=warehouse_id
            )
    except Exception:
        # Fails silently as requested
        pass

def format_alerts(raw_rows):
    alerts = []
    for row in raw_rows:
        alert = {
            'id': row['id'],
            'type': row['type'],
            'severity': row['severity'],
            'message': row['message'],
            'product_id': row['product_id'],
            'warehouse_id': row['warehouse_id'],
            'is_read': row['is_read'],
            'created_at': row['created_at'].isoformat() if row.get('created_at') else None,
            'updated_at': row['updated_at'].isoformat() if row.get('updated_at') else None
        }
        alerts.append(alert)
    return alerts

def format_audit_logs(raw_rows):
    logs = []
    for row in raw_rows:
        logs.append({
            'id': row['id'],
            'user_email': row['user_email'],
            'action_type': row['action_type'],
            'entity_type': row['entity_type'],
            'entity_id': row['entity_id'],
            'details': row['details'],
            'created_at': row['created_at'].isoformat() if row.get('created_at') else None
        })
    return logs
