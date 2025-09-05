from rest_framework import serializers
from .models import School, SchoolTier, SchoolStaff, SchoolUsageStats

class SchoolTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolTier
        fields = '__all__'

class SchoolStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolStaff
        fields = '__all__'

class SchoolUsageStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolUsageStats
        fields = '__all__'

class SchoolSerializer(serializers.ModelSerializer):
    tier_name = serializers.CharField(source='tier.name', read_only=True)
    staff = SchoolStaffSerializer(many=True, read_only=True)
    usage_stats = SchoolUsageStatsSerializer(many=True, read_only=True)
    is_license_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = School
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class SchoolCreateSerializer(serializers.ModelSerializer):
    staff_data = SchoolStaffSerializer(many=True, write_only=True, required=False)
    
    class Meta:
        model = School
        exclude = ('id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        staff_data = validated_data.pop('staff_data', [])
        school = School.objects.create(**validated_data)
        
        # Create staff members
        for staff_item in staff_data:
            SchoolStaff.objects.create(school=school, **staff_item)
        
        return school

class SchoolSummarySerializer(serializers.ModelSerializer):
    tier_name = serializers.CharField(source='tier.name', read_only=True)
    staff_count = serializers.SerializerMethodField()
    
    class Meta:
        model = School
        fields = [
            'id', 'name', 'code', 'status', 'tier_name', 
            'total_students', 'total_teachers', 'total_admins',
            'staff_count', 'subscription_end', 'license_expiry',
            'created_at'
        ]
    
    def get_staff_count(self, obj):
        return obj.staff.filter(is_active=True).count()