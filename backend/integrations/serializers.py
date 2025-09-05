from rest_framework import serializers
from .models import Integration, SchoolIntegration, DLTRegistration

class IntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Integration
        fields = '__all__'

class SchoolIntegrationSerializer(serializers.ModelSerializer):
    integration_name = serializers.CharField(source='integration.name', read_only=True)
    integration_type = serializers.CharField(source='integration.type', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = SchoolIntegration
        fields = '__all__'

class DLTRegistrationSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = DLTRegistration
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')