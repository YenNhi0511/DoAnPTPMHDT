# 🔄 Cấu hình Multi-Tab và Phân luồng Đăng ký

## ✅ Các thay đổi đã thực hiện

### 1. **Phân luồng Đăng ký**

#### Frontend (`frontend/src/pages/Register.jsx`)
- ✅ Thêm lựa chọn loại tài khoản: **Doanh nghiệp** hoặc **Cá nhân**
- ✅ Doanh nghiệp → Role: `ADMIN` → Redirect: `/admin/dashboard`
- ✅ Cá nhân → Role: `CANDIDATE` → Redirect: `/dashboard`

#### Backend (`backend/accounts/serializers.py`)
- ✅ Tự động set role dựa trên `account_type`:
  - `BUSINESS` → `User.Role.ADMIN`
  - `INDIVIDUAL` → `User.Role.CANDIDATE`

### 2. **Multi-Tab Support**

#### Frontend (`frontend/src/contexts/AuthContext.js`)
- ✅ Tắt sync giữa các tab (`SYNC_BETWEEN_TABS = false`)
- ✅ Mỗi tab có localStorage riêng biệt
- ✅ Mỗi tab có thể login với user khác nhau
- ✅ Hoạt động độc lập, không ảnh hưởng lẫn nhau

### 3. **Redirect Logic**

#### Login (`frontend/src/pages/Login.jsx`)
- ✅ Tự động redirect dựa trên role:
  - `ADMIN` → `/admin/dashboard`
  - Các role khác → `/dashboard`

#### Dashboard (`frontend/src/pages/Dashboard.jsx`)
- ✅ Đã có logic redirect ADMIN về `/admin/dashboard`

---

## 🎯 Cách sử dụng

### Demo với 2 tab:

1. **Tab 1 - Doanh nghiệp (Admin):**
   ```
   - Đăng ký: Chọn "Doanh nghiệp"
   - Email: company@example.com
   - Role: ADMIN
   - Redirect: /admin/dashboard
   ```

2. **Tab 2 - Cá nhân (User):**
   ```
   - Đăng ký: Chọn "Cá nhân"
   - Email: user@example.com
   - Role: CANDIDATE
   - Redirect: /dashboard
   ```

### Đăng nhập:

- **Admin:** Login → Tự động redirect `/admin/dashboard`
- **User:** Login → Tự động redirect `/dashboard`

---

## 🔧 Cấu hình

### Bật/Tắt Sync giữa các tab

Trong `frontend/src/contexts/AuthContext.js`:

```javascript
// true = sync giữa các tab (logout ở tab này sẽ logout tab kia)
// false = mỗi tab độc lập (phù hợp cho demo)
const SYNC_BETWEEN_TABS = false;
```

---

## 📋 Flow đăng ký

```
User truy cập /register
  ↓
Chọn loại tài khoản:
  ├─ Doanh nghiệp
  │   ↓
  │   Điền form
  │   ↓
  │   Backend: account_type='BUSINESS' → role='ADMIN'
  │   ↓
  │   Frontend: Redirect → /admin/dashboard
  │
  └─ Cá nhân
      ↓
      Điền form
      ↓
      Backend: account_type='INDIVIDUAL' → role='CANDIDATE'
      ↓
      Frontend: Redirect → /dashboard
```

---

## 🎬 Demo Scenario

### Scenario 1: Đăng ký và đăng nhập

1. **Tab 1:** Đăng ký doanh nghiệp → Vào admin dashboard
2. **Tab 2:** Đăng ký cá nhân → Vào user dashboard
3. Cả 2 tab hoạt động độc lập

### Scenario 2: Tạo job và ứng tuyển

1. **Tab 1 (Admin):** Tạo job mới
2. **Tab 2 (User):** Xem job và ứng tuyển
3. **Tab 1 (Admin):** Xem hồ sơ ứng tuyển

---

## ✅ Checklist

- [x] Phân luồng đăng ký (Doanh nghiệp/Cá nhân)
- [x] Tự động set role dựa trên account_type
- [x] Redirect đúng sau đăng ký
- [x] Redirect đúng sau đăng nhập
- [x] Multi-tab support (độc lập)
- [x] Tắt sync giữa các tab
- [x] Mỗi tab có thể login user khác nhau

---

## 🐛 Troubleshooting

### Vấn đề: Redirect sai sau đăng ký

**Kiểm tra:**
1. Backend serializer có set role đúng không?
2. Frontend có gửi `account_type` đúng không?
3. Console có lỗi gì không?

### Vấn đề: Tab 2 bị logout khi Tab 1 logout

**Giải pháp:** Đảm bảo `SYNC_BETWEEN_TABS = false` trong `AuthContext.js`

### Vấn đề: Không thể login 2 user khác nhau ở 2 tab

**Nguyên nhân:** Có thể do browser extension hoặc cache

**Giải pháp:**
1. Clear cache và localStorage
2. Thử incognito mode
3. Kiểm tra browser extension

---

**Tất cả đã sẵn sàng cho demo! 🎉**

