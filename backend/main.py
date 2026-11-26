import uuid
import hashlib
import secrets
import hmac
import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, select
from sqlalchemy.orm import Session

try:
    from .clinical import build_soap, detect_red_flags
    from .config import settings
    from .database import get_db
    from .models import AnamnesisSession, Message, Patient, ReviewAudit, SoapReport
    from .schemas import MessageCreate, ReportOut, ReviewIn, SessionCreate, SessionOut
    from .services import generate_reply
except ImportError:  # Vercel service root is backend/.
    from clinical import build_soap, detect_red_flags
    from config import settings
    from database import get_db
    from models import AnamnesisSession, Message, Patient, ReviewAudit, SoapReport
    from schemas import MessageCreate, ReportOut, ReviewIn, SessionCreate, SessionOut
    from services import generate_reply

app = FastAPI(title="Lumi Anamnese API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_credentials=False, allow_methods=["GET", "POST", "PATCH"], allow_headers=["Content-Type", "X-Clinician-Token", "X-Session-Token"])


@app.get("/", include_in_schema=False)
def frontend():
    return FileResponse(Path(__file__).resolve().parent.parent / "app.html")


def clinician_auth(x_clinician_token: str | None = Header(default=None)):
    if not x_clinician_token or x_clinician_token != settings.clinician_token:
        raise HTTPException(status_code=401, detail="Acesso profissional não autorizado.")


def get_session(session_id: str, db: Session) -> AnamnesisSession:
    try:
        parsed = str(uuid.UUID(session_id))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Identificador de sessão inválido.") from exc
    session = db.get(AnamnesisSession, parsed)
    if session is None:
        raise HTTPException(status_code=404, detail="Sessão não encontrada.")
    return session


def get_report(report_id: str, db: Session) -> SoapReport:
    try:
        parsed = str(uuid.UUID(report_id))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Identificador de relatório inválido.") from exc
    report = db.get(SoapReport, parsed)
    if report is None:
        raise HTTPException(status_code=404, detail="Relatório não encontrado.")
    return report


def session_out(session: AnamnesisSession) -> SessionOut:
    return SessionOut(id=session.id, patient_id=session.patient_id, status=session.status, channel=session.channel, provider_mode=session.provider_mode, informant_type=session.informant_type, collected=session.collected or {}, messages=session.messages, report_id=session.report.id if session.report else None)


def report_out(report: SoapReport) -> ReportOut:
    return ReportOut(id=report.id, session_id=report.session_id, informant_type=report.session.informant_type, status=report.status, content=report.content, created_at=report.created_at, messages=report.session.messages)


def require_session_access(session: AnamnesisSession, token: str | None):
    supplied = hashlib.sha256((token or "").encode()).hexdigest()
    if not session.access_token_hash or not hmac.compare_digest(session.access_token_hash, supplied):
        raise HTTPException(status_code=401, detail="Token de acesso da sessão inválido.")


@app.get("/api/health")
def health(db: Session = Depends(get_db)):
    if os.getenv("VERCEL") and not os.getenv("DATABASE_URL"):
        return {"status": "degraded", "provider": "groq" if settings.groq_api_key else "rules_demo", "transcription": bool(settings.groq_api_key), "database": "unavailable", "database_error": "database_url_missing"}
    database_error = None
    try:
        inspector = inspect(db.get_bind())
        required_tables = {"patients", "anamnesis_sessions", "messages", "soap_reports", "review_audits"}
        missing_tables = [table for table in required_tables if not inspector.has_table(table)]
        if missing_tables:
            database = "migration_required"
        elif "informant_type" not in {column["name"] for column in inspector.get_columns("anamnesis_sessions")}:
            database = "migration_required"
        else:
            database = "ready"
    except Exception as exc:
        database = "unavailable"
        original = getattr(exc, "orig", exc)
        sqlstate = getattr(original, "sqlstate", None) or getattr(original, "pgcode", None)
        if isinstance(original, ModuleNotFoundError) or type(original).__name__ == "NoSuchModuleError":
            database_error = "driver_missing"
        elif sqlstate in {"28P01", "28000"}:
            database_error = "authentication_failed"
        elif sqlstate and str(sqlstate).startswith("08"):
            database_error = "connection_failed"
        elif "timeout" in type(original).__name__.casefold():
            database_error = "connection_timeout"
        else:
            database_error = type(original).__name__
    return {"status": "ok" if database == "ready" else "degraded", "provider": "groq" if settings.groq_api_key else "rules_demo", "transcription": bool(settings.groq_api_key), "database": database, "database_error": database_error}

@app.post("/api/sessions", response_model=SessionOut, status_code=201)
def create_session(payload: SessionCreate, db: Session = Depends(get_db)):
    patient = Patient(display_name=payload.patient_name, is_demo=payload.demo)
    db.add(patient)
    db.flush()
    session_token = secrets.token_urlsafe(32)
    session = AnamnesisSession(patient_id=patient.id, access_token_hash=hashlib.sha256(session_token.encode()).hexdigest(), informant_type=payload.informant_type, channel=payload.channel, provider_mode="groq" if settings.groq_api_key else "rules_demo", collected={})
    db.add(session)
    db.add(Message(session=session, role="assistant", content="Olá! Sou a Lumi. Vou organizar o que você contar para a equipe de saúde. O que está incomodando você hoje?"))
    db.commit()
    db.refresh(session)
    result = session_out(session).model_dump()
    result["session_token"] = session_token
    return result


@app.get("/api/sessions/{session_id}", response_model=SessionOut)
def read_session(session_id: str, x_session_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    session = get_session(session_id, db)
    require_session_access(session, x_session_token)
    return session_out(session)


@app.post("/api/sessions/{session_id}/messages", response_model=SessionOut)
def send_message(session_id: str, payload: MessageCreate, x_session_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    session = get_session(session_id, db)
    require_session_access(session, x_session_token)
    if session.status != "in_progress":
        raise HTTPException(status_code=409, detail="Esta entrevista já foi finalizada.")
    patient_message = Message(session_id=session.id, role="user", content=payload.content.strip())
    db.add(patient_message)
    db.flush()
    alerts = detect_red_flags(payload.content)
    if alerts:
        answer = "O que você relatou pode precisar de atendimento imediato. Interrompa esta entrevista e procure uma unidade de emergência agora; se estiver no Brasil, ligue 192."
        session.status = "urgent"
        session.collected = {**(session.collected or {}), "alertas_red_flags": alerts}
        provider = session.provider_mode
    else:
        history = [{"role": message.role, "content": message.content} for message in session.messages if message.role in ("assistant", "user")]
        try:
            answer, collected, provider = generate_reply(history, session.collected or {})
        except RuntimeError as exc:
            db.rollback()
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        session.collected = collected
        session.provider_mode = provider
    db.add(Message(session_id=session.id, role="assistant", content=answer))
    session.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(session)
    return session_out(session)


@app.post("/api/sessions/{session_id}/audio")
async def upload_audio(session_id: str, file: UploadFile = File(...), x_session_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    session = get_session(session_id, db)
    require_session_access(session, x_session_token)
    if session.status != "in_progress":
        raise HTTPException(status_code=409, detail="Esta entrevista já foi finalizada.")
    audio_type = (file.content_type or "").split(";", 1)[0].strip().lower()
    if audio_type not in {"audio/webm", "audio/wav", "audio/mpeg", "audio/mp4", "audio/ogg", "audio/x-wav", "audio/mpga"}:
        raise HTTPException(status_code=415, detail="Formato de áudio não aceito.")
    content = await file.read(settings.max_audio_mb * 1024 * 1024 + 1)
    if len(content) > settings.max_audio_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Arquivo de áudio excede o limite configurado.")
    if not settings.groq_api_key:
        raise HTTPException(status_code=503, detail="Transcrição indisponível: configure GROQ_API_KEY para usar o serviço de áudio.")
    from groq import Groq
    try:
        result = Groq(api_key=settings.groq_api_key).audio.transcriptions.create(file=(file.filename or "audio.webm", content), model="whisper-large-v3-turbo", response_format="json", language="pt")
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Falha na transcrição. Confira a GROQ_API_KEY e os limites da conta Groq.") from exc
    transcript = (result.text or "").strip()
    if not transcript:
        raise HTTPException(status_code=422, detail="Não foi possível reconhecer fala nesse áudio. Tente gravar novamente.")
    return {"transcript": transcript}


@app.post("/api/sessions/{session_id}/finalize", response_model=ReportOut, status_code=201)
def finalize_session(session_id: str, x_session_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    session = get_session(session_id, db)
    require_session_access(session, x_session_token)
    if session.report:
        return report_out(session.report)
    alerts = session.collected.get("alertas_red_flags", [])
    content = build_soap(session.collected or {}, alerts, session.informant_type)
    report = SoapReport(session_id=session.id, content=content.model_dump())
    session.status = "pending_review"
    db.add(report)
    db.commit()
    db.refresh(report)
    return report_out(report)


@app.get("/api/reports/{report_id}", response_model=ReportOut, dependencies=[Depends(clinician_auth)])
def read_report(report_id: str, db: Session = Depends(get_db)):
    return report_out(get_report(report_id, db))


@app.get("/api/reports", dependencies=[Depends(clinician_auth)])
def list_reports(db: Session = Depends(get_db)):
    reports = db.scalars(select(SoapReport).order_by(SoapReport.created_at.desc())).all()
    return [{"id": r.id, "session_id": r.session_id, "status": r.status, "created_at": r.created_at, "patient_name": r.session.patient.display_name, "is_demo": r.session.patient.is_demo} for r in reports]


@app.patch("/api/reports/{report_id}/review", response_model=ReportOut, dependencies=[Depends(clinician_auth)])
def review_report(report_id: str, payload: ReviewIn, db: Session = Depends(get_db)):
    report = get_report(report_id, db)
    if payload.edited_content:
        report.content = payload.edited_content.model_dump()
    report.status = "approved" if payload.approved else "changes_requested"
    if payload.approved:
        report.session.status = "approved"
    db.add(ReviewAudit(report_id=report.id, reviewer=payload.reviewer, action=report.status, notes=payload.notes, edited_content=payload.edited_content.model_dump() if payload.edited_content else None))
    db.commit()
    db.refresh(report)
    return report_out(report)


@app.get("/api/reports/{report_id}/reviews", dependencies=[Depends(clinician_auth)])
def report_reviews(report_id: str, db: Session = Depends(get_db)):
    report = get_report(report_id, db)
    return [{"reviewer": r.reviewer, "action": r.action, "notes": r.notes, "created_at": r.created_at} for r in report.reviews]
