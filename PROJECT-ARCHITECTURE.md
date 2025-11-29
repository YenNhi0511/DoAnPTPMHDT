# 🏗️ Kiến Trúc và Quy Mô Dự Án

## 📊 Quy Mô Dự Án

### Mô Hình: **Multi-Tenant Recruitment Platform**

Hệ thống này là một **nền tảng tuyển dụng đa doanh nghiệp** (Multi-tenant platform), cho phép nhiều doanh nghiệp độc lập sử dụng cùng một hệ thống.

---

## 🎯 Kiến Trúc Hệ Thống

### 1. **Mô Hình Hoạt Động**

```
┌─────────────────────────────────────────────────┐
│         Recruitment Platform (Central)          │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐          │
│  │  Company A   │  │  Company B   │  ...     │
│  │  (TechCorp)  │  │  (FinTech)   │          │
│  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                    │
│         └────────┬────────┘                    │
│                  │                              │
│         ┌────────▼────────┐                    │
│         │  Shared Platform │                    │
│         │  - Database      │                    │
│         │  - AI Services   │                    │
│         │  - Email System  │                    │
│         └────────┬─────────┘                    │
│                  │                              │
│         ┌────────▼────────┐                    │
│         │   Candidates     │                    │
│         │   (Shared Pool)  │                    │
│         └──────────────────┘                    │
└─────────────────────────────────────────────────┘
```

### 2. **Đặc Điểm**

#### ✅ **Multi-Tenant Architecture**
- Nhiều doanh nghiệp sử dụng cùng một hệ thống
- Mỗi doanh nghiệp có dữ liệu riêng biệt
- Dữ liệu được phân tách theo `created_by` (company user)

#### ✅ **Data Isolation**
- Mỗi company chỉ thấy jobs của mình
- Mỗi company chỉ thấy applications cho jobs của mình
- Candidates có thể nộp hồ sơ cho nhiều companies khác nhau

#### ✅ **Shared Resources**
- Cùng một database
- Cùng AI screening service (Gemini)
- Cùng email system
- Cùng infrastructure

---

## 🏢 Các Loại Người Dùng

### 1. **Super Admin** (Platform Owner)
- Quản lý toàn bộ hệ thống
- Quản lý tất cả companies
- Xem thống kê tổng thể
- Cấu hình hệ thống

### 2. **Company Admin** (Doanh nghiệp)
- Đăng ký tài khoản doanh nghiệp
- Tự quản lý jobs của mình
- Xem applications cho jobs của mình
- Quản lý interviews, results
- Xem báo cáo riêng của công ty

### 3. **Recruiter** (Nhà tuyển dụng)
- Có thể được company admin tạo
- Quản lý jobs, applications
- Không có quyền admin

### 4. **Interviewer** (Người phỏng vấn)
- Được mời vào interview panels
- Xem applications và interviews
- Submit feedback

### 5. **Candidate** (Ứng viên)
- Đăng ký tài khoản cá nhân
- Xem tất cả jobs công khai (từ mọi companies)
- Nộp hồ sơ cho bất kỳ job nào
- Xem trạng thái applications của mình

---

## 🔄 Flow Hoạt Động

### Scenario: Ứng viên nộp hồ sơ

```
1. Candidate xem jobs công khai
   ↓
2. Candidate chọn job từ Company A
   ↓
3. Candidate nộp hồ sơ
   ↓
4. Application được tạo với:
   - job: Job của Company A
   - candidate: Candidate user
   ↓
5. Django Signals trigger:
   - Email gửi đến Candidate (xác nhận)
   - Email gửi đến Company A (thông báo có hồ sơ mới)
   - AI screening tự động
   ↓
6. Company A đăng nhập:
   - Chỉ thấy applications cho jobs của mình
   - Xem AI score và analysis
   - Quản lý interviews, results
```

### Scenario: Company quản lý jobs

```
1. Company A đăng nhập
   ↓
2. Vào "Việc làm" → "Đăng tin tuyển dụng"
   ↓
3. Tạo job mới
   - job.created_by = Company A user
   ↓
4. Job được lưu vào database
   ↓
5. Job hiển thị công khai cho tất cả candidates
   ↓
6. Khi có application:
   - Application.job.created_by = Company A
   - Company A thấy application này
   - Company B không thấy
```

---

## 📊 Data Model & Isolation

### Jobs
```python
Job.created_by = Company User
# Mỗi company chỉ thấy jobs của mình
```

### Applications
```python
Application.job.created_by = Company User
# Company chỉ thấy applications cho jobs của mình
```

