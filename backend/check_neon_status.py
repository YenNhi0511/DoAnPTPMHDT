"""
Script kiểm tra Neon Database status
Chạy: python check_neon_status.py
"""
import os
import sys
import django
from pathlib import Path

# Fix encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from django.db import connection
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

print("=" * 70)
print("🔍 KIỂM TRA NEON DATABASE")
print("=" * 70)
print()

# Hiển thị DATABASE_URL (ẩn password)
db_url = os.environ.get('DATABASE_URL', '')
if db_url:
    if '@' in db_url:
        parts = db_url.split('@')
        if '://' in parts[0]:
            protocol_user = parts[0].split('://')
            if len(protocol_user) == 2 and ':' in protocol_user[1]:
                user_pass = protocol_user[1].split(':')
                if len(user_pass) >= 2:
                    masked_url = f"{protocol_user[0]}://{user_pass[0]}:****@{parts[1]}"
                    print(f"✅ DATABASE_URL: {masked_url}")
                else:
                    print(f"✅ DATABASE_URL: Đã cấu hình")
            else:
                print(f"✅ DATABASE_URL: Đã cấu hình")
        else:
            print(f"✅ DATABASE_URL: Đã cấu hình")
    else:
        print(f"✅ DATABASE_URL: Đã cấu hình")
    
    # Extract endpoint
    if '@' in db_url and '.neon.tech' in db_url:
        endpoint = db_url.split('@')[1].split('/')[0]
        print(f"📍 Neon Endpoint: {endpoint}")
        print(f"🌐 Neon Dashboard: https://console.neon.tech")
        print()
        print("💡 Truy cập Neon Dashboard để xem chi tiết:")
        print("   1. Vào https://console.neon.tech")
        print("   2. Đăng nhập bằng tài khoản bạn đã dùng")
        print("   3. Chọn project có endpoint:", endpoint)
    elif '.neon.tech' not in db_url:
        print("⚠️  Không phải Neon database (không có .neon.tech trong URL)")
else:
    print("❌ Không tìm thấy DATABASE_URL trong .env")
    print("💡 Thêm DATABASE_URL vào file .env")

print()

# Test connection
db_config = settings.DATABASES['default']
print("📊 Database Configuration:")
print(f"   Engine: {db_config.get('ENGINE', 'N/A')}")
print(f"   Name: {db_config.get('NAME', 'N/A')}")
print(f"   Host: {db_config.get('HOST', 'N/A')}")
print(f"   Port: {db_config.get('PORT', 'N/A')}")

# Check if it's Neon
if 'neon' in db_config.get('HOST', '').lower():
    print("   🎉 Đang kết nối với Neon PostgreSQL!")

print()
print("🔌 Testing connection...")
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"   ✅ Kết nối thành công!")
        print(f"   📊 PostgreSQL version: {version[0][:60]}...")
        
        # Count tables
        cursor.execute("""
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        table_count = cursor.fetchone()[0]
        print(f"   📋 Số bảng: {table_count}")
        
        # Count records
        try:
            from accounts.models import User
            from jobs.models import Job
            from applications.models import Application
            
            user_count = User.objects.count()
            job_count = Job.objects.count()
            app_count = Application.objects.count()
            
            print(f"   👥 Users: {user_count}")
            print(f"   💼 Jobs: {job_count}")
            print(f"   📄 Applications: {app_count}")
        except Exception as e:
            print(f"   ⚠️  Không thể đếm records: {e}")
        
except Exception as e:
    print(f"   ❌ Kết nối thất bại: {e}")
    print()
    print("   🔧 Troubleshooting:")
    print("   1. Kiểm tra DATABASE_URL trong .env")
    print("   2. Kiểm tra Neon dashboard xem database có đang active không")
    print("   3. Kiểm tra network connection")
    print("   4. Kiểm tra credentials")
    print("   5. Database có thể đang sleep (free tier) - đợi vài giây rồi thử lại")

print()
print("=" * 70)
print("✅ KIỂM TRA HOÀN TẤT")
print("=" * 70)
print()
print("📚 Xem thêm: backend/HUONG-DAN-NEON.md")

