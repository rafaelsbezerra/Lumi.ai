"""Store a hash for each patient's session access token."""
from alembic import op
import sqlalchemy as sa

revision = "0002_session_access_token"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("anamnesis_sessions", sa.Column("access_token_hash", sa.String(64), nullable=False, server_default=""))


def downgrade():
    op.drop_column("anamnesis_sessions", "access_token_hash")
