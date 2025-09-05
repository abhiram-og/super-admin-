from rest_framework import serializers
from .models import AuditLog, Complaint, ComplianceReport

class AuditLogSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = '__all__'

class ComplaintSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.get_full_name', read_only=True)
    
    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ('id', 'ticket_number', 'created_at', 'updated_at')

class ComplianceReportSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    generated_by_name = serializers.CharField(source='generated_by.get_full_name', read_only=True)
    
    class Meta:
        model = ComplianceReport
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')