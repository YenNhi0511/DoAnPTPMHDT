"""
Script kiểm tra kết nối database đầy đủ
Chạy: python check_database_connection.py
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

# Setup Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from django.db import connection
from django.conf import settings
from django.core.management import execute_from_command_line

print("=" * 70)
print("🔍 KIỂM TRA KẾT NỐI DATABASE")
print("=" * 70)
print()

# 1. Kiểm tra file .env
print("1️⃣  Kiểm tra file .env:")
env_file = BASE_DIR / '.env'
if env_file.exists():
    print(f"   ✅ Tìm thấy file .env tại: {env_file}")
    
    # Đọc một số biến quan trọng (không hiển thị giá trị nhạy cảm)
    from dotenv import load_dotenv
    load_dotenv(env_file)
    
    has_database_url = bool(os.environ.get('DATABASE_URL'))
    has_db_name = bool(os.environ.get('DB_NAME'))
    
    if has_database_url:
        db_url = os.environ.get('DATABASE_URL', '')
        # Ẩn password trong URL
        if '@' in db_url:
            parts = db_url.split('@')
            if ':' in parts[0]:
                user_pass = parts[0].split(':')
                if len(user_pass) >= 2:
                    masked_url = f"{user_pass[0]}:****@{parts[1]}"
                    print(f"   ✅ DATABASE_URL: {masked_url}")
                else:
                    print(f"   ✅ DATABASE_URL: Đã cấu hình")
            else:
                print(f"   ✅ DATABASE_URL: Đã cấu hình")
        else:
            print(f"   ✅ DATABASE_URL: Đã cấu hình")
    elif has_db_name:
        print(f"   ✅ DB_NAME: {os.environ.get('DB_NAME')}")
        print(f"   ✅ DB_USER: {os.environ.get('DB_USER', 'postgres')}")
        print(f"   ✅ DB_HOST: {os.environ.get('DB_HOST', 'localhost')}")
        print(f"   ✅ DB_PORT: {os.environ.get('DB_PORT', '5432')}")
    else:
        print("   ⚠️  Không tìm thấy cấu hình database trong .env")
        print("   💡 Tạo file .env và thêm DATABASE_URL hoặc DB_NAME, DB_USER, etc.")
else:
    print(f"   ❌ Không tìm thấy file .env tại: {env_file}")
    print("   💡 Tạo file .env từ .env.example và cấu hình database")

print()

# 2. Kiểm tra cấu hình database trong settings
print("2️⃣  Cấu hình database trong Django:")
db_config = settings.DATABASES['default']
print(f"   Engine: {db_config.get('ENGINE', 'N/A')}")
print(f"   Name: {db_config.get('NAME', 'N/A')}")
print(f"   User: {db_config.get('USER', 'N/A')}")
print(f"   Host: {db_config.get('HOST', 'N/A')}")
print(f"   Port: {db_config.get('PORT', 'N/A')}")

# Xác định loại database
if 'postgresql' in db_config.get('ENGINE', '').lower():
    db_type = "PostgreSQL"
elif 'sqlite' in db_config.get('ENGINE', '').lower():
    db_type = "SQLite"
else:
    db_type = "Unknown"

print(f"   Type: {db_type}")

print()

# 3. Test kết nối
print("3️⃣  Kiểm tra kết nối database:")
try:
    with connection.cursor() as cursor:
        # Test 1: Kiểm tra version
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"   ✅ Kết nối thành công!")
        print(f"   📊 PostgreSQL version: {version[0][:60]}...")
        
        # Test 2: Đếm số bảng
        cursor.execute("""
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        table_count = cursor.fetchone()[0]
        print(f"   📋 Số bảng trong database: {table_count}")
        
        # Test 3: Liệt kê các bảng
        if table_count > 0:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            print(f"   📝 Danh sách bảng:")
            for table in tables[:10]:  # Hiển thị 10 bảng đầu
                print(f"      - {table[0]}")
            if len(tables) > 10:
                print(f"      ... và {len(tables) - 10} bảng khác")
        
        # Test 4: Kiểm tra migrations
        print()
        print("4️⃣  Kiểm tra migrations:")
        try:
            from django.db.migrations.recorder import MigrationRecorder
            recorder = MigrationRecorder(connection)
            applied_migrations = recorder.applied_migrations()
            print(f"   ✅ Đã apply {len(applied_migrations)} migrations")
        except Exception as e:
            print(f"   ⚠️  Không thể kiểm tra migrations: {e}")
        
        # Test 5: Kiểm tra models
        print()
        print("5️⃣  Kiểm tra models:")
        try:
            from accounts.models import User
            from jobs.models import Job
            from applications.models import Application
            
            user_count = User.objects.count()
            job_count = Job.objects.count()
            app_count = Application.objects.count()
            
            print(f"   👥 Số users: {user_count}")
            print(f"   💼 Số jobs: {job_count}")
            print(f"   📄 Số applications: {app_count}")
            
            if user_count == 0 and job_count == 0:
                print()
                print("   ⚠️  Database trống - chưa có dữ liệu")
                print("   💡 Chạy migrations: python manage.py migrate")
                print("   💡 Tạo dữ liệu mẫu: python manage.py seed_companies_full.py")
        except Exception as e:
            print(f"   ⚠️  Lỗi khi truy vấn models: {e}")
            print("   💡 Có thể cần chạy migrations: python manage.py migrate")
        
except Exception as e:
    print(f"   ❌ Kết nối thất bại!")
    print(f"   Error: {str(e)}")
    print()
    print("   🔧 Troubleshooting:")
    print("   1. Kiểm tra DATABASE_URL hoặc DB_NAME, DB_USER, DB_PASSWORD trong .env")
    print("   2. Kiểm tra database server có đang chạy không")
    print("   3. Kiểm tra network connection (nếu dùng online database)")
    print("   4. Kiểm tra credentials (username, password)")
    print("   5. Kiểm tra database có tồn tại không")
    print()
    print("   📚 Xem thêm: backend/FIX-DATABASE.md")
    sys.exit(1)

print()
print("=" * 70)
print("✅ KIỂM TRA HOÀN TẤT - Database đã được kết nối!")
print("=" * 70)

