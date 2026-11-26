import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

try:
    from .database import Base
except ImportError:  # Vercel service root is backend/.
    from database import Base


def now_utc():
    return datetime.now(timezone.utc)


class Patient(Base):
    __tablename__ = "patients"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    display_name: Mapped[str] = mapped_column(String(120), default="Paciente demonstrativo")
    is_demo: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    sessions: Mapped[list["AnamnesisSession"]] = relationship(back_populates="patient")


class AnamnesisSession(Base):
    __tablename__ = "anamnesis_sessions"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    access_token_hash: Mapped[str] = mapped_column(String(64), default="")
    informant_type: Mapped[str] = mapped_column(String(20), default="patient")
    status: Mapped[str] = mapped_column(String(30), default="in_progress", index=True)
    channel: Mapped[str] = mapped_column(String(30), default="web")
    provider_mode: Mapped[str] = mapped_column(String(30), default="rules_demo")
    collected: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    patient: Mapped[Patient] = relationship(back_populates="sessions")
    messages: Mapped[list["Message"]] = relationship(back_populates="session", cascade="all, delete-orphan", order_by="Message.created_at")
    report: Mapped["SoapReport | None"] = relationship(back_populates="session", uselist=False, cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id: Mapped[str] = mapped_column(ForeignKey("anamnesis_sessions.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(20))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    session: Mapped[AnamnesisSession] = relationship(back_populates="messages")


class SoapReport(Base):
    __tablename__ = "soap_reports"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id: Mapped[str] = mapped_column(ForeignKey("anamnesis_sessions.id", ondelete="CASCADE"), unique=True, index=True)
    content: Mapped[dict] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String(30), default="pending_review", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    session: Mapped[AnamnesisSession] = relationship(back_populates="report")
    reviews: Mapped[list["ReviewAudit"]] = relationship(back_populates="report", cascade="all, delete-orphan")


class ReviewAudit(Base):
    __tablename__ = "review_audits"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    report_id: Mapped[str] = mapped_column(ForeignKey("soap_reports.id", ondelete="CASCADE"), index=True)
    reviewer: Mapped[str] = mapped_column(String(120))
    action: Mapped[str] = mapped_column(String(30))
    notes: Mapped[str] = mapped_column(Text, default="")
    edited_content: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    report: Mapped[SoapReport] = relationship(back_populates="reviews")
