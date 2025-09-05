from rest_framework import serializers
from .models import UserEngagement, RevenueAnalytics, FeatureUsage, TenantHealth

class UserEngagementSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = UserEngagement
        fields = '__all__'

class RevenueAnalyticsSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = RevenueAnalytics
        fields = '__all__'

class FeatureUsageSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = FeatureUsage
        fields = '__all__'

class TenantHealthSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = TenantHealth
        fields = '__all__'