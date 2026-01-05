import logging
from typing import List, Any, Optional

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

from src.utils.text_helper import PSQL_FETCH_ALL_QUERIES, PSQL_FETCH_SPECIFICS_QUERIES

logger = logging.getLogger(__name__)

class PSQLService:
    """
    Manages async PostgreSQL connections and data retrieval using SQLAlchemy.
    """

    def __init__(self, host, database_name, user, password, port=5432):
        """
        Initializes the async engine with connection pooling.
        """
        self.db_url = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{database_name}"
        self.engine = create_async_engine(
            self.db_url,
            echo=False,
            pool_size=10,
            max_overflow=20,
            connect_args={"ssl": "require"}
        )
        logger.info("PSQLService initialized with Async Engine.")

    async def fetch_all(self) -> List[dict]:
        """
        Retrieves all active products with aggregated details (categories, variants).
        
        Returns:
            List[dict]: A list of product dictionaries.
        """
        try:
            async with self.engine.connect() as conn:
                logger.debug("Executing fetch_all query.")
                result = await conn.execute(text(PSQL_FETCH_ALL_QUERIES))
                
                # SQLAlchemy returns mappings, convert to standard dicts
                rows = [dict(row) for row in result.mappings().all()]
                
                logger.info(f"Fetched {len(rows)} products from DB.")
                return rows

        except Exception as e:
            logger.error(f"Error executing fetch_all: {e}")
            return []

    async def fetch_specifics(self, product_ids: List[Any]) -> List[dict]:
        """
        Retrieves details for specific product IDs.

        Args:
            product_ids (List[Any]): List of product IDs (integers).

        Returns:
            List[dict]: A list of matching product dictionaries.
        """
        if not product_ids:
            return []

        try:
            async with self.engine.connect() as conn:
                # Generate dynamic bind parameters (e.g., :id_0, :id_1)
                bind_params = {f"id_{i}": pid for i, pid in enumerate(product_ids)}
                
                # Create the placeholder string (e.g., ":id_0, :id_1")
                placeholder_str = ", ".join([f":{k}" for k in bind_params.keys()])
                
                # Format the SQL query
                sql_query = PSQL_FETCH_SPECIFICS_QUERIES.format(placeholder=placeholder_str)
                
                logger.debug(f"Executing fetch_specifics for {len(product_ids)} items.")
                
                # Execute safely with bound parameters
                result = await conn.execute(text(sql_query), bind_params)
                
                rows = [dict(row) for row in result.mappings().all()]
                logger.info(f"Fetched {len(rows)} specific products.")
                return rows

        except Exception as e:
            logger.error(f"Error executing fetch_specifics: {e}")
            # Raise exception to let the caller handle the failure
            raise e

    async def dispose(self):
        """
        Closes the database connection pool.
        """
        await self.engine.dispose()
        logger.info("PSQL Engine disposed.")