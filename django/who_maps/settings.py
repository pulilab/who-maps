import os
import datetime

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'qu1nafi=f@#w8fz&)(i4h*-1@!gm4)dg^^@vt7!fhwjo!6qh9z'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['.localhost', '.dev.whomaps.pulilab.com', '*']


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
    'toolkit',
    'country',
    'search',
    'scheduler',
    'cms'
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
    'core.middleware.LanguageSelectorMiddleware',
    'core.middleware.ExceptionLoggingMiddleware',
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

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
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

gettext = lambda s: s # noqa
LANGUAGES = (
    ('en', gettext('English')),
    ('fr', gettext('French')),
    ('es', gettext('French')),
    ('pt', gettext('French')),
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
    'core.auth.EmailBackend',
    # 'django.contrib.auth.backends.ModelBackend',
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

EXPIRING_TOKEN_LIFESPAN = datetime.timedelta(days=7)

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_ADAPTER = 'user.adapters.DefaultAccountAdapterCustom'
ACCOUNT_EMAIL_SUBJECT_PREFIX = ""
DEFAULT_FROM_EMAIL = "Digital Health Atlas <noreply@dhatlas.org>"

EMAIL_BACKEND = 'django.core.mail.backends.dummy.EmailBackend'
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Celery settings
BROKER_URL = 'redis://redis:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
TOOLKIT_DIGEST_PERIOD = 1  # hours

# PRODUCTION SETTINGS
if SITE_ID in [3, 4]:
    CELERYBEAT_SCHEDULE = {
        "send_daily_toolkit_digest": {
            "task": 'send_daily_toolkit_digest',
            "schedule": datetime.timedelta(hours=TOOLKIT_DIGEST_PERIOD),
        },
        "send_project_approval_digest": {
            "task": 'send_project_approval_digest',
            "schedule": datetime.timedelta(days=1),
        },
    }
    RAVEN_CONFIG = {
        'dsn': 'http://cea32567f8aa4eefa4d2051848d37dea:a884ff71e8ae444c8a40af705699a19c@sentry.vidzor.com/12',
    }

    DEBUG = False

    ALLOWED_HOSTS = ['.digitalhealthatlas.org', '.prod.whomaps.pulilab.com',
                     '.qa.whomaps.pulilab.com', '.dhatlas.org',
                     '.digitalhealthatlas.com']

    EMAIL_BACKEND = 'djcelery_email.backends.CeleryEmailBackend'

    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework_expiring_authtoken.authentication.ExpiringTokenAuthentication',
        ),
        'DEFAULT_RENDERER_CLASSES': (
            'rest_framework.renderers.JSONRenderer',
        )
    }

    CACHES = {
        'default': {
            'BACKEND': 'redis_cache.RedisCache',
            'LOCATION': [
                'redis:6379',
            ],
        }
    }

if SITE_ID in [3]:
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

LOGIN_URL = '/login/'

for arg in sys.argv:
    if 'test' in arg:
        DEFAULT_FILE_STORAGE = 'inmemorystorage.InMemoryStorage'
