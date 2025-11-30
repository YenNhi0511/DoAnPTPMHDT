# 🔧 Sửa Lỗi Đăng Ký - Email Đã Tồn Tại

## ❌ Vấn đề

Khi đăng ký tài khoản mới, hệ thống báo email/username đã tồn tại dù chưa có.

## ✅ Đã sửa

### 1. Thêm validation rõ ràng

Đã thêm validation explicit cho email và username trong `UserCreateSerializer`:

```python
def validate_email(self, value):
    """Validate email - kiểm tra đã tồn tại chưa"""
    if value:
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.")
    return value

def validate_username(self, value):
    """Validate username - kiểm tra đã tồn tại chưa"""
    if value:
        value = value.strip()
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Tên người dùng này đã được sử dụng. Vui lòng chọn tên khác.")
    return value
```

### 2. Cải thiện error message

- Message rõ ràng hơn: "Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập."
- Case-insensitive check: `email__iexact` để tránh trùng lặp do chữ hoa/thường

## 🔍 Kiểm tra

### Bước 1: Kiểm tra users trùng lặp

```bash
cd backend
python check-duplicate-users.py
```

Script sẽ hiển thị:
- Tổng số users
- Email trùng lặp (nếu có)
- Username trùng lặp (nếu có)
- Danh sách 10 user mới nhất

### Bước 2: Kiểm tra email cụ thể

```bash
cd backend
python test-register-with-email.py
```

Script sẽ:
- Kiểm tra email đã tồn tại chưa
- Nếu có, hỏi có muốn xóa không
- Test đăng ký với email đó

### Bước 3: Xóa users test cũ (nếu cần)

```bash
cd backend
python delete-test-users.py
```

Script sẽ:
- Hiển thị tất cả users
- Cho phép xóa users test theo:
  - Email pattern (vd: test@, user@)
  - Số lượng (xóa N users mới nhất)
  - Email cụ thể

## 💡 Giải pháp

### Nếu email thực sự đã tồn tại:

1. **Đăng nhập** với email đó thay vì đăng ký mới
2. **Hoặc** dùng email khác để đăng ký
3. **Hoặc** xóa user cũ và đăng ký lại (dùng script `delete-test-users.py`)

### Nếu email chưa tồn tại nhưng vẫn báo lỗi:

1. **Kiểm tra email format** - Có thể có khoảng trắng hoặc ký tự đặc biệt
2. **Kiểm tra case sensitivity** - Email đã được normalize về lowercase
3. **Kiểm tra database** - Có thể có user với email tương tự

## 🎯 Kết quả mong đợi

Sau khi sửa:
- ✅ Validation rõ ràng hơn
- ✅ Error message dễ hiểu hơn
- ✅ Case-insensitive check
- ✅ Trim whitespace tự động

## 📝 Lưu ý

- Email được normalize về lowercase trước khi check
- Username được trim whitespace
- Validation chạy trước khi tạo user, nên không tạo user duplicate

