# 🧪 Hướng dẫn Test Full System

## ✅ Checklist trước khi test

### 1. Backend Server
- [ ] Django server đang chạy: `python manage.py runserver`
- [ ] Không có lỗi khi start
- [ ] API accessible tại: http://localhost:8000

### 2. Frontend
- [ ] React app đang chạy: `npm start`
- [ ] Accessible tại: http://localhost:3000
- [ ] Không có lỗi compile

### 3. Database
- [ ] PostgreSQL đang chạy
- [ ] Đã migrate: `python manage.py migrate`
- [ ] Có dữ liệu mẫu (optional)

### 4. Redis & Celery
- [ ] Redis đang chạy (Docker hoặc Memurai)
- [ ] Celery worker đang chạy: `celery -A recruitment_system worker -l info --pool=solo`
- [ ] Celery đã ready (không có lỗi)

### 5. Dữ liệu mẫu
- [ ] Đã seed jobs: `python seed_jobs.py` (optional)
- [ ] Có CVs mẫu trong `sample_cvs/` (optional)

---

## 🎯 Test Flow Đầy Đủ

### Test 1: Đăng ký và Đăng nhập

#### 1.1. Đăng ký Doanh nghiệp (Admin)

1. Mở: http://localhost:3000/register
2. Chọn **"Doanh nghiệp"**
3. Điền form:
   - Email: `company@test.com`
   - Username: `company`
   - Password: `Company@123`
   - Họ, Tên: `Công ty ABC`
4. Click "Đăng ký"
5. **Kết quả mong đợi:**
   - ✅ Redirect đến `/admin/dashboard`
   - ✅ Thấy Admin Dashboard

#### 1.2. Đăng ký Cá nhân (User)

1. Mở tab mới: http://localhost:3000/register
2. Chọn **"Cá nhân"**
3. Điền form:
   - Email: `user@test.com`
   - Username: `user`
   - Password: `User@123`
   - Họ, Tên: `Nguyễn Văn A`
4. Click "Đăng ký"
5. **Kết quả mong đợi:**
   - ✅ Redirect đến `/dashboard`
   - ✅ Thấy User Dashboard

#### 1.3. Đăng nhập

1. Logout (nếu đang login)
2. Vào: http://localhost:3000/login
3. Đăng nhập với tài khoản vừa tạo
4. **Kết quả mong đợi:**
   - ✅ Login thành công
   - ✅ Redirect đúng theo role

---

### Test 2: Quản lý Jobs (Admin)

#### 2.1. Tạo Job mới

1. Login với tài khoản Admin
2. Vào **"Việc làm"** → **"Đăng tin tuyển dụng"**
3. Điền form:
   - Title: "Senior Developer"
   - Description: "Tuyển dụng Senior Developer..."
   - Requirements: "- 5+ years experience\n- Python, Django\n- PostgreSQL"
   - Location: "Hà Nội"
   - Salary: "2000-3000 USD"
   - Employment Type: "Full-time"
   - Deadline: Chọn ngày trong tương lai
4. Click "Lưu và đăng tin"
5. **Kết quả mong đợi:**
   - ✅ Job được tạo thành công
   - ✅ Hiển thị trong danh sách jobs
   - ✅ Status: OPEN

#### 2.2. Xem danh sách Jobs

1. Vào **"Việc làm"**
2. **Kết quả mong đợi:**
   - ✅ Thấy job vừa tạo
   - ✅ Có thể filter, search
   - ✅ Có thể xem chi tiết

---

### Test 3: Nộp Hồ Sơ (User)

#### 3.1. Xem Jobs công khai

1. Login với tài khoản User (hoặc không login)
2. Vào **"Tìm việc"** (Careers page)
3. **Kết quả mong đợi:**
   - ✅ Thấy danh sách jobs
   - ✅ Thấy job "Senior Developer" vừa tạo

#### 3.2. Xem Job Detail

1. Click vào job "Senior Developer"
2. **Kết quả mong đợi:**
   - ✅ Hiển thị đầy đủ thông tin
   - ✅ Có button "Ứng tuyển ngay"

#### 3.3. Nộp Hồ Sơ

1. Click "Ứng tuyển ngay"
2. Upload CV từ `backend/sample_cvs/` (hoặc CV bất kỳ)
3. Điền thư xin việc (optional)
4. Click "Gửi hồ sơ"
5. **Kết quả mong đợi:**
   - ✅ Hiển thị "Hồ sơ đã được gửi thành công"
   - ✅ Xem logs trong Celery worker:
     ```
     [INFO] Task applications.tasks.send_confirmation_email_task[...] received
     [INFO] Task applications.tasks.parse_cv_task[...] received
     [INFO] Task applications.tasks.screen_cv_task[...] received
     ```
   - ✅ Email được gửi (check console hoặc email backend)

---

### Test 4: AI Screening (Admin)

#### 4.1. Xem Hồ Sơ Ứng Tuyển

1. Login với tài khoản Admin
2. Vào **"Hồ sơ ứng tuyển"**
3. **Kết quả mong đợi:**
   - ✅ Thấy hồ sơ vừa nộp
   - ✅ Status: PENDING hoặc SCREENING
   - ✅ Có thể xem chi tiết

#### 4.2. Kiểm tra AI Score

1. Đợi vài giây để Celery xử lý
2. Refresh trang Applications
3. **Kết quả mong đợi:**
   - ✅ AI Score được hiển thị (0-100)
   - ✅ Status có thể đã chuyển sang SCREENING
   - ✅ Có thể xem AI Analysis trong chi tiết

#### 4.3. Manual Screening (nếu cần)

