# 🏢 Hướng Dẫn Demo với Nhiều Doanh Nghiệp

## 🎯 Mục Tiêu

Demo hệ thống với nhiều doanh nghiệp từ các ngành nghề khác nhau, mỗi doanh nghiệp có jobs và applications riêng.

---

## 📋 Setup

### Bước 1: Seed Companies và Jobs

```bash
cd backend
python seed_companies.py
```

**Kết quả:**
- ✅ Tạo 8 companies từ các ngành nghề khác nhau
- ✅ Mỗi company có 1-3 jobs
- ✅ Tổng cộng ~15 jobs

### Bước 2: Xác nhận

Script sẽ hiển thị:
```
✅ Created company: Tech Corp
  ✅ Created job: Senior Full Stack Developer
  ✅ Created job: DevOps Engineer
...
📊 Đã tạo 8 companies mới
📊 Đã tạo 15 jobs mới
```

---

## 🏢 Danh Sách Companies

### 1. **TechCorp** (Công nghệ)
- Email: `techcorp@example.com`
- Password: `Company@123`
- Jobs:
  - Senior Full Stack Developer
  - DevOps Engineer

### 2. **FinTech Solutions** (Tài chính)
- Email: `fintech@example.com`
- Password: `Company@123`
- Jobs:
  - Backend Developer (Python/Django)
  - Data Engineer

### 3. **Creative Design Studio** (Thiết kế)
- Email: `designstudio@example.com`
- Password: `Company@123`
- Jobs:
  - UI/UX Designer

### 4. **E-Commerce Platform** (Thương mại điện tử)
- Email: `ecommerce@example.com`
- Password: `Company@123`
- Jobs:
  - Frontend Developer (React)
  - Product Manager

### 5. **HealthCare Tech** (Y tế)
- Email: `healthcare@example.com`
- Password: `Company@123`
- Jobs:
  - Mobile Developer (React Native)

### 6. **Digital Marketing Agency** (Marketing)
- Email: `marketing@example.com`
- Password: `Company@123`
- Jobs:
  - Marketing Manager
  - Content Writer

### 7. **EdTech Solutions** (Giáo dục)
- Email: `education@example.com`
- Password: `Company@123`
- Jobs:
  - Full Stack Developer

### 8. **Logistics Pro** (Vận chuyển)
- Email: `logistics@example.com`
- Password: `Company@123`
- Jobs:
  - Backend Developer (Java/Spring)
  - QA Engineer

---

## 🎬 Demo Flow

### Scenario 1: Company A quản lý jobs

1. **Login với TechCorp:**
   - Email: `techcorp@example.com`
   - Password: `Company@123`

2. **Vào "Việc làm":**
   - ✅ Chỉ thấy 2 jobs của TechCorp
   - ✅ Không thấy jobs của companies khác

3. **Xem "Hồ sơ ứng tuyển":**
   - ✅ Chỉ thấy applications cho jobs của TechCorp
   - ✅ Có thể xem AI score, analysis

### Scenario 2: Company B quản lý jobs

1. **Login với FinTech:**
   - Email: `fintech@example.com`
   - Password: `Company@123`

2. **Vào "Việc làm":**
   - ✅ Chỉ thấy 2 jobs của FinTech
   - ✅ Khác với jobs của TechCorp

3. **Xem "Hồ sơ ứng tuyển":**
   - ✅ Chỉ thấy applications cho jobs của FinTech
   - ✅ Số liệu khác với TechCorp

### Scenario 3: Candidate nộp hồ sơ

1. **Login với Candidate:**
   - Email: `user@test.com` (hoặc đăng ký mới)
   - Password: `User@123`

2. **Vào "Tìm việc":**
   - ✅ Thấy TẤT CẢ jobs từ tất cả companies
   - ✅ Có thể filter, search

3. **Nộp hồ sơ:**
   - Nộp cho job của TechCorp
   - Nộp cho job của FinTech
   - Nộp cho job của Design Studio

