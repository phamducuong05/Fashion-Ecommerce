import logging
import asyncio
import json

from concurrent.futures import ThreadPoolExecutor
from langcache import LangCache

logger = logging.getLogger(__name__)


class CacheService:
    """
    Provides caching functionality for prompt–response pairs using LangCache,
    wrapping synchronous operations inside a thread pool for safe async usage.

    Parameters:
        server_url (str):
            The base URL of the LangCache server.
        cache_id (str):
            The unique cache identifier or namespace used for storing data.
        api_key (str):
            API key used for authenticating requests to LangCache.
        threshold (float, optional):
            Similarity score threshold used when searching for cached responses.
            Defaults to 1.
    """

    def __init__(
        self, server_url: str, cache_id: str, api_key: str, threshold: float = 0.95
    ):
        logger.info(f"Connecting to LangCache at {server_url}...")
        self.lang_cache = LangCache(
            server_url=server_url, cache_id=cache_id, api_key=api_key
        )
        self.threshold = threshold
        self.executor = ThreadPoolExecutor(max_workers=5)
        logger.info(f"Successfully create Cache service with threshold {threshold}.")

    async def search_response(self, prompt) -> str:
        """
        Search for a cached response that matches the given prompt based on
        the configured similarity threshold.

        Args:
            prompt (str): The input prompt to look up in the cache.

        Returns:
            Optional[str]: The cached response if a match above the threshold is
                found; otherwise None.
        """
        preview_prompt = (prompt[:50] + "...") if len(prompt) > 50 else prompt
        logger.debug(f"Searching LangCache for response to prompt: {preview_prompt}.")
        try:
            loop = asyncio.get_running_loop()

            result = await loop.run_in_executor(
                self.executor,
                lambda: self.lang_cache.search(
                    prompt=prompt,
                    similarity_threshold=self.threshold
                )
            )

            if result.data:
                logger.info(f"Cache hit: {preview_prompt}")

                raw = result.data[0].response
                return json.loads(raw)   # ← decode JSON

            logger.info(f"Cache miss: {preview_prompt}")
            return None
        except Exception as e:
            logger.error(
                f"Error while searching LangCache for response to prompt: {preview_prompt}: {e}"
            )

    async def save_response(self, prompt, response) -> None:
        """
        Store a prompt-response pair into LangCache.

        Args:
            prompt (str): The input prompt to be stored.
            response (json): The generated response associated with the prompt.

        Returns:
            None: This method returns nothing; it completes once the save
                operation finishes.
        """
        preview_prompt = (prompt[:50] + "...") if len(prompt) > 50 else prompt
        preview_response = (response[:50] + "...") if len(response) > 50 else response
        logger.debug(
            f"Saving LLM response to LangCache. Prompt: {preview_prompt}; Response: {preview_response}."
        )
        try:
            payload = json.dumps(response)  # ← encode JSON

            loop = asyncio.get_running_loop()

            await loop.run_in_executor(
                self.executor,
                lambda: self.lang_cache.set(prompt=prompt, response=payload)
            )

            logger.info(f"Saved cache for: {preview_prompt}")

        except Exception as e:
            logger.error(f"Error while saving LLM response to LangCache: {e}")
