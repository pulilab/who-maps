import os
import datetime
import sys
from celery.schedules import crontab
from django.utils.translation import gettext_lazy as _

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'qu1nafi=f@#w8fz&)(i4h*-1@!gm4)dg^^@vt7!fhwjo!6qh9z'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['.localhost', '*']


# Application definition

INSTALLED_APPS = [
    'modeltranslation',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django_extensions',
    'rest_framework',
    'rest_framework.authtoken',
    'drf_yasg',
    'ordered_model',
    'rosetta',
    'adminsortable2',
    "taggit",
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'django_filters',
    'django_admin_listfilter_dropdown',
    'corsheaders',
    'djcelery_email',
    'simple_history',
    'user',
    'core',
    'project',
    'toolkit',
    'country',
    'search',
    'scheduler',
    'cms',
    'simple_feedback',
    'ckeditor',
    'systemmessages',
    'kpiexport',
    'rangefilter',
    'nonrelated_inlines',
    'import_export'
]

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'core.middleware.ExceptionLoggingMiddleware',
    'simple_history.middleware.HistoryRequestMiddleware',
]

ROOT_URLCONF = 'who_maps.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
                'core.context_processors.from_settings',
            ],
        },
    },
]

WSGI_APPLICATION = 'who_maps.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'HOST': os.environ.get("DATABASE_URL", 'postgres'),
        'PASSWORD': os.environ.get("POSTGRES_PASSWORD", 'postgres'),
        'PORT': 5432,
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGES = (
    ('en', _('English')),
    ('fr', _('French')),
    ('es', _('Spanish')),
    ('pt', _('Portuguese')),
    ('ar', _('Arabic')),
)
LANGUAGE_CODE = 'en'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = '/usr/share/django/static'

MEDIA_ROOT = '/usr/share/django/media'
# MEDIA_ROOT = '/usr/share/nginx/html/media'
MEDIA_URL = '/media/'

FILE_UPLOAD_PERMISSIONS = 0o644

SITE_ID = int(os.environ.get('SITE_ID', 1))
CI_RUN = bool(os.environ.get('CI_RUN', False))

NOTIFICATION_EMAIL = os.environ.get('DEFAULT_NOTIFICATION_EMAIL_EXPORT')

CORS_ORIGIN_ALLOW_ALL = True

# Rest framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'user.authentication.BearerTokenAuthentication'
    ),
    'DEFAULT_THROTTLE_RATES': {
        'ext_anon': '200/hour',
        'ext_user': '200/hour'
    },
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema'
}

# django-allauth and rest-auth settings
AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    # 'django.contrib.auth.backends.ModelBackend',
    # `allauth` specific authentication methods
    'allauth.account.auth_backends.AuthenticationBackend',
)

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": datetime.timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": datetime.timedelta(days=10),
    "LEEWAY": datetime.timedelta(minutes=2),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,
    "AUTH_HEADER_TYPES": ("Token",),
}

REST_AUTH = {
    'USE_JWT': True,
    # 'JWT_AUTH_COOKIE': 'jwt-auth',
    'JWT_SERIALIZER': 'user.serializers.ProfileJWTSerializer',
    'PASSWORD_RESET_SERIALIZER': 'user.serializers.PasswordResetHTMLEmailSerializer',
    'REGISTER_SERIALIZER': 'user.serializers.RegisterWithProfileSerializer'
}

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_ADAPTER = 'user.adapters.DefaultAccountAdapterCustom'
ACCOUNT_EMAIL_SUBJECT_PREFIX = ""
ACCOUNT_EMAIL_CONFIRMATION_HMAC = False  # This is for backwards compat, should move to True to not store it in DB
DEFAULT_FROM_EMAIL = "Digital Health Atlas <noreply@dhatlas.org>"

EMAIL_BACKEND = 'django.core.mail.backends.dummy.EmailBackend'
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

EMAIL_SENDING_PRODUCTION = os.environ.get('EMAIL_SENDING_PRODUCTION', False)

REDIS_URL = os.environ.get('REDIS_URL', 'redis')

# Celery settings
BROKER_URL = 'redis://{}:6379/0'.format(REDIS_URL)
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# SCHEDULES
TOOLKIT_DIGEST_PERIOD = 7 * 24  # 1 week
PROJECT_UPDATE_DIGEST_PERIOD = 7 * 24  # 1 week
APPROVAL_DIGEST_PERIOD = 7 * 24  # 1 week
NEW_QUESTION_DIGEST_PERIOD = 7 * 24  # 1 week
DRAFT_ONLY_REMINDER_PERIOD = 7 * 24  # 1 week
DRAFT_EXPIRATION_REMINDER_PERIOD = 5 * 4 * 7 * 24  # 5 months
DRAFT_EXPIRATION_ARCHIVAL_PERIOD = 6 * 4 * 7 * 24  # 6 months
EMPTY_STAGES_REMINDER_PERIOD = 3 * 4 * 7 * 24  # - 3 month (12 weeks)
NO_COVERAGE_REMINDER = 4 * 7 * 24  # 4 weeks

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://{}:6379/1".format(REDIS_URL),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
    #     'default': {
    #         'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    #     }
}

