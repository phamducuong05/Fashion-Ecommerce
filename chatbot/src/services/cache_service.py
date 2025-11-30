import logging

from langcache import LangCache

logger = logging.getLogger(__name__)


class CacheService:
    def __init__(self, server_url: str, cache_id: str, api_key: str):
        self.lang_cache = LangCache(
            server_url=server_url, cache_id=cache_id, api_key=api_key
        )
        logger.info("Successfully create Cache service.")

    def search_response(self, prompt):
        preview_prompt = (prompt[:50] + "...") if len(prompt) > 50 else prompt
        logger.debug(f"Searching LangCache for response to prompt: {preview_prompt}.")
        try:
            response = self.lang_cache.search(prompt=prompt, similarity_threshold=0.9)
            if response:
                logger.info(f"Hit cache for prompt: {preview_prompt}")
                return response
            else:
                logger.info(f"Cache miss for prompt: {preview_prompt}")
                return None
        except Exception as e:
            logger.error(
                f"Error while searching LangCache for response to prompt: {preview_prompt}: {e}"
            )

    def save_response(self, prompt, response):
        preview_prompt = (prompt[:50] + "...") if len(prompt) > 50 else prompt
        preview_response = (response[:50] + "...") if len(response) > 50 else response
        logger.debug(
            f"Saving LLM response to LangCache. Prompt: {preview_prompt}; Response: {preview_response}."
        )
        try:
            self.lang_cache.set(prompt=prompt, response=response)
            logger.info("Successfully save LLM response to Langcache.")
        except Exception as e:
            logger.error(f"Error while saving LLM response to LangCache: {e}")


if __name__ == "__main__":
    prompt = "test LangCache"
