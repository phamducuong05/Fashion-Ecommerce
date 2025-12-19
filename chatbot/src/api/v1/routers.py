from fastapi import APIRouter, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from src.api.v1.schemas import ChatRequest, ProductSyncRequest, SyncResponse
from src.api.dependencies import get_rag_pipeline, get_sync_service, get_qdrant_service
from src.rag.pipeline import Pipeline
from src.services.sync_service import SyncService
from src.services.qdrant_service import QdrantService

router = APIRouter()


@router.post("/chat")
async def chat_endpoints(
    request: ChatRequest, pipeline: Pipeline = Depends(get_rag_pipeline)
):

    response_generator = await pipeline.get_response(session_id=request.session_id, user_query=request.query)

    return StreamingResponse(response_generator, media_type="text/event-stream")


@router.post("/sync/product", response_model=SyncResponse)
async def sync_product_endpoint(
    background_tasks: BackgroundTasks,
    request: ProductSyncRequest,
    sync_service: SyncService = Depends(get_sync_service),
    qdrant_service: QdrantService = Depends(get_qdrant_service),
):
    if request.action == "update":
        # Đẩy việc nặng (Embed + Upsert) vào background
        background_tasks.add_task(sync_service.sync_specifics, [request.product_id])
        return {
            "status": "success",
            "message": f"Update product with ID {request.product_id} to Qdrant.",
        }

    elif request.action == "update_all":
        # Đẩy việc nặng (Embed + Upsert) vào background
        background_tasks.add_task(sync_service.sync_all)
        return {"status": "success", "message": f"Update all products to Qdrant."}

    elif request.action == "delete":
        background_tasks.add_task(qdrant_service.delete_products, [request.product_id])
        return {
            "status": "success",
            "message": f"Delete product with ID {request.product_id} from Qdrant.",
        }
