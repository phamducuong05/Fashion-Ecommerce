import logging
import json
import sys

from datetime import datetime


class JSONFormatter(logging.Formatter):
    """
    Convert log to JSON format
    """

    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,  # INFO, ERROR, WARNING
            "module": record.name,  # Name of the module/service that calls logger
            "message": record.getMessage(),
            "line": record.lineno,
        }

        # If error, log the error stack trace
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_record, ensure_ascii=False)


def setup_logger():
    """
    Setup logger for the entire app, called only once when the app starts
    """
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler(
        sys.stdout
    )  # Stream the log to console -> Docker can catch the log
    handler.setFormatter(JSONFormatter())

    if logger.hasHandlers():
        logger.handlers.clear()

    logger.addHandler(handler)
