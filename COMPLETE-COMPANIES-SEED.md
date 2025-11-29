# 📋 Hướng Dẫn Tạo Dữ Liệu Companies Đầy Đủ

## 🎯 Yêu Cầu

Tạo companies với đầy đủ thông tin theo TẤT CẢ các ngành nghề trong job-categories.js:
- Kinh doanh/Bán hàng
- Marketing/PR/Quảng cáo
- Chăm sóc khách hàng/Vận hành
- Nhân sự/Hành chính/Pháp chế
- Công nghệ Thông tin
- Kế toán/Tài chính
- Sản xuất/Vận hành
- Lao động phổ thông

Mỗi company cần có:
- Email, username, password
- first_name, last_name, phone
- company_name (tên công ty)
- gender
- work_location_province, work_location_district
- Jobs (1-3 jobs) theo đúng ngành nghề

## 📝 Script Seed

File: `backend/seed_companies_full.py`

Chạy:
```bash
cd backend
python seed_companies_full.py
```

## 📊 Cấu Trúc Dữ Liệu

Mỗi company sẽ có:
- Thông tin công ty đầy đủ
- Jobs phù hợp với ngành nghề
- Địa điểm làm việc
- Mức lương phù hợp

## ✅ Checklist

- [ ] Tạo script seed_companies_full.py
- [ ] Tạo ít nhất 2-3 companies cho mỗi ngành nghề
- [ ] Mỗi company có 1-3 jobs
- [ ] Thông tin đầy đủ: company_name, location, phone, etc.
- [ ] Jobs có description và requirements chi tiết
- [ ] Chạy script và verify data

