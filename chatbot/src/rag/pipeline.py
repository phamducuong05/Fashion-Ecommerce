import logging

from typing import AsyncGenerator, Union, Any
from src.services.embedding_service import EmbeddingService
from src.services.memory_service import MemoryService
from src.services.qdrant_service import QdrantService
from src.services.llm_service import LLMService
from src.services.rerank_service import RerankService
from src.services.cache_service import CacheService
from src.utils.text_helper import PROMPT_TEMPLATE

logger = logging.getLogger(__name__)

class Pipeline:
    def __init__(
        self,
        embedding_service: EmbeddingService,
        memory_service: MemoryService,
        qdrant_service: QdrantService,
        rerank_service: RerankService,
        llm_service: LLMService,
        cache_service: CacheService,
    ):
        self.embedding_service = embedding_service
        self.memory_service = memory_service
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

    async def get_rag_response(self, session_id: str, user_query: str) -> Union[Any, AsyncGenerator]:
        # Rewrite new user's query according to chat history
        history = await self.memory_service.get_history(session_id=session_id)
        rewritten_query = await self.llm_service.rewrite_query_with_memory(user_query=user_query, history=history)
        
        # Check if the query is already in LangCache
        cache_ans = await self.cache_service.search_response(prompt=rewritten_query)
        if cache_ans:
            async def cache_streamer():
                yield cache_ans
            
            logger.info(f"Saving chat message to memory.")
            await self.memory_service.add_message(
                session_id=session_id,
                role="user",
                content=rewritten_query
            )
            await self.memory_service.add_message(
                session_id=session_id,
                role="chatbot",
                content=cache_ans
            )

            return cache_streamer()

        # Reformat user query (for Dense vector search) and extract keywords (for Sparse vector search)
        search_queries = await self.llm_service.generate_search_queries(
            user_query=rewritten_query
        )

        unique_products_map = {}

        for sub_query in search_queries:
            semantic_query = sub_query.get("semantic_query", rewritten_query)
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
        prompt = PROMPT_TEMPLATE.format(context_str=context_str, query=rewritten_query)

        # Get response from LLM based on the context
        stream_gen = await self.llm_service.response(prompt=prompt, stream=True)

        async def response_streamer():
            full_response_text = ""
            try:
                async for chunk in stream_gen:
                    if chunk:
                        full_response_text += chunk
                        yield chunk

                if full_response_text.strip():
                    logger.info(f"Saving response to cache (len={len(full_response_text)})")
                    await self.cache_service.save_response(
                        prompt=rewritten_query, response=full_response_text
                    )
                    logger.info(f"Saving chat message to memory.")
                    await self.memory_service.add_message(
                        session_id=session_id,
                        role="user",
                        content=rewritten_query
                    )
                    await self.memory_service.add_message(
                        session_id=session_id,
                        role="chatbot",
                        content=full_response_text
                    )
                else:
                    logger.warning("Empty response from LLM, skipping cache save.")
                    print("Error here else")

            except Exception as e:
                logger.error(f"Error during streaming/caching: {e}")

        return response_streamer()
