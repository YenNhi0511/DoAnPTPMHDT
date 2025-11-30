# 🔧 HƯỚNG DẪN SỬA LỖI ĐĂNG NHẬP

## ✅ ĐÃ SỬA XONG

### 1. ✅ Verify tất cả users
- Đã chạy `verify-all-users.py`
- Tất cả 7 users chưa verify đã được verify
- Bây giờ tất cả users có thể login

### 2. ✅ Cải thiện Login Logic
- Validate input (email và password)
- Error message rõ ràng hơn
- Kiểm tra đầy đủ các điều kiện

### 3. ✅ Fix Frontend Error Handling
- Cải thiện error handling trong AuthContext
- Đảm bảo error được throw đúng cách

---

## 🧪 KIỂM TRA ĐĂNG NHẬP

### Bước 1: Kiểm tra Backend

```bash
cd backend
python manage.py runserver
```

Đảm bảo backend chạy trên http://localhost:8000

### Bước 2: Kiểm tra Frontend

```bash
cd frontend
npm start
```

Đảm bảo frontend chạy trên http://localhost:3000 (hoặc port tương ứng)

### Bước 3: Test Login

1. Mở http://localhost:3000/login
2. Thử đăng nhập với:
   - **Admin:** `admin@recruitment.com` / `admin123`
   - **Admin GoodCV:** `admin@goodcv.com` / `admin123`
3. Kiểm tra:
   - Console (F12) - xem có error không
   - Network tab - xem request/response
   - Redirect có đúng không

---

## 🔍 DEBUG

### Nếu vẫn không đăng nhập được:

1. **Kiểm tra Console (F12):**
   - Xem error message
   - Kiểm tra network request

2. **Kiểm tra Network Tab:**
   - Request URL: `http://localhost:8000/api/users/login/`
   - Status code: 200 (success) hoặc 401/403 (error)
   - Response body: xem error message

3. **Kiểm tra Backend Terminal:**
   - Xem có error log không
   - Kiểm tra request có đến backend không

4. **Test API trực tiếp:**
   ```bash
   cd backend
   python test-login-direct.py
   ```

---

## 📋 TÀI KHOẢN TEST

### Admin Accounts:
- `admin@recruitment.com` / `admin123`
- `admin@goodcv.com` / `admin123`

### Recruiter Accounts:
- `mymymon109.dev+tech@gmail.com` / `tech123`
- `mymymon109.dev+finance@gmail.com` / `finance123`
- ... (các recruiter khác)

### Candidate Accounts:
- `trucnguyen102004+user2@gmail.com` / (password đã set khi đăng ký)
- ... (các candidate khác)

---

## ⚠️ LƯU Ý

1. **Email verification:**
   - ADMIN không cần verify
   - CANDIDATE và RECRUITER cần verify (đã verify tất cả)

2. **Password:**
   - Nếu không nhớ password, có thể reset qua admin panel
   - Hoặc tạo user mới

3. **Backend URL:**
   - Đảm bảo `REACT_APP_API_URL` trong frontend/.env đúng
   - Mặc định: `http://localhost:8000/api`

---

## ✅ KẾT QUẢ

Sau khi sửa:
- ✅ Tất cả users đã được verify
- ✅ Login logic đã được cải thiện
- ✅ Error handling tốt hơn

**Hãy thử đăng nhập lại!**

