from rest_framework.routers import SimpleRouter

from .views import SearchViewSet

router = SimpleRouter()
router.register(r'search', SearchViewSet, base_name="search-list")

urlpatterns = router.urls
