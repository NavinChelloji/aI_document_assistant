from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ai_doc_assistant"
    JWT_SECRET: str = "supersecretjwtkey_change_in_production"
    JWT_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CHROMA_PATH: str = "./chroma_data"
    OLLAMA_HOST: str = "http://localhost:11434"
    UPLOAD_DIR: str = "./uploads"
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

@lru_cache
def get_settings() -> Settings:
    return Settings()
