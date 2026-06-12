"""create module4 alerts and audit_logs tables

Revision ID: h3c4d5e6f7g8
Revises: g2b3c4d5e6f7
Create Date: 2026-06-12

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'h3c4d5e6f7g8'
down_revision = 'g2b3c4d5e6f7'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'alerts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('severity', sa.String(length=50), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=True),
        sa.Column('warehouse_id', sa.Integer(), nullable=True),
        sa.Column('is_read', sa.Boolean(), server_default=sa.text('false'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['product_id'], ['products.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    with op.batch_alter_table('alerts', schema=None) as batch_op:
        batch_op.create_index('idx_alerts_is_read_severity', ['is_read', 'severity'], unique=False)

    op.create_table(
        'audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('action_type', sa.String(length=100), nullable=False),
        sa.Column('entity_type', sa.String(length=100), nullable=True),
        sa.Column('entity_id', sa.Integer(), nullable=True),
        sa.Column('details', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=True),
        sa.Column('ip_address', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    with op.batch_alter_table('audit_logs', schema=None) as batch_op:
        batch_op.create_index('idx_audit_logs_user_id', ['user_id'], unique=False)
        batch_op.create_index('idx_audit_logs_created_at', ['created_at'], unique=False)


def downgrade():
    with op.batch_alter_table('audit_logs', schema=None) as batch_op:
        batch_op.drop_index('idx_audit_logs_created_at')
        batch_op.drop_index('idx_audit_logs_user_id')
    op.drop_table('audit_logs')

    with op.batch_alter_table('alerts', schema=None) as batch_op:
        batch_op.drop_index('idx_alerts_is_read_severity')
    op.drop_table('alerts')
