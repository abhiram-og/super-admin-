from django.db import models
from schools.models import School
import uuid

class UserEngagement(models.Model):
    date = models.DateField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True)
    
    # Geographic data
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    
    # Engagement metrics
    total_users = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    new_users = models.IntegerField(default=0)
    returning_users = models.IntegerField(default=0)
    
    # Session metrics
    total_sessions = models.IntegerField(default=0)
    average_session_duration = models.FloatField(default=0)  # in minutes
    bounce_rate = models.FloatField(default=0)  # percentage
    
    # Activity metrics
    page_views = models.IntegerField(default=0)
    unique_page_views = models.IntegerField(default=0)
    actions_performed = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['date', 'school', 'country', 'state', 'city']
        ordering = ['-date']
    
    def __str__(self):
        location = f"{self.city or 'Unknown'}, {self.country or 'Unknown'}"
        school_name = self.school.name if self.school else "Global"
        return f"{school_name} - {location} - {self.date}"

class RevenueAnalytics(models.Model):
    date = models.DateField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True)
    
    # Revenue data
    daily_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    monthly_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    yearly_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Subscription metrics
    new_subscriptions = models.IntegerField(default=0)
    canceled_subscriptions = models.IntegerField(default=0)
    upgraded_subscriptions = models.IntegerField(default=0)
    downgraded_subscriptions = models.IntegerField(default=0)
    
    # Payment metrics
    successful_payments = models.IntegerField(default=0)
    failed_payments = models.IntegerField(default=0)
    refunds = models.IntegerField(default=0)
    chargebacks = models.IntegerField(default=0)
    
    # Customer metrics
    customer_acquisition_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    customer_lifetime_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    churn_rate = models.FloatField(default=0)  # percentage
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['date', 'school']
        ordering = ['-date']
    
    def __str__(self):
        school_name = self.school.name if self.school else "Global"
        return f"Revenue - {school_name} - {self.date}"

class FeatureUsage(models.Model):
    date = models.DateField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True)
    feature_name = models.CharField(max_length=100)
    
    # Usage metrics
    total_uses = models.IntegerField(default=0)
    unique_users = models.IntegerField(default=0)
    average_time_spent = models.FloatField(default=0)  # in minutes
    success_rate = models.FloatField(default=0)  # percentage
    
    # Performance metrics
    average_load_time = models.FloatField(default=0)  # in seconds
    error_rate = models.FloatField(default=0)  # percentage
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['date', 'school', 'feature_name']
        ordering = ['-date']
    
    def __str__(self):
        school_name = self.school.name if self.school else "Global"
        return f"{self.feature_name} - {school_name} - {self.date}"

class TenantHealth(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='health_metrics')
    date = models.DateField()
    
    # Performance metrics
    uptime_percentage = models.FloatField(default=100.0)
    average_response_time = models.FloatField(default=0)  # in milliseconds
    error_rate = models.FloatField(default=0)  # percentage
    
    # Resource usage
    cpu_usage = models.FloatField(default=0)  # percentage
    memory_usage = models.FloatField(default=0)  # percentage
    storage_usage = models.FloatField(default=0)  # percentage in GB
    bandwidth_usage = models.FloatField(default=0)  # in GB
    
    # Database metrics
    database_size = models.FloatField(default=0)  # in MB
    query_performance = models.FloatField(default=0)  # average query time in ms
    
    # User activity
    concurrent_users = models.IntegerField(default=0)
    peak_concurrent_users = models.IntegerField(default=0)
    
    # Health score (0-100)
    overall_health_score = models.FloatField(default=100.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['school', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.school.name} Health - {self.date}"