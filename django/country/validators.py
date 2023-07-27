from django.core.exceptions import ValidationError
from django.conf import settings


def file_size(value):  # pragma: no cover
    if value.size > settings.MAX_ROAD_MAP_DOCUMENT_UPLOAD_SIZE:
        raise ValidationError(f'File too large. '
                              f'Size should not exceed {round(settings.MAX_ROAD_MAP_DOCUMENT_UPLOAD_SIZE/1024**2)} MB.')
