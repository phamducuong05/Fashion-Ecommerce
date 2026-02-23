import logging
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from src.api.v1.schemas import (
    ChatRequest,
    ChatResponse,
    ProductSyncRequest,
    SyncResponse,
    BulkProductSyncRequest
)
from src.api.dependencies import get_rag_pipeline, get_sync_service, get_qdrant_service
from src.rag.pipeline import Pipeline
from src.services.sync_service import SyncService
from src.services.qdrant_service import QdrantService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest, 
    pipeline: Pipeline = Depends(get_rag_pipeline)
):
    """
    Processes a chat message using the RAG pipeline.

    - Retrieves context from PostgreSQL (Read-Only).
    - Performs vector search via Qdrant.
    - Generates a response using the LLM.
    - Returns a JSON object containing the text response and relevant products.

    The Node.js backend is responsible for saving this response to the database.
    """
    try:
        # The pipeline returns a dictionary matching the ChatResponse schema
        response_data = await pipeline.get_response(
            session_id=request.session_id, 
            user_query=request.query
        )
        return response_data
        
    except Exception as e:
        # Log the error (handled by middleware usually) and return 500
        print(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sync/product", response_model=SyncResponse)
async def sync_product_endpoint(
    background_tasks: BackgroundTasks,
    request: ProductSyncRequest,
    sync_service: SyncService = Depends(get_sync_service),
    qdrant_service: QdrantService = Depends(get_qdrant_service),
):
    """
    Triggers product synchronization between PostgreSQL and Qdrant.
    This is processed asynchronously in the background.

    Actions:
    - 'update': Syncs a specific product ID.
    - 'delete': Removes a specific product ID from Qdrant.
    - 'update_all': Re-syncs the entire product catalog.
    """
    
    if request.action == "update":
        if not request.product_id:
            raise HTTPException(status_code=400, detail="product_id is required for update action")
            
        # sync_specifics is an async method, BackgroundTasks handles it correctly
        background_tasks.add_task(sync_service.sync_specifics, [request.product_id])
        
        return {
            "status": "success",
            "message": f"Queued update for product ID {request.product_id} to Qdrant.",
        }

    elif request.action == "update_all":
        # Full sync can take time, running in background
        background_tasks.add_task(sync_service.sync_all)
        return {
            "status": "success", 
            "message": "Queued full synchronization of all products to Qdrant."
        }

    elif request.action == "delete":
        if not request.product_id:
            raise HTTPException(status_code=400, detail="product_id is required for delete action")

        background_tasks.add_task(qdrant_service.delete_products, [request.product_id])
        return {
            "status": "success",
            "message": f"Queued deletion for product ID {request.product_id} from Qdrant.",
        }
        
    else:
        raise HTTPException(status_code=400, detail="Invalid action provided")


@router.post("/sync-products", response_model=SyncResponse)
async def sync_products_endpoint(
    background_tasks: BackgroundTasks,
    request: BulkProductSyncRequest,
    sync_service: SyncService = Depends(get_sync_service),
):
    """
    Bulk product synchronization endpoint for Node.js backend.
    
    This endpoint is called automatically when admin adds/updates/deletes products.
    It triggers a full re-sync of all active products to Qdrant vector database.
    
    Returns:
        SyncResponse with success status and count of products to be synced.
    """
    try:
        # Get product count for response
        product_ids = [p.id for p in request.products]
        
        # Queue full sync in background
        background_tasks.add_task(sync_service.sync_specifics, product_ids)
        
        return {
            "status": "success",
            "message": f"Successfully queued sync for {len(product_ids)} products to AI service.",
        }
        
    except Exception as e:
        logger.error(f"Error in sync_products_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")
