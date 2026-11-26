from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DATABASE_URL = f"sqlite:///{PROJECT_DIR.as_posix()}/lumi.db"


class Settings(BaseSettings):
    database_url: str = DEFAULT_DATABASE_URL
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-120b"
    clinician_token: str = "local-demo-token-change-me"
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:5500,http://localhost:8000"
    max_audio_mb: int = 15
    database_pool_size: int = 1
    database_max_overflow: int = 0

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
