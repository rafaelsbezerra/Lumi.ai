"""Record who provided the interview answers."""
from alembic import op
import sqlalchemy as sa

revision = "0003_informant_type"
down_revision = "0002_session_access_token"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("anamnesis_sessions", sa.Column("informant_type", sa.String(20), nullable=False, server_default="patient"))


def downgrade():
    op.drop_column("anamnesis_sessions", "informant_type")