### Queries
```python
# Company A chỉ thấy jobs của mình
jobs = Job.objects.filter(created_by=company_a_user)

# Company A chỉ thấy applications cho jobs của mình
applications = Application.objects.filter(job__created_by=company_a_user)
```

---

## 🎯 So Sánh với Các Mô Hình Khác

### 1. **Multi-Tenant Platform** (Mô hình này) ✅

**Ưu điểm:**
- ✅ Nhiều companies dùng chung hệ thống
- ✅ Chi phí thấp (shared infrastructure)
- ✅ Dễ maintain và update
- ✅ Candidates có thể apply nhiều companies
- ✅ Centralized AI services

**Nhược điểm:**
- ❌ Cần đảm bảo data isolation tốt
- ❌ Cần quản lý permissions cẩn thận

**Phù hợp:**
- Job board platforms (như Indeed, LinkedIn Jobs)
- Recruitment SaaS platforms
- Freelance platforms

### 2. **Single Company System** (Mỗi company có hệ thống riêng)

**Ưu điểm:**
- ✅ Data hoàn toàn độc lập
- ✅ Tùy chỉnh cao
- ✅ Bảo mật tốt hơn

**Nhược điểm:**
- ❌ Chi phí cao (mỗi company một hệ thống)
- ❌ Khó maintain
- ❌ Candidates phải đăng ký nhiều lần

**Phù hợp:**
- Enterprise recruitment systems
- Large corporations

### 3. **Hybrid Model** (Kết hợp)

- Platform cung cấp core services
- Companies có thể customize một phần
- Phù hợp cho enterprise clients

---

## 🔐 Bảo Mật và Phân Quyền

### Data Isolation

1. **Job Level:**
   ```python
   # Company chỉ thấy jobs của mình
   if user.role == 'ADMIN':
       jobs = Job.objects.filter(created_by=user)
   ```

2. **Application Level:**
   ```python
   # Company chỉ thấy applications cho jobs của mình
   applications = Application.objects.filter(job__created_by=user)
   ```

3. **Candidate Level:**
   ```python
   # Candidate chỉ thấy applications của mình
   applications = Application.objects.filter(candidate=user)
   ```

### Permissions

- **Company Admin:** Full control trên jobs và applications của mình
- **Recruiter:** Quản lý jobs và applications (không có quyền admin)
- **Interviewer:** Xem và feedback (read-only + feedback)
- **Candidate:** Xem jobs, nộp hồ sơ, xem applications của mình

---

## 📈 Scalability

### Hiện Tại (Development)
- Single database
- Single server
- Shared resources

### Production (Có thể mở rộng)
- **Database:** Có thể shard theo company
- **Cache:** Redis cho mỗi company
- **Storage:** S3 cho CVs (phân tách theo company)
- **AI Services:** Rate limiting per company
- **Email:** Queue per company

---

## 🎬 Demo Scenario

### Setup
1. Seed 8 companies với jobs khác nhau
2. Mỗi company có 1-3 jobs
3. Tạo một số candidates

### Test Flow

**Tab 1: Company A (TechCorp)**
- Login: `techcorp@example.com` / `Company@123`
- Thấy 2 jobs: Senior Full Stack Developer, DevOps Engineer
- Xem applications cho jobs của mình
- Tạo interviews, results

**Tab 2: Company B (FinTech)**
- Login: `fintech@example.com` / `Company@123`
- Thấy 2 jobs: Backend Developer, Data Engineer
- Xem applications cho jobs của mình (khác với Company A)

**Tab 3: Candidate**
- Login với tài khoản candidate
- Xem tất cả jobs từ cả 2 companies
- Nộp hồ sơ cho job của Company A
- Nộp hồ sơ cho job của Company B
- Xem applications của mình

**Kết quả:**
- Company A chỉ thấy application cho job của mình
- Company B chỉ thấy application cho job của mình
- Candidate thấy tất cả applications của mình

---

## 📝 Tóm Tắt

### Quy Mô Dự Án

**Loại:** Multi-Tenant Recruitment Platform

**Đặc điểm:**
- ✅ Nhiều doanh nghiệp độc lập
- ✅ Mỗi doanh nghiệp tự quản lý jobs
- ✅ Candidates có thể apply nhiều companies
- ✅ Data isolation theo company
- ✅ Shared AI services và infrastructure

**Phù hợp cho:**
- Job board platforms
- Recruitment SaaS
- Freelance platforms
- Multi-company recruitment systems

---

**Đây là mô hình phổ biến và hiệu quả cho recruitment platforms! 🚀**

