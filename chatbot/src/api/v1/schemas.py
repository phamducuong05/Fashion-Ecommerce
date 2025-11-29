from pydantic import BaseModel, Field
from typing import List, Optional

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, example="Tìm giày thể thao màu đỏ")
    stream: bool = True


class ProductSyncRequest(BaseModel):
    product_id: int
    action: str = Field(
        ..., pattern="^(update|delete|update_all)$"
    )


class SyncResponse(BaseModel):
    status: str
    message: str