if SITE_ID in [2, 3, 4]:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

# Mailgun settings
EMAIL_USE_TLS = True
EMAIL_HOST = "smtp.mailgun.org"
EMAIL_HOST_USER = "postmaster@whomaps.pulilab.com"
EMAIL_HOST_PASSWORD = "5ede15430fbf90989648a0fe12e379cc"
EMAIL_PORT = 587

FROM_EMAIL = DEFAULT_FROM_EMAIL


# Geodata settings
GEOJSON_TEMP_DIR = os.path.join(os.path.dirname(__file__), os.pardir, 'temp/')

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'logfile': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/tmp/whomaps.log',
            'maxBytes': 10000000,
        },
    },
    'loggers': {
        '': {
            'handlers': ['console', 'logfile'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

LOGIN_URL = '/admin/login/'
LOGIN_REDIRECT_URL = '/admin/login/'

ROSETTA_STORAGE_CLASS = 'rosetta.storage.CacheRosettaStorage'
ROSETTA_WSGI_AUTO_RELOAD = True
ROSETTA_MESSAGES_PER_PAGE = 25
ROSETTA_SHOW_AT_ADMIN_PANEL = True
ROSETTA_ENABLE_TRANSLATION_SUGGESTIONS = True
DEEPL_AUTH_KEY = os.environ.get('DEEPL_KEY', '')

LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'translations'),  # don't move this, update_translations mgmt cmd is using it
    os.path.join(BASE_DIR, 'locale'),
    os.path.join(BASE_DIR, 'cms/locale'),
    os.path.join(BASE_DIR, 'core/locale'),
    os.path.join(BASE_DIR, 'country/locale'),
    os.path.join(BASE_DIR, 'project/locale'),
    os.path.join(BASE_DIR, 'search/locale'),
    os.path.join(BASE_DIR, 'toolkit/locale'),
    os.path.join(BASE_DIR, 'user/locale'),
]

for arg in sys.argv:
    if 'test' in arg:
        DEFAULT_FILE_STORAGE = 'inmemorystorage.InMemoryStorage'

if SITE_ID == 3:
    ENVIRONMENT_NAME = f"PRODUCTION - ({os.environ.get('DEPLOY_VERSION', 'Unknown')})"
    ENVIRONMENT_COLOR = "red"
elif SITE_ID == 4:
    ENVIRONMENT_NAME = f"QA / STAGING - ({os.environ.get('DEPLOY_VERSION', 'Unknown')})"
    ENVIRONMENT_COLOR = "orange"
    DRAFT_ONLY_REMINDER_LIMITED = True
else:
    ENVIRONMENT_NAME = f"DEVELOPMENT - ({os.environ.get('DEPLOY_VERSION', 'Unknown')})"
    ENVIRONMENT_COLOR = "blue"


if CI_RUN:
    STATIC_ROOT = "/home/circleci/who-maps/nginx/site/static/"
    MEDIA_ROOT = "/home/circleci/who-maps/django/media/"

OSM_MAP_CLI_KEY = 'a9ea45b5-ab37-4323-8263-767aa5896113'


MAX_ROAD_MAP_DOCUMENT_UPLOAD_SIZE = 25 * 1024 * 1024  # 25 MB
VALID_ROAD_MAP_DOCUMENT_FILE_TYPES = ('.pdf', '.xls', '.xlsx', '.doc', '.docx')
ENABLE_GDHI_UPDATE_ON_COUNTRY_SAVE = os.environ.get('ENABLE_GDHI_UPDATE_ON_COUNTRY_SAVE', False)

# PRODUCTION SETTINGS
if SITE_ID in [3, 4]:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    from sentry_sdk.integrations.celery import CeleryIntegration
    sentry_sdk.init(
        dsn=os.environ.get('SENTRY_DSN', ''),
        integrations=[DjangoIntegration(), CeleryIntegration()],

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=0.2,

        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True,

        # By default the SDK will try to use the SENTRY_RELEASE
        # environment variable, or infer a git commit
        # SHA as release, however you may want to set
        # something more human-readable.
        release=os.environ.get('DEPLOY_VERSION', '0.0.0')
    )

    CELERYBEAT_SCHEDULE = {
        "send_toolkit_digest": {
            "task": 'send_toolkit_digest',
            "schedule": datetime.timedelta(hours=TOOLKIT_DIGEST_PERIOD),
        },
        "send_project_updated_digest": {
            "task": 'send_project_updated_digest',
            "schedule": datetime.timedelta(hours=PROJECT_UPDATE_DIGEST_PERIOD),
        },
        "send_project_approval_digest": {
            "task": 'send_project_approval_digest',
            "schedule": datetime.timedelta(hours=APPROVAL_DIGEST_PERIOD),
        },
        "send_new_custom_country_question_digest": {
            "task": 'send_new_custom_country_question_digest',
            "schedule": datetime.timedelta(hours=NEW_QUESTION_DIGEST_PERIOD),
        },
        "send_new_custom_donor_question_digest": {
            "task": 'send_new_custom_donor_question_digest',
            "schedule": datetime.timedelta(hours=NEW_QUESTION_DIGEST_PERIOD),
        },
        "send_draft_only_reminders": {
            "task": 'send_draft_only_reminders',
            "schedule": datetime.timedelta(hours=DRAFT_ONLY_REMINDER_PERIOD),
        },
        "send_draft_expiration_reminders": {
            "task": 'send_draft_expiration_reminders',
            "schedule": crontab(hour='11', minute='0', month_of_year="1,3,5,7,9,11", day_of_month='17'),
        },
        "archive_expired_drafts": {
            "task": 'archive_expired_drafts',
            "schedule": crontab(hour='11', minute='0', month_of_year="2,4,6,8,10,12", day_of_month='17'),
        },
        "send_empty_stages_reminder": {
            "task": 'send_empty_stages_reminder',
            "schedule": datetime.timedelta(hours=EMPTY_STAGES_REMINDER_PERIOD),
        },
        "send_coverage_reminder": {
            "task": 'send_coverage_reminder',
            "schedule": datetime.timedelta(hours=NO_COVERAGE_REMINDER),
        },
        "auditlog_update_user_data": {
            "task": "auditlog_update_user_data",
            "schedule": crontab(hour=1, minute=0, ),
        },
        "auditlog_update_token_data": {
            "task": "auditlog_update_token_data",
            "schedule": crontab(hour=1, minute=0, ),
        },
        "auditlog_update_project_status_data": {
            "task": "auditlog_update_project_status_data",
            "schedule": crontab(hour=1, minute=0, ),
        },
        "auditlog_update_project_stages_data": {
            "task": "auditlog_update_project_stages_data",
            "schedule": crontab(hour=1, minute=0, ),
        },
        "auditlog_update_data_standards": {
            "task": "auditlog_update_data_standards",
            "schedule": crontab(hour=1, minute=0, ),
        },
        "auditlog_update_hfa": {
            "task": "auditlog_update_hfa",
            "schedule": crontab(hour=2, minute=0, ),
        }
    }

    DEBUG = False

    ALLOWED_HOSTS = ['.digitalhealthatlas.org', '.prod.whomaps.pulilab.com',
                     '.qa.whomaps.pulilab.com', '.dhatlas.org',
                     '.digitalhealthatlas.com', 'nginx:9010', 'nginx',
                     'digitalatlas.who.int', 'digitalhealthatlas.who.int', 'atlas.who.int']

    EMAIL_BACKEND = 'djcelery_email.backends.CeleryEmailBackend'

    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework_simplejwt.authentication.JWTAuthentication',
            'user.authentication.BearerTokenAuthentication'
        ),
        'DEFAULT_RENDERER_CLASSES': (
            'rest_framework.renderers.JSONRenderer',
        ),
        'DEFAULT_THROTTLE_RATES': {
            'ext_anon': '200/hour',
            'ext_user': '200/hour'
        }
    }
    # TODO: refactor these into .env settings
    if SITE_ID == 3:
        EMAIL_SENDING_PRODUCTION = True
    if SITE_ID == 4:
        # redirect all emails to the forced addresses
        EMAIL_BACKEND = 'core.middleware.TestCeleryEmailBackend'
        TEST_FORCED_TO_ADDRESS = ["t@pulilab.com", "f@pulilab.com", "ta@pulilab.com"]
        ALLOWED_HOSTS = ALLOWED_HOSTS + ['139.59.148.238']

