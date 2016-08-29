"""
Django settings for who_maps project.

Generated by 'django-admin startproject' using Django 1.9.4.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'qu1nafi=f@#w8fz&)(i4h*-1@!gm4)dg^^@vt7!fhwjo!6qh9z'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'raven.contrib.django.raven_compat',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',
    'rest_auth.registration',
    'rest_framework_expiring_authtoken',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'corsheaders',
    'djcelery_email',
    'core',
    'user',
    'project',
    'hss',
    'toolkit',
    'country',
    'search',
    'scheduler',
]

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'core.middleware.ExceptionLoggingMiddleware',
]

ROOT_URLCONF = 'who_maps.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates',],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'who_maps.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgres',
        'USER': 'postgres',
        'HOST': os.environ.get("DATABASE_URL", 'postgres'),
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

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

SITE_ID = int(os.environ.get('SITE_ID', 1))

CORS_ORIGIN_ALLOW_ALL = True

# Rest framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_expiring_authtoken.authentication.ExpiringTokenAuthentication',
    ),
}

# django-allauth and rest-auth settings
AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',
    # `allauth` specific authentication methods
    'allauth.account.auth_backends.AuthenticationBackend',
)

REST_AUTH_SERIALIZERS = {
    'TOKEN_SERIALIZER': 'user.serializers.ProfileTokenSerializer',
    'PASSWORD_RESET_SERIALIZER': 'user.serializers.PasswordResetHTMLEmailSerializer'
}

REST_AUTH_REGISTER_SERIALIZERS = {
    'REGISTER_SERIALIZER': 'user.serializers.RegisterWithProfileSerializer'
}

import datetime
EXPIRING_TOKEN_LIFESPAN = datetime.timedelta(days=1)

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_ADAPTER = 'user.adapters.DefaultAccountAdapterCustom'
ACCOUNT_EMAIL_SUBJECT_PREFIX = ""
DEFAULT_FROM_EMAIL = "Digital Health Atlas <noreply@dhatlas.org>"

# Celery settings
BROKER_URL = 'amqp://guest:guest@rabbitmq:5672//'
TOOLKIT_DIGEST_PERIOD = 1  # hours

# PRODUCTION SETTINGS
if SITE_ID in [3]:
    CELERYBEAT_SCHEDULE = {
        "send_daily_toolkit_digest": {
            "task": 'send_daily_toolkit_digest',
            "schedule": datetime.timedelta(hours=TOOLKIT_DIGEST_PERIOD),
        }
    }

    import raven

    RAVEN_CONFIG = {
        'dsn': 'http://cea32567f8aa4eefa4d2051848d37dea:a884ff71e8ae444c8a40af705699a19c@sentry.vidzor.com/12',
    }

    DEBUG = False

    ALLOWED_HOSTS = ['digitalhealthatlas.org', '46.101.227.24',
                     'test.whomaps.pulilab.com', 'dhatlas.org',
                     'digitalhealthatlas.com']


# Mailgun settings
EMAIL_USE_TLS = True
EMAIL_HOST = "smtp.mailgun.org"
EMAIL_HOST_USER = "postmaster@whomaps.pulilab.com"
EMAIL_HOST_PASSWORD = "5ede15430fbf90989648a0fe12e379cc"
EMAIL_PORT = 587

EMAIL_BACKEND = 'djcelery_email.backends.CeleryEmailBackend'

FROM_EMAIL = DEFAULT_FROM_EMAIL

# Geodata settings
GEOJSON_TEMP_DIR = os.path.join(os.path.dirname(__file__), os.pardir, 'temp/')

LEVELS_FOR_DISTRICTS = {
    "sierra-leone": "admin_level_5",
    "india": "admin_level_5",
    "kenya": "admin_level_4",
    "philippines": "admin_level_3",
    "bangladesh": "admin_level_4",
    # "senegal": "admin_level_3",
    "malawi": "admin_level_4",
    "pakistan": "admin_level_4",
    "indonesia": "admin_level_4",
    "tunisia": "admin_level_4",
    "tanzania": "admin_level_4",
    "ghana": "admin_level_4",
    "benin": "admin_level_4",
    "south-africa": "admin_level_4",
    "sri-lanka": "admin_level_5",
    "nigeria": "admin_level_4",
    "nepal": "admin_level_6",
    "zambia": "admin_level_4",
    "vietnam": "admin_level_4",
    "uganda": "admin_level_6",
    "liberia": "admin_level_4",
    "mali": "admin_level_4",
    "afghanistan": "admin_level_4",
    "angola": "admin_level_4",
    "botswana": "admin_level_4",
    "brazil": "admin_level_4",
    "burkina-faso": "admin_level_5",
    "cameroon": "admin_level_4",
    "central-african-republic": "admin_level_4",
    "chad": "admin_level_4",
    "costa-rica": "admin_level_4",
    "congo-brazzaville": "admin_level_4",
    "congo-kinshasa": "admin_level_4",
    "ethiopia": "admin_level_4",
    "gabon": "admin_level_4",
    "the-gambia": "admin_level_4",
    "guinea": "admin_level_6",
    "guinea-bissau": "admin_level_4",
    "haiti": "admin_level_4",
    "honduras": "admin_level_4",
    "madagascar": "admin_level_4",
    "malaysia": "admin_level_4",
    "mozambique": "admin_level_4",
    "mexico": "admin_level_4",
    "morocco": "admin_level_4",
    "myanmar": "admin_level_4",
    "namibia": "admin_level_4",
    "nicaragua": "admin_level_4",
    "niger": "admin_level_4",
    "peru": "admin_level_4",
    "rwanda": "admin_level_4",
    "south-sudan": "admin_level_4",
    "sudan": "admin_level_4",
    "swaziland": "admin_level_4",
    "togo": "admin_level_4",
    "zimbabwe": "admin_level_4",

    "jamaica": "admin_level_6",
    "albania": "admin_level_6"
}

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

LOGIN_URL = '/login/'

for arg in sys.argv:
    if 'test' in arg:
        DEFAULT_FILE_STORAGE = 'inmemorystorage.InMemoryStorage'
