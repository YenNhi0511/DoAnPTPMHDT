# Tài Khoản Mẫu để Test

File này chứa danh sách các tài khoản mẫu để test hệ thống GoodCV.

## Cách sử dụng

1. Chạy script seed để tạo các tài khoản này trong database
2. Hoặc tạo thủ công qua Django Admin hoặc API

## Tài khoản ADMIN (Quản trị viên)

| Email | Password | Tên | Vai trò | Mô tả |
|-------|----------|-----|---------|-------|
| admin@goodcv.com | admin123 | Admin User | ADMIN | Tài khoản quản trị hệ thống chính |
| nhiyen@goodcv.com | admin123 | Nhi Yến | ADMIN | Quản trị viên phụ |

## Tài khoản RECRUITER (Nhà tuyển dụng)

| Email | Password | Tên | Vai trò | Mô tả |
|-------|----------|-----|---------|-------|
| recruiter@goodcv.com | recruiter123 | Recruiter User | RECRUITER | Nhà tuyển dụng mẫu |
| company1@goodcv.com | company123 | Công ty ABC | RECRUITER | Công ty công nghệ |
| company2@goodcv.com | company123 | Công ty XYZ | RECRUITER | Công ty tài chính |

## Tài khoản CANDIDATE (Ứng viên)

| Email | Password | Tên | Vai trò | Mô tả |
|-------|----------|-----|---------|-------|
| candidate@goodcv.com | candidate123 | Candidate User | CANDIDATE | Ứng viên mẫu |
| test1@goodcv.com | test123 | Nguyễn Văn A | CANDIDATE | Ứng viên test 1 |
| test2@goodcv.com | test123 | Trần Thị B | CANDIDATE | Ứng viên test 2 |
| test3@goodcv.com | test123 | Lê Văn C | CANDIDATE | Ứng viên test 3 |
| test4@goodcv.com | test123 | Phạm Thị D | CANDIDATE | Ứng viên test 4 |
| test5@goodcv.com | test123 | Hoàng Văn E | CANDIDATE | Ứng viên test 5 |

## Tổng hợp

- **ADMIN:** 2 tài khoản
- **RECRUITER:** 3 tài khoản
- **CANDIDATE:** 6 tài khoản
- **Tổng:** 11 tài khoản

## Lưu ý

- Tất cả mật khẩu đều là `123` hoặc `123456` (để dễ test)
- Trong production, nên sử dụng mật khẩu mạnh hơn
- Các tài khoản này chỉ dùng cho môi trường development/test

## Script tạo tài khoản

Bạn có thể tạo các tài khoản này bằng cách:

1. **Qua Django Admin:**
   - Truy cập `http://localhost:8000/admin/`
   - Đăng nhập với admin account
   - Tạo user mới trong phần Users

2. **Qua API:**
   - POST `/api/auth/register/` với data tương ứng

3. **Qua script Python:**
   - Tạo file `create_sample_accounts.py` trong `backend/`
   - Chạy: `python manage.py shell < create_sample_accounts.py`

