# 📊 Quy Mô và Mô Hình Dự Án

## 🎯 Quy Mô Dự Án

### **Multi-Tenant Recruitment Platform**

Hệ thống này là một **nền tảng tuyển dụng đa doanh nghiệp**, cho phép nhiều doanh nghiệp độc lập sử dụng cùng một hệ thống để quản lý tuyển dụng.

---

## 🏗️ Mô Hình Hoạt Động

### **Nhiều Doanh Nghiệp Độc Lập Tự Đăng JD**

✅ **Đúng!** Đây chính xác là mô hình của dự án:

```
┌─────────────────────────────────────────────┐
│     Recruitment Platform (Shared System)    │
│                                             │
│  ┌────────────┐  ┌────────────┐  ┌──────┐ │
│  │ Company A  │  │ Company B  │  │ ...  │ │
│  │            │  │            │  │      │ │
│  │ Tự đăng JD │  │ Tự đăng JD │  │ ...  │ │
│  │ Quản lý    │  │ Quản lý    │  │      │ │
│  │ Applications│ │ Applications│ │      │ │
│  └────────────┘  └────────────┘  └──────┘ │
│                                             │
│         ┌──────────────────┐               │
│         │  Shared Services  │               │
│         │  - AI Screening   │               │
│         │  - Email System    │               │
│         │  - Database        │               │
│         └──────────────────┘               │
│                                             │
│         ┌──────────────────┐               │
│         │   Candidates      │               │
│         │   (Shared Pool)   │               │
│         └──────────────────┘               │
└─────────────────────────────────────────────┘
```

---

## 🔄 Cách Hoạt Động

### 1. **Đăng Ký Doanh Nghiệp**

- Doanh nghiệp đăng ký tài khoản (chọn "Doanh nghiệp")
- Tự động được cấp quyền ADMIN
- Có thể bắt đầu đăng JD ngay

### 2. **Tự Đăng JD Tuyển Dụng**

- Doanh nghiệp tự đăng nhập
- Vào "Việc làm" → "Đăng tin tuyển dụng"
- Tự điền thông tin JD:
  - Title, Description, Requirements
  - Location, Salary, Deadline
  - Employment Type, Experience
- Click "Lưu và đăng tin"
- JD được lưu với `created_by = company_user`

### 3. **Quản Lý Hồ Sơ**

- Doanh nghiệp chỉ thấy:
  - Jobs của mình
  - Applications cho jobs của mình
  - Statistics riêng của công ty

### 4. **Ứng Viên Nộp Hồ Sơ**

- Ứng viên xem TẤT CẢ jobs từ TẤT CẢ companies
- Ứng viên nộp hồ sơ cho job nào
- Application được gửi đến đúng company đó
- Company nhận được thông báo

---

## 📊 So Sánh với Các Mô Hình Khác

### 1. **Job Board Platform** (Mô hình này) ✅

**Ví dụ:** Indeed, LinkedIn Jobs, TopCV

**Đặc điểm:**
- ✅ Nhiều companies đăng jobs
- ✅ Candidates xem tất cả jobs
- ✅ Candidates apply trực tiếp
- ✅ Mỗi company quản lý riêng

**Phù hợp:**
- Job portals
- Recruitment platforms
- Freelance platforms

### 2. **Recruitment Agency**

**Ví dụ:** Manpower, Adecco

**Đặc điểm:**
- ❌ Agency đăng jobs thay cho companies
- ❌ Candidates apply qua agency
- ❌ Agency sàng lọc và giới thiệu

**Khác biệt:**
- Không phải mô hình này
- Companies tự quản lý

### 3. **Enterprise ATS** (Applicant Tracking System)

**Ví dụ:** Workday, Greenhouse

**Đặc điểm:**
- ❌ Mỗi company có hệ thống riêng
- ❌ Không chia sẻ candidates
- ❌ Chi phí cao

**Khác biệt:**
- Không phải mô hình này
- Đây là shared platform

---

## 🎯 Đặc Điểm Nổi Bật

### ✅ **Multi-Tenant Architecture**

- Nhiều companies dùng chung hệ thống
- Mỗi company có dữ liệu riêng
- Data isolation đảm bảo bảo mật

