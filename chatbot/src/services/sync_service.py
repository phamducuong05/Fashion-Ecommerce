import logging
from typing import List, Tuple, Dict, Any

from src.core.database import PSQLService
from src.services.embedding_service import EmbeddingService
from src.services.qdrant_service import QdrantService

logger = logging.getLogger(__name__)


class SyncService:
    """
    Service responsible for synchronizing product data from PostgreSQL
    to Qdrant vector database.
    """

    def __init__(
        self,
        psql_service: PSQLService,
        embedding_service: EmbeddingService,
        qdrant_service: QdrantService,
    ) -> None:
        """
        Initialize the synchronization service.

        Parameters:
            psql_service (PSQLService): Async PostgreSQL data access layer.
            embedding_service (EmbeddingService): Service for generating vectors.
            qdrant_service (QdrantService): Service for Qdrant operations.
        """
        self.psql_service = psql_service
        self.embedding_service = embedding_service
        self.qdrant_service = qdrant_service

        logger.info("SyncService initialized.")

    def __process_batch(
        self, batch_rows: List[Dict[str, Any]]
    ) -> Tuple[List[int], List[List[float]], List[Any], List[Dict[str, Any]]]:
        """
        Converts raw DB rows into vectors and payloads for Qdrant.

        Maps new DB schema fields (price, image, slug) to the payload.

        Args:
            batch_rows (List[Dict]): List of raw rows from PostgreSQL.

        Returns:
            Tuple: (ids, dense_vectors, sparse_vectors, payloads)
        """
        count = len(batch_rows)
        logger.debug(f"Processing batch of {count} records...")

        try:
            ids: List[int] = []
            texts: List[str] = []
            payloads: List[Dict[str, Any]] = []

            for row in batch_rows:
                # 1. Extract Data from new SQL Schema
                product_id = row["product_id"]
                ids.append(product_id)

                product_name = row["product_name"] or "Unknown Product"
                slug = row["slug"] or ""
                # "categories" is now a comma-separated string from SQL
                categories = row["categories"] or "General"
                desc = row["product_description"] or ""
                
                # Pricing & Metadata
                price = row["price"]
                original_price = row["original_price"]
                image_url = row["image_url"] or ""
                rating = row["rating"] or 0.0
                review_count = row["review_count"] or 0

                sizes_str = row["available_sizes"] or ""
                colors_str = row["available_colors"] or ""

                # 2. Build Semantic Text for Embedding
                # We include price and categories to help the model understand context
                semantic_text = f"""
                    Product: {product_name}
                    Category: {categories}
                    Price: {price}
                    Description: {desc}
                    Colors: {colors_str}
                    Sizes: {sizes_str}
                """.strip()

                texts.append(semantic_text)

                # 3. Build Payload for Retrieval
                # Keys here must match what Pipeline.__extract_product_metadata expects
                payloads.append(
                    {
                        "product_id": product_id,
                        "product_name": product_name,
                        "slug": slug,
                        "categories": categories,
                        "price": float(price) if price else 0.0,
                        "original_price": float(original_price) if original_price else 0.0,
                        "image_url": image_url,
                        "rating": float(rating),
                        "review_count": int(review_count),
                        "product_description": desc,
                        "available_sizes": sizes_str, # Keep as string for display or split if needed
                        "available_colors": colors_str,
                        "text_content": semantic_text,
                    }
                )

            # 4. Generate Embeddings
            dense_vecs, sparse_vecs = self.embedding_service.get_embeddings(texts)

            return ids, dense_vecs, sparse_vecs, payloads

        except Exception as e:
            logger.error(f"Error processing batch: {e}", exc_info=True)
            raise

    async def sync_all(self, batch: int = 128) -> None:
        """
        Asynchronously synchronizes all active products from PostgreSQL to Qdrant.

        Args:
            batch (int): Batch size for processing.
        """
        logger.info("Starting full sync (PostgreSQL -> Qdrant).")

        try:
            rows = await self.psql_service.fetch_all()

            total_rows = len(rows)
            logger.info(f"Fetched {total_rows} rows from database.")

            if total_rows == 0:
                logger.warning("No products found. Full sync aborted.")
                return

            # Process in batches
            for i in range(0, total_rows, batch):
                batch_rows = rows[i : i + batch]
                ids, dense_vecs, sparse_vecs, payloads = self.__process_batch(
                    batch_rows
                )
                self.qdrant_service.upsert_products(
                    ids, dense_vecs, sparse_vecs, payloads
                )

            logger.info("Full sync completed successfully.")

        except Exception as e:
            logger.error(f"Full sync failed: {e}", exc_info=True)
            raise

    async def sync_specifics(self, product_ids: List[int], batch: int = 50) -> None:
        """
        Asynchronously synchronizes specific products based on IDs.

        Args:
            product_ids (List[int]): List of product IDs to sync.
            batch (int): Batch size.
        """
        if not product_ids:
            logger.warning("sync_specifics called with an empty list. Skipped.")
            return

        logger.info(f"Starting partial sync for {len(product_ids)} products...")

        try:
            rows = await self.psql_service.fetch_specifics(product_ids=product_ids)

            total_rows = len(rows)
            logger.info(f"Fetched {total_rows} rows for requested IDs.")

            if total_rows == 0:
                logger.warning(f"No matching records found for IDs: {product_ids}")
                return

            for i in range(0, total_rows, batch):
                batch_rows = rows[i : i + batch]
                ids, dense_vecs, sparse_vecs, payloads = self.__process_batch(
                    batch_rows
                )

                self.qdrant_service.upsert_products(
                    ids, dense_vecs, sparse_vecs, payloads
                )

            logger.info("Partial sync completed successfully.")

        except Exception as e:
            logger.error(f"Partial sync failed: {e}", exc_info=True)
            raise