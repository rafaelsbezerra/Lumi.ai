from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class InitialContext(BaseModel):
    symptom_regions: list[str] = Field(default_factory=list, max_length=9)
    initial_symptoms: str = Field(default="", max_length=1000)


class SessionCreate(BaseModel):
    patient_name: str = Field(default="Paciente demonstrativo", min_length=1, max_length=120)
    channel: str = Field(default="web", pattern="^(web|whatsapp|kiosk|qr)$")
    informant_type: str = Field(default="patient", pattern="^(patient|companion|staff)$")
    demo: bool = True
    initial_context: InitialContext = Field(default_factory=InitialContext)


class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)


class LLMReply(BaseModel):
    answer: str = Field(min_length=1, max_length=1200)
    collected: dict[str, str] = Field(default_factory=dict)


class MessageOut(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SessionOut(BaseModel):
    id: str
    patient_id: str
    status: str
    channel: str
    provider_mode: str
    informant_type: str
    collected: dict
    messages: list[MessageOut]
    report_id: str | None = None
    session_token: str | None = None
    model_config = ConfigDict(from_attributes=True)


class SoapBody(BaseModel):
    subjetivo: str
    objetivo: str
    avaliacao: str
    plano: str


class HistoryBody(BaseModel):
    medicamentos_em_uso: list[str]
    alergias: list[str]
    comorbidades: list[str]


class SoapContent(BaseModel):
    queixa_principal: str
    tempo_evolucao: str
    fonte_relato: str = "Paciente"
    soap: SoapBody
    historico: HistoryBody
    alertas_red_flags: list[str]
    sugestoes_cid: list[str]


class ReviewIn(BaseModel):
    reviewer: str = Field(default="Profissional demonstrativo", min_length=1, max_length=120)
    notes: str = Field(default="", max_length=5000)
    approved: bool = True
    edited_content: SoapContent | None = None


class ReportOut(BaseModel):
    id: str
    session_id: str
    informant_type: str
    status: str
    content: SoapContent
    created_at: datetime
    messages: list[MessageOut] = Field(default_factory=list)
