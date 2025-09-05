from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IntegrationViewSet, SchoolIntegrationViewSet, DLTRegistrationViewSet

router = DefaultRouter()
router.register(r'integrations', IntegrationViewSet)
router.register(r'school-integrations', SchoolIntegrationViewSet)
router.register(r'dlt-registrations', DLTRegistrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]