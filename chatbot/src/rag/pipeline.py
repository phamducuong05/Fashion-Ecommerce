from typing import AsyncGenerator, Union, Any
from src.services.embedding_service import EmbeddingService
from src.services.qdrant_service import QdrantService
from src.services.llm_service import LLMService
from src.services.rerank_service import RerankService
from src.services.cache_service import CacheService
from src.utils.text_helper import PROMPT_TEMPLATE


class Pipeline:
    def __init__(
        self,
        embedding_service: EmbeddingService,
        qdrant_service: QdrantService,
        rerank_service: RerankService,
        llm_service: LLMService,
        cache_service: CacheService,
    ):
        self.embedding_service = embedding_service
        self.qdrant_service = qdrant_service
        self.rerank_service = rerank_service
        self.llm_service = llm_service
        self.cache_service = cache_service

    def __build_context(self, selected_products):
        context_str = ""
        if selected_products:
            for i, item in enumerate(selected_products, 1):
                p = item.get("meta", {})
                context_str += (
                    f"{i}. Name: {p.get('name', 'N/A')}\n"
                    f"   Brand: {p.get('brand', '')}\n\n"
                    f"   Category: {p.get('category', '')}\n\n"
                    f"   Description: {p.get('text_content', '')}\n\n"
                    f"   Available colors: {p.get('colors', '')}\n\n"
                    f"   Available sizes: {p.get('sizes', '')}\n\n"
                )
        else:
            context_str = "No products found matching the criteria."
        return context_str

    async def get_rag_response(self, user_query: str) -> Union[Any, AsyncGenerator]:
        # Check if the query is already in LangCache
        cache_ans = await self.cache_service.search_response(prompt=user_query)
        if cache_ans:

            async def cache_streamer():
                yield cache_ans

            return cache_streamer()

        # Reformat user query (for Dense vector search) and extract keywords (for Sparse vector search)
        search_queries = await self.llm_service.generate_search_queries(
            user_query=user_query
        )

        unique_products_map = {}

        for sub_query in search_queries:
            semantic_query = sub_query.get("semantic_query", user_query)
            keywords = sub_query.get("keywords", [])

            sparse_query = " ".join(keywords) if keywords else semantic_query

            # Embed query
            dense_vectors, sparse_vectors = self.embedding_service.get_embeddings(
                [semantic_query, sparse_query]
            )

            query_dense_vec = dense_vectors[0]
            raw_sparse_vec = sparse_vectors[1]

            query_sparse_vec = {
                "indices": raw_sparse_vec.indices.tolist(),
                "values": raw_sparse_vec.values.tolist(),
            }

            # Search for similar product in the Qdrant
            matched_products = self.qdrant_service.search_hybrid(
                query_dense_vec=query_dense_vec,
                query_sparse_vec=query_sparse_vec,
                top_k=10,
            )

            reranked_products = self.rerank_service.rerank_matched_products(
                semantic_query=semantic_query,
                matched_products=matched_products,
                top_k=5,
            )

            for product in reranked_products:
                p_id = product.get("id") or product["meta"].get("product_id")

                if p_id and p_id not in unique_products_map:
                    unique_products_map[p_id] = product

        selected_products = list(unique_products_map.values())

        # Build context
        context_str = self.__build_context(selected_products=selected_products)

        # Create prompt
        prompt = PROMPT_TEMPLATE.format(context_str=context_str, query=user_query)

        # Get response from LLM based on the context
        full_response_text = ""
        stream_gen = await self.llm_service.response(prompt=prompt, stream=True)

        async def response_streamer():
            full_response_text = ""
            try:
                async for chunk in stream_gen:
                    if chunk:
                        full_response_text += chunk
                        yield chunk

                # [QUAN TRỌNG] Lưu cache SAU KHI vòng lặp kết thúc
                if full_response_text.strip():
                    # logger.info(f"Saving response to cache (len={len(full_response_text)})")
                    await self.cache_service.save_response(
                        prompt=user_query, response=full_response_text
                    )
                else:
                    # logger.warning("Empty response from LLM, skipping cache save.")
                    print("Error here else")

            except Exception as e:
                # logger.error(f"Error during streaming/caching: {e}")
                # Không raise lỗi ở đây để tránh đứt kết nối client nếu chỉ lỗi save cache
                print("Error here except")

        return response_streamer()
