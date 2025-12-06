import logging
from typing import List, Dict, Any, Tuple
from qdrant_client import QdrantClient, models
from qdrant_client.models import (
    VectorParams,
    SparseVectorParams,
    Distance,
    PointStruct,
)

logger = logging.getLogger(__name__)


class QdrantService:
    def __init__(self, url: str, api_key: str, collection_name: str) -> None:
        """
        Initialize Qdrant service and establish connection.

        Parameters:
            url: Qdrant endpoint URL.
            api_key: Qdrant API key or None for local deployments.
            collection_name: Name of the collection where vectors will be stored.
        """
        self.client = QdrantClient(url=url, api_key=api_key, check_compatibility=False)
        self.collection_name = collection_name

        self.DENSE_VECTOR_NAME = "text-dense"
        self.SPARSE_VECTOR_NAME = "text-sparse"

        logger.info(
            f"QdrantService initialized. URL={url}, Collection={collection_name}"
        )

    def create_collection_hybrid(self) -> None:
        """
        Create a Hybrid Search-enabled collection using both dense and sparse vectors.
        If the collection already exists, the operation is skipped.
        """
        try:
            if not self.client.collection_exists(self.collection_name):
                logger.info(
                    f"Collection '{self.collection_name}' does not exist. Creating..."
                )
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config={
                        self.DENSE_VECTOR_NAME: VectorParams(
                            size=768,
                            distance=Distance.COSINE,
                        )
                    },
                    sparse_vectors_config={
                        self.SPARSE_VECTOR_NAME: SparseVectorParams()
                    },
                )
                logger.info(
                    f"Successfully created Hybrid Collection: {self.collection_name}"
                )
            else:
                logger.info(
                    f"Collection '{self.collection_name}' already exists. Skipping."
                )

        except Exception as e:
            logger.error(
                f"Failed to create collection '{self.collection_name}': {e}",
                exc_info=True,
            )
            raise

    def upsert_products(
        self,
        ids: List[int],
        dense_vectors: List[List[float]],
        sparse_vectors: List[Any],
        payloads: List[Dict[str, Any]],
    ) -> None:
        """
        Upsert (insert or update) product vectors and payloads.

        Parameters:
            ids: List of product IDs.
            dense_vectors: List of dense embedding vectors.
            sparse_vectors: List of sparse embeddings (objects supporting as_object()).
            payloads: List of payload dictionaries to attach to each point.

        Raises:
            Exception: Raised when upsert fails.
        """
        count = len(ids)
        logger.info(f"Preparing to upsert {count} products...")

        try:
            points = [
                PointStruct(
                    id=ids[i],
                    vector={
                        self.DENSE_VECTOR_NAME: dense_vectors[i],
                        self.SPARSE_VECTOR_NAME: sparse_vectors[i].as_object(),
                    },
                    payload=payloads[i],
                )
                for i in range(count)
            ]

            logger.debug(f"Sending upsert request for {count} points...")
            self.client.upsert(
                collection_name=self.collection_name,
                points=points,
                wait=True,
            )
            logger.info(f"Successfully upserted {count} products.")

        except Exception as e:
            logger.error(f"Error during upsert operation: {e}", exc_info=True)
            raise

    def delete_products(self, ids: List[int]) -> None:
        """
        Delete products based on their IDs.

        Parameters:
            ids: List of product IDs to delete.

        Notes:
            If the ID list is empty, the operation is skipped.
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
            logger.info(f"Successfully deleted {len(ids)} products.")

        except Exception as e:
            logger.error(f"Error deleting products: {e}", exc_info=True)
            raise

    def search_hybrid(
        self,
        query_dense_vec: List[float],
        query_sparse_vec: Dict[str, Any],
        top_k: int = 5,
    ):
        """
        Execute a Hybrid Search using Reciprocal Rank Fusion (RRF).

        Parameters:
            query_dense_vec: Dense embedding vector for the query.
            query_sparse_vec: Sparse embedding represented as a dict with
                'indices' and 'values'.
            top_k: Number of results to return.

        Returns:
            List of matching points with payloads.

        Raises:
            Exception: If hybrid search fails.
        """
        logger.debug(f"Starting Hybrid Search. top_k={top_k}")

        try:
            prefetch_limit = top_k * 2

            results = self.client.query_points(
                collection_name=self.collection_name,
                prefetch=[
                    models.Prefetch(
                        query=query_dense_vec,
                        using=self.DENSE_VECTOR_NAME,
                        limit=prefetch_limit,
                    ),
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

            logger.debug(f"Hybrid search returned {len(results.points)} results.")
            return results.points

        except Exception as e:
            logger.error(f"Error during Hybrid Search: {e}", exc_info=True)
            raise
