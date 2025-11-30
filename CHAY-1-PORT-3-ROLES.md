# 🚀 Chạy 3 Roles trên cùng 1 Port

## 📋 Tổng quan

Bạn có thể chạy tất cả 3 roles (Admin, Candidate, Recruiter) trên **cùng 1 port (3000)** và test bằng cách:
- Mở 3 tabs trong browser
- Đăng nhập với 3 tài khoản khác nhau
- Mỗi tab sẽ hiển thị interface phù hợp với role của user đã đăng nhập

## ✅ Có ảnh hưởng gì không?

### **KHÔNG có ảnh hưởng xấu!** 

Thực ra đây là cách **TỐT HƠN** cho development vì:

1. ✅ **Đơn giản hơn**: Chỉ cần 1 terminal cho frontend
2. ✅ **Tiết kiệm tài nguyên**: Không cần chạy 3 React instances
3. ✅ **Giống production**: Production cũng chạy 1 instance, phân quyền bằng login
4. ✅ **Dễ test**: Chỉ cần đăng nhập với tài khoản khác nhau

### Cách hoạt động:

- Frontend sẽ render routes dựa trên **role của user đã đăng nhập**
- Mỗi role chỉ thấy menu và chức năng của mình
- Không cần `REACT_APP_ROLE` environment variable

---

## 🔧 Cách setup

### Bước 1: Sửa App.js để không filter routes

File `frontend/src/App.js` hiện tại đang filter routes dựa trên `REACT_APP_ROLE`. 
Chúng ta sẽ sửa để hiển thị TẤT CẢ routes, và phân quyền dựa trên user đã đăng nhập.

### Bước 2: Chạy frontend trên port 3000

```bash
cd frontend
npm start
# Hoặc:
npm run start  # (mặc định port 3000)
```

### Bước 3: Test với 3 tabs

1. **Tab 1 - Admin:**
   - Mở: http://localhost:3000
   - Đăng nhập với tài khoản ADMIN
   - Sẽ thấy Admin Dashboard và menu Admin

2. **Tab 2 - Candidate:**
   - Mở: http://localhost:3000 (tab mới)
   - Đăng nhập với tài khoản CANDIDATE
   - Sẽ thấy Candidate Dashboard và menu Candidate

3. **Tab 3 - Recruiter:**
   - Mở: http://localhost:3000 (tab mới)
   - Đăng nhập với tài khoản RECRUITER
   - Sẽ thấy Recruiter Dashboard và menu Recruiter

---

## 📝 Lưu ý

1. **Authentication state:**
   - Mỗi tab có thể đăng nhập với user khác nhau
   - Không bị conflict vì mỗi tab có localStorage riêng

2. **Routing:**
   - Routes được filter dựa trên role của user đã đăng nhập
   - Nếu chưa đăng nhập → thấy public routes (Home, Careers, Login, Register)
   - Sau khi đăng nhập → redirect về dashboard phù hợp với role

3. **Navigation:**
   - Header và Sidebar tự động hiển thị menu phù hợp với role
   - Mỗi role chỉ thấy chức năng của mình

---

## 🎯 So sánh 2 cách

| Tiêu chí | 3 Ports riêng | 1 Port (3 tabs) |
|----------|---------------|-----------------|
| **Số terminal** | 3 terminals | 1 terminal |
| **Tài nguyên** | Nhiều hơn (3 React instances) | Ít hơn (1 instance) |
| **Phù hợp** | Demo riêng biệt | Development & Production |
| **Test** | Phải mở 3 URLs khác nhau | Mở 3 tabs cùng URL |
| **Phân quyền** | Theo environment variable | Theo user đăng nhập |

---

## 💡 Kết luận

**Chạy trên 1 port với 3 tabs là cách TỐT NHẤT cho development!**

- Đơn giản hơn
- Tiết kiệm tài nguyên
- Giống production
- Dễ test và debug

