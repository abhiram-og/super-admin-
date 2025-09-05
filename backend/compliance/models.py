from django.db import models
from schools.models import School
from django.contrib.auth.models import User
import uuid

class AuditLog(models.Model):
    ACTION_TYPES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('access', 'Access'),
        ('export', 'Export'),
        ('import', 'Import'),
        ('backup', 'Backup'),
        ('restore', 'Restore'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='audit_logs', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Action details
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    resource_type = models.CharField(max_length=100)  # e.g., 'Student', 'Teacher', 'Grade'
    resource_id = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField()
    
    # Request details
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    endpoint = models.CharField(max_length=200, null=True, blank=True)
    http_method = models.CharField(max_length=10, null=True, blank=True)
    
    # Additional context
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='low')
    metadata = models.JSONField(default=dict)
    
    # Changes tracking
    old_values = models.JSONField(default=dict, null=True, blank=True)
    new_values = models.JSONField(default=dict, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['school', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.action} {self.resource_type} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class Complaint(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
        ('rejected', 'Rejected'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    CATEGORY_CHOICES = [
        ('technical', 'Technical Issue'),
        ('billing', 'Billing Issue'),
        ('feature_request', 'Feature Request'),
        ('bug_report', 'Bug Report'),
        ('performance', 'Performance Issue'),
        ('security', 'Security Concern'),
        ('data_issue', 'Data Issue'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_number = models.CharField(max_length=20, unique=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='complaints')
    
    # Complaint details
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    
    # Contact information
    reporter_name = models.CharField(max_length=200)
    reporter_email = models.EmailField()
    reporter_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Assignment
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_complaints')
    
    # Resolution
    resolution = models.TextField(blank=True, null=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_complaints')
    
    # Attachments and metadata
    attachments = models.JSONField(default=list)  # File paths/URLs
    tags = models.JSONField(default=list)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.ticket_number} - {self.title}"
    
    def save(self, *args, **kwargs):
        if not self.ticket_number:
            # Generate unique ticket number
            import random
            import string
            self.ticket_number = f"TKT-{''.join(random.choices(string.digits, k=8))}"
        super().save(*args, **kwargs)

class ComplianceReport(models.Model):
    REPORT_TYPES = [
        ('data_privacy', 'Data Privacy'),
        ('security_audit', 'Security Audit'),
        ('usage_report', 'Usage Report'),
        ('financial_report', 'Financial Report'),
        ('performance_report', 'Performance Report'),
    ]
    
    STATUS_CHOICES = [
        ('generating', 'Generating'),
        ('ready', 'Ready'),
        ('failed', 'Failed'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='compliance_reports', null=True, blank=True)
    
    # Report details
    report_type = models.CharField(max_length=30, choices=REPORT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Date range
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Status and files
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='generating')
    file_path = models.CharField(max_length=500, blank=True, null=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    
    # Generation details
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    generated_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Parameters
    filters = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_report_type_display()} - {self.title}"