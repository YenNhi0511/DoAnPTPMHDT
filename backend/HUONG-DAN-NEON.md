# 🚀 Hướng dẫn sử dụng Neon Database

## 📋 Tổng quan

Neon là một PostgreSQL cloud service miễn phí. Nếu bạn đã có `DATABASE_URL` trong file `.env`, bạn có thể truy cập Neon dashboard để quản lý database.

## 🔗 Cách truy cập Neon Dashboard

### Bước 1: Lấy thông tin từ DATABASE_URL

File `.env` của bạn có dạng:
```env
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Thông tin quan trọng:**
- `ep-xxx-xxx.region.aws.neon.tech` - Đây là endpoint của Neon
- `username` - Username của bạn
- `dbname` - Tên database

### Bước 2: Truy cập Neon Dashboard

1. **Mở trình duyệt** và truy cập: https://console.neon.tech

2. **Đăng nhập** bằng tài khoản bạn đã dùng để tạo Neon database:
   - Email/Password
   - Hoặc GitHub/Google (nếu đã đăng nhập bằng OAuth)

3. **Chọn Project** của bạn từ danh sách

4. **Xem Dashboard** - Bạn sẽ thấy:
   - Tên project
   - Endpoint (host)
   - Database name
   - Connection string
   - Usage statistics

## 📊 Xem tình trạng Database trên Neon

### 1. Dashboard chính

Khi vào Neon dashboard, bạn sẽ thấy:

- **Project Overview**:
  - Database name
  - Endpoint URL
  - Region
  - Created date
  - Status (Active/Inactive)

- **Usage Statistics**:
  - Storage used
  - Compute hours
  - Active connections
  - Queries per second

- **Connection Details**:
  - Connection string
  - Connection pooling
  - SSL settings

### 2. SQL Editor

1. Click vào **"SQL Editor"** ở sidebar bên trái
2. Bạn có thể:
   - Chạy SQL queries trực tiếp
   - Xem dữ liệu trong các bảng
   - Kiểm tra schema

**Ví dụ queries hữu ích:**

```sql
-- Xem tất cả các bảng
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Đếm số records trong mỗi bảng
SELECT 
    schemaname,
    tablename,
    n_tup_ins - n_tup_del as row_count
FROM pg_stat_user_tables
ORDER BY tablename;

-- Xem users
SELECT id, email, role, created_at FROM users LIMIT 10;

-- Xem jobs
SELECT id, title, status, created_at FROM jobs LIMIT 10;

-- Xem applications
SELECT id, status, applied_at FROM applications LIMIT 10;
```

### 3. Branches (Nếu có)

Neon hỗ trợ database branching (giống Git):
- **Main branch**: Database chính
- **Branches**: Các bản sao để test/development

### 4. Settings

Trong **Settings**, bạn có thể:
- Đổi tên project
- Xem/regenerate connection string
- Cấu hình connection pooling
- Xem billing information

## 🔍 Kiểm tra Database Status từ Code

### Script kiểm tra Neon connection

Tạo file `check_neon_status.py`:

```python
import os
import sys
import django
from pathlib import Path

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
        if ':' in parts[0]:
            user_pass = parts[0].split('://')[1].split(':')
            if len(user_pass) >= 2:
                masked_url = f"{db_url.split('://')[0]}://{user_pass[0]}:****@{parts[1]}"
                print(f"✅ DATABASE_URL: {masked_url}")
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
else:
    print("❌ Không tìm thấy DATABASE_URL trong .env")

print()

# Test connection
db_config = settings.DATABASES['default']
print("📊 Database Configuration:")
print(f"   Engine: {db_config.get('ENGINE', 'N/A')}")
print(f"   Name: {db_config.get('NAME', 'N/A')}")
print(f"   Host: {db_config.get('HOST', 'N/A')}")
print(f"   Port: {db_config.get('PORT', 'N/A')}")

print()
print("🔌 Testing connection...")
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"   ✅ Kết nối thành công!")
        print(f"   📊 PostgreSQL version: {version[0][:60]}...")
        
        # Check if it's Neon
        if 'neon' in db_config.get('HOST', '').lower():
            print(f"   🎉 Đang kết nối với Neon PostgreSQL!")
        
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
        except:
            pass
        
except Exception as e:
    print(f"   ❌ Kết nối thất bại: {e}")
    print()
    print("   🔧 Troubleshooting:")
    print("   1. Kiểm tra DATABASE_URL trong .env")
    print("   2. Kiểm tra Neon dashboard xem database có đang active không")
    print("   3. Kiểm tra network connection")
    print("   4. Kiểm tra credentials")

print()
print("=" * 70)
```

## 🛠️ Các tính năng hữu ích trên Neon

### 1. SQL Editor
- Chạy queries trực tiếp
- Xem dữ liệu real-time
- Export kết quả

### 2. Connection Pooling
- Neon tự động cung cấp connection pooling
- Giúp tối ưu performance
- Giảm số lượng connections

### 3. Monitoring
- Xem usage statistics
- Monitor queries
- Check performance

### 4. Backups
- Neon tự động backup
- Có thể restore từ backup
- Point-in-time recovery

### 5. Branches
- Tạo branch để test
- Merge changes
- Giống Git workflow

## 📝 Các lệnh hữu ích

### Kiểm tra connection từ terminal:

```bash
# Sử dụng psql (nếu đã cài PostgreSQL client)
psql "postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Hoặc từ Django
cd backend
python manage.py dbshell
```

### Xem tables:

```sql
\dt
```

### Xem data:

```sql
SELECT * FROM users LIMIT 10;
SELECT * FROM jobs LIMIT 10;
```

## ⚠️ Lưu ý quan trọng

1. **Free Tier Limits**:
   - Storage: 0.5 GB
   - Compute: Limited hours
   - Connections: Limited

2. **Security**:
   - Luôn dùng SSL (sslmode=require)
   - Không commit DATABASE_URL vào Git
   - Rotate password định kỳ

3. **Performance**:
   - Neon có thể "sleep" nếu không dùng (free tier)
   - Lần đầu connect có thể chậm (cold start)
   - Dùng connection pooling để tối ưu

## 🔗 Links hữu ích

- **Neon Dashboard**: https://console.neon.tech
- **Neon Docs**: https://neon.tech/docs
- **Neon Status**: https://status.neon.tech

## 🆘 Troubleshooting

### Database không kết nối được:

1. **Kiểm tra Neon Dashboard**:
   - Vào https://console.neon.tech
   - Xem project status
   - Kiểm tra endpoint có đúng không

2. **Kiểm tra DATABASE_URL**:
   ```bash
   # Xem (ẩn password)
   python check_neon_status.py
   ```

3. **Test connection trực tiếp**:
   ```bash
   psql "YOUR_DATABASE_URL"
   ```

4. **Kiểm tra network**:
   - Firewall có block không
   - VPN có ảnh hưởng không

### Database bị sleep (free tier):

- Neon có thể sleep database nếu không dùng
- Lần đầu connect sẽ wake up database (có thể mất vài giây)
- Đây là tính năng bình thường của free tier

