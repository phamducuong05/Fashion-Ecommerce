import json
import os
import asyncio
import logging

from dotenv import load_dotenv
from groq import AsyncGroq
from typing import Union, AsyncGenerator, Dict, Any, List

from src.utils.text_helper import FORMAT_USER_INPUT_PROMPT, REWRITE_QUERY_WITH_HISTORY_PROMPT_TEMPLATE

logger = logging.getLogger(__name__)

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


class LLMService:
    """
    Service layer wrapper for Groq LLM API, providing both normal and streaming
    completion utilities, as well as structured query decomposition for hybrid search.

    This class abstracts:
        1. Low-level communication with Groq's ChatCompletion API (async).
        2. Unified interface for full-response and streamed-response modes.
        3. Query decomposition where the model must output a strict JSON schema.
        4. Fallback behavior to ensure system stability when the model produces invalid JSON.

    Attributes:
        client (AsyncGroq): Asynchronous Groq API client instance.
        model_name (str): Default model used for all completion requests.
    """
    def __init__(self, api_key: str, model_name: str):
        self.client = AsyncGroq(api_key=api_key)
        self.model_name = model_name
        logger.info(f"LLMService initialized with model: {model_name}")

    async def response(
        self,
        prompt: str,
        stream: bool = False
    ) -> Union[str, AsyncGenerator]:
        """
        Sends a completion request to the Groq language model.

        This method supports two modes:
            - Non-streaming: returns the full LLM output as a single string.
            - Streaming: returns an async generator yielding tokens incrementally.

        Args:
            prompt (str):
                The input text to be sent to the LLM.
            stream (bool, optional):
                Whether the response should be streamed. If True, the method returns
                an async generator. Defaults to False.

        Returns:
            Union[str, AsyncGenerator]:
                - If stream=False: returns the complete response as a string.
                - If stream=True: returns an async generator producing incremental chunks.

        Raises:
            Exception:
                Any exception raised by the API or during streaming will be logged
                and re-raised to the caller.
        """
        # Log the request (Truncate prompt to avoid massive logs)
        preview_prompt = (prompt[:50] + "...") if len(prompt) > 50 else prompt
        logger.debug(
            f"Sending request to LLM (Stream={stream}). Prompt preview: '{preview_prompt}'"
        )
        try:
            completion = await self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model_name,
                temperature=0.7,
                max_tokens=8192,
                top_p=1,
                stream=stream,
                stop=None,
            )

            if stream:

                async def streamer():
                    logger.debug("Starting response stream...")
                    try:
                        async for chunk in completion:
                            content = chunk.choices[0].delta.content 
                            if content:
                                yield content
                    except Exception as e:
                        logger.error(f"Error during streaming: {str(e)}", exc_info=True)
                        raise e

                return streamer()
            else:
                logger.debug("Received full response from LLM.")
                return completion.choices[0].message["content"]
        except Exception as e:
            logger.error(f"Error calling LLM API: {str(e)}", exc_info=True)
        
    async def rewrite_query_with_memory(self, user_query: str, history: List[Dict]) -> str:
        if not history:
            return user_query
        
        history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
        prompt = REWRITE_QUERY_WITH_HISTORY_PROMPT_TEMPLATE.format(history=history_text, new_query=user_query)
        
        logger.info(f"Rewriting new user's query {user_query} according to chat history...")
        try:
            completion = await self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
            )
            rewritten_query = completion.choices[0].message.content
            print(rewritten_query)
            
            return rewritten_query
        except Exception as e:
            logger.error(f"Failed to rewrite new user's query {user_query} according to chat history: {e}")
            logger.warning(f"Trigger fallback mechanism. Returning original query.")
            return user_query
            
    async def generate_search_queries(self, user_query: str) -> List[Dict[str, Any]]:
        """
        Performs intelligent query decomposition using the LLM to prepare input
        for hybrid semantic-keyword search.

        The model is instructed to:
            1. Analyze the raw user query.
            2. Detect if the user is requesting multiple independent items.
            3. Split the request into sub-queries as needed.
            4. Produce, for each sub-query:
                - semantic_query (str): cleaned, optimized query text.
                - keywords (List[str]): extracted keyword list for sparse search.

        The model is required to output strict JSON. If JSON parsing fails or
        the structure is invalid, the method falls back to a robust default that
        treats the entire user query as a single search unit.

        Args:
            user_query (str):
                The raw text provided by the user describing what they want.

        Returns:
            List[Dict[str, Any]]:
                A list of objects with the structure:
                {
                    "semantic_query": str,
                    "keywords": List[str]
                }
                In case of failure, returns a single-element fallback list.

        Raises:
            Exception:
                Any LLM or parsing-related exception is logged and re-raised
                after fallback handling.
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
