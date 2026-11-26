"""Initial Lumi schema."""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("patients", sa.Column("id", sa.String(36), primary_key=True), sa.Column("display_name", sa.String(120), nullable=False), sa.Column("is_demo", sa.Boolean(), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    op.create_table("anamnesis_sessions", sa.Column("id", sa.String(36), primary_key=True), sa.Column("patient_id", sa.String(36), sa.ForeignKey("patients.id"), nullable=False), sa.Column("status", sa.String(30), nullable=False), sa.Column("channel", sa.String(30), nullable=False), sa.Column("provider_mode", sa.String(30), nullable=False), sa.Column("collected", sa.JSON(), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_anamnesis_sessions_patient_id", "anamnesis_sessions", ["patient_id"])
    op.create_index("ix_anamnesis_sessions_status", "anamnesis_sessions", ["status"])
    op.create_table("messages", sa.Column("id", sa.String(36), primary_key=True), sa.Column("session_id", sa.String(36), sa.ForeignKey("anamnesis_sessions.id", ondelete="CASCADE"), nullable=False), sa.Column("role", sa.String(20), nullable=False), sa.Column("content", sa.Text(), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_messages_session_id", "messages", ["session_id"])
    op.create_table("soap_reports", sa.Column("id", sa.String(36), primary_key=True), sa.Column("session_id", sa.String(36), sa.ForeignKey("anamnesis_sessions.id", ondelete="CASCADE"), nullable=False, unique=True), sa.Column("content", sa.JSON(), nullable=False), sa.Column("status", sa.String(30), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_soap_reports_session_id", "soap_reports", ["session_id"])
    op.create_index("ix_soap_reports_status", "soap_reports", ["status"])
    op.create_table("review_audits", sa.Column("id", sa.String(36), primary_key=True), sa.Column("report_id", sa.String(36), sa.ForeignKey("soap_reports.id", ondelete="CASCADE"), nullable=False), sa.Column("reviewer", sa.String(120), nullable=False), sa.Column("action", sa.String(30), nullable=False), sa.Column("notes", sa.Text(), nullable=False), sa.Column("edited_content", sa.JSON(), nullable=True), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    op.create_index("ix_review_audits_report_id", "review_audits", ["report_id"])


def downgrade():
    op.drop_table("review_audits")
    op.drop_table("soap_reports")
    op.drop_table("messages")
    op.drop_table("anamnesis_sessions")
    op.drop_table("patients")
