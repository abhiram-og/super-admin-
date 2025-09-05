from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserProfileViewSet, UserSessionViewSet, ApiKeyViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'sessions', UserSessionViewSet)
router.register(r'api-keys', ApiKeyViewSet)

urlpatterns = [
    path('', include(router.urls)),
]