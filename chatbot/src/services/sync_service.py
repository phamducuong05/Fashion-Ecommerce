import logging

from typing import List
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
    ):
        self.psql_service = psql_service
        self.embedding_service = embedding_service
        self.qdrant_service = qdrant_service
        logger.info("SyncService initialized.")

    def __process_batch(self, batch_rows):
        count = len(batch_rows)
        logger.debug(f"Processing batch of {count} rows...")
        try:
            ids = []
            texts = []
            payloads = []

            for row in batch_rows:
                ids.append(row["product_id"])

                # Normalize data (avoid NULL/None data)
                p_name = row["product_name"]
                brand = row["brand_name"] or "Unknown"
                category = row["category"] or "Unknown"
                desc = row["product_description"] or ""
                sizes_str = row["available_sizes"] or ""
                colors_str = row["available_colors"] or ""

                # Create semantic text
                semantic_text = f"""
                    Product name: {p_name}
                    Brand: {brand}
                    Category: {category}
                    Description: {desc}
                    Colors: {colors_str}
                """

                texts.append(semantic_text.strip())

                # Create payload (to store data and filter)
                payload = {
                    "product_id": row["product_id"],
                    "name": p_name,
                    "brand": brand,
                    "category": category,
                    "sizes": sizes_str.split(", ") if sizes_str else [],
                    "colors": (
                        colors_str.split(", ") if colors_str else []
                    ),  # "S, M, L" -> ["S", "M", "L"]
                    "text_content": semantic_text,
                }
                payloads.append(payload)

            dense_vecs, sparse_vecs = self.embedding_service.get_embeddings(texts)

            return ids, dense_vecs, sparse_vecs, payloads
        except Exception as e:
            logger.error(f"Error processing batch: {str(e)}", exc_info=True)
            raise e

    def sync_all(self, batch=128):
        logger.info("Starting Full Sync (Postgres -> Qdrant)...")
        try:
            self.psql_service.connect()
            rows = self.psql_service.fetch_all()

            total_rows = len(rows)

            logger.info(
                f"Fetched {total_rows} rows from Database. Starting batch processing..."
            )

            if total_rows == 0:
                logger.warning("No products found in database. Sync aborted.")
                return

            for i in range(0, len(rows), batch):
                batch_rows = rows[i : i + batch]
                ids, dense_vecs, sparse_vecs, payloads = self.__process_batch(
                    batch_rows
                )
                self.qdrant_service.upsert_products(
                    ids, dense_vecs, sparse_vecs, payloads
                )
            logger.info("Full Sync completed successfully.")
        except Exception as e:
            logger.error(f"Full Sync failed: {str(e)}", exc_info=True)
            raise e
        finally:
            self.psql_service.disconnect()
            logger.debug("Database disconnected.")

    def sync_specifics(self, product_ids: List, batch=50):
        if not product_ids:
            logger.warning("sync_specifics called with empty product_ids list.")
            return

        logger.info(f"Starting Partial Sync for {len(product_ids)} products...")
        try:
            self.psql_service.connect()
            rows = self.psql_service.fetch_specifics(product_ids=product_ids)

            total_rows = len(rows)
            logger.info(f"Fetched {total_rows} rows from Database.")

            if total_rows == 0:
                logger.warning(
                    f"None of the requested IDs {product_ids} were found in DB."
                )
                return

            for i in range(0, len(rows), batch):
                batch_rows = rows[i : i + batch]
                ids, dense_vecs, sparse_vecs, payloads = self.__process_batch(
                    batch_rows
                )
                self.qdrant_service.upsert_products(
                    ids, dense_vecs, sparse_vecs, payloads
                )
            logger.info(f"Partial Sync for {len(product_ids)} products completed.")
        except Exception as e:
            logger.error(f"Partial Sync failed: {str(e)}", exc_info=True)
            raise e
        finally:
            self.psql_service.disconnect()
            logger.debug("Database disconnected.")
