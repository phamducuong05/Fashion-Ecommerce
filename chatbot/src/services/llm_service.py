import json
import os
import asyncio
import logging

from dotenv import load_dotenv
from groq import AsyncGroq
from typing import Union, AsyncGenerator, Dict, Any, List

from src.utils.text_helper import FORMAT_USER_INPUT_PROMPT

logger = logging.getLogger(__name__)

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


class LLMService:
    def __init__(self, api_key: str, model_name: str):
        self.client = AsyncGroq(api_key=api_key)
        self.model_name = model_name
        logger.info(f"LLMService initialized with model: {model_name}")

    async def response(
        self, prompt: str, stream: bool = False
    ) -> Union[str, AsyncGenerator]:
        """
        Get response from LLM

        Parameters:
            prompt: prompt for LLM
            stream: whether to stream the response (True) or return the full response at once (False)

        Returns:
            Union[str, Generator]: The full response string or a generator yielding chunks.
        """
        # Log the request (Truncate prompt to avoid massive logs)
        preview_prompt = (prompt[:50] + "...") if len(prompt) > 50 else prompt
        logger.debug(
            f"Sending request to LLM (Stream={stream}). Prompt preview: '{preview_prompt}'"
        )
        try:
            chat_completion = await self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model_name,
                temperature=0.7,
                max_completion_tokens=8192,
                top_p=1,
                stream=stream,
                stop=None,
            )

            if stream:

                async def streamer():
                    logger.debug("Starting response stream...")
                    try:
                        async for chunk in chat_completion:
                            content = chunk.choices[0].delta.content
                            if content:
                                yield content
                    except Exception as e:
                        logger.error(f"Error during streaming: {str(e)}", exc_info=True)
                        raise e

                return streamer()
            else:
                logger.debug("Received full response from LLM.")
                return chat_completion.choices[0].message["content"]
        except Exception as e:
            logger.error(f"Error calling LLM API: {str(e)}", exc_info=True)
            raise e

    async def generate_search_queries(self, user_query: str) -> List[Dict[str, Any]]:
        """
        Analyzes and rewrites the user query for Hybrid Search, performing decomposition if necessary.

        This method instructs the LLM to:
        1. Detect if the user is asking for multiple products (e.g., "shoes and shirt").
        2. Split them into separate sub-queries.
        3. Generate 'semantic_query' and 'keywords' for EACH sub-query.

        Parameters:
            user_query: The raw question from the user.

        Returns:
            List[Dict]: A list of dictionaries, where each dict contains:
                        - 'semantic_query' (str)
                        - 'keywords' (List[str])
        """
        logger.info(f"Generating search queries for input: '{user_query}'")
        try:
            completion = await self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": FORMAT_USER_INPUT_PROMPT},
                    {"role": "user", "content": user_query},
                ],
                temperature=0.1,  # Lower temperature for strict JSON compliance
                response_format={"type": "json_object"},
            )

            response_content = completion.choices[0].message.content

            # Parse the JSON response
            data = json.loads(response_content)

            # Extract the list of queries.
            # We use .get() to be safe, defaulting to an empty list if structure fails
            queries = data.get("queries", [])

            # Validation: If LLM returns empty list for some reason, fallback to original
            if not queries:
                logger.warning("LLM returned valid JSON but empty 'queries' list.")
                raise ValueError("LLM returned empty queries list")

            logger.info(f"Successfully decomposed into {len(queries)} sub-queries.")
            return queries

        except Exception as e:
            logger.error(f"Error during query decomposition: {str(e)}", exc_info=True)
            logger.warning("Triggering fallback mechanism: returning original query.")
            # Fallback mechanism: Return the original query as a single item list
            return [{"semantic_query": user_query, "keywords": user_query.split()}]


# Testing
async def main():
    llm = LLMService(api_key=GROQ_API_KEY, model_name="openai/gpt-oss-20b")

    # Test hybrid search query generation
    print("--- Hybrid Search Query Generation ---")
    raw_query = "Find me 2 products: a pair of shoes and a t-shirt. Both of them must be suitable suitable for sports"

    optimized_query = await llm.generate_search_queries(raw_query)

    print(json.dumps(optimized_query, indent=4, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
