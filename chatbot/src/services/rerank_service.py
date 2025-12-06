import logging
from typing import List, Dict, Any

from flashrank import RerankRequest, Ranker

logger = logging.getLogger(__name__)


class RerankService:
    def __init__(self, model_name: str) -> None:
        """
        Initialize the RerankService with a FlashRank model.

        Parameters:
            model_name: Name of the FlashRank model to load.

        Raises:
            Exception: If the model cannot be loaded.
        """
        logger.info(f"Initializing RerankService. Loading model '{model_name}'...")
        try:
            self.ranker = Ranker(model_name=model_name)
            logger.info("Rerank model loaded successfully.")
        except Exception as e:
            logger.error(
                f"Failed to load Rerank model '{model_name}': {e}", exc_info=True
            )
            raise

    def rerank_matched_products(
        self, semantic_query: str, matched_products: List[Any], top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Rerank a list of matched products using FlashRank.

        Parameters:
            semantic_query: The query used to rerank product passages.
            matched_products: List of Qdrant points (with payloads) that contain product metadata.
            top_k: Number of ranked results to return.

        Returns:
            A list of ranked passages in FlashRank result format.
            If reranking fails, returns the original matched_products.
        """
        count = len(matched_products)

        # Preview query for logging purposes
        query_preview = (
            semantic_query[:50] + "..." if len(semantic_query) > 50 else semantic_query
        )

        logger.debug(f"Starting rerank for {count} products. Query='{query_preview}'")

        # Handle empty product list
        if not matched_products:
            logger.warning("No products provided for reranking. Returning empty list.")
            return []

        try:
            passages: List[Dict[str, Any]] = []

            # Convert Qdrant payloads to FlashRank passage format
            for product in matched_products:
                payload = product.payload or {}

                passages.append(
                    {
                        "id": str(payload.get("product_id")),
                        "text": payload.get("text_content", ""),
                        "meta": payload,
                    }
                )

            logger.debug(
                f"Prepared {len(passages)} passages. Sending to FlashRank reranker..."
            )

            rerank_request = RerankRequest(query=semantic_query, passages=passages)

            results = self.ranker.rerank(rerank_request)
            top_results = results[:top_k]

            logger.debug(
                f"Reranking complete. Returning top {len(top_results)} results."
            )

            return top_results

        except Exception as e:
            logger.error(f"Error during reranking: {e}", exc_info=True)
            logger.warning(
                "Fallback triggered. Returning original matched products unmodified."
            )
            return matched_products
