from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class ExternalAPIAnonRateThrottle(AnonRateThrottle):
    def get_rate(self):
        return '200/hour'


class ExternalAPIUserRateThrottle(UserRateThrottle):
    def get_rate(self):
        return '200/hour'