1. Click icon 🧠 (Brain) để trigger AI screening thủ công
2. **Kết quả mong đợi:**
   - ✅ Alert "Đã bắt đầu sàng lọc CV bằng AI"
   - ✅ Xem logs trong Celery worker
   - ✅ AI score được cập nhật

---

### Test 5: Quản lý Phỏng Vấn (Admin)

#### 5.1. Tạo Lịch Phỏng Vấn

1. Vào **"Lịch phỏng vấn"**
2. Click "Tạo lịch phỏng vấn mới"
3. Chọn application từ danh sách
4. Điền thông tin:
   - Scheduled At: Chọn thời gian
   - Duration: 60 phút
   - Location: "Zoom" hoặc "Văn phòng"
   - Interview Type: "Video"
5. Click "Lưu"
6. **Kết quả mong đợi:**
   - ✅ Interview được tạo
   - ✅ Email được gửi (check Celery logs)
   - ✅ Hiển thị trong danh sách interviews

---

### Test 6: Kết Quả Tuyển Dụng (Admin)

#### 6.1. Tạo Kết Quả

1. Vào **"Kết quả tuyển dụng"**
2. Chọn application đã phỏng vấn
3. Tạo result:
   - Final Decision: "OFFER" hoặc "REJECT"
   - Salary: "2500 USD"
   - Start Date: Chọn ngày
   - Notes: "Ghi chú..."
4. Click "Lưu"
5. **Kết quả mong đợi:**
   - ✅ Result được tạo
   - ✅ Email được gửi đến ứng viên

#### 6.2. Tạo Offer Letter

1. Vào result vừa tạo
2. Click "Tạo thư mời nhận việc"
3. **Kết quả mong đợi:**
   - ✅ PDF được tạo
   - ✅ Lưu trong `media/offer_letters/`
   - ✅ Có thể download

---

### Test 7: Báo Cáo Thống Kê (Admin)

#### 7.1. Xem Dashboard

1. Vào **"Admin Dashboard"**
2. **Kết quả mong đợi:**
   - ✅ Thấy statistics:
     - Tổng số jobs
     - Tổng số applications
     - AI score trung bình
     - Phân bố trạng thái
   - ✅ Charts hiển thị đúng

#### 7.2. Xem Reports

1. Vào **"Báo cáo thống kê"**
2. **Kết quả mong đợi:**
   - ✅ Thấy các báo cáo chi tiết
   - ✅ Charts và graphs
   - ✅ Có thể filter theo thời gian

---

### Test 8: Profile (User)

#### 8.1. Xem Profile

1. Click vào avatar → **"Hồ sơ cá nhân"**
2. **Kết quả mong đợi:**
   - ✅ Hiển thị thông tin user
   - ✅ Có 2 tabs: Thông tin cá nhân, Đổi mật khẩu

#### 8.2. Cập nhật Profile

1. Sửa thông tin:
   - First Name: "Nguyễn"
   - Last Name: "Văn B"
   - Phone: "0901234567"
2. Click "Lưu thay đổi"
3. **Kết quả mong đợi:**
   - ✅ Hiển thị "Cập nhật thông tin thành công"
   - ✅ Thông tin được cập nhật

#### 8.3. Đổi Mật Khẩu

1. Vào tab "Đổi mật khẩu"
2. Điền:
   - Mật khẩu hiện tại
   - Mật khẩu mới
   - Xác nhận mật khẩu
3. Click "Đổi mật khẩu"
4. **Kết quả mong đợi:**
   - ✅ Hiển thị "Đổi mật khẩu thành công"
   - ✅ Có thể login với mật khẩu mới

---

## 🐛 Troubleshooting

### Vấn đề: Không thấy jobs

**Giải pháp:**
```bash
# Seed jobs
cd backend
python seed_jobs.py
```

### Vấn đề: AI score không được tạo

**Giải pháp:**
1. Kiểm tra Celery worker đang chạy
2. Xem logs trong Celery worker
3. Kiểm tra `GEMINI_API_KEY` trong `.env` (optional)

### Vấn đề: Email không được gửi

**Giải pháp:**
- Development: Email hiển thị trong console (Django settings)
- Production: Cần cấu hình email backend

### Vấn đề: CV không upload được

**Giải pháp:**
1. Kiểm tra `MEDIA_ROOT` trong settings
2. Đảm bảo thư mục `media/cvs/` tồn tại
3. Kiểm tra quyền ghi file

---

## ✅ Checklist Test Hoàn Chỉnh

- [ ] Đăng ký Doanh nghiệp → Admin Dashboard
- [ ] Đăng ký Cá nhân → User Dashboard
- [ ] Đăng nhập với cả 2 tài khoản
- [ ] Tạo job mới (Admin)
- [ ] Xem jobs công khai (User)
- [ ] Nộp hồ sơ (User)
- [ ] Xem hồ sơ ứng tuyển (Admin)
- [ ] AI score được tạo tự động
- [ ] Tạo lịch phỏng vấn
- [ ] Tạo kết quả tuyển dụng
- [ ] Tạo offer letter
- [ ] Xem báo cáo thống kê
- [ ] Cập nhật profile
- [ ] Đổi mật khẩu

---

## 🎉 Kết Quả

Nếu tất cả tests pass, hệ thống đã hoạt động đầy đủ!

**Các tính năng đã test:**
- ✅ Authentication (Register/Login)
- ✅ Job Management
- ✅ Application Submission
- ✅ AI CV Screening
- ✅ Interview Management
- ✅ Results & Offer Letters
- ✅ Reports & Statistics
- ✅ User Profile

---

**Chúc bạn test thành công! 🚀**

