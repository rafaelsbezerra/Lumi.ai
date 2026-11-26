import json

from groq import Groq

try:
    from .clinical import SYSTEM_PROMPT, decode_llm_json, local_reply
    from .config import settings
    from .schemas import LLMReply
except ImportError:  # Vercel service root is backend/.
    from clinical import SYSTEM_PROMPT, decode_llm_json, local_reply
    from config import settings
    from schemas import LLMReply


def generate_reply(history: list[dict], collected: dict) -> tuple[str, dict, str]:
    if not settings.groq_api_key:
        answer, facts = local_reply(collected, history[-1]["content"])
        return answer, facts, "rules_demo"
    try:
        client = Groq(api_key=settings.groq_api_key)
        response = client.chat.completions.create(
            model=settings.groq_model,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT + "\nInformações já coletadas: " + json.dumps(collected, ensure_ascii=False)},
                *history,
            ],
        )
        data = LLMReply.model_validate(decode_llm_json(response.choices[0].message.content or ""))
        answer = data.answer.strip()
        if not answer or answer.count("?") > 1:
            raise ValueError("A resposta deve conter no máximo uma pergunta.")
        return answer, {**collected, **data.collected}, "groq"
    except Exception as exc:
        raise RuntimeError("IA indisponível: confira a GROQ_API_KEY, se o modelo GROQ_MODEL está ativo e se há limite disponível na conta Groq.") from exc
