# Cấu trúc 3 Roles trong Hệ thống

## Tổng quan

Hệ thống được thiết kế với **3 roles chính**:

1. **ADMIN** - Quản lý hệ thống
2. **CANDIDATE** - Ứng viên tìm việc
3. **RECRUITER** - Nhà tuyển dụng (doanh nghiệp/cá nhân)

## Chi tiết từng Role

### 1. 👤 ADMIN - Quản lý Hệ thống

**Mục đích:** Quản lý toàn bộ hệ thống, người dùng, và cấu hình

**Quyền hạn:**
- ✅ Quản lý tất cả người dùng trong hệ thống
- ✅ Xem và quản lý tất cả việc làm (của tất cả công ty)
- ✅ Xem và quản lý tất cả hồ sơ ứng tuyển
- ✅ Quản lý cấu hình hệ thống
- ✅ Truy cập Django Admin
- ✅ Có thể làm tất cả những gì RECRUITER có thể làm

**Routes:**
```
/admin/dashboard    → Admin Dashboard
/admin/users         → Quản lý người dùng
/admin/settings      → Cài đặt hệ thống
/dashboard           → Dashboard (có thể quản lý việc làm)
/jobs                → Quản lý việc làm
/applications        → Hồ sơ ứng tuyển
/interviews          → Lịch phỏng vấn
/panels              → Hội đồng tuyển dụng
/results             → Kết quả tuyển dụng
/processes           → Quy trình tuyển dụng
/reports             → Báo cáo thống kê
/settings            → Cài đặt tài khoản
```

**Layout:** Layout với sidebar (dark theme)

**Navigation trong Header:**
- Việc làm
- Quản lý việc làm
- Hồ sơ ứng tuyển
- Dashboard

**Sidebar Menu:**
- Dashboard
- Quản lý việc làm
- Hồ sơ ứng tuyển
- Lịch phỏng vấn
- Hội đồng tuyển dụng
- Kết quả tuyển dụng
- Quy trình tuyển dụng
- Báo cáo thống kê
- **Section Quản trị:**
  - Admin Dashboard
  - Quản lý người dùng
  - Cài đặt hệ thống
  - Django Admin

---

### 2. 🔍 CANDIDATE - Ứng viên Tìm việc

**Mục đích:** Tìm kiếm và ứng tuyển việc làm

**Quyền hạn:**
- ✅ Xem danh sách việc làm
- ✅ Xem chi tiết việc làm
- ✅ Ứng tuyển việc làm (upload CV, cover letter)
- ✅ Xem trạng thái hồ sơ ứng tuyển của mình
- ✅ Quản lý hồ sơ cá nhân
- ❌ Không thể tạo/chỉnh sửa việc làm
- ❌ Không thể xem hồ sơ ứng tuyển của người khác

**Routes:**
```
/candidate/dashboard → Dashboard ứng viên (my applications)
/profile             → Hồ sơ cá nhân
/careers             → Tìm kiếm việc làm (public)
/jobs/:id            → Chi tiết việc làm (public)
```

**Layout:** CandidateLayout (chỉ Header/Footer, không sidebar)

**Navigation trong Header:**
- Việc làm
- Dashboard

**Không có sidebar**

---

### 3. 💼 RECRUITER - Nhà Tuyển dụng

**Mục đích:** Đăng tin tuyển dụng và quản lý ứng viên

**Quyền hạn:**
- ✅ Tạo, chỉnh sửa, xóa việc làm của công ty mình
- ✅ Xem và quản lý hồ sơ ứng tuyển cho việc làm của mình
- ✅ Lên lịch phỏng vấn
- ✅ Tạo hội đồng tuyển dụng
- ✅ Quản lý kết quả tuyển dụng
- ✅ Xem báo cáo thống kê
- ✅ Quản lý thông tin công ty
- ❌ Không thể xem việc làm của công ty khác
- ❌ Không thể quản lý người dùng hệ thống

**Routes:**
```
/dashboard           → Dashboard nhà tuyển dụng
/jobs                → Quản lý việc làm
/jobs/new            → Tạo việc làm mới
/jobs/:id/edit       → Chỉnh sửa việc làm
/applications        → Hồ sơ ứng tuyển
/interviews          → Lịch phỏng vấn
/panels              → Hội đồng tuyển dụng
/results             → Kết quả tuyển dụng
/processes           → Quy trình tuyển dụng
/reports             → Báo cáo thống kê
/settings            → Cài đặt tài khoản & công ty
```

**Layout:** Layout với sidebar (dark theme)

**Navigation trong Header:**
- Việc làm
- Quản lý việc làm
- Hồ sơ ứng tuyển
- Dashboard

**Sidebar Menu:**
- Dashboard
- Quản lý việc làm
- Hồ sơ ứng tuyển
- Lịch phỏng vấn
- Hội đồng tuyển dụng
- Kết quả tuyển dụng
- Quy trình tuyển dụng
- Báo cáo thống kê

---

## So sánh 3 Roles

| Tính năng | ADMIN | RECRUITER | CANDIDATE |
|-----------|-------|-----------|-----------|
| Xem việc làm | ✅ Tất cả | ✅ Chỉ của mình | ✅ Tất cả (public) |
| Tạo việc làm | ✅ Có thể | ✅ Có thể | ❌ Không |
| Ứng tuyển | ❌ Không | ❌ Không | ✅ Có thể |
| Xem hồ sơ ứng tuyển | ✅ Tất cả | ✅ Chỉ của mình | ✅ Chỉ của mình |
| Quản lý người dùng | ✅ Có thể | ❌ Không | ❌ Không |
| Quản lý hệ thống | ✅ Có thể | ❌ Không | ❌ Không |
| Layout | Sidebar | Sidebar | Header/Footer only |

## Data Isolation (Phân quyền dữ liệu)

### CANDIDATE
- Chỉ thấy applications của chính mình
- Có thể xem tất cả jobs (public)

### RECRUITER
- Chỉ thấy jobs do chính mình tạo
- Chỉ thấy applications cho jobs của mình
- Data được isolate theo `created_by` (company)

### ADMIN
- Thấy tất cả jobs (của tất cả công ty)
- Thấy tất cả applications
- Có quyền quản lý toàn hệ thống

## Registration Flow

### Đăng ký CANDIDATE
- Chọn "Cá nhân" → Role: `CANDIDATE`
- Cần verify email
- Redirect → `/candidate/dashboard`

### Đăng ký RECRUITER
- Chọn "Doanh nghiệp" → Role: `ADMIN` (sẽ được đổi thành `RECRUITER` trong tương lai)
- Hiện tại: Role `ADMIN` được gán cho doanh nghiệp
- Redirect → `/dashboard`

## Lưu ý

1. **INTERVIEWER role đã được loại bỏ** - Tất cả chức năng interviewer được merge vào RECRUITER
2. **ADMIN có thể làm tất cả** - ADMIN có thể quản lý việc làm như RECRUITER
3. **Data isolation** - Mỗi RECRUITER chỉ thấy dữ liệu của công ty mình
4. **Layout khác nhau** - CANDIDATE không có sidebar, chỉ có Header/Footer

