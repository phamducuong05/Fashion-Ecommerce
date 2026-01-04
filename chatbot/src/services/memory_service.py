import logging
from typing import List, Dict
from sqlalchemy import text
from src.core.database import PSQLService

logger = logging.getLogger(__name__)

class MemoryService:
    """
    Handles retrieval of chat history from PostgreSQL to provide context for the RAG pipeline.
    
    Note: This service is READ-ONLY. The Node.js Backend handles saving messages 
    and managing session states.
    """

    def __init__(self, db_service: PSQLService):
        """
        Initializes the MemoryService with a database service instance.

        Args:
            db_service (PSQLService): The service handling async database connections.
        """
        self.db_service = db_service
        logger.info("MemoryService initialized with PostgreSQL connection.")

    async def get_history(self, session_id: int, limit: int = 20) -> List[Dict[str, str]]:
        """
        Fetches the latest `limit` messages for a specific session from the database.
        
        It retrieves messages in descending order (newest first) and then reverses them
        to chronological order (oldest -> newest) for the LLM context.
        Also maps the database role 'bot' to the LLM standard 'assistant'.

        Args:
            session_id (int): The ID of the chat session.
            limit (int): The maximum number of messages to retrieve (default: 20).

        Returns:
            List[Dict[str, str]]: A list of message objects, e.g., 
            [{'role': 'user', 'content': '...'}, {'role': 'assistant', 'content': '...'}]
        """
        logger.info(f"Retrieving last {limit} messages for session {session_id}...")

        try:
            async with self.db_service.engine.connect() as conn:
                # Query the latest messages
                query = text("""
                    SELECT role, content
                    FROM "ChatBotMessage"
                    WHERE "sessionId" = :session_id
                    ORDER BY "createdAt" DESC
                    LIMIT :limit
                """)
                
                result = await conn.execute(query, {"session_id": session_id, "limit": limit})
                rows = result.mappings().all()

                formatted_messages = []
                for row in rows:
                    role = row["role"]
                    content = row["content"]

                    # Map DB role to LLM role
                    if role == "bot" or role == "ADMIN":
                        role = "assistant"
                    
                    formatted_messages.append({"role": role, "content": content})

                # Reverse to get chronological order (Past -> Present)
                return formatted_messages[::-1]

        except Exception as e:
            logger.error(f"Failed to retrieve history for session {session_id}: {e}")
            # Return empty list to prevent pipeline crash, treating it as a new conversation
            return []
    
    #! FOR TESTING ONLY, NOT EXISTS IN PRODUCTION
    # async def add_message_temp(self, session_id: int, role: str, content: str):
    #     try:
    #         # Map role lại cho đúng chuẩn DB (assistant -> bot)
    #         db_role = 'bot' if role == 'assistant' else role
            
    #         async with self.db_service.engine.begin() as conn:
    #             await conn.execute(
    #                 text('INSERT INTO "ChatBotMessage" ("sessionId", role, content) VALUES (:s, :r, :c)'),
    #                 {"s": session_id, "r": db_role, "c": content}
    #             )
    #             logger.warning(f"⚠️ [TEST MODE] Inserted message to DB: {content[:20]}...")
    #     except Exception as e:
    #         logger.error(f"Error inserting temp message: {e}")