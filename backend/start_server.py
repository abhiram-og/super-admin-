#!/usr/bin/env python
"""
Django development server startup script
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    """Run the Django development server"""
    
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'super_admin_backend.settings')
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print("🚀 Starting Django Super Admin Backend Server...")
    print("=" * 50)
    
    # Check if migrations need to be applied
    try:
        result = subprocess.run([
            sys.executable, 'manage.py', 'showmigrations', '--plan'
        ], capture_output=True, text=True, check=False)
        
        if '[X]' not in result.stdout and result.returncode == 0:
            print("📋 Applying database migrations...")
            subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
            print("✅ Migrations applied successfully")
        
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Migration check failed: {e}")
    
    # Populate sample data if database is empty
    try:
        result = subprocess.run([
            sys.executable, 'manage.py', 'shell', '-c', 
            'from schools.models import School; print(School.objects.count())'
        ], capture_output=True, text=True, check=False)
        
        if result.returncode == 0 and '0' in result.stdout.strip():
            print("📊 Populating sample data...")
            subprocess.run([
                sys.executable, 'manage.py', 'populate_sample_data'
            ], check=True)
            print("✅ Sample data populated successfully")
            
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Sample data population failed: {e}")
    
    print("\n🌟 Django Super Admin Backend is ready!")
    print("📍 Server will run on: http://127.0.0.1:8000")
    print("🔧 Admin panel: http://127.0.0.1:8000/admin")
    print("📚 API endpoints: http://127.0.0.1:8000/api/")
    print("👤 Admin credentials: admin / admin123")
    print("=" * 50)
    
    # Start the development server
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())