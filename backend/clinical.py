import json
import re

try:
    from .schemas import SoapContent
except ImportError:  # Vercel service root is backend/.
    from schemas import SoapContent

RED_FLAGS = {
    "dor no peito": "Relato de dor no peito",
    "falta de ar": "Relato de falta de ar",
    "dificuldade para respirar": "Relato de dificuldade para respirar",
    "desmaiei": "Relato de desmaio",
    "desmaio": "Relato de desmaio",
    "fraqueza de um lado": "Relato de fraqueza súbita de um lado do corpo",
    "rosto torto": "Relato de alteração súbita na face",
    "dificuldade para falar": "Relato de dificuldade súbita para falar",
    "sangramento intenso": "Relato de sangramento intenso",
    "sangramento que não para": "Relato de sangramento que não para",
    "convulsão": "Relato de convulsão",
    "reação alérgica grave": "Relato de possível reação alérgica grave",
    "língua inchada": "Relato de inchaço da língua",
    "rosto inchado": "Relato de inchaço no rosto",
    "fala enrolada": "Relato de alteração súbita na fala",
    "confusão súbita": "Relato de confusão súbita",
    "quero me matar": "Relato de risco de autoagressão",
    "suicídio": "Relato relacionado a suicídio",
}

SYSTEM_PROMPT = """Você é um assistente de coleta inicial de informações de saúde. Converse sempre em português brasileiro simples, com empatia. Faça somente UMA pergunta por mensagem. Não diagnostique, não prescreva nem recomende tratamento. Não invente dados e deixe claro que informações são relatadas pelo paciente. Adapte a entrevista ao relato, evite perguntas repetidas ou irrelevantes e não assuma que sinais não mencionados estão ausentes. Se aparecer sinal de emergência, interrompa a entrevista, oriente a procurar atendimento imediato ou ligar 192 no Brasil e não faça outra pergunta. Retorne JSON com answer e collected (objeto com fatos explicitamente ditos)."""


def detect_red_flags(text: str) -> list[str]:
    normalized = re.sub(r"\s+", " ", text.casefold())
    alerts = []
    for phrase, alert in RED_FLAGS.items():
        negated = re.search(rf"\b(não|nega|sem|nunca)\s+(?:tenho|estou com|sinto|sentindo|tive|apresento|percebi)?\s*{re.escape(phrase)}\b", normalized)
        if phrase in normalized and not negated:
            alerts.append(alert)
    return list(dict.fromkeys(alerts))


def next_question(collected: dict, text: str) -> str:
    all_text = " ".join([*collected.values(), text]).casefold()
    if not collected.get("queixa_principal"):
        return "O que está incomodando você hoje?"
    if not collected.get("tempo_evolucao"):
        return "Quando isso começou?"
    if any(word in all_text for word in ("dor", "desconforto", "ardência", "pontada")) and "intensidade" not in collected:
        return "De 0 a 10, quanto está incomodando agora?"
    if "sintomas_associados" not in collected:
        return "Além disso, percebeu algum outro sintoma?"
    if "medicamentos_em_uso" not in collected:
        return "Está usando algum medicamento atualmente?"
    if "alergias" not in collected:
        return "Tem alguma alergia conhecida?"
    if "comorbidades" not in collected:
        return "Há alguma condição de saúde ou histórico importante que gostaria de contar?"
    return "Obrigado por compartilhar. Você gostaria de acrescentar mais alguma informação antes de concluir?"


def local_reply(collected: dict, text: str) -> tuple[str, dict]:
    """Transparent rule-based demonstration only; never represented as an LLM response."""
    facts = dict(collected)
    if not facts.get("queixa_principal"):
        facts["queixa_principal"] = text
    elif not facts.get("tempo_evolucao"):
        facts["tempo_evolucao"] = text
    else:
        question = next_question(collected, text)
        key = "intensidade" if question.startswith("De 0 a 10") else "sintomas_associados" if "outro sintoma" in question else "medicamentos_em_uso" if "medicamento" in question else "alergias" if "alergia" in question else "comorbidades" if "condição de saúde" in question else "informacoes_adicionais"
        facts[key] = text
    return next_question(facts, ""), facts


def build_soap(collected: dict, alerts: list[str], informant_type: str = "patient") -> SoapContent:
    complaint = collected.get("queixa_principal", "Não informada")
    duration = collected.get("tempo_evolucao", "Não informado")
    source_labels = {"patient": "Paciente", "companion": "Acompanhante ou responsável", "staff": "Equipe de atendimento assistido"}
    source = source_labels.get(informant_type, "Relator não identificado")
    subjective = "; ".join(f"{key.replace('_', ' ')}: {value}" for key, value in collected.items()) or "Nenhuma informação foi coletada."
    report = {
        "queixa_principal": complaint,
        "tempo_evolucao": duration,
        "fonte_relato": source,
        "soap": {
            "subjetivo": f"Relato do paciente: {subjective}",
            "objetivo": "Sem dados objetivos ou sinais vitais disponíveis nesta entrevista.",
            "avaliacao": "Síntese preliminar das informações relatadas, sem diagnóstico. Requer revisão por profissional habilitado.",
            "plano": "Encaminhar para revisão profissional. Em caso de sinal de emergência, procurar atendimento imediato ou ligar 192.",
        },
        "historico": {
            "medicamentos_em_uso": [collected["medicamentos_em_uso"]] if collected.get("medicamentos_em_uso") and collected["medicamentos_em_uso"].casefold() not in ("não", "não informado", "nenhum") else [],
            "alergias": [collected["alergias"]] if collected.get("alergias") and collected["alergias"].casefold() not in ("não", "não informado", "nenhuma") else [],
            "comorbidades": [collected["comorbidades"]] if collected.get("comorbidades") and collected["comorbidades"].casefold() not in ("não", "não informado", "nenhuma") else [],
        },
        "alertas_red_flags": alerts,
        "sugestoes_cid": [],
    }
    return SoapContent.model_validate(report)


def decode_llm_json(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?|```$", "", cleaned, flags=re.I).strip()
    return json.loads(cleaned)
