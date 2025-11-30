# 🔍 Kiểm Tra Toàn Bộ Email Verification Flow

## ❌ Vấn đề hiện tại

1. **Email không gửi được** khi đăng ký trên web
2. **Link xác thực lỗi** - không hoạt động đúng
3. **Flow verification không đúng** - frontend và backend không đồng bộ

---

## 🔍 Phân tích Flow hiện tại

### Flow hiện tại (CÓ VẤN ĐỀ):

```
1. User đăng ký → Backend tạo user
2. Backend tạo token và gửi email với link:
   http://localhost:8000/api/users/verify-email/{token}/
3. User click link → Backend GET endpoint verify và redirect:
   http://localhost:3000/login?verified=success&token=...
4. Frontend Login.jsx xử lý token và auto login
```

### Vấn đề:

1. **VerifyEmail.jsx không được dùng** - Component này expect `/verify-email?token=...` nhưng backend redirect về `/login?verified=success&token=...`
2. **Email có thể không gửi được** - Exception bị nuốt, không raise
3. **FRONTEND_URL không đúng** - Có thể không match với port frontend đang chạy

---

## ✅ Checklist kiểm tra

### 1. Cấu hình Email (Backend)

- [ ] File `backend/.env` tồn tại
- [ ] `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend`
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USE_TLS=True`
- [ ] `EMAIL_HOST_USER=tdyennhi0511@gmail.com`
- [ ] `EMAIL_HOST_PASSWORD=<app-password>` (không phải password thường)
- [ ] `DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com`
- [ ] `FRONTEND_URL=http://localhost:3000` (hoặc port tương ứng)
- [ ] `BACKEND_URL=http://localhost:8000`

### 2. Code Backend

- [ ] `backend/accounts/serializers.py` - Gửi email trong `create()` method
- [ ] `backend/accounts/views.py` - GET endpoint `/api/users/verify-email/{token}/`
- [ ] `backend/accounts/tasks.py` - Celery task (fallback)
- [ ] `backend/templates/email/verify_email.html` - Email template
- [ ] `backend/templates/email/verify_email.txt` - Plain text template

### 3. Code Frontend

- [ ] `frontend/src/pages/VerifyEmail.jsx` - Component xử lý verification
- [ ] `frontend/src/pages/Login.jsx` - Xử lý auto login sau verification
- [ ] `frontend/src/services/api.js` - API calls: `verifyEmail()`, `resendVerification()`
- [ ] `frontend/src/App.js` - Route `/verify-email`

### 4. Testing

- [ ] Test gửi email đơn giản: `python test-email-send.py`
- [ ] Test đăng ký user mới trên web
- [ ] Test click link verification trong email
- [ ] Test resend verification email

---

## 🔧 Sửa lỗi

### Bước 1: Kiểm tra cấu hình email

```bash
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('EMAIL_BACKEND:', os.environ.get('EMAIL_BACKEND')); print('EMAIL_HOST_USER:', os.environ.get('EMAIL_HOST_USER')); print('EMAIL_HOST_PASSWORD:', 'SET' if os.environ.get('EMAIL_HOST_PASSWORD') else 'NOT SET')"
```

### Bước 2: Test gửi email

```bash
cd backend
python test-email-send.py
```

### Bước 3: Test đăng ký và verification

1. Đăng ký user mới trên web
2. Kiểm tra terminal backend có log:
   ```
   ✅ Email verification sent to user@example.com (direct)
   ```
3. Kiểm tra email có đến không
4. Click link verification trong email
5. Kiểm tra có redirect về login và auto login không

---

## 🎯 Flow đúng (Sau khi sửa)

```
1. User đăng ký → Backend tạo user
2. Backend gửi email với link:
   http://localhost:8000/api/users/verify-email/{token}/
3. User click link → Backend GET endpoint:
   - Verify user
   - Tạo JWT token
   - Redirect về: http://localhost:3000/login?verified=success&token={access_token}
4. Frontend Login.jsx:
   - Detect `verified=success&token=...`
   - Lưu token vào localStorage
   - Lấy user info
   - Redirect về dashboard phù hợp
```

---

## 📝 Notes

- **Email phải gửi được** - Không được nuốt exception
- **Link phải hoạt động** - Backend redirect đúng frontend URL
- **Auto login phải hoạt động** - Frontend xử lý token từ URL
- **Logging rõ ràng** - Dễ debug khi có lỗi

