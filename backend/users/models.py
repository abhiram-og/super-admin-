from django.db import models
from django.contrib.auth.models import User
from schools.models import School
import uuid

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('platform_admin', 'Platform Admin'),
        ('support_agent', 'Support Agent'),
        ('analyst', 'Analyst'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    # Permissions and access
    can_manage_schools = models.BooleanField(default=False)
    can_manage_integrations = models.BooleanField(default=False)
    can_view_analytics = models.BooleanField(default=False)
    can_manage_compliance = models.BooleanField(default=False)
    can_handle_complaints = models.BooleanField(default=False)
    
    # Access restrictions
    accessible_schools = models.ManyToManyField(School, blank=True, help_text="If empty, can access all schools")
    
    # Settings
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    email_notifications = models.BooleanField(default=True)
    
    # Activity tracking
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    login_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.get_role_display()}"

class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    
    # Location (if available)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    
    # Session details
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.ip_address}"

class ApiKey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    name = models.CharField(max_length=100)
    key_hash = models.CharField(max_length=128, unique=True)  # Hashed API key
    
    # Permissions
    permissions = models.JSONField(default=list)  # List of allowed actions
    rate_limit = models.IntegerField(default=1000)  # Requests per hour
    
    # Usage tracking
    last_used = models.DateTimeField(null=True, blank=True)
    usage_count = models.IntegerField(default=0)
    
    # Status
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"