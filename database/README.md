# 📊 Database Schema

Thư mục này chứa các file SQL schema cho hệ thống.

## 📁 Files

- **schema.sql** - Full database schema với tables, indexes, views, functions
- **README.md** - File này

## 🚀 Sử dụng

### Option 1: Dùng Django Migrations (Khuyến nghị)

Django tự động tạo schema từ models. Chỉ cần chạy:

```bash
cd backend
python manage.py migrate
```

### Option 2: Import SQL trực tiếp

Nếu muốn tạo database từ SQL file:

```bash
# Tạo database
createdb recruitment_db

# Import schema
psql -d recruitment_db -f database/schema.sql
```

Hoặc với connection string:

```bash
psql "postgresql://user:password@host:5432/dbname" -f database/schema.sql
```

## 📋 Schema Overview

### Tables

1. **users** - Người dùng hệ thống
2. **recruitment_processes** - Quy trình tuyển dụng
3. **process_steps** - Các bước trong quy trình
4. **jobs** - Vị trí tuyển dụng
5. **applications** - Hồ sơ ứng tuyển
6. **interviews** - Lịch phỏng vấn
7. **interview_panels** - Hội đồng phỏng vấn
8. **recruitment_results** - Kết quả tuyển dụng
9. **notifications** - Thông báo

### Views

- **v_job_applications_summary** - Tổng hợp hồ sơ theo job
- **v_candidate_applications** - Hồ sơ của ứng viên

### Functions

- **get_upcoming_interviews(days_ahead)** - Lấy lịch phỏng vấn sắp tới
- **get_application_stats(job_id)** - Thống kê hồ sơ

## 🔍 Queries mẫu

### Lấy tất cả jobs đang mở

```sql
SELECT * FROM jobs WHERE status = 'OPEN' AND deadline > CURRENT_TIMESTAMP;
```

### Lấy hồ sơ chưa được sàng lọc

```sql
SELECT * FROM applications WHERE status = 'PENDING' ORDER BY applied_at;
```

### Lấy lịch phỏng vấn sắp tới

```sql
SELECT * FROM get_upcoming_interviews(7);
```

### Thống kê hồ sơ theo job

```sql
SELECT * FROM get_application_stats('job-uuid-here');
```

## 📝 Lưu ý

- File SQL này chỉ là reference
- Django migrations là cách chính thức để quản lý schema
- Không nên chỉnh sửa database trực tiếp, dùng Django models và migrations

## 🔄 Backup & Restore

### Backup

```bash
pg_dump -h host -U user -d recruitment_db > backup.sql
```

### Restore

```bash
psql -h host -U user -d recruitment_db < backup.sql
```
