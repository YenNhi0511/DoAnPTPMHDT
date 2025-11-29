# 📋 Hướng dẫn Setup Jobs và CVs mẫu

## 🎯 Tổng quan

Hướng dẫn này giúp bạn:
1. ✅ Seed jobs với JD chi tiết (10 jobs)
2. ✅ Tạo CVs mẫu để test (20 CVs)
3. ✅ Sử dụng tính năng AI screening

---

## 📝 1. Seed Jobs với JD chi tiết

### Cách 1: Chạy script trực tiếp

```bash
cd backend
python seed_jobs.py
```

### Cách 2: Chạy qua Django shell

```bash
cd backend
python manage.py shell < seed_jobs.py
```

### Kết quả

Sẽ tạo **10 jobs** với JD chi tiết:
1. Senior Full Stack Developer
2. Frontend Developer (React)
3. Backend Developer (Python/Django)
4. DevOps Engineer
5. Mobile Developer (React Native)
6. UI/UX Designer
7. Data Engineer
8. Product Manager
9. QA Engineer
10. Marketing Manager

Mỗi job có:
- ✅ Description chi tiết
- ✅ Requirements đầy đủ
- ✅ Salary range
- ✅ Location
- ✅ Experience years
- ✅ Employment type

---

## 📄 2. Tạo CVs mẫu

### Cách 1: Tự động tạo bằng Python script

**Bước 1:** Cài đặt dependencies
```bash
cd backend
pip install reportlab faker
```

**Bước 2:** Chạy script
```bash
python sample_cvs/generate_sample_cvs.py
```

**Kết quả:** Tạo 20 CVs PDF trong `backend/sample_cvs/`

### Cách 2: Tạo thủ công

1. Tạo CV bằng Word/Google Docs
2. Export thành PDF
3. Đặt tên: `CV_01_Name_JobTitle.pdf`
4. Lưu vào `backend/sample_cvs/`

### Format CV mẫu

Mỗi CV nên có:
- ✅ Tên, email, số điện thoại
- ✅ Mục tiêu nghề nghiệp
- ✅ Kinh nghiệm làm việc
- ✅ Kỹ năng
- ✅ Học vấn

---

## 🧪 3. Test với Jobs và CVs

### Test Flow

1. **Seed jobs:**
   ```bash
   python seed_jobs.py
   ```

2. **Tạo CVs mẫu:**
   ```bash
   python sample_cvs/generate_sample_cvs.py
   ```

3. **Chạy server:**
   ```bash
   # Terminal 1: Backend
   python manage.py runserver
   
   # Terminal 2: Frontend
   cd frontend
   npm start
   
   # Terminal 3: Celery (cho AI screening)
   celery -A recruitment_system worker -l info
   ```

4. **Test ứng tuyển:**
   - Login với tài khoản user
   - Vào trang Jobs
   - Chọn một job
   - Click "Ứng tuyển"
   - Upload CV từ `sample_cvs/`
   - Submit

5. **Test AI Screening:**
   - Login với tài khoản admin
   - Vào "Hồ sơ ứng tuyển"
   - Tìm application có status `PENDING`
   - Click icon 🧠 để sàng lọc AI
   - Xem kết quả AI score

---

## 📊 4. Cấu trúc thư mục

```
backend/
├── seed_jobs.py              # Script seed jobs
├── sample_cvs/                # Thư mục CVs mẫu
│   ├── README.md
│   ├── generate_sample_cvs.py
│   ├── CV_01_Name_Job.pdf
│   ├── CV_02_Name_Job.pdf
│   └── ...
└── applications/
    └── tasks.py              # AI screening task
```

---

## 🔧 5. Troubleshooting

### Vấn đề: Script seed jobs không chạy

**Giải pháp:**
```bash
# Đảm bảo đang ở đúng thư mục
cd backend

# Kiểm tra Django setup
python manage.py check

# Chạy lại
python seed_jobs.py
```

### Vấn đề: Không tạo được CVs PDF

**Giải pháp:**
```bash
# Cài đặt dependencies
pip install reportlab faker

# Chạy lại script
python sample_cvs/generate_sample_cvs.py
```

### Vấn đề: Jobs không hiển thị

**Giải pháp:**
1. Kiểm tra jobs đã được tạo:
   ```bash
   python manage.py shell
   >>> from jobs.models import Job
   >>> Job.objects.count()
   ```

2. Kiểm tra status của jobs (phải là `OPEN`)

3. Refresh frontend

---

## ✅ Checklist

- [ ] Đã seed 10 jobs với JD chi tiết
- [ ] Đã tạo 20 CVs mẫu
- [ ] Đã test upload CV
- [ ] Đã test AI screening
- [ ] Đã kiểm tra AI score hiển thị đúng

---

## 📚 Tài liệu liên quan

- [AI Screening Guide](./AI-SCREENING-GUIDE.md) - Hướng dẫn chi tiết về AI screening
- [Demo Guide](./DEMO-GUIDE.md) - Hướng dẫn demo hệ thống

---

**Chúc bạn test thành công! 🎉**

