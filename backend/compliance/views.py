from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import AuditLog, Complaint, ComplianceReport
from .serializers import AuditLogSerializer, ComplaintSerializer, ComplianceReportSerializer

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related('school', 'user')
    serializer_class = AuditLogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'action', 'resource_type', 'severity']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get audit log statistics"""
        # Time-based statistics
        now = timezone.now()
        today = now.date()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        today_logs = AuditLog.objects.filter(created_at__date=today).count()
        week_logs = AuditLog.objects.filter(created_at__gte=week_ago).count()
        month_logs = AuditLog.objects.filter(created_at__gte=month_ago).count()
        
        # Action type distribution
        action_stats = AuditLog.objects.values('action').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Severity distribution
        severity_stats = AuditLog.objects.values('severity').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Top active schools
        school_stats = AuditLog.objects.filter(
            school__isnull=False
        ).values('school__name').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        return Response({
            'counts': {
                'today': today_logs,
                'this_week': week_logs,
                'this_month': month_logs
            },
            'action_distribution': list(action_stats),
            'severity_distribution': list(severity_stats),
            'top_schools': list(school_stats)
        })

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.select_related('school', 'assigned_to', 'resolved_by')
    serializer_class = ComplaintSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'status', 'priority', 'category', 'assigned_to']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign complaint to a user"""
        complaint = self.get_object()
        assigned_to_id = request.data.get('assigned_to_id')
        
        if assigned_to_id:
            from django.contrib.auth.models import User
            try:
                user = User.objects.get(id=assigned_to_id)
                complaint.assigned_to = user
                complaint.status = 'in_progress'
                complaint.save()
                return Response({'status': 'Complaint assigned successfully'})
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(
            {'error': 'assigned_to_id is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve a complaint"""
        complaint = self.get_object()
        resolution = request.data.get('resolution', '')
        
        complaint.status = 'resolved'
        complaint.resolution = resolution
        complaint.resolved_at = timezone.now()
        complaint.resolved_by = request.user
        complaint.save()
        
        return Response({'status': 'Complaint resolved successfully'})
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get complaint statistics"""
        total_complaints = Complaint.objects.count()
        open_complaints = Complaint.objects.filter(status='open').count()
        in_progress_complaints = Complaint.objects.filter(status='in_progress').count()
        resolved_complaints = Complaint.objects.filter(status='resolved').count()
        
        # Priority distribution
        priority_stats = Complaint.objects.values('priority').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Category distribution
        category_stats = Complaint.objects.values('category').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Response time analysis
        resolved_with_time = Complaint.objects.filter(
            status='resolved',
            resolved_at__isnull=False
        ).extra(
            select={
                'resolution_time': '(EXTRACT(EPOCH FROM resolved_at - created_at) / 3600)'
            }
        )
        
        avg_resolution_time = 0
        if resolved_with_time.exists():
            total_time = sum([c.resolution_time for c in resolved_with_time])
            avg_resolution_time = total_time / resolved_with_time.count()
        
        return Response({
            'total_complaints': total_complaints,
            'open_complaints': open_complaints,
            'in_progress_complaints': in_progress_complaints,
            'resolved_complaints': resolved_complaints,
            'priority_distribution': list(priority_stats),
            'category_distribution': list(category_stats),
            'average_resolution_time_hours': round(avg_resolution_time, 2)
        })

class ComplianceReportViewSet(viewsets.ModelViewSet):
    queryset = ComplianceReport.objects.select_related('school', 'generated_by')
    serializer_class = ComplianceReportSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'report_type', 'status']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """Generate/regenerate a compliance report"""
        report = self.get_object()
        
        # In a real implementation, this would trigger background task
        # For now, we'll just update the status
        report.status = 'generating'
        report.save()
        
        # Simulate report generation (in real app, use Celery)
        # This would be replaced with actual report generation logic
        
        return Response({'status': 'Report generation started'})
    
    @action(detail=False, methods=['get'])
    def types(self, request):
        """Get available report types"""
        return Response([
            {'value': choice[0], 'label': choice[1]} 
            for choice in ComplianceReport.REPORT_TYPES
        ])