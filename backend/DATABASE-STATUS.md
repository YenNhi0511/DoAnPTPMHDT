# 📊 Trạng thái kết nối Database

## ✅ KẾT QUẢ KIỂM TRA

**Database đã được kết nối thành công!** 🎉

### Thông tin kết nối:
- **Engine**: PostgreSQL
- **Database Name**: `recruitment_db`
- **User**: `postgres`
- **Host**: `localhost`
- **Port**: `5432`
- **PostgreSQL Version**: 17.4

### Trạng thái database:
- ✅ **18 bảng** đã được tạo
- ✅ **25 migrations** đã được apply
- ✅ **Có dữ liệu**:
  - 👥 **10 users**
  - 💼 **12 jobs**
  - 📄 **2 applications**

### Danh sách bảng chính:
- `users` - Người dùng
- `jobs` - Công việc
- `applications` - Hồ sơ ứng tuyển
- `interviews` - Phỏng vấn
- `interview_panels` - Hội đồng tuyển dụng
- `recruitment_processes` - Quy trình tuyển dụng
- `notifications` - Thông báo
- Và các bảng khác...

## 🔍 Cách kiểm tra lại

Chạy script kiểm tra:
```bash
cd backend
python check_database_connection.py
```

Hoặc sử dụng script có sẵn:
```bash
cd backend
python test_db_connection.py
```

## 📝 Lưu ý

1. **File .env**: Hiện tại không có cấu hình database trong `.env`, đang dùng giá trị mặc định:
   - `DB_NAME=recruitment_db`
   - `DB_USER=postgres`
   - `DB_PASSWORD=postgres`
   - `DB_HOST=localhost`
   - `DB_PORT=5432`

2. **Nếu muốn cấu hình trong .env**, thêm vào file `backend/.env`:
   ```env
   DB_NAME=recruitment_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

3. **Hoặc dùng DATABASE_URL** (cho online database như Neon, Supabase):
   ```env
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```

## 🚀 Các lệnh hữu ích

### Xem danh sách bảng:
```bash
python manage.py dbshell
# Sau đó gõ: \dt
```

### Xem migrations:
```bash
python manage.py showmigrations
```

### Tạo migrations mới:
```bash
python manage.py makemigrations
```

### Apply migrations:
```bash
python manage.py migrate
```

### Backup database:
```bash
pg_dump -U postgres recruitment_db > backup.sql
```

### Restore database:
```bash
psql -U postgres recruitment_db < backup.sql
```

## ⚠️ Troubleshooting

Nếu gặp lỗi kết nối:

1. **Kiểm tra PostgreSQL có đang chạy không:**
   - Windows: Services → PostgreSQL
   - Hoặc: `pg_ctl status`

2. **Kiểm tra credentials:**
   - Username: `postgres`
   - Password: (mật khẩu bạn đã set khi cài PostgreSQL)

3. **Kiểm tra database có tồn tại:**
   ```bash
   psql -U postgres -l
   ```

4. **Tạo database nếu chưa có:**
   ```bash
   psql -U postgres
   CREATE DATABASE recruitment_db;
   ```

## 📚 Tài liệu tham khảo

- `FIX-DATABASE.md` - Hướng dẫn sửa lỗi database
- `HUONG-DAN-CAI-DAT.md` - Hướng dẫn cài đặt đầy đủ

