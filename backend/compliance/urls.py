from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet, ComplaintViewSet, ComplianceReportViewSet

router = DefaultRouter()
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'complaints', ComplaintViewSet)
router.register(r'reports', ComplianceReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]