# Tổng hợp Fix Màu Sắc và Chức Năng theo Role

## ✅ Đã Fix

### 1. Header Component
- ✅ "Tìm việc làm" CHỈ hiện cho CANDIDATE hoặc public (không đăng nhập)
- ✅ ADMIN KHÔNG có "Tìm việc làm" và "Quản lý việc làm" trong Header
- ✅ RECRUITER KHÔNG có "Tìm việc làm" trong Header
- ✅ Màu sắc role-specific:
  - CANDIDATE: Blue (#2563eb)
  - RECRUITER: Green (#059669)
  - ADMIN: Purple (#7c3aed)

### 2. Layout Component
- ✅ Sidebar light theme với màu role-specific
- ✅ ADMIN chỉ thấy: Admin Dashboard, Quản lý người dùng, Cài đặt hệ thống
- ✅ RECRUITER chỉ thấy: Dashboard, Quản lý việc làm, Hồ sơ ứng tuyển, etc.

### 3. Pages đã fix màu sắc
- ✅ Login.jsx - Light theme
- ✅ Register.jsx - Light theme
- ✅ AdminUsers.jsx - Light theme, Purple accent
- ✅ AdminSettings.jsx - Light theme, Purple accent
- ✅ Jobs.jsx - Light theme, Green accent cho RECRUITER
- ✅ Applications.jsx - Light theme, Green accent cho RECRUITER

## ⚠️ Cần Fix Tiếp

### Pages cần update màu sắc (từ dark sang light theme):

1. **Dashboard.jsx** (RECRUITER)
   - Đổi từ dark theme sang light theme
   - Màu accent: Green (#059669)
   - Background: bg-gray-50
   - Cards: bg-white với border

2. **Interviews.jsx** (RECRUITER)
   - Đổi từ dark theme sang light theme
   - Màu accent: Green
   - Fix các class: `card`, `text-white` → `bg-white`, `text-gray-900`

3. **Reports.jsx** (RECRUITER)
   - Đổi từ dark theme sang light theme
   - Màu accent: Green
   - Fix các class: `stat-card`, `text-white` → `bg-white`, `text-gray-900`

4. **Processes.jsx** (RECRUITER)
   - Đổi từ dark theme sang light theme
   - Màu accent: Green

5. **Results.jsx** (RECRUITER)
   - Đổi từ dark theme sang light theme
   - Màu accent: Green

6. **InterviewPanels.jsx** (RECRUITER)
   - Đổi từ dark theme sang light theme
   - Màu accent: Green

7. **JobForm.jsx** (RECRUITER)
   - Đổi từ dark theme sang light theme
   - Màu accent: Green

8. **Settings.jsx** (RECRUITER)
   - Đổi từ dark theme sang light theme
   - Màu accent: Green

9. **AdminDashboard.jsx** (ADMIN)
   - Đổi từ dark theme sang light theme
   - Màu accent: Purple (#7c3aed)

10. **CandidateDashboard.jsx** (CANDIDATE)
    - Đã có light theme nhưng cần kiểm tra lại màu Blue

11. **Profile.jsx** (All roles)
    - Đổi từ dark theme sang light theme
    - Màu accent theo role

12. **JobDetail.jsx** (Public/CANDIDATE)
    - Đổi từ dark theme sang light theme
    - Màu accent: Blue cho CANDIDATE

13. **Careers.jsx** (Public/CANDIDATE)
    - Đổi từ dark theme sang light theme
    - Màu accent: Blue

## Quy tắc Màu Sắc

### CANDIDATE (Ứng viên)
- Primary: Blue (#2563eb, blue-600)
- Gradient: from-blue-600 to-blue-700
- Accent: bg-blue-50, text-blue-600
- Background: bg-gray-50

### RECRUITER (Nhà tuyển dụng)
- Primary: Green (#059669, green-600)
- Gradient: from-green-600 to-emerald-700
- Accent: bg-green-50, text-green-600
- Background: bg-gray-50

### ADMIN (Quản trị viên)
- Primary: Purple (#7c3aed, purple-600)
- Gradient: from-purple-600 to-indigo-700
- Accent: bg-purple-50, text-purple-600
- Background: bg-gray-50

## Pattern để Fix

Thay thế các class sau trong tất cả pages:

```jsx
// OLD (Dark theme)
className="card" → className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
className="text-white" → className="text-gray-900"
className="text-gray-400" → className="text-gray-600"
className="bg-slate-900" → className="bg-gray-50"
className="bg-slate-800" → className="bg-white"
className="border-slate-700" → className="border-gray-200"
className="text-blue-400" → className="text-green-600" (cho RECRUITER) hoặc className="text-purple-600" (cho ADMIN)

// Buttons
className="btn-primary" → className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors" (cho RECRUITER)
className="btn-primary" → className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors" (cho ADMIN)

// Badges
className="badge badge-success" → className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-700 border-green-200"
```

## Routing & Permissions

### CANDIDATE Routes
- `/careers` - Tìm việc làm (PUBLIC hoặc CANDIDATE)
- `/candidate/dashboard` - Dashboard ứng viên
- `/profile` - Hồ sơ cá nhân
- `/jobs/:id` - Chi tiết việc làm (PUBLIC)

### RECRUITER Routes
- `/dashboard` - Dashboard nhà tuyển dụng
- `/jobs` - Quản lý việc làm
- `/jobs/new` - Đăng tin tuyển dụng
- `/jobs/:id/edit` - Chỉnh sửa việc làm
- `/applications` - Hồ sơ ứng tuyển
- `/interviews` - Lịch phỏng vấn
- `/panels` - Hội đồng tuyển dụng
- `/results` - Kết quả tuyển dụng
- `/processes` - Quy trình tuyển dụng
- `/reports` - Báo cáo thống kê
- `/settings` - Cài đặt tài khoản

### ADMIN Routes
- `/admin/dashboard` - Admin Dashboard
- `/admin/users` - Quản lý người dùng
- `/admin/settings` - Cài đặt hệ thống

## Lưu ý

1. **KHÔNG** cho ADMIN truy cập `/careers` (tìm việc làm)
2. **KHÔNG** cho RECRUITER truy cập `/careers` (tìm việc làm)
3. **KHÔNG** cho ADMIN truy cập các routes quản lý việc làm của RECRUITER
4. Tất cả pages phải dùng **light theme** (bg-gray-50, bg-white)
5. Màu sắc phải nhất quán theo role

