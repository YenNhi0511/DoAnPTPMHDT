# 🚀 Hướng dẫn chạy 3 Roles trên cùng 1 Port

## ✅ Trả lời câu hỏi của bạn

### 1. **Celery Worker có chức năng gì?**

Celery Worker xử lý các **background tasks** (tác vụ chạy ngầm):

- ✅ **Gửi Email**: Xác nhận nộp CV, thông báo kết quả, mời phỏng vấn
- ✅ **Parse CV**: Đọc file CV (PDF/DOCX), trích xuất thông tin
- ✅ **AI Screening**: Đánh giá CV bằng Google Gemini API, tính điểm phù hợp
- ✅ **Generate Offer Letter**: Tạo file PDF thư mời nhận việc

**Tại sao cần?**
- Không có Celery: User phải đợi 30 giây → Trải nghiệm tệ ❌
- Có Celery: User nhận response ngay, task chạy ngầm → Trải nghiệm tốt ✅

**Có bắt buộc không?**
- ❌ **KHÔNG bắt buộc** để test UI cơ bản
- ✅ **CẦN THIẾT** để test đầy đủ tính năng (email, AI screening, etc.)

---

### 2. **Chạy 3 roles trên cùng 1 port có ảnh hưởng gì không?**

**KHÔNG có ảnh hưởng xấu!** Thực ra đây là cách **TỐT HƠN** cho development:

✅ **Ưu điểm:**
- Đơn giản hơn: Chỉ cần 1 terminal cho frontend
- Tiết kiệm tài nguyên: Không cần chạy 3 React instances
- Giống production: Production cũng chạy 1 instance, phân quyền bằng login
- Dễ test: Chỉ cần đăng nhập với tài khoản khác nhau trong các tabs

❌ **Nhược điểm:**
- Không thể test 3 roles cùng lúc mà không đăng nhập (nhưng bạn có thể đăng nhập 3 tài khoản khác nhau)

---

## 🎯 Cách chạy (3 terminals)

### Terminal 1: Backend (Django)
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```
**URL:** http://localhost:8000

### Terminal 2: Celery Worker
```bash
cd backend
venv\Scripts\activate
celery -A recruitment_system worker -l info --pool=solo
```

**Lưu ý:** 
- Cần Redis đang chạy (Docker Desktop)
- `--pool=solo` chỉ cần cho Windows

### Terminal 3: Frontend (Port 3000 - Tất cả roles)
```bash
cd frontend
npm start
# Hoặc:
npm run start  # (mặc định port 3000)
```
**URL:** http://localhost:3000

---

## 🧪 Cách test 3 roles trên cùng 1 port

### Bước 1: Chạy các services
- Redis: Đã chạy trong Docker Desktop (background)
- Backend: Terminal 1
- Celery: Terminal 2
- Frontend: Terminal 3

### Bước 2: Mở 3 tabs trong browser

**Tab 1 - Admin:**
1. Mở: http://localhost:3000
2. Đăng nhập với tài khoản ADMIN
3. Sẽ thấy Admin Dashboard và menu Admin

**Tab 2 - Candidate:**
1. Mở: http://localhost:3000 (tab mới)
2. Đăng nhập với tài khoản CANDIDATE
3. Sẽ thấy Candidate Dashboard và menu Candidate

**Tab 3 - Recruiter:**
1. Mở: http://localhost:3000 (tab mới)
2. Đăng nhập với tài khoản RECRUITER
3. Sẽ thấy Recruiter Dashboard và menu Recruiter

---

## 🔍 Cách hoạt động

1. **Routing tự động:**
   - Frontend hiển thị TẤT CẢ routes
   - Phân quyền dựa trên **role của user đã đăng nhập**
   - Mỗi role chỉ thấy menu và chức năng của mình

2. **Authentication:**
   - Mỗi tab có localStorage riêng
   - Có thể đăng nhập với user khác nhau trong mỗi tab
   - Không bị conflict

3. **Navigation:**
   - Header và Sidebar tự động hiển thị menu phù hợp với role
   - Nếu truy cập route không đúng role → tự động redirect về dashboard phù hợp

---

## 📋 Script tự động

### Chạy tất cả (1 lệnh):
```bash
# Double-click file này:
start-simple.bat
```

Script sẽ tự động mở 4 terminals:
1. Redis (Docker)
2. Backend
3. Celery
4. Frontend (Port 3000)

---

## 📊 So sánh 2 cách

| Tiêu chí | 3 Ports riêng | 1 Port (3 tabs) |
|----------|---------------|-----------------|
| **Số terminal frontend** | 3 terminals | 1 terminal |
| **Tài nguyên** | Nhiều hơn (3 React instances) | Ít hơn (1 instance) |
| **Phù hợp** | Demo riêng biệt | Development & Production |
| **Test** | Phải mở 3 URLs khác nhau | Mở 3 tabs cùng URL |
| **Phân quyền** | Theo environment variable | Theo user đăng nhập |
| **Đơn giản** | Phức tạp hơn | Đơn giản hơn ✅ |

---

## ⚠️ Lưu ý

1. **Redis phải chạy trước:**
   - Kiểm tra: `docker ps` phải thấy container `redis`
   - Nếu chưa có: `docker start redis` hoặc chạy `start-redis-docker.bat`

2. **Celery cần Redis:**
   - Nếu không có Redis, Celery sẽ lỗi
   - Có thể bỏ qua Celery nếu chỉ test UI

3. **Database phải đang chạy:**
   - Local PostgreSQL hoặc Neon
   - Kiểm tra: `python backend/check_database_connection.py`

4. **Thứ tự khởi động:**
   - Redis → Backend → Celery → Frontend
   - Đợi mỗi service khởi động xong (3-5 giây)

---

## 🎯 Tóm tắt

**Với Docker Desktop đã chạy Redis, bạn chỉ cần:**

1. ✅ **Terminal 1:** Backend (`python manage.py runserver`)
2. ✅ **Terminal 2:** Celery (`celery -A recruitment_system worker -l info --pool=solo`)
3. ✅ **Terminal 3:** Frontend (`npm start` - port 3000)

**Hoặc dùng script tự động:**
```bash
start-simple.bat
```

**Test 3 roles:**
- Mở 3 tabs → http://localhost:3000
- Đăng nhập với 3 tài khoản khác nhau
- Mỗi tab sẽ hiển thị interface phù hợp với role

**KHÔNG có ảnh hưởng xấu!** Đây là cách tốt nhất cho development. 🎉

