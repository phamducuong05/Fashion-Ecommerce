import logging
import time
from typing import List, Tuple
from fastembed import SparseTextEmbedding, TextEmbedding

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self, dense_model_name: str, sparse_model_name: str) -> None:
        """
        Initialize the embedding service with both dense and sparse embedding models.

        Parameters:
            dense_model_name: Name or path of the dense embedding model.
            sparse_model_name: Name or path of the sparse embedding model.
        """
        logger.info(f"Loading dense vector embedding model: {dense_model_name}")
        self.dense_model = TextEmbedding(model_name=dense_model_name)

        logger.info(f"Loading sparse vector embedding model: {sparse_model_name}")
        self.sparse_model = SparseTextEmbedding(model_name=sparse_model_name)

        logger.info("Embedding models successfully loaded.")

    def get_embeddings(
        self, texts: List[str]
    ) -> Tuple[List[List[float]], List[object]]:
        """
        Generate dense and sparse vector embeddings for a list of text inputs.

        Parameters:
            texts: A list of input strings to embed.

        Returns:
            A tuple containing:
                - dense_vectors: List of dense embedding vectors (list of floats)
                - sparse_vectors: List of sparse embedding objects

        Raises:
            Exception: Propagates any exception encountered during embedding operations.
        """
        logger.info(f"Creating vector embeddings for {len(texts)} texts...")
        start_time = time.perf_counter()

        try:
            # Dense embeddings
            dense_vectors = list(self.dense_model.embed(texts))
            dense_vectors = [v.tolist() for v in dense_vectors]

            # Sparse embeddings (already in output form)
            sparse_vectors = list(self.sparse_model.embed(texts))

            # Performance logging
            duration = time.perf_counter() - start_time
            if duration > 1.0:
                logger.warning(
                    f"Slow embedding detected: {duration:.4f}s for {len(texts)} texts."
                )
            else:
                logger.debug(f"Embedded in {duration:.4f}s")

            return dense_vectors, sparse_vectors

        except Exception as e:
            logger.error(f"Error embedding {len(texts)} texts: {str(e)}", exc_info=True)