import logging
import json
import os

from semantic_router.route import Route
from semantic_router.encoders import HuggingFaceEncoder
from semantic_router.routers import SemanticRouter

logger = logging.getLogger(__name__)
logging.getLogger("semantic_router").setLevel(logging.ERROR)

class SemanticRouterService():
    def __init__(self):
        logger.info("Initializing Semantic router service...")
        
        self.encoder = HuggingFaceEncoder(name="sentence-transformers/all-MiniLM-L6-v2")
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(current_dir, '../../fashion_chatbot_samples.json')
        
        with open(json_path, 'r', encoding='utf-8') as f:
            sample_data = json.load(f)
        
        chitchat_route = Route(
            name="CHITCHAT",
            utterances=sample_data["CHITCHAT"],
            score_threshold=0.3
        )
        
        product_route = Route(
            name="PRODUCT_QUERY",
            utterances=sample_data["PRODUCT_QUERY"]
        )
        
        self.router = SemanticRouter(
            encoder=self.encoder,
            routes=[]
        )
        self.router.add(chitchat_route)
        self.router.add(product_route)

        logger.info("Initialized Semantic router successfully.")
    
    def guide(self, query: str) -> str:
        try:
            route_choice = self.router(query)
            if route_choice.name:
                logger.info(f"Router decision: \"{query}\" -> {route_choice.name}")
                return route_choice.name
            else:
                return None
        except Exception as e:
            logger.error(f"Failed to guide route for \"{query}\": {e}")
            return None