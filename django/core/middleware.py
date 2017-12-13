import logging

from django.utils.translation import activate


class ExceptionLoggingMiddleware(object):
    """
    This Middleware enables proper exception stacktrace logging under Gunicorn.
    """

    def process_exception(self, request, exception):  # pragma: no cover
        logging.exception('Exception handling request for ' + request.path)


class LanguageSelectorMiddleware(object):
    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.user.is_authenticated:
            activate(request.user.userprofile.language)
