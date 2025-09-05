from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.utils import timezone
from .models import Integration, SchoolIntegration, DLTRegistration
from .serializers import IntegrationSerializer, SchoolIntegrationSerializer, DLTRegistrationSerializer

class IntegrationViewSet(viewsets.ModelViewSet):
    queryset = Integration.objects.all()
    serializer_class = IntegrationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'status', 'provider']
    ordering = ['name']
    
    @action(detail=False, methods=['get'])
    def types(self, request):
        """Get all integration types with counts"""
        types_data = Integration.objects.values('type').annotate(
            count=Count('id')
        ).order_by('type')
        
        return Response(list(types_data))
    
    @action(detail=True, methods=['get'])
    def schools(self, request, pk=None):
        """Get schools using this integration"""
        integration = self.get_object()
        school_integrations = SchoolIntegration.objects.filter(
            integration=integration
        ).select_related('school')
        
        serializer = SchoolIntegrationSerializer(school_integrations, many=True)
        return Response(serializer.data)

class SchoolIntegrationViewSet(viewsets.ModelViewSet):
    queryset = SchoolIntegration.objects.select_related('school', 'integration')
    serializer_class = SchoolIntegrationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'integration', 'status']
    ordering = ['-updated_at']
    
    @action(detail=True, methods=['post'])
    def enable(self, request, pk=None):
        """Enable integration for school"""
        school_integration = self.get_object()
        school_integration.status = 'enabled'
        school_integration.save()
        return Response({'status': 'Integration enabled'})
    
    @action(detail=True, methods=['post'])
    def disable(self, request, pk=None):
        """Disable integration for school"""
        school_integration = self.get_object()
        school_integration.status = 'disabled'
        school_integration.save()
        return Response({'status': 'Integration disabled'})
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get integration usage statistics"""
        total_integrations = SchoolIntegration.objects.count()
        enabled_integrations = SchoolIntegration.objects.filter(status='enabled').count()
        error_integrations = SchoolIntegration.objects.filter(status='error').count()
        
        # Most popular integrations
        popular_integrations = SchoolIntegration.objects.values(
            'integration__name', 'integration__type'
        ).annotate(
            school_count=Count('school', distinct=True),
            enabled_count=Count('id', filter=Q(status='enabled'))
        ).order_by('-enabled_count')[:10]
        
        return Response({
            'total_integrations': total_integrations,
            'enabled_integrations': enabled_integrations,
            'error_integrations': error_integrations,
            'popular_integrations': list(popular_integrations)
        })

class DLTRegistrationViewSet(viewsets.ModelViewSet):
    queryset = DLTRegistration.objects.select_related('school')
    serializer_class = DLTRegistrationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['school', 'status', 'telecom_operator']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve DLT registration"""
        dlt_registration = self.get_object()
        dlt_registration.status = 'approved'
        dlt_registration.approved_at = timezone.now()
        dlt_registration.approved_by = request.user.get_full_name() or request.user.username
        dlt_registration.save()
        return Response({'status': 'DLT registration approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject DLT registration"""
        dlt_registration = self.get_object()
        dlt_registration.status = 'rejected'
        dlt_registration.rejection_reason = request.data.get('reason', '')
        dlt_registration.save()
        return Response({'status': 'DLT registration rejected'})
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get DLT registration statistics"""
        total_registrations = DLTRegistration.objects.count()
        pending_registrations = DLTRegistration.objects.filter(status='pending').count()
        approved_registrations = DLTRegistration.objects.filter(status='approved').count()
        rejected_registrations = DLTRegistration.objects.filter(status='rejected').count()
        
        # Operator wise stats
        operator_stats = DLTRegistration.objects.values('telecom_operator').annotate(
            count=Count('id'),
            approved=Count('id', filter=Q(status='approved'))
        ).order_by('-count')
        
        return Response({
            'total_registrations': total_registrations,
            'pending_registrations': pending_registrations,
            'approved_registrations': approved_registrations,
            'rejected_registrations': rejected_registrations,
            'operator_statistics': list(operator_stats)
        })