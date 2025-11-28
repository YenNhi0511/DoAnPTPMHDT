# 🔧 Hướng dẫn Fix Database Connection

## Vấn đề bạn gặp

1. DATABASE_URL có `&channel_binding=require` - có thể gây lỗi
2. Chưa kết nối được với database

## Giải pháp

### Bước 1: Sửa DATABASE_URL trong file .env

**Vấn đề:** DATABASE_URL của bạn có `&channel_binding=require` ở cuối, có thể gây lỗi với `dj-database-url`.

**Sửa thành:**

```env
DATABASE_URL=postgresql://neondb_owner:npg_1DpbXAfiC9nk@ep-withered-river-a1e3hteu-pooler.ap-southeast-1.aws.neon.tech/recruitment_db?sslmode=require
```

**Bỏ phần:** `&channel_binding=require`

### Bước 2: Kiểm tra file .env

Đảm bảo file `backend/.env` có nội dung đúng:

```env
# Django Settings
SECRET_KEY=your-secret-key-here-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database - Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_1DpbXAfiC9nk@ep-withered-river-a1e3hteu-pooler.ap-southeast-1.aws.neon.tech/recruitment_db?sslmode=require

# Email Configuration (Gmail)
EMAIL_HOST_USER=trucnguyen102004@gmail.com
EMAIL_HOST_PASSWORD=paei rbbs avip dojl

# AI API
GEMINI_API_KEY=AIzaSyAGjQXZ2IzPMcIynN3C6PolZpFdxDeZXVo

# Redis (Optional)
REDIS_URL=redis://localhost:6379/0
```

**Lưu ý:**
- Bỏ dấu ngoặc kép quanh `EMAIL_HOST_PASSWORD`
- Bỏ `&channel_binding=require` khỏi DATABASE_URL

### Bước 3: Test kết nối database

```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

python test_db_connection.py
```

**Kết quả mong đợi:**
```
==================================================
TEST DATABASE CONNECTION
==================================================

📊 Database Configuration:
  Engine: django.db.backends.postgresql
  Name: recruitment_db
  User: neondb_owner
  Host: ep-withered-river-a1e3hteu-pooler.ap-southeast-1.aws.neon.tech
  Port: 5432

🔌 Testing connection...
  ✅ Connected successfully!
  PostgreSQL version: PostgreSQL 15.x...
  📋 Tables in database: X

==================================================
✅ Database connection test passed!
==================================================
```

### Bước 4: Chạy migrations

Nếu test kết nối thành công:

```bash
python manage.py migrate
```

### Bước 5: Tạo superuser

```bash
python manage.py createsuperuser
```

## Lỗi thường gặp

### Lỗi: `dj_database_url.UnknownSchemeError`

**Nguyên nhân:** DATABASE_URL format sai

**Giải pháp:**
- Kiểm tra DATABASE_URL không có `channel_binding=require`
- Format đúng: `postgresql://user:pass@host:port/dbname?sslmode=require`

### Lỗi: `connection refused` hoặc `timeout`

**Nguyên nhân:** Database không accessible

**Giải pháp:**
1. Vào Neon dashboard: https://console.neon.tech
2. Kiểm tra project có đang active không
3. Kiểm tra connection string có đúng không
4. Thử copy connection string mới từ Neon dashboard

### Lỗi: `password authentication failed`

**Nguyên nhân:** Password trong DATABASE_URL sai

**Giải pháp:**
1. Vào Neon dashboard
2. Copy lại connection string mới
3. Update vào file .env

## Không cần PostgreSQL Local

Nếu bạn đang dùng **Neon (online PostgreSQL)**, bạn **KHÔNG CẦN** cài PostgreSQL local.

Chỉ cần:
- ✅ DATABASE_URL trong .env đúng
- ✅ Internet connection
- ✅ Database đang hoạt động trên Neon

## Checklist

- [ ] File .env đã sửa DATABASE_URL (bỏ channel_binding)
- [ ] EMAIL_HOST_PASSWORD không có dấu ngoặc kép
- [ ] Test connection thành công (`python test_db_connection.py`)
- [ ] Migrations chạy được (`python manage.py migrate`)
- [ ] Superuser tạo được (`python manage.py createsuperuser`)

## Cần hỗ trợ?

Nếu vẫn gặp lỗi, chạy:

```bash
python test_db_connection.py
```

Và gửi kết quả để debug tiếp.

