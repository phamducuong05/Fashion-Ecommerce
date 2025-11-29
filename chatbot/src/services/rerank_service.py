import logging

from flashrank import RerankRequest, Ranker
from typing import List, Dict

logger = logging.getLogger(__name__)


class RerankService:
    def __init__(self, model_name: str):
        logger.info(f"Initializing RerankService. Loading model: {model_name}...")
        try:
            self.ranker = Ranker(model_name=model_name)
            logger.info("Rerank model loaded successfully.")
        except Exception as e:
            logger.error(
                f"Failed to load Rerank model '{model_name}': {str(e)}", exc_info=True
            )
            raise e

    def rerank_matched_products(
        self, semantic_query: str, matched_products: list, top_k: int = 5
    ) -> List[Dict]:
        count = len(matched_products)

        query_preview = (
            (semantic_query[:50] + "...")
            if len(semantic_query) > 50
            else semantic_query
        )
        logger.debug(f"Starting rerank for {count} products. Query: '{query_preview}'")

        if not matched_products:
            logger.warning("No products provided for reranking. Returning empty list.")
            return []
        try:
            passages = []

            for product in matched_products:
                payload = product.payload
                text_content = payload.get("text_content", "")

                passages.append(
                    {
                        "id": str(payload.get("product_id")),
                        "text": text_content,
                        "meta": payload,
                    }
                )
            logger.debug(f"Prepared {len(passages)} passages. Sending to FlashRank...")
            rerank_request = RerankRequest(query=semantic_query, passages=passages)

            results = self.ranker.rerank(rerank_request)[:top_k]
            logger.debug(f"Reranking complete. Selected top {len(results)} results.")

            return results
        except Exception as e:
            logger.error(f"Error during reranking operation: {str(e)}", exc_info=True)
            logger.warning(
                "Triggering fallback mechanism: returning original matched products list."
            )
            return matched_products
