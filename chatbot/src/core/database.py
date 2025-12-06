import psycopg2
import logging

from typing import List, Optional
from psycopg2.extras import RealDictCursor

from src.utils.text_helper import PSQL_FETCH_ALL_QUERIES, PSQL_FETCH_SPECIFICS_QUERIES

logger = logging.getLogger(__name__)


class PSQLService:
    """
    Provides basic PostgreSQL connection management and data retrieval utilities.

    Parameters:
        host (str):
            Host address of the PostgreSQL server.
        database_name (str):
            Name of the database to connect to.
        user (str):
            Username used for authentication.
        password (str):
            Password associated with the user.
    """

    def __init__(self, host, database_name, user, password):
        self.host = host
        self.database_name = database_name
        self.user = user
        self.password = password
        self.conn = None

    def connect(self) -> None:
        """
        Establish a PostgreSQL connection using the configured credentials.

        Returns:
            None: The connection is stored internally on success.
        """
        if self.conn is not None:
            logger.warning(
                "Connection attempt ignored: PSQL connection is already established."
            )
            return None
        try:
            self.conn = psycopg2.connect(
                host=self.host,
                database=self.database_name,
                user=self.user,
                password=self.password,
                cursor_factory=RealDictCursor,
            )
            logger.info("Successfully connected to PSQL.")
        except psycopg2.Error as e:
            logger.error(f"Error connecting to PSQL: {e}")
            raise e

    def disconnect(self) -> None:
        """
        Close the active PostgreSQL connection if one exists.

        Returns:
            None: Connection is closed; ignored if already disconnected.
        """
        if self.conn is not None:
            try:
                self.conn.close()
                logger.info("Successfully closed connection to PSQL.")
            except psycopg2.Error as e:
                logger.error(f"Error closing PSQL connection: {e}")

    def fetch_all(self) -> Optional[List[dict]]:
        """
        Retrieve semantic data for all products.

        Returns:
            rows (List[dict]): A list of row objects if successful; None on error
                or if no active connection exists.
        """
        if self.conn is None:
            logger.error("fetch_all called but no active PSQL connection.")
            return None

        try:
            with self.conn.cursor() as cur:
                logger.debug(f"Executing query: {PSQL_FETCH_ALL_QUERIES}")
                cur.execute(PSQL_FETCH_ALL_QUERIES)
                rows = cur.fetchall()
                logger.info(f"Fetched {len(rows)} rows from fetch_all().")
                return rows
        except psycopg2.Error as e:
            logger.error(f"Error executing fetch_all: {e}")
            return None

    def fetch_specifics(self, product_ids: List) -> Optional[List[dict]]:
        """
        Retrieve semantic data for specific products based on provided IDs.

        Parameters:
            product_ids (List):
                List of product IDs to fetch data for.

        Returns:
            rows (List[dict]): A list of matching row objects if successful; None
                on connection error. Raises exception on query execution errors.
        """
        if self.conn is None:
            logger.error("fetch_specifics called but no active PSQL connection.")
            return None

        try:
            with self.conn.cursor() as cur:
                placeholder = ", ".join(["%s"] * len(product_ids))
                sql_query = PSQL_FETCH_SPECIFICS_QUERIES.format(placeholder=placeholder)

                logger.debug(
                    f"Executing fetch_specifics with query: {sql_query} "
                    f"and product_ids={product_ids}"
                )

                cur.execute(sql_query, product_ids)
                rows = cur.fetchall()

                logger.info(f"Fetched {len(rows)} rows for product_ids={product_ids}.")
                return rows

        except psycopg2.Error as e:
            logger.error(
                f"Error executing fetch_specifics for product_ids={product_ids}: {e}"
            )
            raise e
