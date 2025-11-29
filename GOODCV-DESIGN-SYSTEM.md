# GoodCV Design System & Redesign Plan

## Brand Identity

**Tên hệ thống:** GoodCV  
**Slogan:** "Tuyển dụng thông minh"  
**Màu chính:** Blue (#2563eb) - Tượng trưng cho sự tin cậy và chuyên nghiệp

## 3 Roles với Tên Rõ Ràng

### 1. 👤 CANDIDATE - "Ứng viên"
- **Màu sắc:** Blue (#2563eb)
- **Icon:** User/Briefcase
- **Mục đích:** Tìm kiếm và ứng tuyển việc làm

### 2. 💼 RECRUITER - "Nhà tuyển dụng"  
- **Màu sắc:** Green (#059669)
- **Icon:** Building2/Briefcase
- **Mục đích:** Đăng tin tuyển dụng và quản lý ứng viên

### 3. 🛡️ ADMIN - "Quản trị viên"
- **Màu sắc:** Purple (#7c3aed)
- **Icon:** Shield/BarChart3
- **Mục đích:** Quản lý toàn bộ hệ thống

## Design Principles

### 1. Consistency (Nhất quán)
- Tất cả các trang phải có cùng header/footer
- Navigation logic rõ ràng cho từng role
- Màu sắc và typography thống nhất

### 2. User Experience (Trải nghiệm người dùng)
- Flow logic và intuitive
- Clear call-to-actions
- Responsive design

### 3. Visual Hierarchy (Phân cấp thị giác)
- Important information stands out
- Clear sections and spacing
- Consistent use of colors

## Layout Structure

### Public Pages (Home, Careers, JobDetail)
```
┌─────────────────────────┐
│  Top Accent Bar (1px)   │
├─────────────────────────┤
│      HEADER             │ ← GoodCV logo, navigation
├─────────────────────────┤
│                         │
│      MAIN CONTENT       │ ← Hero section, job listings
│                         │
├─────────────────────────┤
│      FOOTER             │ ← Company info, links
└─────────────────────────┘
```

### CANDIDATE Pages
```
┌─────────────────────────┐
│  Top Accent Bar (Blue)  │
├─────────────────────────┤
│      HEADER             │ ← Navigation: Tìm việc, Trang chủ, Hồ sơ
├─────────────────────────┤
│                         │
│      MAIN CONTENT       │ ← Dashboard, Applications, Profile
│                         │
├─────────────────────────┤
│      FOOTER             │
└─────────────────────────┘
```

### RECRUITER Pages
```
┌─────────────────────────┐
│  Top Accent Bar (Green) │
├─────────────────────────┤
│      HEADER             │ ← Navigation: Tìm việc, Trang chủ, QL việc làm, Hồ sơ
├─────────────────────────┤
│ Sidebar │ Main Content  │ ← Dark theme sidebar
│         │               │
├─────────────────────────┤
│      FOOTER             │
└─────────────────────────┘
```

### ADMIN Pages
```
┌─────────────────────────┐
│  Top Accent Bar (Purple)│
├─────────────────────────┤
│      HEADER             │ ← Navigation: Quản trị, QL việc làm, QL người dùng
├─────────────────────────┤
│ Sidebar │ Main Content  │ ← Dark theme sidebar + Admin section
│         │               │
├─────────────────────────┤
│      FOOTER             │
└─────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Blue (CANDIDATE):** #2563eb, #3b82f6, #1e40af
- **Green (RECRUITER):** #059669, #10b981, #047857
- **Purple (ADMIN):** #7c3aed, #8b5cf6, #6d28d9

### Neutral Colors
- **Gray Scale:** #f9fafb → #111827
- **White:** #ffffff
- **Black:** #000000

### Status Colors
- **Success:** #10b981
- **Warning:** #f59e0b
- **Error:** #ef4444
- **Info:** #3b82f6

## Typography

- **Font Family:** Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- **Headings:** Bold, clear hierarchy
- **Body:** Regular, readable size (14-16px)
- **Small text:** 12-13px for labels, captions

## Spacing System

- **xs:** 4px (0.25rem)
- **sm:** 8px (0.5rem)
- **md:** 16px (1rem)
- **lg:** 24px (1.5rem)
- **xl:** 32px (2rem)
- **2xl:** 48px (3rem)
- **3xl:** 64px (4rem)

## Component Guidelines

### Buttons
- Primary: Solid background, white text
- Secondary: Outline or ghost style
- Consistent padding and border radius

### Cards
- White background for light theme
- Shadow for depth
- Border radius: 8-12px

### Forms
- Clear labels
- Helpful placeholders
- Error states visible
- Success feedback

## Navigation Logic

### CANDIDATE Flow
1. Home → Tìm việc làm
2. Dashboard → Xem hồ sơ ứng tuyển của mình
3. Profile → Quản lý thông tin cá nhân
4. Job Detail → Ứng tuyển

### RECRUITER Flow
1. Dashboard → Tổng quan tuyển dụng
2. Quản lý việc làm → Tạo/Chỉnh sửa jobs
3. Hồ sơ ứng tuyển → Xem và đánh giá candidates
4. Lịch phỏng vấn → Quản lý interviews
5. Báo cáo → Thống kê

### ADMIN Flow
1. Admin Dashboard → Tổng quan hệ thống
2. Quản lý người dùng → CRUD users
3. Quản lý việc làm → Xem tất cả jobs
4. Cài đặt hệ thống → Configuration

## Implementation Checklist

- [x] Update Header với GoodCV branding
- [x] Update Footer với GoodCV info
- [ ] Redesign Home page (landing page)
- [ ] Redesign Candidate Dashboard
- [ ] Redesign Recruiter Dashboard  
- [ ] Redesign Admin Dashboard
- [ ] Update all pages với consistent design
- [ ] Add role-specific color accents
- [ ] Ensure responsive design
- [ ] Test navigation flows

