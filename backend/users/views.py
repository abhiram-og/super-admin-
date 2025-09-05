from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.utils import timezone
from .models import UserProfile, UserSession, ApiKey
from .serializers import (
    UserSerializer, UserProfileSerializer, UserSessionSerializer, 
    ApiKeySerializer, CreateUserSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('profile')
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active', 'is_staff', 'is_superuser']
    ordering = ['-date_joined']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateUserSerializer
        return UserSerializer
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user"""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'status': 'User activated'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a user"""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'status': 'User deactivated'})
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get user statistics"""
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        staff_users = User.objects.filter(is_staff=True).count()
        superusers = User.objects.filter(is_superuser=True).count()
        
        # Role distribution from profiles
        role_stats = UserProfile.objects.values('role').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Recent registrations
        from datetime import timedelta
        week_ago = timezone.now() - timedelta(days=7)
        recent_registrations = User.objects.filter(
            date_joined__gte=week_ago
        ).count()
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'staff_users': staff_users,
            'superusers': superusers,
            'recent_registrations': recent_registrations,
            'role_distribution': list(role_stats)
        })

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.select_related('user')
    serializer_class = UserProfileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'can_manage_schools', 'can_manage_integrations']
    ordering = ['-created_at']

class UserSessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserSession.objects.select_related('user')
    serializer_class = UserSessionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'is_active', 'country', 'city']
    ordering = ['-last_activity']
    
    @action(detail=False, methods=['get'])
    def active_sessions(self, request):
        """Get currently active sessions"""
        # Sessions active in last 30 minutes
        cutoff_time = timezone.now() - timezone.timedelta(minutes=30)
        active_sessions = UserSession.objects.filter(
            last_activity__gte=cutoff_time,
            is_active=True
        ).select_related('user')
        
        serializer = UserSessionSerializer(active_sessions, many=True)
        return Response({
            'count': active_sessions.count(),
            'sessions': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get session analytics"""
        from datetime import timedelta
        
        now = timezone.now()
        today = now.date()
        week_ago = now - timedelta(days=7)
        
        # Today's sessions
        today_sessions = UserSession.objects.filter(
            created_at__date=today
        ).count()
        
        # Week's sessions
        week_sessions = UserSession.objects.filter(
            created_at__gte=week_ago
        ).count()
        
        # Geographic distribution
        geo_stats = UserSession.objects.values('country', 'city').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Browser/device stats (simplified)
        device_stats = UserSession.objects.exclude(
            user_agent__isnull=True
        ).extra(
            select={
                'browser': "CASE WHEN user_agent LIKE '%Chrome%' THEN 'Chrome' "
                          "WHEN user_agent LIKE '%Firefox%' THEN 'Firefox' "
                          "WHEN user_agent LIKE '%Safari%' THEN 'Safari' "
                          "ELSE 'Other' END"
            }
        ).values('browser').annotate(count=Count('id')).order_by('-count')
        
        return Response({
            'today_sessions': today_sessions,
            'week_sessions': week_sessions,
            'geographic_distribution': list(geo_stats),
            'browser_distribution': list(device_stats)
        })

class ApiKeyViewSet(viewsets.ModelViewSet):
    queryset = ApiKey.objects.select_related('user')
    serializer_class = ApiKeySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'is_active']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def regenerate(self, request, pk=None):
        """Regenerate API key"""
        api_key = self.get_object()
        
        # Generate new key hash (in real implementation, you'd generate actual key)
        import hashlib
        import secrets
        new_key = secrets.token_urlsafe(32)
        api_key.key_hash = hashlib.sha256(new_key.encode()).hexdigest()
        api_key.save()
        
        return Response({
            'status': 'API key regenerated',
            'new_key': new_key  # In production, return this securely
        })
    
    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        """Revoke API key"""
        api_key = self.get_object()
        api_key.is_active = False
        api_key.save()
        return Response({'status': 'API key revoked'})