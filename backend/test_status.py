from app import create_app
from app.modules.module3_orders.services import update_purchase_order_status, update_sales_order_status
from app.modules.module3_orders.models import PurchaseOrder, SalesOrder
from app.core.database.db import db

app = create_app('development')

with app.app_context():
    po = PurchaseOrder.query.first()
    if po:
        print(f"Trying to update PO {po.id} status to 'pending'")
        try:
            res, err = update_purchase_order_status(po.id, 'pending')
            print(f"PO update result: {res}, Error: {err}")
        except Exception as e:
            import traceback
            traceback.print_exc()
            
    so = SalesOrder.query.first()
    if so:
        print(f"Trying to update SO {so.id} status to 'confirmed'")
        try:
            res, err = update_sales_order_status(so.id, 'confirmed')
            print(f"SO update result: {res}, Error: {err}")
        except Exception as e:
            import traceback
            traceback.print_exc()
