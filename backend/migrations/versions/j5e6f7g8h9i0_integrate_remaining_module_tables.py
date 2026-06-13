"""integrate remaining module tables for existing databases

Revision ID: j5e6f7g8h9i0
Revises: 1a2d7377837f
Create Date: 2026-06-13

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = 'j5e6f7g8h9i0'
down_revision = '1a2d7377837f'
branch_labels = None
depends_on = None


def _table_exists(table_name):
    bind = op.get_bind()
    return table_name in inspect(bind).get_table_names()


def upgrade():
    if not _table_exists('purchase_orders'):
        op.create_table(
            'purchase_orders',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('po_number', sa.String(length=50), nullable=False),
            sa.Column('supplier_id', sa.Integer(), nullable=True),
            sa.Column('supplier_name', sa.String(length=200), nullable=False),
            sa.Column('order_date', sa.DateTime(timezone=True), nullable=False),
            sa.Column('expected_delivery_date', sa.DateTime(timezone=True), nullable=True),
            sa.Column('status', sa.String(length=50), nullable=False),
            sa.Column('total_amount', sa.Numeric(precision=12, scale=2), nullable=False),
            sa.Column('notes', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint('id'),
        )
        with op.batch_alter_table('purchase_orders', schema=None) as batch_op:
            batch_op.create_index(batch_op.f('ix_purchase_orders_po_number'), ['po_number'], unique=True)
            batch_op.create_index(batch_op.f('ix_purchase_orders_status'), ['status'], unique=False)

        op.create_table(
            'sales_orders',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('so_number', sa.String(length=50), nullable=False),
            sa.Column('customer_name', sa.String(length=200), nullable=False),
            sa.Column('customer_email', sa.String(length=200), nullable=True),
            sa.Column('customer_phone', sa.String(length=50), nullable=True),
            sa.Column('order_date', sa.DateTime(timezone=True), nullable=False),
            sa.Column('status', sa.String(length=50), nullable=False),
            sa.Column('total_amount', sa.Numeric(precision=12, scale=2), nullable=False),
            sa.Column('notes', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint('id'),
        )
        with op.batch_alter_table('sales_orders', schema=None) as batch_op:
            batch_op.create_index(batch_op.f('ix_sales_orders_so_number'), ['so_number'], unique=True)
            batch_op.create_index(batch_op.f('ix_sales_orders_status'), ['status'], unique=False)

        op.create_table(
            'purchase_order_items',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('purchase_order_id', sa.Integer(), nullable=False),
            sa.Column('product_id', sa.Integer(), nullable=True),
            sa.Column('product_name', sa.String(length=200), nullable=False),
            sa.Column('product_sku', sa.String(length=100), nullable=True),
            sa.Column('quantity', sa.Integer(), nullable=False),
            sa.Column('unit_price', sa.Numeric(precision=10, scale=2), nullable=False),
            sa.Column('total_price', sa.Numeric(precision=12, scale=2), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(['purchase_order_id'], ['purchase_orders.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
        )
        with op.batch_alter_table('purchase_order_items', schema=None) as batch_op:
            batch_op.create_index(batch_op.f('ix_purchase_order_items_purchase_order_id'), ['purchase_order_id'], unique=False)

        op.create_table(
            'sales_order_items',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('sales_order_id', sa.Integer(), nullable=False),
            sa.Column('product_id', sa.Integer(), nullable=True),
            sa.Column('product_name', sa.String(length=200), nullable=False),
            sa.Column('product_sku', sa.String(length=100), nullable=True),
            sa.Column('quantity', sa.Integer(), nullable=False),
            sa.Column('unit_price', sa.Numeric(precision=10, scale=2), nullable=False),
            sa.Column('total_price', sa.Numeric(precision=12, scale=2), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(['sales_order_id'], ['sales_orders.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
        )
        with op.batch_alter_table('sales_order_items', schema=None) as batch_op:
            batch_op.create_index(batch_op.f('ix_sales_order_items_sales_order_id'), ['sales_order_id'], unique=False)

    if not _table_exists('categories'):
        op.create_table(
            'categories',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('name', sa.String(length=100), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('name'),
        )
        op.create_table(
            'suppliers',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('name', sa.String(length=150), nullable=False),
            sa.Column('contact_person', sa.String(length=100), nullable=True),
            sa.Column('email', sa.String(length=120), nullable=False),
            sa.Column('phone', sa.String(length=20), nullable=True),
            sa.Column('address', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('email'),
        )
        op.create_table(
            'products',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('category_id', sa.Integer(), nullable=False),
            sa.Column('supplier_id', sa.Integer(), nullable=False),
            sa.Column('name', sa.String(length=200), nullable=False),
            sa.Column('sku', sa.String(length=50), nullable=False),
            sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('reorder_level', sa.Integer(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(['category_id'], ['categories.id']),
            sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id']),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('sku'),
        )
        with op.batch_alter_table('products') as batch_op:
            batch_op.create_index('ix_products_sku', ['sku'], unique=True)


def downgrade():
    if _table_exists('products'):
        op.drop_table('products')
    if _table_exists('suppliers'):
        op.drop_table('suppliers')
    if _table_exists('categories'):
        op.drop_table('categories')
    if _table_exists('sales_order_items'):
        op.drop_table('sales_order_items')
    if _table_exists('purchase_order_items'):
        op.drop_table('purchase_order_items')
    if _table_exists('sales_orders'):
        op.drop_table('sales_orders')
    if _table_exists('purchase_orders'):
        op.drop_table('purchase_orders')
