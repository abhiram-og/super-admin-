from django.db import models
from schools.models import School
from django.contrib.auth.models import User
import uuid

class SystemHealth(models.Model):
    COMPONENT_CHOICES = [
        ('database', 'Database'),
        ('api', 'API Server'),
        ('cache', 'Cache Server'),
        ('storage', 'File Storage'),
        ('email', 'Email Service'),
        ('sms', 'SMS Service'),
        ('payment', 'Payment Gateway'),
    ]
    
    STATUS_CHOICES = [
        ('healthy', 'Healthy'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
        ('down', 'Down'),
    ]
    
    component = models.CharField(max_length=20, choices=COMPONENT_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    response_time = models.FloatField(help_text="Response time in milliseconds")
    uptime_percentage = models.FloatField()
    last_check = models.DateTimeField(auto_now=True)
    error_message = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.get_component_display()}: {self.get_status_display()}"

class PlatformMetrics(models.Model):
    date = models.DateField(unique=True)
    
    # User metrics
    total_schools = models.IntegerField(default=0)
    active_schools = models.IntegerField(default=0)
    trial_schools = models.IntegerField(default=0)
    suspended_schools = models.IntegerField(default=0)
    
    # Usage metrics
    total_students = models.IntegerField(default=0)
    total_teachers = models.IntegerField(default=0)
    total_logins = models.IntegerField(default=0)
    total_quiz_attempts = models.IntegerField(default=0)
    
    # Revenue metrics
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    monthly_recurring_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # System metrics
    api_requests = models.IntegerField(default=0)
    error_rate = models.FloatField(default=0)
    average_response_time = models.FloatField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Platform Metrics - {self.date}"

class RecentActivity(models.Model):
    ACTIVITY_TYPES = [
        ('school_created', 'School Created'),
        ('school_activated', 'School Activated'),
        ('school_suspended', 'School Suspended'),
        ('integration_enabled', 'Integration Enabled'),
        ('tier_upgraded', 'Tier Upgraded'),
        ('license_renewed', 'License Renewed'),
        ('payment_received', 'Payment Received'),
        ('system_alert', 'System Alert'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Additional context data
    metadata = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class AIQuizPerformance(models.Model):
    date = models.DateField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True)
    
    # Quiz metrics
    total_quizzes = models.IntegerField(default=0)
    ai_generated_quizzes = models.IntegerField(default=0)
    manual_quizzes = models.IntegerField(default=0)
    
    # Performance metrics
    average_score = models.FloatField(default=0)
    completion_rate = models.FloatField(default=0)
    average_time_taken = models.FloatField(default=0)  # in minutes
    
    # AI metrics
    ai_accuracy_rate = models.FloatField(default=0)
    ai_generation_time = models.FloatField(default=0)  # in seconds
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['date', 'school']
        ordering = ['-date']
    
    def __str__(self):
        school_name = self.school.name if self.school else "Global"
        return f"AI Quiz Performance - {school_name} - {self.date}"