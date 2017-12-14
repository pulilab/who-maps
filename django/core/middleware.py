import logging


class ExceptionLoggingMiddleware(object):
    """
    This Middleware enables proper exception stacktrace logging under Gunicorn.
    """

    def process_exception(self, request, exception):  # pragma: no cover
        logging.exception('Exception handling request for ' + request.path)