if SITE_ID == 2:
    DEBUG = False
    ALLOWED_HOSTS = ['.dev.whomaps.pulilab.com', 'nginx:9010', 'nginx']

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'description': 'authorization: Bearer XXXXXXXXXXXXXXXXXXX'
        },
    },
    'SECURITY_REQUIREMENTS': [{'Bearer': []}]
}

"""
'hash' : 'name'
"""
EXTERNAL_API_CLIENTS = {
    "default": "Other",
    "xNhlb4": "DCH",
    "6TAyaB": "DHIS2",
    "9uX76C": "DHI"
}
"""
For checking which projects can be safely deleted
"""
OBSOLETE_PROJECT_MARKERS = {
    'test',
    'demo',
    'delete'
}

SIMPLE_FEEDBACK_NOTIFICATIONS_ENABLED = os.environ.get('SIMPLE_FEEDBACK_NOTIFICATIONS_ENABLED', False)
SIMPLE_FEEDBACK_SEND_TO = os.environ.get('SIMPLE_FEEDBACK_SEND_TO', 'dhasupport@pulilab.com')
TAGGIT_CASE_INSENSITIVE = True
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar_DEFAULT': [
            ['Bold', 'Italic', 'Underline', 'Strike', '-', 'NumberedList', 'BulletedList', '-',
             'Outdent', 'Indent', '-', 'Undo', 'Redo', '-', 'Source']
        ],
        'toolbar': 'DEFAULT',
        'width': 800,
    }
}
AUTOARCHIVE_EXPIRED_DRAFTS = os.environ.get('AUTOARCHIVE_EXPIRED_DRAFTS', False)
