from alembic import op
import sqlalchemy as sa

revision = 'g2b3c4d5e6f7'
down_revision = 'f1a2b3c4d5e7'
branch_labels = None
depends_on = None


def upgrade():
    # warehouse_stock is created by the module2 inventory migration (1a2d7377837f)
    pass


def downgrade():
    pass
