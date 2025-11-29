# Cấu trúc Routing theo Role

## Tổng quan

Hệ thống được thiết kế với **3 roles chính**:
1. **ADMIN** - Quản lý hệ thống
2. **CANDIDATE** - Ứng viên tìm việc
3. **RECRUITER** - Nhà tuyển dụng (doanh nghiệp/cá nhân)

Routing logic rõ ràng cho từng role, đảm bảo mỗi role chỉ truy cập được các trang phù hợp.

## Layout Structure

### 1. CandidateLayout (CANDIDATE)
- **Chỉ có Header và Footer**
- **Không có Sidebar**
- Sử dụng cho tất cả routes của CANDIDATE
- Màu sắc: Light theme (nền trắng)

### 2. Layout (ADMIN/RECRUITER/INTERVIEWER)
- **Có Header, Footer và Sidebar**
- Sidebar hiển thị menu items phù hợp với từng role
- Màu sắc: Dark theme (nền tối)

## Routing theo Role

### 🔓 PUBLIC ROUTES (Không cần đăng nhập)
```
/                    → Home page
/login               → Đăng nhập
/register            → Đăng ký
/verify-email        → Xác thực email
/careers             → Tìm kiếm việc làm
/jobs/:id            → Chi tiết việc làm
```

### 👤 CANDIDATE ROUTES (Ứng viên)
```
/candidate/dashboard → Dashboard ứng viên (my applications)
/profile             → Hồ sơ cá nhân
```

**Navigation trong Header:**
- Việc làm
- Dashboard

**Không có sidebar**, chỉ có Header/Footer

### 💼 RECRUITER ROUTES (Nhà tuyển dụng)

#### Dashboard & Quản lý
```
/dashboard           → Dashboard chính (RECRUITER/ADMIN/INTERVIEWER)
/jobs                → Quản lý việc làm (ADMIN/RECRUITER)
/jobs/new            → Tạo việc làm mới (ADMIN/RECRUITER)
/jobs/:id/edit       → Chỉnh sửa việc làm (ADMIN/RECRUITER)
```

#### Ứng tuyển & Phỏng vấn
```
/applications        → Hồ sơ ứng tuyển (ADMIN/RECRUITER/INTERVIEWER)
/interviews          → Lịch phỏng vấn (ADMIN/RECRUITER/INTERVIEWER)
/panels              → Hội đồng tuyển dụng (ADMIN/RECRUITER)
/results             → Kết quả tuyển dụng (ADMIN/RECRUITER)
```

#### Quy trình & Báo cáo
```
/processes           → Quy trình tuyển dụng (ADMIN/RECRUITER)
/reports             → Báo cáo thống kê (ADMIN/RECRUITER)
/settings            → Cài đặt tài khoản (ADMIN/RECRUITER)
```

**Navigation trong Header:**
- Việc làm
- Quản lý việc làm
- Hồ sơ ứng tuyển
- Dashboard

**Sidebar hiển thị:**
- Dashboard
- Quản lý việc làm
- Hồ sơ ứng tuyển
- Lịch phỏng vấn
- Hội đồng tuyển dụng
- Kết quả tuyển dụng
- Quy trình tuyển dụng
- Báo cáo thống kê

### 🛡️ ADMIN ROUTES (Quản trị hệ thống)
```
/admin/dashboard     → Admin Dashboard
/admin/users         → Quản lý người dùng
/admin/settings      → Cài đặt hệ thống
```

**Sidebar có thêm section "Quản trị":**
- Admin Dashboard
- Quản lý người dùng
- Cài đặt hệ thống
- Django Admin (link external)

## Redirect Logic

### Sau khi Login
- **ADMIN** → `/admin/dashboard`
- **CANDIDATE** → `/candidate/dashboard`
- **RECRUITER/INTERVIEWER** → `/dashboard`

### Khi truy cập route không đúng role
- Tự động redirect về dashboard phù hợp với role

### Khi đã đăng nhập truy cập public route
- Tự động redirect về dashboard phù hợp với role

## Protected Routes

Tất cả routes (trừ public routes) đều được bảo vệ bởi `ProtectedRoute` component:
- Kiểm tra authentication
- Kiểm tra role permissions
- Tự động chọn layout phù hợp (CandidateLayout hoặc Layout)

## File Structure

```
frontend/src/
├── components/
│   ├── Header.jsx              # Header chung (có navigation theo role)
│   ├── Footer.jsx              # Footer chung
│   ├── Layout.jsx               # Layout với sidebar (ADMIN/RECRUITER/INTERVIEWER)
│   └── CandidateLayout.jsx      # Layout không sidebar (CANDIDATE)
├── pages/
│   ├── CandidateDashboard.jsx  # Dashboard riêng cho CANDIDATE
│   ├── Dashboard.jsx           # Dashboard cho RECRUITER/ADMIN/INTERVIEWER
│   └── ...
└── App.js                       # Routing configuration
```

## Lưu ý

1. **CANDIDATE** không bao giờ thấy sidebar, chỉ có Header/Footer
2. **ADMIN/RECRUITER/INTERVIEWER** luôn có sidebar với menu items phù hợp
3. Mỗi role chỉ thấy navigation links phù hợp trong Header
4. Redirect logic đảm bảo user luôn được đưa đến đúng trang dashboard

