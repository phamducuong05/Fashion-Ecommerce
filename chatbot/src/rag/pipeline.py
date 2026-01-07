import logging
from typing import Union, Any, Literal, List, Dict

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
    """
    Orchestrates the RAG (Retrieval-Augmented Generation) process.
    
    This pipeline handles:
    1. Query Reflection (rewriting based on history).
    2. Semantic Routing (Chitchat vs. Product Search).
    3. Hybrid Retrieval (Qdrant Vector Search + Keyword Search).
    4. Reranking.
    5. LLM Response Generation.
    """

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

    def __build_context(self, selected_products: List[Dict[str, Any]]) -> str:
        """
        Constructs a text context from selected products for the LLM prompt.
        
        Updated to match the new SQL Query Aliases:
        - product_name, product_description, price, rating, categories, etc.
        
        Args:
            selected_products (List[Dict]): List of product objects from Qdrant/DB.

        Returns:
            str: A formatted string containing product details.
        """
        if not selected_products:
            return "No products found matching the criteria."
            
        context_parts = []
        for i, item in enumerate(selected_products, 1):
            # 'meta' contains the payload from Qdrant/DB which matches the SQL columns
            p = item.get("meta", {})
            
            context_parts.append(
                f"{i}. Name: {p.get('product_name', 'N/A')}\n"
                f"   Categories: {p.get('categories', '')}\n"
                f"   Price: {p.get('price', 'N/A')}\n"
                f"   Original price: {p.get('original_price', 'N/A')}"
                f"   Rating: {p.get('rating', '0')} ({p.get('review_count', 0)} reviews)\n"
                f"   Description: {p.get('product_description', '')}\n"
                f"   Available colors: {p.get('available_colors', '')}\n"
                f"   Available sizes: {p.get('available_sizes', '')}\n"
            )
        return "\n".join(context_parts)
    
    async def __reflect(self, session_id: int, query: str) -> str:
        """
        Rewrites the user query based on chat history to include context.
        """
        history = await self.memory_service.get_history(session_id=session_id)
        reflected_query = await self.llm_service.rewrite_query_with_memory(query=query, history=history)
        return reflected_query
    
    def __route(self, query: str) -> Literal['CHITCHAT', 'PRODUCT_QUERY']:
        """
        Determines the intent of the query using the Semantic Router.
        """
        intent = self.semantic_router_service.guide(query)
        if not intent:
            logger.info(f"Router returned None for '{query}', falling back to PRODUCT_QUERY")
            return 'CHITCHAT'
        return intent
    
    async def __search_cache(self, query: str) -> str:
        """
        Checks the semantic cache for an existing response.
        """
        return await self.cache_service.search_response(prompt=query)
        
    async def __format_query(self, query: str) -> List[Dict[str, Any]]:
        """
        Uses LLM to generate keywords and sub-queries for search.
        """
        formatted_query = await self.llm_service.generate_search_queries(query=query)
        return formatted_query
    
    async def __retrieve(self, search_queries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Executes Hybrid Search (Dense + Sparse) and Reranking.
        """
        unique_products_map = {}

        for sub_query in search_queries:
            semantic_query = sub_query.get("semantic_query", "")
            keywords = sub_query.get("keywords", [])

            # Construct sparse query from keywords
            sparse_query = " ".join(keywords) if keywords else semantic_query

            # Generate embeddings
            dense_vectors, sparse_vectors = self.embedding_service.get_embeddings(
                [semantic_query, sparse_query]
            )

            query_dense_vec = dense_vectors[0]
            raw_sparse_vec = sparse_vectors[1]

            query_sparse_vec = {
                "indices": raw_sparse_vec.indices.tolist(),
                "values": raw_sparse_vec.values.tolist(),
            }

            # 1. Hybrid Search in Qdrant
            matched_products = self.qdrant_service.search_hybrid(
                query_dense_vec=query_dense_vec,
                query_sparse_vec=query_sparse_vec,
                top_k=10,
            )

            # 2. Reranking
            reranked_products = self.rerank_service.rerank_matched_products(
                semantic_query=semantic_query,
                matched_products=matched_products,
                top_k=5,
            )

            # Deduplicate products based on ID
            for product in reranked_products:
                # Key update: SQL uses 'product_id', Qdrant payload stores it as such
                p_id = product.get("id") or product.get("meta", {}).get("product_id")

                if p_id and p_id not in unique_products_map:
                    unique_products_map[p_id] = product

        return list(unique_products_map.values())
    
    def __extract_product_metadata(self, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extracts and transforms product data to match the Frontend interface.
        
        Target Interface:
            id: string;
            name: string;
            price: number;
            image: string;
            rating: number;
            reviewCount: number;
            colors: { name: string; hex: string }[];
            sizes: string[];
        """
        extracted = []
        for p in products:
            meta = p.get("meta", {})
            
            # 1. Handle Sizes: "S, M, L" -> ["S", "M", "L"]
            raw_sizes = meta.get("available_sizes")
            sizes_list = [s.strip() for s in raw_sizes.split(",")] if raw_sizes else []

            # 2. Handle Colors: "Red, Blue" -> [{name: "Red", hex: ""}, ...]
            raw_colors = meta.get("available_colors")
            colors_list = []
            if raw_colors:
                color_names = [c.strip() for c in raw_colors.split(",")]
                for c_name in color_names:
                    colors_list.append({
                        "name": c_name,
                        "hex": "" # Placeholder. Update SQL if you need real hex codes.
                    })

            extracted.append({
                "id": str(meta.get("product_id")),
                "name": meta.get("product_name"),
                "price": float(meta.get("price") or 0),
                "image": meta.get("image_url"),
                "rating": float(meta.get("rating") or 0),
                "reviewCount": int(meta.get("review_count") or 0),
                "colors": colors_list,
                "sizes": sizes_list
            })
            
        return extracted

    async def get_response(self, session_id: int, user_query: str) -> Dict[str, Any]:
        """
        Main entry point for the pipeline.
        
        Args:
            session_id (int): The session ID (from PostgreSQL).
            user_query (str): The user's input text.
            
        Returns:
            Dict[str, Any]: { "content": str, "products": List[dict], "intent": str }
        """
        # 1. Reflection
        reflected_query = await self.__reflect(session_id=session_id, query=user_query)
        logger.info(f"Reflected Query: {reflected_query}")
        
        # 2. Routing
        route = self.__route(reflected_query)
        logger.info(f"Route determined: {route}")
        
        response_text = ""
        products_data = []
        
        #! FOR TESTING ONLY, NOT EXISTS IN PRODUCTION
        # await self.memory_service.add_message_temp(session_id, "user", user_query)
        
        # 3. Handling Logic
        if route == 'CHITCHAT': 
            prompt = CHITCHAT_PROMPT_TEMPLATE.format(query=reflected_query)
            response_text = await self.llm_service.response(prompt=prompt, stream=False)
            
        else: # PRODUCT_QUERY
            # A. Check Cache
            # cache_ans = await self.__search_cache(reflected_query)
            # if cache_ans:
            #     logger.info("Cache hit!")
            #     return {
            #         "content": cache_ans,
            #         "products": [],
            #         "intent": route
            #     }
            
            # B. Format Query & Retrieve
            search_queries = await self.__format_query(query=reflected_query)
            selected_products = await self.__retrieve(search_queries=search_queries)
            
            # Extract metadata for Node.js
            products_data = self.__extract_product_metadata(selected_products)
            
            # C. Build Context & Generate
            context_str = self.__build_context(selected_products=selected_products)
            prompt = PROMPT_TEMPLATE.format(context_str=context_str, query=reflected_query)

            # D. Call LLM
            response_text = await self.llm_service.response(prompt=prompt, stream=False)
            
            # E. Save to Cache
            if response_text:
                await self.cache_service.save_response(prompt=reflected_query, response=response_text)
        
        #! FOR TESTING ONLY, NOT EXISTS IN PRODUCTION
        # await self.memory_service.add_message_temp(session_id, "bot", response_text)
        # 4. Return structured data to Node.js Backend
        return {
            "content": response_text,
            "intent": route,
            "products": products_data
        }