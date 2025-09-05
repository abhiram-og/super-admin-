from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import SystemHealth, PlatformMetrics, RecentActivity, AIQuizPerformance
from .serializers import (
    SystemHealthSerializer, PlatformMetricsSerializer, 
    RecentActivitySerializer, AIQuizPerformanceSerializer
)
from schools.models import School

class SystemHealthViewSet(viewsets.ModelViewSet):
    queryset = SystemHealth.objects.all()
    serializer_class = SystemHealthSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['component', 'status']
    ordering = ['-last_check']
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get system health overview"""
        components = SystemHealth.objects.all()
        
        healthy_count = components.filter(status='healthy').count()
        warning_count = components.filter(status='warning').count()
        critical_count = components.filter(status='critical').count()
        down_count = components.filter(status='down').count()
        
        average_response_time = components.aggregate(
            avg_response=Avg('response_time')
        )['avg_response'] or 0
        
        average_uptime = components.aggregate(
            avg_uptime=Avg('uptime_percentage')
        )['avg_uptime'] or 0
        
        return Response({
            'total_components': components.count(),
            'healthy': healthy_count,
            'warning': warning_count,
            'critical': critical_count,
            'down': down_count,
            'average_response_time': round(average_response_time, 2),
            'average_uptime': round(average_uptime, 2),
            'components': SystemHealthSerializer(components, many=True).data
        })

class PlatformMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlatformMetrics.objects.all()
    serializer_class = PlatformMetricsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['date']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def dashboard_summary(self, request):
        """Get key metrics for dashboard"""
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        # Get latest metrics
        latest_metrics = PlatformMetrics.objects.first()
        
        # Get trends for last 30 days
        metrics_30d = PlatformMetrics.objects.filter(
            date__gte=thirty_days_ago
        ).order_by('date')
        
        # Calculate trends
        revenue_trend = list(metrics_30d.values_list('total_revenue', flat=True))
        schools_trend = list(metrics_30d.values_list('total_schools', flat=True))
        students_trend = list(metrics_30d.values_list('total_students', flat=True))
        
        # Calculate growth rates
        def calculate_growth(current, previous):
            if previous == 0:
                return 0
            return round(((current - previous) / previous) * 100, 2)
        
        growth_data = {}
        if len(revenue_trend) >= 2:
            growth_data['revenue_growth'] = calculate_growth(
                revenue_trend[-1], revenue_trend[-2]
            )
        if len(schools_trend) >= 2:
            growth_data['schools_growth'] = calculate_growth(
                schools_trend[-1], schools_trend[-2]
            )
        if len(students_trend) >= 2:
            growth_data['students_growth'] = calculate_growth(
                students_trend[-1], students_trend[-2]
            )
        
        return Response({
            'current_metrics': PlatformMetricsSerializer(latest_metrics).data if latest_metrics else None,
            'trends': {
                'revenue': revenue_trend,
                'schools': schools_trend,
                'students': students_trend,
                'dates': list(metrics_30d.values_list('date', flat=True))
            },
            'growth_rates': growth_data
        })
    
    @action(detail=False, methods=['get'])
    def revenue_chart(self, request):
        """Get revenue chart data"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        metrics = PlatformMetrics.objects.filter(
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        
        data = []
        for metric in metrics:
            data.append({
                'date': metric.date,
                'revenue': float(metric.total_revenue),
                'mrr': float(metric.monthly_recurring_revenue),
                'schools': metric.total_schools
            })
        
        return Response(data)

class RecentActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RecentActivity.objects.select_related('school', 'user')
    serializer_class = RecentActivitySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['activity_type', 'school']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get activity summary for different time periods"""
        now = timezone.now()
        today = now.date()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        # Today's activities
        today_activities = RecentActivity.objects.filter(
            created_at__date=today
        ).values('activity_type').annotate(count=Count('id'))
        
        # This week's activities
        week_activities = RecentActivity.objects.filter(
            created_at__gte=week_ago
        ).values('activity_type').annotate(count=Count('id'))
        
        # This month's activities
        month_activities = RecentActivity.objects.filter(
            created_at__gte=month_ago
        ).values('activity_type').annotate(count=Count('id'))
        
        return Response({
            'today': list(today_activities),
            'this_week': list(week_activities),
            'this_month': list(month_activities),
            'recent_activities': RecentActivitySerializer(
                RecentActivity.objects.all()[:10], many=True
            ).data
        })

class AIQuizPerformanceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AIQuizPerformance.objects.select_related('school')
    serializer_class = AIQuizPerformanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'date']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get AI quiz performance analytics"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        queryset = self.get_queryset().filter(
            date__gte=start_date,
            date__lte=end_date
        )
        
        # Overall statistics
        total_stats = queryset.aggregate(
            total_quizzes=Sum('total_quizzes'),
            ai_generated=Sum('ai_generated_quizzes'),
            manual_quizzes=Sum('manual_quizzes'),
            avg_score=Avg('average_score'),
            avg_completion=Avg('completion_rate'),
            avg_ai_accuracy=Avg('ai_accuracy_rate')
        )
        
        # Daily trends
        daily_trends = list(queryset.values('date').annotate(
            total_quizzes=Sum('total_quizzes'),
            ai_generated=Sum('ai_generated_quizzes'),
            avg_score=Avg('average_score'),
            completion_rate=Avg('completion_rate')
        ).order_by('date'))
        
        # School-wise performance
        school_performance = list(queryset.values(
            'school__name'
        ).annotate(
            total_quizzes=Sum('total_quizzes'),
            ai_generated=Sum('ai_generated_quizzes'),
            avg_score=Avg('average_score'),
            completion_rate=Avg('completion_rate')
        ).order_by('-total_quizzes')[:10])
        
        return Response({
            'summary': total_stats,
            'daily_trends': daily_trends,
            'top_schools': school_performance
        })