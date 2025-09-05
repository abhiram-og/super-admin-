from django.db import models
from schools.models import School
import uuid

class Integration(models.Model):
    INTEGRATION_TYPES = [
        ('sms', 'SMS Gateway'),
        ('email', 'Email Service'),
        ('payment', 'Payment Gateway'),
        ('lms', 'Learning Management System'),
        ('ai', 'AI Services'),
        ('analytics', 'Analytics Platform'),
        ('storage', 'Cloud Storage'),
        ('video', 'Video Conferencing'),
        ('notification', 'Push Notifications'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Under Maintenance'),
        ('deprecated', 'Deprecated'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=INTEGRATION_TYPES)
    description = models.TextField()
    provider = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Configuration
    config_schema = models.JSONField(default=dict)  # Schema for configuration
    default_config = models.JSONField(default=dict)  # Default configuration
    
    # Metadata
    documentation_url = models.URLField(blank=True, null=True)
    support_contact = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.provider})"

class SchoolIntegration(models.Model):
    STATUS_CHOICES = [
        ('enabled', 'Enabled'),
        ('disabled', 'Disabled'),
        ('error', 'Error'),
        ('configuring', 'Configuring'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='integrations')
    integration = models.ForeignKey(Integration, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='disabled')
    
    # Configuration specific to school
    config = models.JSONField(default=dict)
    
    # Usage tracking
    last_used = models.DateTimeField(null=True, blank=True)
    usage_count = models.IntegerField(default=0)
    error_count = models.IntegerField(default=0)
    last_error = models.TextField(blank=True, null=True)
    last_error_time = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    enabled_at = models.DateTimeField(null=True, blank=True)
    disabled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['school', 'integration']
    
    def __str__(self):
        return f"{self.school.name} - {self.integration.name}"

class DLTRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='dlt_registrations')
    
    # DLT Details
    entity_id = models.CharField(max_length=100, unique=True)
    template_id = models.CharField(max_length=100)
    header = models.CharField(max_length=6)  # 6-digit header
    category = models.CharField(max_length=50)
    content_type = models.CharField(max_length=50)
    
    # Registration details
    template_content = models.TextField()
    variables = models.JSONField(default=list)
    telecom_operator = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Approval details
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.CharField(max_length=100, blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    
    # Usage tracking
    messages_sent = models.IntegerField(default=0)
    last_used = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.school.name} - {self.entity_id}"