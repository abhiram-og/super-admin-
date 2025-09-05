from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SystemHealthViewSet, PlatformMetricsViewSet, 
    RecentActivityViewSet, AIQuizPerformanceViewSet
)

router = DefaultRouter()
router.register(r'system-health', SystemHealthViewSet)
router.register(r'metrics', PlatformMetricsViewSet)
router.register(r'activities', RecentActivityViewSet)
router.register(r'ai-quiz', AIQuizPerformanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]