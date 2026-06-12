from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer


revision = 'f1a2b3c4d5e7'
down_revision = 'e1a2b3c4d5e6'
branch_labels = None
depends_on = None


def upgrade():
    # Create roles table
    op.create_table('roles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    
    # Seed roles table with default roles
    roles_table = table('roles',
        column('id', Integer),
        column('name', String)
    )
    
    op.bulk_insert(roles_table, [
        {'id': 1, 'name': 'admin'},
        {'id': 2, 'name': 'manager'},
        {'id': 3, 'name': 'staff'}
    ])


def downgrade():
    op.drop_table('users')
    op.drop_table('roles')
