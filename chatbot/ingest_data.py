import sys
import os
import asyncio
import logging

from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.core.database import PSQLService
from src.services.embedding_service import EmbeddingService
from src.services.qdrant_service import QdrantService
from src.services.sync_service import SyncService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# TODO: Load from config instead
load_dotenv()

# QDRANT
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

# PostgreSQL
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

# AI core
DENSE_MODEL_NAME = os.getenv("DENSE_MODEL_NAME")
SPARSE_MODEL_NAME = os.getenv("SPARSE_MODEL_NAME")

BATCH_SIZE = 50


async def main():
    # 1. Initialize Services
    psql_service = PSQLService(
        host=DB_HOST, 
        database_name=DB_NAME, 
        user=DB_USER, 
        password=DB_PASS
    )
    
    embedding_service = EmbeddingService(
        dense_model_name=DENSE_MODEL_NAME, 
        sparse_model_name=SPARSE_MODEL_NAME
    )
    
    qdrant_service = QdrantService(
        url=QDRANT_URL, 
        api_key=QDRANT_API_KEY, 
        collection_name=COLLECTION_NAME
    )

    qdrant_service.create_collection_hybrid()

    sync_service = SyncService(
        psql_service=psql_service,
        embedding_service=embedding_service,
        qdrant_service=qdrant_service,
    )

    try:
        await sync_service.sync_all(batch=BATCH_SIZE)
        
    except Exception as e:
        logger.error(f"Ingestion process failed: {e}")
        
    finally:
        await psql_service.dispose()
        logger.info("Resources cleaned up.")


if __name__ == "__main__":
    asyncio.run(main())