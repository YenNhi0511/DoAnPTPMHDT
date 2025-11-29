# 🎬 Hướng dẫn Demo - Chạy song song nhiều tab

Hướng dẫn demo hệ thống với nhiều tab cùng lúc (1 tab admin, 1 tab user).

---

## 🎯 Mục tiêu

Demo hệ thống với:
- **Tab 1:** Admin/Doanh nghiệp (quản trị hệ thống)
- **Tab 2:** User/Cá nhân (ứng viên tìm việc)

Cả 2 tab hoạt động **độc lập**, không ảnh hưởng lẫn nhau.

---

## 📋 Chuẩn bị

### Bước 1: Chạy Backend và Frontend

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Bước 2: Tạo tài khoản

#### Tài khoản Doanh nghiệp (Admin)

1. Mở trình duyệt, truy cập: http://localhost:3000/register
2. Chọn **"Doanh nghiệp"**
3. Điền form:
   - Email: `company@example.com`
   - Username: `company`
   - Password: `Company@12345`
   - Họ, Tên: `Công ty ABC`
4. Click "Đăng ký"
5. Tự động redirect đến `/admin/dashboard`

#### Tài khoản Cá nhân (User)

1. Mở tab mới (hoặc cửa sổ mới), truy cập: http://localhost:3000/register
2. Chọn **"Cá nhân"**
3. Điền form:
   - Email: `user@example.com`
   - Username: `user`
   - Password: `User@12345`
   - Họ, Tên: `Nguyễn Văn A`
4. Click "Đăng ký"
5. Tự động redirect đến `/dashboard`

---

## 🎬 Demo Flow

### Scenario 1: Doanh nghiệp đăng tin tuyển dụng

**Tab 1 (Admin/Doanh nghiệp):**

1. Đăng nhập với tài khoản doanh nghiệp
2. Vào **"Việc làm"** → **"Đăng tin tuyển dụng"**
3. Tạo job mới:
   - Title: "Senior Developer"
   - Description: "Tuyển dụng Senior Developer..."
   - Location: "Hà Nội"
   - Salary: "2000-3000 USD"
4. Click "Lưu và đăng tin"
5. Job hiển thị trong danh sách

### Scenario 2: Ứng viên ứng tuyển

**Tab 2 (User/Cá nhân):**

1. Đăng nhập với tài khoản cá nhân
2. Vào **"Tìm việc"** (Careers page)
3. Xem danh sách jobs (bao gồm job vừa tạo ở Tab 1)
4. Click vào job "Senior Developer"
5. Click "Ứng tuyển ngay"
6. Upload CV và điền thông tin
7. Click "Gửi hồ sơ"

### Scenario 3: Doanh nghiệp xem hồ sơ

**Tab 1 (Admin/Doanh nghiệp):**

1. Vào **"Hồ sơ ứng tuyển"**
2. Xem hồ sơ mới từ Tab 2
3. Click vào hồ sơ để xem chi tiết
4. Có thể:
   - Sàng lọc bằng AI
   - Đặt lịch phỏng vấn
   - Cập nhật trạng thái

### Scenario 4: Quản lý phỏng vấn

**Tab 1 (Admin/Doanh nghiệp):**

1. Vào **"Lịch phỏng vấn"**
2. Tạo lịch phỏng vấn mới
3. Chọn ứng viên từ danh sách
4. Đặt thời gian, địa điểm
5. Lưu lịch

**Tab 2 (User/Cá nhân):**

1. Refresh trang hoặc vào **"Hồ sơ của bạn"**
2. Xem thông báo về lịch phỏng vấn
3. Xem chi tiết lịch phỏng vấn

---

## 🔧 Cách hoạt động

### Multi-tab Independence

Mỗi tab browser có **localStorage riêng biệt**, nên:

- ✅ Tab 1 có thể login với user A
- ✅ Tab 2 có thể login với user B
- ✅ Cả 2 tab hoạt động độc lập
- ✅ Không ảnh hưởng lẫn nhau

### Authentication State

- Mỗi tab lưu token riêng trong localStorage
- Mỗi tab có AuthContext riêng
- Không sync giữa các tab (đã tắt trong code)

### Phân luồng đăng ký

```
Đăng ký
  ├─ Doanh nghiệp → role: ADMIN → redirect: /admin/dashboard
  └─ Cá nhân → role: CANDIDATE → redirect: /dashboard
```

---

## 📝 Checklist Demo

### Trước khi demo:

- [ ] Backend đang chạy (http://localhost:8000)
- [ ] Frontend đang chạy (http://localhost:3000)
- [ ] Database đã kết nối
- [ ] Đã tạo 2 tài khoản (1 doanh nghiệp, 1 cá nhân)

### Khi demo:

- [ ] Tab 1: Login với tài khoản doanh nghiệp
- [ ] Tab 2: Login với tài khoản cá nhân
- [ ] Tab 1: Tạo job mới
- [ ] Tab 2: Xem job và ứng tuyển
- [ ] Tab 1: Xem hồ sơ ứng tuyển
- [ ] Tab 1: Đặt lịch phỏng vấn
- [ ] Tab 2: Xem thông báo phỏng vấn

---

## 🎯 Tips cho Demo

1. **Sử dụng 2 cửa sổ browser** thay vì 2 tab để dễ theo dõi
2. **Đặt cửa sổ cạnh nhau** (Windows: Win + Left/Right Arrow)
3. **Chuẩn bị data mẫu** trước khi demo
4. **Test flow trước** để đảm bảo không có lỗi

---

## 🐛 Troubleshooting

### Vấn đề: Tab 2 tự động logout khi Tab 1 logout

**Nguyên nhân:** Storage event listener đang bật

**Giải pháp:** Đã tắt trong code (`SYNC_BETWEEN_TABS = false`)

### Vấn đề: Không thấy job mới ở Tab 2

**Giải pháp:** Refresh trang hoặc kiểm tra API có trả về job mới

### Vấn đề: Redirect sai sau khi đăng ký

**Giải pháp:** Kiểm tra role được set đúng:
- Doanh nghiệp → ADMIN
- Cá nhân → CANDIDATE

---

## ✅ Kết quả mong đợi

Sau khi setup:

- ✅ 2 tab có thể login với user khác nhau
- ✅ Tab 1 (Admin) có thể quản lý jobs, applications, interviews
- ✅ Tab 2 (User) có thể xem jobs, ứng tuyển, xem hồ sơ của mình
- ✅ Cả 2 tab hoạt động độc lập, không ảnh hưởng nhau
- ✅ Data được sync qua database (job mới ở Tab 1 hiển thị ở Tab 2)

---

**Chúc bạn demo thành công! 🎉**
