from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class ExternalAPIAnonRateThrottle(AnonRateThrottle):
    scope = 'ext_anon'


class ExternalAPIUserRateThrottle(UserRateThrottle):
    scope = 'ext_user'
