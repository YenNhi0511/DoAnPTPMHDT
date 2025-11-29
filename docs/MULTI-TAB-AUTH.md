# 🔐 Hướng dẫn Multi-Tab Authentication

## Cách hoạt động

Hệ thống sử dụng **JWT tokens** lưu trong `localStorage`, mỗi tab trình duyệt có `localStorage` riêng, nên có thể đăng nhập nhiều tài khoản khác nhau trên các tab khác nhau.

## Demo: Chạy 2 tab cùng lúc

### Tab 1: Admin/Doanh nghiệp

1. Mở tab mới: http://localhost:3000
2. Đăng ký với **"Doanh nghiệp"**:
   - Email: `company@example.com`
   - Chọn: **Doanh nghiệp**
   - Điền đầy đủ thông tin
   - Đăng ký
3. Tự động redirect đến `/admin/dashboard`
4. Tab này sẽ có quyền Admin/Recruiter

### Tab 2: User/Cá nhân

1. Mở tab mới khác: http://localhost:3000
2. Đăng ký với **"Cá nhân"**:
   - Email: `user@example.com`
   - Chọn: **Cá nhân**
   - Điền đầy đủ thông tin
   - Đăng ký
3. Tự động redirect đến `/dashboard`
4. Tab này sẽ có quyền Candidate

## Kiểm tra

### Tab 1 (Admin):
- Có thể truy cập `/admin/dashboard`
- Có thể truy cập `/admin/users`
- Có thể đăng tin tuyển dụng
- Menu hiển thị "Quản trị"

### Tab 2 (User):
- Chỉ thấy Dashboard thường
- Có thể xem danh sách việc làm
- Có thể ứng tuyển
- Không thấy menu "Quản trị"

## Lưu ý

- Mỗi tab có `localStorage` riêng → Tokens độc lập
- Đăng xuất ở tab này không ảnh hưởng tab kia
- Có thể đăng nhập cùng lúc nhiều tài khoản trên các tab khác nhau

## Troubleshooting

### Nếu tab bị logout khi đăng nhập tab khác

**Nguyên nhân:** Có thể do session storage thay vì localStorage

**Giải pháp:** Đảm bảo code dùng `localStorage`, không dùng `sessionStorage`

### Nếu không redirect đúng sau đăng ký

**Kiểm tra:**
1. Backend trả về user data đúng role
2. Frontend auto-login hoạt động
3. Redirect path đúng với account_type

