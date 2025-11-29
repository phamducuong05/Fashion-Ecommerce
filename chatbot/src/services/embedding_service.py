import logging
import time

from typing import List
from fastembed import SparseTextEmbedding, TextEmbedding

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self, dense_model_name, sparse_model_name):
        logger.info(f"Loading dense vector embedding model {dense_model_name}...")
        self.dense_model = TextEmbedding(model_name=dense_model_name)

        logger.info(f"Loading sparse vector embedding model {sparse_model_name}...")
        self.sparse_model = SparseTextEmbedding(model_name=sparse_model_name)

        logger.info("Successfully load embeddding models.")

    def get_embeddings(
        self, texts: List[str]
    ) -> tuple[List[List[float]], List[object]]:
        """
        Embedding a list of text to dense vector embedddings and sparse vector embeddings

        Parameters:
            texts: List of texts that need embedding

        Returns:
            (dense_vectors, sparse_vectors)
        """
        logger.info(f"Creating vector embeddings for {len(texts)} texts...")

        start_time = time.perf_counter()

        try:
            dense_vectors = list(self.dense_model.embed(texts))
            dense_vectors = [v.tolist() for v in dense_vectors]

            sparse_vectors = list(self.sparse_model.embed(texts))

            duration = time.perf_counter() - start_time

            if duration > 1.0:
                logger.warning(
                    f"Slow embedding detected: {duration:.4f}s for {len(texts)} texts."
                )
            else:
                logger.debug(f"Embedded in {duration:.4f}s")

            return dense_vectors, sparse_vectors
        except Exception as e:
            logger.error(
                f"Error embedding {len(texts)} texts: {str(e)}.", exc_info=True
            )
            raise e
