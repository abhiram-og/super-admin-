from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import UserEngagement, RevenueAnalytics, FeatureUsage, TenantHealth
from .serializers import (
    UserEngagementSerializer, RevenueAnalyticsSerializer, 
    FeatureUsageSerializer, TenantHealthSerializer
)

class UserEngagementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserEngagement.objects.select_related('school')
    serializer_class = UserEngagementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'date', 'country', 'state', 'city']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def global_stats(self, request):
        """Get global engagement statistics"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        queryset = self.get_queryset().filter(
            date__gte=start_date,
            date__lte=end_date
        )
        
        # Aggregate statistics
        stats = queryset.aggregate(
            total_users=Sum('total_users'),
            active_users=Sum('active_users'),
            new_users=Sum('new_users'),
            total_sessions=Sum('total_sessions'),
            avg_session_duration=Avg('average_session_duration'),
            avg_bounce_rate=Avg('bounce_rate'),
            total_page_views=Sum('page_views')
        )
        
        # Daily trends
        daily_trends = list(queryset.values('date').annotate(
            total_users=Sum('total_users'),
            active_users=Sum('active_users'),
            sessions=Sum('total_sessions')
        ).order_by('date'))
        
        # Geographic distribution
        geo_stats = queryset.values('country', 'city').annotate(
            users=Sum('total_users'),
            sessions=Sum('total_sessions')
        ).order_by('-users')[:10]
        
        return Response({
            'summary': stats,
            'daily_trends': daily_trends,
            'geographic_distribution': list(geo_stats)
        })
    
    @action(detail=False, methods=['get'])
    def school_comparison(self, request):
        """Compare engagement across schools"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        school_stats = self.get_queryset().filter(
            date__gte=start_date,
            school__isnull=False
        ).values('school__name').annotate(
            total_users=Sum('total_users'),
            active_users=Sum('active_users'),
            sessions=Sum('total_sessions'),
            avg_session_duration=Avg('average_session_duration'),
            bounce_rate=Avg('bounce_rate')
        ).order_by('-active_users')[:20]
        
        return Response(list(school_stats))

class RevenueAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RevenueAnalytics.objects.select_related('school')
    serializer_class = RevenueAnalyticsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'date']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def revenue_dashboard(self, request):
        """Get revenue dashboard data"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        queryset = self.get_queryset().filter(
            date__gte=start_date,
            date__lte=end_date
        )
        
        # Revenue summary
        revenue_summary = queryset.aggregate(
            total_daily_revenue=Sum('daily_revenue'),
            avg_monthly_revenue=Avg('monthly_revenue'),
            new_subscriptions=Sum('new_subscriptions'),
            canceled_subscriptions=Sum('canceled_subscriptions'),
            successful_payments=Sum('successful_payments'),
            failed_payments=Sum('failed_payments'),
            avg_cac=Avg('customer_acquisition_cost'),
            avg_clv=Avg('customer_lifetime_value'),
            avg_churn_rate=Avg('churn_rate')
        )
        
        # Daily revenue trend
        daily_revenue = list(queryset.values('date').annotate(
            revenue=Sum('daily_revenue'),
            new_subs=Sum('new_subscriptions'),
            churn=Sum('canceled_subscriptions')
        ).order_by('date'))
        
        # Top revenue schools
        top_schools = queryset.filter(
            school__isnull=False
        ).values('school__name').annotate(
            total_revenue=Sum('daily_revenue'),
            subscribers=Sum('new_subscriptions')
        ).order_by('-total_revenue')[:10]
        
        return Response({
            'summary': revenue_summary,
            'daily_trends': daily_revenue,
            'top_schools': list(top_schools)
        })
    
    @action(detail=False, methods=['get'])
    def subscription_metrics(self, request):
        """Get subscription-related metrics"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        metrics = self.get_queryset().filter(
            date__gte=start_date,
            date__lte=end_date
        ).aggregate(
            new_subscriptions=Sum('new_subscriptions'),
            canceled_subscriptions=Sum('canceled_subscriptions'),
            upgraded_subscriptions=Sum('upgraded_subscriptions'),
            downgraded_subscriptions=Sum('downgraded_subscriptions'),
            avg_churn_rate=Avg('churn_rate')
        )
        
        # Calculate net growth
        net_growth = (metrics['new_subscriptions'] or 0) - (metrics['canceled_subscriptions'] or 0)
        
        return Response({
            **metrics,
            'net_subscription_growth': net_growth
        })

class FeatureUsageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FeatureUsage.objects.select_related('school')
    serializer_class = FeatureUsageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'feature_name', 'date']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def popular_features(self, request):
        """Get most popular features across platform"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        feature_stats = self.get_queryset().filter(
            date__gte=start_date,
            date__lte=end_date
        ).values('feature_name').annotate(
            total_uses=Sum('total_uses'),
            unique_users=Sum('unique_users'),
            avg_time_spent=Avg('average_time_spent'),
            avg_success_rate=Avg('success_rate'),
            avg_load_time=Avg('average_load_time')
        ).order_by('-total_uses')
        
        return Response(list(feature_stats))
    
    @action(detail=False, methods=['get'])
    def feature_performance(self, request):
        """Get feature performance metrics"""
        feature_name = request.query_params.get('feature_name')
        days = int(request.query_params.get('days', 30))
        
        if not feature_name:
            return Response(
                {'error': 'feature_name parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        performance_data = list(self.get_queryset().filter(
            feature_name=feature_name,
            date__gte=start_date,
            date__lte=end_date
        ).values('date').annotate(
            uses=Sum('total_uses'),
            users=Sum('unique_users'),
            success_rate=Avg('success_rate'),
            load_time=Avg('average_load_time')
        ).order_by('date'))
        
        return Response(performance_data)

class TenantHealthViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TenantHealth.objects.select_related('school')
    serializer_class = TenantHealthSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'date']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def health_overview(self, request):
        """Get overall platform health overview"""
        latest_date = self.get_queryset().first()
        if not latest_date:
            return Response({'error': 'No health data available'})
        
        latest_date = latest_date.date
        
        # Get latest health metrics for all schools
        latest_metrics = self.get_queryset().filter(date=latest_date)
        
        overview = latest_metrics.aggregate(
            avg_uptime=Avg('uptime_percentage'),
            avg_response_time=Avg('average_response_time'),
            avg_error_rate=Avg('error_rate'),
            avg_cpu_usage=Avg('cpu_usage'),
            avg_memory_usage=Avg('memory_usage'),
            total_storage_usage=Sum('storage_usage'),
            avg_health_score=Avg('overall_health_score'),
            total_concurrent_users=Sum('concurrent_users')
        )
        
        # Health score distribution
        score_ranges = [
            ('excellent', 90, 100),
            ('good', 70, 89),
            ('fair', 50, 69),
            ('poor', 0, 49)
        ]
        
        score_distribution = {}
        for label, min_score, max_score in score_ranges:
            count = latest_metrics.filter(
                overall_health_score__gte=min_score,
                overall_health_score__lte=max_score
            ).count()
            score_distribution[label] = count
        
        # Schools with issues
        unhealthy_schools = latest_metrics.filter(
            Q(overall_health_score__lt=70) | 
            Q(uptime_percentage__lt=95) |
            Q(error_rate__gt=5)
        ).values('school__name', 'overall_health_score', 'uptime_percentage', 'error_rate')
        
        return Response({
            'overview': overview,
            'health_score_distribution': score_distribution,
            'schools_with_issues': list(unhealthy_schools),
            'total_schools_monitored': latest_metrics.count()
        })
    
    @action(detail=True, methods=['get'])
    def school_health_trend(self, request, pk=None):
        """Get health trend for a specific school"""
        school_health = self.get_object()
        school = school_health.school
        
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        trend_data = list(TenantHealth.objects.filter(
            school=school,
            date__gte=start_date,
            date__lte=end_date
        ).values(
            'date', 'uptime_percentage', 'average_response_time', 
            'error_rate', 'overall_health_score'
        ).order_by('date'))
        
        return Response({
            'school_name': school.name,
            'trend_data': trend_data
        })