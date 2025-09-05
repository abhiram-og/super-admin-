#!/bin/bash

echo "🚀 Starting Django Super Admin Backend..."
echo "=================================="

# Navigate to backend directory
cd /app/backend

# Activate virtual environment if it exists
if [ -d "/root/.venv" ]; then
    source /root/.venv/bin/activate
    echo "✅ Virtual environment activated"
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Apply migrations
echo "📋 Applying database migrations..."
python manage.py migrate

# Create superuser if it doesn't exist
echo "👤 Checking admin user..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@superadmin.com', 'admin123')
    print('✅ Admin user created: admin/admin123')
else:
    print('✅ Admin user already exists')
"

# Populate sample data
echo "📊 Populating sample data..."
python manage.py populate_sample_data

# Start the development server
echo ""
echo "🌟 Django Super Admin Backend is ready!"
echo "📍 Server running on: http://127.0.0.1:8000"
echo "🔧 Admin panel: http://127.0.0.1:8000/admin"
echo "📚 API endpoints: http://127.0.0.1:8000/api/"
echo "👤 Admin credentials: admin / admin123"
echo "=================================="
echo ""

# Start server
python manage.py runserver 0.0.0.0:8000