### ✅ **Self-Service Model**

- Companies tự đăng ký
- Tự đăng JD
- Tự quản lý applications
- Không cần admin can thiệp

### ✅ **Shared Candidate Pool**

- Candidates có thể apply nhiều companies
- Không cần đăng ký nhiều lần
- Xem tất cả jobs trong một nơi

### ✅ **Centralized Services**

- AI Screening (Gemini) cho tất cả
- Email system chung
- Infrastructure chung
- Chi phí thấp

---

## 📈 Scalability

### Hiện Tại (Development)
- Single database
- Single server
- ~8-10 companies demo

### Production (Có thể mở rộng)
- **100+ companies:** Vẫn hoạt động tốt
- **1000+ companies:** Cần optimize database
- **10,000+ companies:** Cần sharding, load balancing

### Limits
- **Jobs per company:** Không giới hạn
- **Applications per job:** Không giới hạn
- **Candidates:** Không giới hạn

---

## 💼 Use Cases

### 1. **Job Portal**
- Nhiều companies đăng jobs
- Candidates tìm việc
- Ví dụ: TopCV, VietnamWorks

### 2. **Recruitment SaaS**
- Bán subscription cho companies
- Mỗi company có account riêng
- Ví dụ: Greenhouse, Lever

### 3. **Freelance Platform**
- Clients đăng projects
- Freelancers apply
- Ví dụ: Upwork, Freelancer

### 4. **Internal Recruitment**
- Nhiều departments trong một công ty
- Mỗi department quản lý riêng
- Shared candidate pool

---

## 🔐 Data Isolation

### Jobs
```python
# Mỗi company chỉ thấy jobs của mình
jobs = Job.objects.filter(created_by=company_user)
```

### Applications
```python
# Company chỉ thấy applications cho jobs của mình
applications = Application.objects.filter(job__created_by=company_user)
```

### Statistics
```python
# Dashboard chỉ tính stats của company đó
total_jobs = Job.objects.filter(created_by=company_user).count()
total_apps = Application.objects.filter(job__created_by=company_user).count()
```

---

## 🎬 Demo với Nhiều Companies

### Setup
```bash
python seed_companies.py
```

### Kết Quả
- 8 companies từ các ngành nghề khác nhau
- Mỗi company có 1-3 jobs
- Tổng ~15 jobs

### Test
1. Login TechCorp → Chỉ thấy 2 jobs của TechCorp
2. Login FinTech → Chỉ thấy 2 jobs của FinTech
3. Login Candidate → Thấy tất cả 15 jobs
4. Candidate nộp hồ sơ cho TechCorp → TechCorp thấy
5. Candidate nộp hồ sơ cho FinTech → FinTech thấy
6. TechCorp không thấy applications của FinTech ✅

---

## 📝 Tóm Tắt

### Quy Mô Dự Án

**Loại:** Multi-Tenant Recruitment Platform

**Mô hình:**
- ✅ Nhiều doanh nghiệp độc lập
- ✅ Tự đăng ký và tự quản lý
- ✅ Tự đăng JD tuyển dụng
- ✅ Quản lý applications riêng
- ✅ Shared candidate pool
- ✅ Centralized AI services

**Giống như:**
- TopCV, VietnamWorks (Job portals)
- LinkedIn Jobs (Social + Jobs)
- Indeed (Job aggregator)

**Khác với:**
- Recruitment agencies (không phải agency)
- Enterprise ATS (không phải single company)
- Headhunting firms (không phải headhunting)

---

## 🚀 Kết Luận

**Đây là một nền tảng tuyển dụng đa doanh nghiệp**, nơi:

1. **Nhiều doanh nghiệp** đăng ký và sử dụng
2. **Tự đăng JD** tuyển dụng
3. **Tự quản lý** applications và interviews
4. **Candidates** có thể apply nhiều companies
5. **Data isolation** đảm bảo mỗi company chỉ thấy dữ liệu của mình
6. **Shared services** (AI, Email) cho tất cả

**Đây là mô hình phổ biến và hiệu quả cho recruitment platforms! 🎉**

