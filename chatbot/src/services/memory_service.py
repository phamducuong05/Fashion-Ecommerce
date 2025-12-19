import json
import logging
import redis.asyncio as redis

from typing import Literal

logger = logging.getLogger(__name__)

class MemoryService:
    def __init__(self, server_url: str):
        self.memory = redis.from_url(
            url=server_url,
            decode_responses=True
        )
        self.ttl = 86400 # 24h
        logger.info(f"Redis memory service initialized. URL: {server_url}.")
    
    async def add_message(self, session_id: str, role: Literal["user", "chatbot"], content: str):
        key = f"chat:{session_id}"
        content = json.dumps({"role": role, "content": content})
        
        preview_content = (content[:50] + "...") if len(content) > 50 else content
        logger.info(f"Adding content {preview_content} from {role} to {key}...")
        
        try:
            await self.memory.rpush(key, content)
        except Exception as e:
            logger.error(f"Failed to add message {preview_content} from {role} to {key}: {e}")
            
        await self.memory.expire(key, time=self.ttl)
        
    async def get_history(self, session_id: str, limit: int=6):
        # Limit = 6 => Get the 3 latest pairs of (final_query, response)
        key = f"chat:{session_id}"
        logger.info(f"Retrieving {int(limit / 2)} latest chat history from {key}...")
        
        try:
            raw_messages = await self.memory.lrange(key, -limit, -1)
            return [json.loads(msg) for msg in raw_messages]
        except Exception as e:
            logger.error(f"Failed to retrive {limit / 2} latest chat history from {key}: {e}")
    
    async def delete_history(self, session_id: str):
        key = f"chat:{session_id}"
        logger.info(f"Deleting {key} history...")
        try: 
            await self.memory.delete(key)
        except Exception as e:
            logger.error(f"Failed to delete {key} history: {e}")
        
        