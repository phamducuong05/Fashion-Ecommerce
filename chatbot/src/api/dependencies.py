from functools import lru_cache
from src.core.config import settings
from src.core.database import PSQLService
from src.services.llm_service import LLMService
from src.services.semantic_router_service import SemanticRouterService
from src.services.embedding_service import EmbeddingService
from src.services.memory_service import MemoryService
from src.services.qdrant_service import QdrantService
from src.services.rerank_service import RerankService
from src.services.sync_service import SyncService
from src.services.cache_service import CacheService
from src.rag.pipeline import Pipeline

@lru_cache()
def get_settings():
    return settings

@lru_cache()
def get_psql_service() -> PSQLService:
    return PSQLService(
        host=settings.DB_HOST,
        database_name=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASS,
    )

@lru_cache()
def get_qdrant_service() -> QdrantService:
    return QdrantService(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY,
        collection_name=settings.COLLECTION_NAME,
    )

@lru_cache()
def get_embedding_service() -> EmbeddingService:
    return EmbeddingService(
        dense_model_name=settings.DENSE_MODEL_NAME,
        sparse_model_name=settings.SPARSE_MODEL_NAME,
    )

@lru_cache()
def get_llm_service() -> LLMService:
    return LLMService(
        api_key=settings.GROQ_API_KEY,
        model_name=settings.LLM_MODEL_NAME,
    )

@lru_cache()
def get_rerank_service() -> RerankService:
    return RerankService(model_name=settings.RERANK_MODEL_NAME)

@lru_cache()
def get_cache_service() -> CacheService:
    return CacheService(
        server_url=settings.LANGCACHE_SERVER_URL,
        cache_id=settings.LANGCACHE_CACHE_ID,
        api_key=settings.LANGCACHE_API_KEY,
    )

@lru_cache()
def get_semantic_router_service() -> SemanticRouterService:
    return SemanticRouterService()

@lru_cache()
def get_memory_service() -> MemoryService:
    return MemoryService(
        db_service=get_psql_service(),
    )

@lru_cache()
def get_sync_service() -> SyncService:
    return SyncService(
        psql_service=get_psql_service(),
        qdrant_service=get_qdrant_service(),
        embedding_service=get_embedding_service(),
    )

@lru_cache()
def get_rag_pipeline() -> Pipeline:
    return Pipeline(
        semantic_router_service=get_semantic_router_service(),
        llm_service=get_llm_service(),
        embedding_service=get_embedding_service(),
        memory_service=get_memory_service(),
        qdrant_service=get_qdrant_service(),
        rerank_service=get_rerank_service(),
        cache_service=get_cache_service(),
    )