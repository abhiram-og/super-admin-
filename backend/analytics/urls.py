from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserEngagementViewSet, RevenueAnalyticsViewSet, 
    FeatureUsageViewSet, TenantHealthViewSet
)

router = DefaultRouter()
router.register(r'user-engagement', UserEngagementViewSet)
router.register(r'revenue', RevenueAnalyticsViewSet)
router.register(r'feature-usage', FeatureUsageViewSet)
router.register(r'tenant-health', TenantHealthViewSet)

urlpatterns = [
    path('', include(router.urls)),
]