4. **Xem "Hồ sơ của bạn":**
   - ✅ Thấy tất cả applications đã nộp
   - ✅ Thấy trạng thái từng application

### Scenario 4: Kiểm tra Data Isolation

1. **Tab 1: TechCorp**
   - Login: `techcorp@example.com`
   - Vào Applications
   - ✅ Chỉ thấy applications cho jobs của TechCorp

2. **Tab 2: FinTech**
   - Login: `fintech@example.com`
   - Vào Applications
   - ✅ Chỉ thấy applications cho jobs của FinTech
   - ✅ Khác hoàn toàn với TechCorp

3. **Tab 3: Candidate**
   - Login với candidate
   - Vào Applications
   - ✅ Thấy tất cả applications của mình
   - ✅ Bao gồm applications cho nhiều companies

---

## 📊 Kiểm Tra Số Liệu

### Mỗi Company có số liệu riêng:

**TechCorp:**
- Jobs: 2
- Applications: Chỉ applications cho 2 jobs này
- AI Score trung bình: Tính từ applications của TechCorp

**FinTech:**
- Jobs: 2
- Applications: Chỉ applications cho 2 jobs này
- AI Score trung bình: Tính từ applications của FinTech

**Design Studio:**
- Jobs: 1
- Applications: Chỉ applications cho 1 job này

### Dashboard của mỗi Company:

- **Tổng số jobs:** Chỉ jobs của company đó
- **Tổng số applications:** Chỉ applications cho jobs của company đó
- **AI Score trung bình:** Tính từ applications của company đó
- **Charts:** Dữ liệu riêng của company đó

---

## 🧪 Test Checklist

- [ ] Seed companies thành công
- [ ] Mỗi company có jobs riêng
- [ ] Login với TechCorp → Chỉ thấy jobs của TechCorp
- [ ] Login với FinTech → Chỉ thấy jobs của FinTech
- [ ] Candidate thấy tất cả jobs
- [ ] Candidate nộp hồ sơ cho nhiều companies
- [ ] TechCorp chỉ thấy applications cho jobs của mình
- [ ] FinTech chỉ thấy applications cho jobs của mình
- [ ] Dashboard mỗi company có số liệu riêng
- [ ] Data isolation hoạt động đúng

---

## 🔍 Kiểm Tra Data Isolation

### Test Query trong Django Shell:

```bash
python manage.py shell
```

```python
from accounts.models import User
from jobs.models import Job
from applications.models import Application

# Lấy TechCorp
techcorp = User.objects.get(email='techcorp@example.com')

# Jobs của TechCorp
techcorp_jobs = Job.objects.filter(created_by=techcorp)
print(f"TechCorp có {techcorp_jobs.count()} jobs")

# Applications cho jobs của TechCorp
techcorp_apps = Application.objects.filter(job__created_by=techcorp)
print(f"TechCorp có {techcorp_apps.count()} applications")

# Lấy FinTech
fintech = User.objects.get(email='fintech@example.com')

# Jobs của FinTech
fintech_jobs = Job.objects.filter(created_by=fintech)
print(f"FinTech có {fintech_jobs.count()} jobs")

# Applications cho jobs của FinTech
fintech_apps = Application.objects.filter(job__created_by=fintech)
print(f"FinTech có {fintech_apps.count()} applications")

# Verify: TechCorp không thấy apps của FinTech
assert techcorp_apps.filter(job__created_by=fintech).count() == 0
print("✅ Data isolation verified!")
```

---

## 🎯 Kết Quả Mong Đợi

Sau khi seed và test:

1. ✅ 8 companies với jobs khác nhau
2. ✅ Mỗi company chỉ thấy jobs và applications của mình
3. ✅ Candidates thấy tất cả jobs và có thể apply nhiều companies
4. ✅ Dashboard mỗi company có số liệu riêng
5. ✅ Data isolation hoạt động đúng

---

**Chúc bạn demo thành công với nhiều doanh nghiệp! 🚀**

