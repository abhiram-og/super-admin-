"""
URL configuration for super_admin_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('rest_framework.urls')),
    path('api/schools/', include('schools.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/integrations/', include('integrations.urls')),
    path('api/compliance/', include('compliance.urls')),
    path('api/users/', include('users.urls')),
    path('api/analytics/', include('analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)