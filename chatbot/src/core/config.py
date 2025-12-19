from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # API_KEY
    GROQ_API_KEY: str

    # LANGCACHE
    LANGCACHE_SERVER_URL: str
    LANGCACHE_CACHE_ID: str
    LANGCACHE_API_KEY: str
    
    # REDIS CHATBOT MEMORY
    REDIS_SERVER_URL: str

    # QDRANT
    QDRANT_URL: str
    QDRANT_API_KEY: str
    COLLECTION_NAME: str

    # PostgreSQL
    DB_HOST: str
    DB_PORT: int = 5432
    DB_NAME: str
    DB_USER: str
    DB_PASS: str

    # AI core
    LLM_MODEL_NAME: str
    DENSE_MODEL_NAME: str
    SPARSE_MODEL_NAME: str
    RERANK_MODEL_NAME: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings():
    """Load config only once (singleton)."""
    return Settings()


settings = get_settings()
