from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SchoolViewSet, SchoolTierViewSet, SchoolStaffViewSet, SchoolUsageStatsViewSet

router = DefaultRouter()
router.register(r'schools', SchoolViewSet)
router.register(r'tiers', SchoolTierViewSet)
router.register(r'staff', SchoolStaffViewSet)
router.register(r'usage-stats', SchoolUsageStatsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]