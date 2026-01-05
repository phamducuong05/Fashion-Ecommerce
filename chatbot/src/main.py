import logging

from fastapi import FastAPI
from src.core.logging import setup_logger
from src.api.v1.routers import router as v1_router

setup_logger()

logger = logging.getLogger(__name__)

app = FastAPI(title="Fashion ecommerce chatbot v1", version="1.0.0")

app.include_router(v1_router, prefix="/api/v1")


@app.get("/")
async def health_check():
    return {"status": "Chatbot service is healthy and ready to run."}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
