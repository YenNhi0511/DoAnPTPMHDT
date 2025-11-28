"""
Script test kết nối database
Chạy: python test_db_connection.py
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from django.db import connection
from django.conf import settings

print("=" * 50)
print("TEST DATABASE CONNECTION")
print("=" * 50)

# Hiển thị thông tin database config
print("\n📊 Database Configuration:")
db_config = settings.DATABASES['default']
print(f"  Engine: {db_config.get('ENGINE', 'N/A')}")
print(f"  Name: {db_config.get('NAME', 'N/A')}")
print(f"  User: {db_config.get('USER', 'N/A')}")
print(f"  Host: {db_config.get('HOST', 'N/A')}")
print(f"  Port: {db_config.get('PORT', 'N/A')}")

# Test kết nối
print("\n🔌 Testing connection...")
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"  ✅ Connected successfully!")
        print(f"  PostgreSQL version: {version[0][:50]}...")
        
        # Test query
        cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
        table_count = cursor.fetchone()[0]
        print(f"  📋 Tables in database: {table_count}")
        
except Exception as e:
    print(f"  ❌ Connection failed!")
    print(f"  Error: {str(e)}")
    print("\n💡 Troubleshooting:")
    print("  1. Kiểm tra DATABASE_URL trong file .env")
    print("  2. Kiểm tra database có đang hoạt động (vào Neon/Supabase dashboard)")
    print("  3. Kiểm tra network connection")
    sys.exit(1)

print("\n" + "=" * 50)
print("✅ Database connection test passed!")
print("=" * 50)

