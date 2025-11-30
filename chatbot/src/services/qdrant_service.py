import logging

from typing import List, Dict, Any
from qdrant_client import QdrantClient, models
from qdrant_client.models import VectorParams, SparseVectorParams, Distance, PointStruct

logger = logging.getLogger(__name__)


class QdrantService:
    def __init__(self, url: str, api_key: str, collection_name: str):
        self.client = QdrantClient(url=url, api_key=api_key, check_compatibility=False)
        self.collection_name = collection_name
        self.DENSE_VECTOR_NAME = "text-dense"
        self.SPARSE_VECTOR_NAME = "text-sparse"

        logger.info(
            f"QdrantService initialized. URL: {url}, Collection: {collection_name}"
        )

    def create_collection_hybrid(self):
        """
        Create collection that supports Hybrid Search
        """
        try:
            if not self.client.collection_exists(self.collection_name):
                logger.info(
                    f"Collection '{self.collection_name}' does not exist. Creating..."
                )
                self.client.create_collection(
                    collection_name=self.collection_name,
                    # Dense vector configuration
                    vectors_config={
                        self.DENSE_VECTOR_NAME: VectorParams(
                            size=768, distance=Distance.COSINE
                        )
                    },
                    # Sparse vector configuration
                    sparse_vectors_config={
                        self.SPARSE_VECTOR_NAME: SparseVectorParams()
                    },
                )
                logger.info(
                    f"Successfully created Hybrid Collection: {self.collection_name}"
                )
            else:
                logger.info(
                    f"Collection '{self.collection_name}' already exists. Skipping creation."
                )

        except Exception as e:
            logger.error(
                f"Failed to create collection '{self.collection_name}': {str(e)}",
                exc_info=True,
            )
            raise e

    def upsert_products(
        self, ids: List[int], dense_vectors, sparse_vectors, payloads: List[Dict]
    ):
        """
        Update/Store product to Qdrant
        """
        count = len(ids)
        logger.info(f"Preparing to upsert {count} products to Qdrant...")
        try:
            points = []
            for i in range(len(ids)):
                points.append(
                    PointStruct(
                        id=ids[i],  # Product ID
                        vector={
                            self.DENSE_VECTOR_NAME: dense_vectors[i],
                            self.SPARSE_VECTOR_NAME: sparse_vectors[i].as_object(),
                        },
                        payload=payloads[i],
                    )
                )
            logger.debug(f"Sending upsert request for {count} points...")
            self.client.upsert(
                collection_name=self.collection_name, points=points, wait=True
            )
            logger.info(f"Successfully upserted {count} products.")
        except Exception as e:
            logger.error(f"Error during upsert operation: {str(e)}", exc_info=True)
            raise e

    def delete_products(self, ids: List[int]):
        """
        Delete products from Qdrant by their IDs.

        Parameters:
            ids: List of product IDs (integers) to delete.
        """
        if not ids:
            logger.warning("Delete operation called with empty ID list. Skipping.")
            return

        logger.info(f"Attempting to delete {len(ids)} products...")

        try:
            self.client.delete(
                collection_name=self.collection_name,
                points_selector=models.PointIdsList(points=ids),
                wait=True,
            )
            logger.info(f"Successfully deleted {len(ids)} products from Qdrant.")

        except Exception as e:
            logger.error(f"Error deleting products: {str(e)}", exc_info=True)
            raise e

    def search_hybrid(
        self,
        query_dense_vec: List[float],
        query_sparse_vec: Dict[str, Any],
        top_k: int = 5,
    ):
        """
        Perform Hybrid Search using RRF (Reciprocal Rank Fusion).

        Parameters:
            query_dense_vec: Dense vector embedding of the query
            query_sparse_vec: Dense vector embedding of the query
            top_k: Top results
        """
        logger.debug(f"Starting Hybrid Search. Top_k={top_k}")
        try:
            prefetch_limit = top_k * 2
            results = self.client.query_points(
                collection_name=self.collection_name,
                prefetch=[
                    # Search using Dense Vector
                    models.Prefetch(
                        query=query_dense_vec,
                        using=self.DENSE_VECTOR_NAME,
                        limit=prefetch_limit,
                    ),
                    # Search using Sparse vector
                    models.Prefetch(
                        query=models.SparseVector(
                            indices=query_sparse_vec["indices"],
                            values=query_sparse_vec["values"],
                        ),
                        using=self.SPARSE_VECTOR_NAME,
                        limit=prefetch_limit,
                    ),
                ],
                query=models.FusionQuery(fusion=models.Fusion.RRF),
                limit=top_k,
                with_payload=True,
            )
            count = len(results.points)
            logger.debug(f"Hybrid search returned {count} results.")
            return results.points
        except Exception as e:
            logger.error(f"Error during Hybrid Search: {str(e)}", exc_info=True)
            raise e
