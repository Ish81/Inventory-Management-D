from app.db import get_connection

# --- ANALYTICS ---

def get_total_products():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) as count FROM products")
            result = cur.fetchone()
            return result['count'] if result else 0
    finally:
        conn.close()

def get_low_stock_count():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT COUNT(*) as count 
                FROM warehouse_stock ws
                JOIN products p ON ws.product_id = p.id
                WHERE ws.quantity_available < p.reorder_level
            """)
            result = cur.fetchone()
            return result['count'] if result else 0
    finally:
        conn.close()

def get_inventory_valuation():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT SUM(ws.quantity_available * p.price) as total_value
                FROM warehouse_stock ws
                JOIN products p ON ws.product_id = p.id
            """)
            result = cur.fetchone()
            return float(result['total_value']) if result and result['total_value'] is not None else 0.0
    finally:
        conn.close()

def get_monthly_orders(months=6):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(f"""
                WITH combined_orders AS (
                    SELECT order_date FROM purchase_orders
                    UNION ALL
                    SELECT order_date FROM sales_orders
                )
                SELECT 
                    TO_CHAR(order_date, 'Mon YYYY') as month_str,
                    COUNT(*) as count,
                    DATE_TRUNC('month', order_date) as month_date
                FROM combined_orders
                WHERE order_date >= (CURRENT_DATE - INTERVAL '{months} months')
                GROUP BY month_str, month_date
                ORDER BY month_date ASC
            """)
            results = cur.fetchall()
            return [{'month': row['month_str'], 'count': row['count']} for row in results] if results else []
    finally:
        conn.close()


# --- ALERTS ---

def get_alerts(is_read=None, severity=None):
    conn = get_connection()
    try:
        query = "SELECT * FROM alerts"
        conditions = []
        params = []
        
        if is_read is not None:
            conditions.append("is_read = %s")
            params.append(is_read)
            
        if severity is not None:
            conditions.append("severity = %s")
            params.append(severity)
            
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
            
        query += """ 
            ORDER BY 
            CASE severity 
                WHEN 'critical' THEN 1 
                WHEN 'warning' THEN 2 
                WHEN 'info' THEN 3 
                ELSE 4 
            END ASC,
            created_at DESC
        """
        
        with conn.cursor() as cur:
            cur.execute(query, tuple(params))
            results = cur.fetchall()
            return results if results else []
    finally:
        conn.close()

def get_existing_low_stock_alert_today(product_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id FROM alerts
                WHERE type = 'low_stock' 
                AND product_id = %s
                AND is_read = FALSE
                AND DATE(created_at) = CURRENT_DATE
            """, (product_id,))
            result = cur.fetchone()
            return result['id'] if result else None
    finally:
        conn.close()

def create_alert(alert_type, severity, message, product_id=None, warehouse_id=None):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO alerts (type, severity, message, product_id, warehouse_id)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING *
            """, (alert_type, severity, message, product_id, warehouse_id))
            alert = cur.fetchone()
            conn.commit()
            return alert
    finally:
        conn.close()

def mark_alert_read(alert_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE alerts
                SET is_read = TRUE
                WHERE id = %s
                RETURNING *
            """, (alert_id,))
            alert = cur.fetchone()
            conn.commit()
            return alert
    finally:
        conn.close()

def get_audit_logs():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT a.id, u.email as user_email, a.action_type, a.entity_type, 
                       a.entity_id, a.details, a.created_at
                FROM audit_logs a
                LEFT JOIN users u ON a.user_id = u.id
                ORDER BY a.created_at DESC
            """)
            results = cur.fetchall()
            return results if results else []
    finally:
        conn.close()

def get_low_stock_items():
    """Helper for services.check_low_stock()"""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT p.id as product_id, p.name as product_name, p.reorder_level, 
                       ws.quantity_available, ws.warehouse_id
                FROM warehouse_stock ws
                JOIN products p ON ws.product_id = p.id
                WHERE ws.quantity_available < p.reorder_level
            """)
            results = cur.fetchall()
            return results if results else []
    finally:
        conn.close()
