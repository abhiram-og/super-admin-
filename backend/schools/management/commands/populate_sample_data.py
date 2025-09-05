from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random
from decimal import Decimal

from schools.models import SchoolTier, School, SchoolStaff, SchoolUsageStats
from integrations.models import Integration, SchoolIntegration, DLTRegistration
from dashboard.models import SystemHealth, PlatformMetrics, RecentActivity, AIQuizPerformance
from compliance.models import AuditLog, Complaint, ComplianceReport
from analytics.models import UserEngagement, RevenueAnalytics, FeatureUsage, TenantHealth
from users.models import UserProfile
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Populate the database with sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to populate sample data...'))
        
        # Create School Tiers
        self.create_school_tiers()
        
        # Create Integrations
        self.create_integrations()
        
        # Create Schools
        self.create_schools()
        
        # Create System Health Data
        self.create_system_health()
        
        # Create Platform Metrics
        self.create_platform_metrics()
        
        # Create Recent Activities
        self.create_recent_activities()
        
        # Create Sample Complaints
        self.create_complaints()
        
        # Create User Profiles for existing admin
        self.create_user_profiles()
        
        self.stdout.write(self.style.SUCCESS('Successfully populated sample data!'))

    def create_school_tiers(self):
        tiers = [
            {
                'name': 'basic',
                'description': 'Basic plan for small schools',
                'max_students': 100,
                'max_teachers': 10,
                'max_admins': 2,
                'price_per_month': Decimal('49.99'),
                'features': ['student_management', 'basic_reporting']
            },
            {
                'name': 'standard',
                'description': 'Standard plan for medium schools',
                'max_students': 500,
                'max_teachers': 50,
                'max_admins': 5,
                'price_per_month': Decimal('149.99'),
                'features': ['student_management', 'teacher_portal', 'advanced_reporting', 'parent_portal']
            },
            {
                'name': 'premium',
                'description': 'Premium plan for large schools',
                'max_students': 2000,
                'max_teachers': 200,
                'max_admins': 15,
                'price_per_month': Decimal('399.99'),
                'features': ['all_features', 'ai_analytics', 'custom_integrations', 'priority_support']
            }
        ]
        
        for tier_data in tiers:
            tier, created = SchoolTier.objects.get_or_create(
                name=tier_data['name'],
                defaults=tier_data
            )
            if created:
                self.stdout.write(f'Created tier: {tier.name}')

    def create_integrations(self):
        integrations = [
            {
                'name': 'Twilio SMS',
                'type': 'sms',
                'description': 'SMS notifications via Twilio',
                'provider': 'Twilio',
                'version': '1.0',
                'config_schema': {'api_key': 'string', 'sender_id': 'string'},
                'default_config': {'sender_id': 'SCHOOL'}
            },
            {
                'name': 'SendGrid Email',
                'type': 'email',
                'description': 'Email notifications via SendGrid',
                'provider': 'SendGrid',
                'version': '1.0',
                'config_schema': {'api_key': 'string', 'from_email': 'string'},
                'default_config': {'from_email': 'noreply@school.com'}
            },
            {
                'name': 'Stripe Payments',
                'type': 'payment',
                'description': 'Payment processing via Stripe',
                'provider': 'Stripe',
                'version': '1.0',
                'config_schema': {'publishable_key': 'string', 'secret_key': 'string'},
                'default_config': {}
            },
            {
                'name': 'OpenAI GPT',
                'type': 'ai',
                'description': 'AI-powered quiz generation',
                'provider': 'OpenAI',
                'version': '1.0',
                'config_schema': {'api_key': 'string', 'model': 'string'},
                'default_config': {'model': 'gpt-4'}
            }
        ]
        
        for integration_data in integrations:
            integration, created = Integration.objects.get_or_create(
                name=integration_data['name'],
                defaults=integration_data
            )
            if created:
                self.stdout.write(f'Created integration: {integration.name}')

    def create_schools(self):
        tiers = list(SchoolTier.objects.all())
        schools_data = [
            {
                'name': 'Springfield Elementary School',
                'code': 'SPR001',
                'email': 'admin@springfield-elem.edu',
                'phone': '+1-555-0101',
                'address': '123 Education Lane',
                'city': 'Springfield',
                'state': 'Illinois',
                'country': 'USA',
                'postal_code': '62701',
                'status': 'active',
                'total_students': 450,
                'total_teachers': 25,
                'total_admins': 3,
                'enabled_modules': ['student_management', 'teacher_portal', 'parent_portal']
            },
            {
                'name': 'Roosevelt High School',
                'code': 'ROO001',
                'email': 'principal@roosevelt-high.edu',
                'phone': '+1-555-0102',
                'address': '456 Learning Ave',
                'city': 'Chicago',
                'state': 'Illinois',
                'country': 'USA',
                'postal_code': '60601',
                'status': 'active',
                'total_students': 1200,
                'total_teachers': 80,
                'total_admins': 8,
                'enabled_modules': ['student_management', 'teacher_portal', 'parent_portal', 'ai_analytics']
            },
            {
                'name': 'Sunshine Academy',
                'code': 'SUN001',
                'email': 'info@sunshine-academy.edu',
                'phone': '+1-555-0103',
                'address': '789 Bright Street',
                'city': 'Miami',
                'state': 'Florida',
                'country': 'USA',
                'postal_code': '33101',
                'status': 'trial',
                'total_students': 85,
                'total_teachers': 8,
                'total_admins': 2,
                'enabled_modules': ['student_management', 'basic_reporting']
            }
        ]
        
        for i, school_data in enumerate(schools_data):
            tier = tiers[i % len(tiers)]
            now = timezone.now()
            
            school_data.update({
                'tier': tier,
                'subscription_start': now - timedelta(days=30),
                'subscription_end': now + timedelta(days=335),
                'license_expiry': now + timedelta(days=365),
            })
            
            school, created = School.objects.get_or_create(
                code=school_data['code'],
                defaults=school_data
            )
            
            if created:
                self.stdout.write(f'Created school: {school.name}')
                
                # Create staff for each school
                self.create_school_staff(school)
                
                # Create usage stats
                self.create_usage_stats(school)
                
                # Create school integrations
                self.create_school_integrations(school)

    def create_school_staff(self, school):
        staff_data = [
            {'name': f'{school.name} Principal', 'email': f'principal@{school.code.lower()}.edu', 'role': 'principal', 'phone': '+1-555-1001'},
            {'name': f'{school.name} Admin', 'email': f'admin@{school.code.lower()}.edu', 'role': 'admin', 'phone': '+1-555-1002'},
            {'name': f'{school.name} Teacher 1', 'email': f'teacher1@{school.code.lower()}.edu', 'role': 'teacher', 'phone': '+1-555-1003'},
        ]
        
        for staff_info in staff_data:
            SchoolStaff.objects.get_or_create(
                school=school,
                email=staff_info['email'],
                defaults=staff_info
            )

    def create_usage_stats(self, school):
        # Create usage stats for last 30 days
        for i in range(30):
            date = timezone.now().date() - timedelta(days=i)
            SchoolUsageStats.objects.get_or_create(
                school=school,
                date=date,
                defaults={
                    'active_students': random.randint(int(school.total_students * 0.6), school.total_students),
                    'active_teachers': random.randint(int(school.total_teachers * 0.7), school.total_teachers),
                    'login_count': random.randint(50, 200),
                    'quiz_attempts': random.randint(20, 100),
                    'assignments_submitted': random.randint(30, 150),
                    'classes_conducted': random.randint(10, 50),
                    'features_used': {
                        'student_management': random.randint(10, 50),
                        'teacher_portal': random.randint(5, 30),
                        'parent_portal': random.randint(15, 40)
                    }
                }
            )

    def create_school_integrations(self, school):
        integrations = list(Integration.objects.all())
        
        for integration in integrations[:2]:  # Enable first 2 integrations for each school
            SchoolIntegration.objects.get_or_create(
                school=school,
                integration=integration,
                defaults={
                    'status': 'enabled',
                    'config': {'api_key': 'sample_key_' + school.code},
                    'usage_count': random.randint(50, 500),
                    'enabled_at': timezone.now() - timedelta(days=random.randint(1, 30))
                }
            )

    def create_system_health(self):
        components = [
            {'component': 'database', 'status': 'healthy', 'response_time': 45.2, 'uptime_percentage': 99.9},
            {'component': 'api', 'status': 'healthy', 'response_time': 120.5, 'uptime_percentage': 99.8},
            {'component': 'cache', 'status': 'healthy', 'response_time': 15.1, 'uptime_percentage': 99.95},
            {'component': 'storage', 'status': 'warning', 'response_time': 250.3, 'uptime_percentage': 98.5},
            {'component': 'email', 'status': 'healthy', 'response_time': 890.2, 'uptime_percentage': 99.2},
        ]
        
        for comp_data in components:
            SystemHealth.objects.update_or_create(
                component=comp_data['component'],
                defaults=comp_data
            )

    def create_platform_metrics(self):
        # Create metrics for last 30 days
        for i in range(30):
            date = timezone.now().date() - timedelta(days=i)
            PlatformMetrics.objects.get_or_create(
                date=date,
                defaults={
                    'total_schools': 3 + random.randint(-1, 2),
                    'active_schools': 2 + random.randint(0, 1),
                    'trial_schools': 1,
                    'suspended_schools': 0,
                    'total_students': 1735 + random.randint(-100, 100),
                    'total_teachers': 113 + random.randint(-10, 10),
                    'total_logins': random.randint(200, 800),
                    'total_quiz_attempts': random.randint(100, 400),
                    'total_revenue': Decimal(str(random.uniform(5000, 15000))),
                    'monthly_recurring_revenue': Decimal(str(random.uniform(8000, 12000))),
                    'api_requests': random.randint(5000, 20000),
                    'error_rate': random.uniform(0.1, 2.0),
                    'average_response_time': random.uniform(100, 300)
                }
            )

    def create_recent_activities(self):
        schools = list(School.objects.all())
        activities = [
            {'activity_type': 'school_created', 'title': 'New school registered', 'description': 'Sunshine Academy has been added to the platform'},
            {'activity_type': 'integration_enabled', 'title': 'SMS integration enabled', 'description': 'Springfield Elementary enabled Twilio SMS integration'},
            {'activity_type': 'tier_upgraded', 'title': 'Plan upgraded', 'description': 'Roosevelt High School upgraded to Premium tier'},
            {'activity_type': 'license_renewed', 'title': 'License renewed', 'description': 'Springfield Elementary renewed their annual license'},
            {'activity_type': 'payment_received', 'title': 'Payment processed', 'description': 'Monthly subscription payment received from Roosevelt High School'},
        ]
        
        for i, activity in enumerate(activities):
            RecentActivity.objects.get_or_create(
                title=activity['title'],
                defaults={
                    **activity,
                    'school': schools[i % len(schools)] if schools else None,
                    'metadata': {'source': 'system', 'priority': 'normal'}
                }
            )

    def create_complaints(self):
        schools = list(School.objects.all())
        complaints_data = [
            {
                'title': 'Login issues with teacher portal',
                'description': 'Teachers are unable to log in to the portal since yesterday',
                'category': 'technical',
                'priority': 'high',
                'status': 'open',
                'reporter_name': 'John Smith',
                'reporter_email': 'j.smith@school.edu'
            },
            {
                'title': 'Billing discrepancy in monthly invoice',
                'description': 'The invoice amount does not match our agreed pricing',
                'category': 'billing',
                'priority': 'medium',
                'status': 'in_progress',
                'reporter_name': 'Jane Doe',
                'reporter_email': 'j.doe@school.edu'
            }
        ]
        
        for i, complaint_data in enumerate(complaints_data):
            complaint_data['school'] = schools[i % len(schools)] if schools else None
            Complaint.objects.get_or_create(
                title=complaint_data['title'],
                defaults=complaint_data
            )

    def create_user_profiles(self):
        admin_user = User.objects.filter(username='admin').first()
        if admin_user and not hasattr(admin_user, 'profile'):
            UserProfile.objects.create(
                user=admin_user,
                role='super_admin',
                phone='+1-555-9999',
                can_manage_schools=True,
                can_manage_integrations=True,
                can_view_analytics=True,
                can_manage_compliance=True,
                can_handle_complaints=True,
                timezone='UTC',
                language='en'
            )
            self.stdout.write('Created user profile for admin')