from fastapi import Depends
from functools import lru_cache
from src.core.config import settings
from src.core.database import PSQLService
from src.services.llm_service import LLMService
from src.services.embedding_service import EmbeddingService
from src.services.qdrant_service import QdrantService
from src.services.rerank_service import RerankService
from src.services.sync_service import SyncService
from src.rag.pipeline import Pipeline


@lru_cache()
def get_embedding_service() -> EmbeddingService:
    return EmbeddingService(
        dense_model_name=settings.DENSE_MODEL_NAME,
        sparse_model_name=settings.SPARSE_MODEL_NAME,
    )


@lru_cache()
def get_qdrant_service() -> QdrantService:
    return QdrantService(
        url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY, collection_name=settings.COLLECTION_NAME
    )


@lru_cache()
def get_llm_service() -> LLMService:
    return LLMService(api_key=settings.GROQ_API_KEY, model_name=settings.LLM_MODEL_NAME)


@lru_cache()
def get_rerank_service() -> RerankService:
    return RerankService(model_name=settings.RERANK_MODEL_NAME)


@lru_cache()
def get_psql_service() -> PSQLService:
    return PSQLService(
        host=settings.DB_HOST,
        database_name=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASS,
    )


def get_sync_service(
    psql_service: PSQLService = Depends(get_psql_service),
    qdrant_service: QdrantService = Depends(get_qdrant_service),
    embedding_service: EmbeddingService = Depends(get_embedding_service),
) -> SyncService:
    return SyncService(
        psql_service=psql_service,
        qdrant_service=qdrant_service,
        embedding_service=embedding_service,
    )


def get_rag_pipeline(
    llm: LLMService = Depends(get_llm_service),
    embed: EmbeddingService = Depends(get_embedding_service),
    qdrant: QdrantService = Depends(get_qdrant_service),
    rerank: RerankService = Depends(get_rerank_service),
) -> Pipeline:
    return Pipeline(
        llm_service=llm,
        embedding_service=embed,
        qdrant_service=qdrant,
        rerank_service=rerank,
    )
