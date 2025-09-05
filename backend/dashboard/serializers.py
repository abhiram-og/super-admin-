from rest_framework import serializers
from .models import SystemHealth, PlatformMetrics, RecentActivity, AIQuizPerformance

class SystemHealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemHealth
        fields = '__all__'

class PlatformMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformMetrics
        fields = '__all__'

class RecentActivitySerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = RecentActivity
        fields = '__all__'

class AIQuizPerformanceSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = AIQuizPerformance
        fields = '__all__'