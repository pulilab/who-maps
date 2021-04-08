from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class ExternalAPIAnonRateThrottle(AnonRateThrottle):
    scope = 'ext_user'


class ExternalAPIUserRateThrottle(UserRateThrottle):
    scope = 'ext_user'
