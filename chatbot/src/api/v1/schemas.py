from pydantic import BaseModel, Field
from typing import List, Optional

# --- Request Schemas ---

class ChatRequest(BaseModel):
    """
    Payload for incoming chat requests from the Node.js backend.
    """
    session_id: int = Field(..., description="PostgreSQL ID of the chat session")
    query: str = Field(..., min_length=1, example="Find me red sneakers")


class ProductSyncRequest(BaseModel):
    """
    Payload for product synchronization triggers.
    """
    product_id: Optional[int] = Field(None, description="Target product ID (required for update/delete)")
    action: str = Field(..., pattern="^(update|delete|update_all)$", description="Action to perform")


class ProductData(BaseModel):
    """
    Individual product data from Node.js backend.
    """
    id: str
    name: str
    description: Optional[str] = ""
    price: float
    originalPrice: float
    image: Optional[str] = ""
    rating: float = 0
    reviewCount: int = 0
    colors: List[str] = []
    sizes: List[str] = []
    categories: List[str] = []
    slug: str


class BulkProductSyncRequest(BaseModel):
    """
    Payload for bulk product synchronization from Node.js backend.
    Sent automatically when admin adds/updates/deletes products.
    """
    products: List[ProductData] = Field(..., description="List of products to sync")


# --- Response Schemas ---

class ProductColor(BaseModel):
    name: str
    hex: str


class ProductMetadata(BaseModel):
    """
    Detailed product information formatted for the Frontend UI.
    Matches the TypeScript interface required by the client.
    """
    id: str
    name: str
    price: float
    image: Optional[str] = None
    rating: float
    reviewCount: int = Field(..., alias="reviewCount")
    colors: List[ProductColor] = []
    sizes: List[str] = []

    class Config:
        populate_by_name = True


class ChatResponse(BaseModel):
    """
    Standard JSON response structure for the chat endpoint.
    """
    content: str
    intent: str
    products: List[ProductMetadata] = []


class SyncResponse(BaseModel):
    """
    Response structure for sync operations.
    """
    status: str
    message: str