from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum
from django.utils import timezone
from .models import School, SchoolTier, SchoolStaff, SchoolUsageStats
from .serializers import (
    SchoolSerializer, SchoolTierSerializer, SchoolStaffSerializer,
    SchoolUsageStatsSerializer, SchoolCreateSerializer, SchoolSummarySerializer
)

class SchoolTierViewSet(viewsets.ModelViewSet):
    queryset = SchoolTier.objects.all()
    serializer_class = SchoolTierSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price_per_month', 'created_at']
    ordering = ['price_per_month']

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.select_related('tier').prefetch_related('staff', 'usage_stats')
    serializer_class = SchoolSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'tier', 'city', 'state', 'country']
    search_fields = ['name', 'code', 'email', 'city']
    ordering_fields = ['name', 'created_at', 'subscription_end', 'total_students']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SchoolCreateSerializer
        elif self.action == 'list':
            return SchoolSummarySerializer
        return SchoolSerializer
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get overall school statistics"""
        total_schools = School.objects.count()
        active_schools = School.objects.filter(status='active').count()
        trial_schools = School.objects.filter(status='trial').count()
        suspended_schools = School.objects.filter(status='suspended').count()
        
        # License expiry stats
        now = timezone.now()
        expired_licenses = School.objects.filter(license_expiry__lt=now).count()
        expiring_soon = School.objects.filter(
            license_expiry__gt=now,
            license_expiry__lt=now + timezone.timedelta(days=30)
        ).count()
        
        # Tier distribution
        tier_stats = School.objects.values('tier__name').annotate(
            count=Count('id')
        ).order_by('tier__name')
        
        return Response({
            'total_schools': total_schools,
            'active_schools': active_schools,
            'trial_schools': trial_schools,
            'suspended_schools': suspended_schools,
            'expired_licenses': expired_licenses,
            'expiring_soon': expiring_soon,
            'tier_distribution': tier_stats
        })
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a school"""
        school = self.get_object()
        school.status = 'active'
        school.save()
        return Response({'status': 'School activated'})
    
    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        """Suspend a school"""
        school = self.get_object()
        school.status = 'suspended'
        school.save()
        return Response({'status': 'School suspended'})
    
    @action(detail=True, methods=['get'])
    def usage_stats(self, request, pk=None):
        """Get usage statistics for a school"""
        school = self.get_object()
        stats = SchoolUsageStats.objects.filter(school=school).order_by('-date')[:30]
        serializer = SchoolUsageStatsSerializer(stats, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def expiring_licenses(self, request):
        """Get schools with expiring licenses"""
        days = int(request.query_params.get('days', 30))
        now = timezone.now()
        cutoff_date = now + timezone.timedelta(days=days)
        
        schools = School.objects.filter(
            license_expiry__gt=now,
            license_expiry__lt=cutoff_date
        ).order_by('license_expiry')
        
        serializer = SchoolSummarySerializer(schools, many=True)
        return Response(serializer.data)

class SchoolStaffViewSet(viewsets.ModelViewSet):
    queryset = SchoolStaff.objects.select_related('school')
    serializer_class = SchoolStaffSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['school', 'role', 'is_active']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'role', 'created_at']
    ordering = ['-created_at']

class SchoolUsageStatsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SchoolUsageStats.objects.select_related('school')
    serializer_class = SchoolUsageStatsSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['school', 'date']
    ordering_fields = ['date', 'active_students', 'login_count']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get usage summary across all schools"""
        from django.db.models import Sum, Avg
        
        # Get date range from query params
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = self.get_queryset()
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        summary = queryset.aggregate(
            total_active_students=Sum('active_students'),
            total_active_teachers=Sum('active_teachers'),
            total_logins=Sum('login_count'),
            total_quiz_attempts=Sum('quiz_attempts'),
            average_active_students=Avg('active_students'),
            average_logins=Avg('login_count')
        )
        
        return Response(summary)