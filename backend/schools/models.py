from django.db import models
from django.contrib.auth.models import User
import uuid

class SchoolTier(models.Model):
    TIER_CHOICES = [
        ('basic', 'Basic'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
        ('enterprise', 'Enterprise'),
    ]
    
    name = models.CharField(max_length=50, choices=TIER_CHOICES, unique=True)
    description = models.TextField()
    max_students = models.IntegerField()
    max_teachers = models.IntegerField()
    max_admins = models.IntegerField()
    price_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    features = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.get_name_display()

class School(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
        ('trial', 'Trial'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    
    # Subscription details
    tier = models.ForeignKey(SchoolTier, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='trial')
    subscription_start = models.DateTimeField()
    subscription_end = models.DateTimeField()
    license_expiry = models.DateTimeField()
    
    # Usage tracking
    total_students = models.IntegerField(default=0)
    total_teachers = models.IntegerField(default=0)
    total_admins = models.IntegerField(default=0)
    total_classes = models.IntegerField(default=0)
    
    # Configuration
    enabled_modules = models.JSONField(default=list)
    custom_settings = models.JSONField(default=dict)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    @property
    def is_license_expired(self):
        from django.utils import timezone
        return timezone.now() > self.license_expiry

class SchoolStaff(models.Model):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('principal', 'Principal'),
        ('vice_principal', 'Vice Principal'),
        ('teacher', 'Teacher'),
        ('staff', 'Staff'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='staff')
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['school', 'email']
    
    def __str__(self):
        return f"{self.name} - {self.school.name}"

class SchoolUsageStats(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='usage_stats')
    date = models.DateField()
    
    # Daily usage metrics
    active_students = models.IntegerField(default=0)
    active_teachers = models.IntegerField(default=0)
    login_count = models.IntegerField(default=0)
    quiz_attempts = models.IntegerField(default=0)
    assignments_submitted = models.IntegerField(default=0)
    classes_conducted = models.IntegerField(default=0)
    
    # Feature usage
    features_used = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['school', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.school.name} - {self.date}"