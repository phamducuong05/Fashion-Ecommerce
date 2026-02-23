import logging

from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.core.logging import setup_logger
from src.api.v1.routers import router as v1_router
from src.api.dependencies import get_rag_pipeline, get_sync_service, get_qdrant_service

setup_logger()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up services...")

    pipeline = get_rag_pipeline()
    sync_service = get_sync_service()
    qdrant_service = get_qdrant_service()

    logger.info("All services initialized")

    yield

    logger.info("Shutting down...")

app = FastAPI(title="Fashion ecommerce chatbot v1", version="1.0.0", lifespan=lifespan)

app.include_router(v1_router, prefix="/api/v1")

@app.get("/")
async def health_check():
    
    return {"status": "Chatbot service is healthy and ready to run."}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
