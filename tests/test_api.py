import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.config import settings
from backend.database import Base, get_db
from backend.main import app


@pytest.fixture()
def client(monkeypatch):
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    Base.metadata.create_all(engine)
    def override_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_db
    monkeypatch.setattr(settings, "groq_api_key", "")
    monkeypatch.setattr(settings, "clinician_token", "test-token")
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(engine)
    engine.dispose()


def create_session(client):
    response = client.post("/api/sessions", json={"patient_name": "Paciente fictício", "demo": True})
    assert response.status_code == 201
    return response.json()


def patient_headers(session):
    return {"X-Session-Token": session["session_token"]}


def test_create_and_recover_session(client):
    session = create_session(client)
    recovered = client.get(f"/api/sessions/{session['id']}", headers=patient_headers(session))
    assert recovered.status_code == 200
    assert recovered.json()["messages"][0]["role"] == "assistant"
    assert recovered.json()["provider_mode"] == "rules_demo"


def test_message_history_and_adaptive_question(client):
    session = create_session(client)
    response = client.post(f"/api/sessions/{session['id']}/messages", headers=patient_headers(session), json={"content": "Estou com dor de cabeça"})
    assert response.status_code == 200
    data = response.json()
    assert [m["role"] for m in data["messages"]] == ["assistant", "user", "assistant"]
    assert "Quando isso começou" in data["messages"][-1]["content"]


def test_red_flag_stops_interview(client):
    session = create_session(client)
    response = client.post(f"/api/sessions/{session['id']}/messages", headers=patient_headers(session), json={"content": "Estou com falta de ar"})
    assert response.status_code == 200
    assert response.json()["status"] == "urgent"
    assert "192" in response.json()["messages"][-1]["content"]


def test_negated_red_flag_is_not_reported():
    from backend.clinical import detect_red_flags
    assert detect_red_flags("Não sinto dor no peito e não estou com falta de ar") == []
    assert detect_red_flags("Sinto dor no peito")


def test_finalize_validates_soap_and_does_not_invent_objective(client):
    session = create_session(client)
    client.post(f"/api/sessions/{session['id']}/messages", headers=patient_headers(session), json={"content": "Dor na lombar"})
    report = client.post(f"/api/sessions/{session['id']}/finalize", headers=patient_headers(session))
    assert report.status_code == 201
    content = report.json()["content"]
    assert content["soap"]["objetivo"].startswith("Sem dados objetivos")
    assert content["soap"]["avaliacao"]
    assert client.post(f"/api/sessions/{session['id']}/finalize", headers=patient_headers(session)).status_code == 201


def test_medical_report_requires_auth_and_can_be_approved(client):
    session = create_session(client)
    report = client.post(f"/api/sessions/{session['id']}/finalize", headers=patient_headers(session)).json()
    assert client.get(f"/api/reports/{report['id']}").status_code == 401
    headers = {"X-Clinician-Token": "test-token"}
    assert client.get(f"/api/reports/{report['id']}", headers=headers).status_code == 200
    approved = client.patch(f"/api/reports/{report['id']}/review", headers=headers, json={"reviewer": "Dra. Demo", "notes": "Revisado", "approved": True})
    assert approved.status_code == 200
    assert approved.json()["status"] == "approved"
    assert client.get(f"/api/reports/{report['id']}/reviews", headers=headers).json()[0]["action"] == "approved"


def test_bad_uuid_is_rejected(client):
    assert client.get("/api/sessions/not-a-uuid").status_code == 422


def test_report_schema_rejects_missing_soap_fields():
    from backend.schemas import SoapContent
    with pytest.raises(Exception):
        SoapContent.model_validate({"queixa_principal": "dor"})


def test_audio_requires_provider_and_validates_type(client):
    session = create_session(client)
    bad_type = client.post(f"/api/sessions/{session['id']}/audio", headers=patient_headers(session), files={"file": ("notes.txt", b"test", "text/plain")})
    assert bad_type.status_code == 415
    no_provider = client.post(f"/api/sessions/{session['id']}/audio", headers=patient_headers(session), files={"file": ("voice.wav", b"test", "audio/wav")})
    assert no_provider.status_code == 503


def test_provider_failure_is_reported_without_fake_answer(client, monkeypatch):
    from backend import services
    session = create_session(client)
    monkeypatch.setattr(settings, "groq_api_key", "configured-test-key")
    def unavailable(*args, **kwargs):
        raise RuntimeError("Provedor de IA indisponível ou resposta inválida.")
    monkeypatch.setattr(services, "generate_reply", unavailable)
    response = client.post(f"/api/sessions/{session['id']}/messages", headers=patient_headers(session), json={"content": "Dor de cabeça"})
    assert response.status_code == 503
    assert "indisponível" in response.json()["detail"]
    recovered = client.get(f"/api/sessions/{session['id']}", headers=patient_headers(session)).json()
    assert len(recovered["messages"]) == 1


def test_session_token_is_required_and_scoped(client):
    session = create_session(client)
    assert client.get(f"/api/sessions/{session['id']}").status_code == 401
    assert client.get(f"/api/sessions/{session['id']}", headers={"X-Session-Token": "wrong"}).status_code == 401
    assert client.get(f"/api/sessions/{session['id']}", headers=patient_headers(session)).status_code == 200


def test_llm_json_output_is_validated(monkeypatch):
    from types import SimpleNamespace
    from backend import services
    monkeypatch.setattr(settings, "groq_api_key", "configured-test-key")
    class FakeGroq:
        def __init__(self, **kwargs):
            self.chat = SimpleNamespace(completions=SimpleNamespace(create=lambda **_: SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content='{"answer":"Pergunta?","collected":[]}'))])))
    monkeypatch.setattr(services, "Groq", FakeGroq)
    with pytest.raises(RuntimeError):
        services.generate_reply([{"role": "user", "content": "Dor"}], {})
