import logging
from typing import AsyncGenerator, Union, Any, Literal, List, Dict

from src.services.semantic_router_service import SemanticRouterService
from src.services.embedding_service import EmbeddingService
from src.services.memory_service import MemoryService
from src.services.qdrant_service import QdrantService
from src.services.llm_service import LLMService
from src.services.rerank_service import RerankService
from src.services.cache_service import CacheService
from src.utils.text_helper import PROMPT_TEMPLATE, CHITCHAT_PROMPT_TEMPLATE

logger = logging.getLogger(__name__)

class Pipeline:
    def __init__(
        self,
        semantic_router_service: SemanticRouterService,
        embedding_service: EmbeddingService,
        memory_service: MemoryService,
        qdrant_service: QdrantService,
        rerank_service: RerankService,
        llm_service: LLMService,
        cache_service: CacheService,
    ):
        self.semantic_router_service = semantic_router_service
        self.embedding_service = embedding_service
        self.memory_service = memory_service
        self.qdrant_service = qdrant_service
        self.rerank_service = rerank_service
        self.llm_service = llm_service
        self.cache_service = cache_service

    def __build_context(self, selected_products):
        # Tối ưu hóa việc nối chuỗi (String Concatenation)
        if not selected_products:
            return "No products found matching the criteria."
            
        context_parts = []
        for i, item in enumerate(selected_products, 1):
            p = item.get("meta", {})
            context_parts.append(
                f"{i}. Name: {p.get('name', 'N/A')}\n"
                f"   Brand: {p.get('brand', '')}\n"
                f"   Category: {p.get('category', '')}\n"
                f"   Description: {p.get('text_content', '')}\n"
                f"   Available colors: {p.get('colors', '')}\n"
                f"   Available sizes: {p.get('sizes', '')}\n"
            )
        return "\n".join(context_parts)
    
    async def __reflect(self, session_id: str, query: str) -> str:
        history = await self.memory_service.get_history(session_id=session_id)
        reflected_query = await self.llm_service.rewrite_query_with_memory(query=query, history=history)
        return reflected_query
    
    def __route(self, query: str) -> Literal['CHITCHAT', 'PRODUCT_QUERY']:
        intent = self.semantic_router_service.guide(query)
        if not intent:
            logger.info(f"Router returned None for '{query}', falling back to PRODUCT_QUERY")
            return 'PRODUCT_QUERY'
        return intent
    
    async def __search_cache(self, query: str) -> str:
        return await self.cache_service.search_response(prompt=query)
    
    async def __save_conversation(self, session_id: str, query: str, response: str) -> None:
        await self.memory_service.add_message(
            session_id=session_id,
            role="user",
            content=query
        )
        await self.memory_service.add_message(
            session_id=session_id,
            role="chatbot",
            content=response
        )
        
    async def __format_query(self, query: str) -> List[Dict[str, Any]]:
        formatted_query = await self.llm_service.generate_search_queries(query=query)
        return formatted_query
    
    async def __retrieve(self, search_queries: List[Dict[str, Any]]) -> List:
        unique_products_map = {}

        for sub_query in search_queries:
            semantic_query = sub_query.get("semantic_query", "")
            keywords = sub_query.get("keywords", [])

            sparse_query = " ".join(keywords) if keywords else semantic_query

            dense_vectors, sparse_vectors = self.embedding_service.get_embeddings(
                [semantic_query, sparse_query]
            )

            query_dense_vec = dense_vectors[0]
            raw_sparse_vec = sparse_vectors[1]

            query_sparse_vec = {
                "indices": raw_sparse_vec.indices.tolist(),
                "values": raw_sparse_vec.values.tolist(),
            }

            # Search Hybrid
            matched_products = self.qdrant_service.search_hybrid(
                query_dense_vec=query_dense_vec,
                query_sparse_vec=query_sparse_vec,
                top_k=10,
            )

            # Rerank
            reranked_products = self.rerank_service.rerank_matched_products(
                semantic_query=semantic_query,
                matched_products=matched_products,
                top_k=5,
            )

            for product in reranked_products:
                p_id = product.get("id") or product.get("meta", {}).get("product_id")

                if p_id and p_id not in unique_products_map:
                    unique_products_map[p_id] = product

        selected_products = list(unique_products_map.values())
        return selected_products
    
    async def get_response(self, session_id: str, user_query: str) -> Union[Any, AsyncGenerator]:
        # Reflection
        reflected_query = await self.__reflect(session_id=session_id, query=user_query)
        logger.info(f"Reflected Query: {reflected_query}")
        
        # Routing
        route = self.__route(reflected_query)
        logger.info(f"Route: {route}")
        
        stream_gen = None
        
        # Handling Logic
        if route == 'CHITCHAT': 
            # If the query is chitchat, response immediately
            prompt = CHITCHAT_PROMPT_TEMPLATE.format(query=reflected_query)
            stream_gen = await self.llm_service.response(prompt=prompt, stream=True)
            
        else: # PRODUCT_QUERY (or Fallback)
            # A. Check Cache
            cache_ans = await self.__search_cache(reflected_query)
            if cache_ans:
                logger.info("Cache hit!")
                async def cache_streamer():
                    yield cache_ans
                
                await self.__save_conversation(session_id=session_id, query=user_query, response=cache_ans)
                return cache_streamer()
            
            # Format Query (Extract keywords)
            search_queries = await self.__format_query(query=reflected_query)
            
            # Retrieve
            selected_products = await self.__retrieve(search_queries=search_queries)
            
            # Build Context
            context_str = self.__build_context(selected_products=selected_products)
            
            # Generate Prompt
            prompt = PROMPT_TEMPLATE.format(context_str=context_str, query=reflected_query)

            # Call LLM
            stream_gen = await self.llm_service.response(prompt=prompt, stream=True)
            
        async def response_streamer():
            full_response_text = ""
            try:
                if stream_gen:
                    async for chunk in stream_gen:
                        if chunk:
                            full_response_text += chunk
                            yield chunk
                else:
                    logger.error("Stream generator is None!")
                    yield "Xin lỗi, hệ thống đang gặp sự cố xử lý."
                    return

                if full_response_text.strip():
                    if route == 'PRODUCT_QUERY':
                        logger.info(f"Saving response to cache (len={len(full_response_text)})")
                        await self.cache_service.save_response(
                            prompt=reflected_query, response=full_response_text
                        )
                    
                    logger.info(f"Saving chat message to memory.")
                    await self.__save_conversation(session_id=session_id, query=user_query, response=full_response_text)
                else:
                    logger.warning("Empty response from LLM, skipping save.")

            except Exception as e:
                logger.error(f"Error during streaming/caching: {e}")
                yield "Đã xảy ra lỗi trong quá trình phản hồi."
            
        return response_streamer()