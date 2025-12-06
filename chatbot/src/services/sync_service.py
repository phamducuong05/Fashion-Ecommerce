import logging
from typing import List, Tuple, Dict, Any

from src.core.database import PSQLService
from src.services.embedding_service import EmbeddingService
from src.services.qdrant_service import QdrantService

logger = logging.getLogger(__name__)


class SyncService:
    def __init__(
        self,
        psql_service: PSQLService,
        embedding_service: EmbeddingService,
        qdrant_service: QdrantService,
    ) -> None:
        """
        Service responsible for synchronizing product data from PostgreSQL
        to Qdrant vector database.

        Parameters:
            psql_service: PostgreSQL data access layer.
            embedding_service: Embedding model service for generating vectors.
            qdrant_service: Qdrant storage and search service.
        """
        self.psql_service = psql_service
        self.embedding_service = embedding_service
        self.qdrant_service = qdrant_service

        logger.info("SyncService initialized.")

    def __process_batch(
        self, batch_rows: List[Dict[str, Any]]
    ) -> Tuple[List[int], List[List[float]], List[Any], List[Dict[str, Any]]]:
        """
        Convert raw DB rows into vectors + payloads suitable for Qdrant.

        Parameters:
            batch_rows: List of raw DB rows.

        Returns:
            Tuple containing:
                ids: List of product IDs
                dense_vectors: Dense embedding vectors
                sparse_vectors: Sparse embedding vectors
                payloads: Metadata payloads for Qdrant

        Raises:
            Exception: Any unexpected processing errors.
        """
        count = len(batch_rows)
        logger.debug(f"Processing batch of {count} records...")

        try:
            ids: List[int] = []
            texts: List[str] = []
            payloads: List[Dict[str, Any]] = []

            for row in batch_rows:
                product_id = row["product_id"]
                ids.append(product_id)

                product_name = row["product_name"]
                brand = row["brand_name"] or "Unknown"
                category = row["category"] or "Unknown"
                desc = row["product_description"] or ""
                sizes_str = row["available_sizes"] or ""
                colors_str = row["available_colors"] or ""

                semantic_text = f"""
                    Product name: {product_name}
                    Brand: {brand}
                    Category: {category}
                    Description: {desc}
                    Colors: {colors_str}
                """.strip()

                texts.append(semantic_text)

                payloads.append(
                    {
                        "product_id": product_id,
                        "name": product_name,
                        "brand": brand,
                        "category": category,
                        "sizes": sizes_str.split(", ") if sizes_str else [],
                        "colors": colors_str.split(", ") if colors_str else [],
                        "text_content": semantic_text,
                    }
                )

            dense_vecs, sparse_vecs = self.embedding_service.get_embeddings(texts)

            return ids, dense_vecs, sparse_vecs, payloads

        except Exception as e:
            logger.error(f"Error processing batch: {e}", exc_info=True)
            raise

    def sync_all(self, batch: int = 128) -> None:
        """
        Synchronize all products from PostgreSQL to Qdrant in batches.

        Parameters:
            batch: Number of products to process per batch.

        Raises:
            Exception: If sync fails at any stage.
        """
        logger.info("Starting full sync (PostgreSQL -> Qdrant).")

        try:
            self.psql_service.connect()
            rows = self.psql_service.fetch_all()

            total_rows = len(rows)
            logger.info(f"Fetched {total_rows} rows from database.")

            if total_rows == 0:
                logger.warning("No products found. Full sync aborted.")
                return

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

        finally:
            self.psql_service.disconnect()
            logger.debug("Database disconnected after full sync.")

    def sync_specifics(self, product_ids: List[int], batch: int = 50) -> None:
        """
        Synchronize specific products by their IDs.

        Parameters:
            product_ids: List of product IDs to sync.
            batch: Number of items to process per batch.

        Raises:
            Exception: If the sync process fails.
        """
        if not product_ids:
            logger.warning(
                "sync_specifics called with an empty list. Operation skipped."
            )
            return

        logger.info(f"Starting partial sync for {len(product_ids)} products...")

        try:
            self.psql_service.connect()
            rows = self.psql_service.fetch_specifics(product_ids=product_ids)

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

        finally:
            self.psql_service.disconnect()
            logger.debug("Database disconnected after partial sync.")
