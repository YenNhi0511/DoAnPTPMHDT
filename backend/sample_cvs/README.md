# Sample CVs

Thư mục này chứa các CV mẫu (PDF) để test hệ thống.

## Scripts

### 1. `generate_sample_cvs.py`
Tạo 20 CV mẫu cơ bản cho các vị trí IT phổ biến.

**Chạy:**
```bash
cd backend/sample_cvs
python generate_sample_cvs.py
```

**Tạo CV cho:**
- Full Stack Developer
- Frontend Developer
- Backend Developer
- DevOps Engineer
- Mobile Developer
- UI/UX Designer
- Data Engineer
- Product Manager
- QA Engineer
- Marketing Manager

### 2. `generate_all_cvs.py` ⭐ MỚI
Tạo CV mẫu cho **TẤT CẢ** các ngành nghề trong hệ thống (30+ CV).

**Chạy:**
```bash
cd backend/sample_cvs
python generate_all_cvs.py
```

**Tạo CV cho các ngành nghề:**
- **Kinh doanh/Bán hàng**: Sales Logistics, Sales Bất động sản, Sales IT
- **Marketing/PR/Quảng cáo**: SEO/SEM Specialist, Social Media Marketing, Brand Manager, Graphic Designer
- **Chăm sóc khách hàng/Vận hành**: Customer Support, Operations Manager
- **Nhân sự/Hành chính/Pháp chế**: HR Manager, Recruiter, Legal Advisor
- **Công nghệ Thông tin**: Frontend/Backend/Full Stack/Mobile Developer, DevOps, Data Engineer/Analyst/Scientist, QA Engineer, Product/Project Manager
- **Kế toán/Tài chính**: Kế toán tổng hợp, Kế toán thuế, Financial Analyst, Auditor
- **Sản xuất/Vận hành**: Production Manager, Quality Manager

## Yêu cầu

```bash
pip install reportlab faker
```

## Cấu trúc CV

Mỗi CV bao gồm:
- **Thông tin cá nhân**: Tên, email, số điện thoại
- **Mục tiêu nghề nghiệp**: Được tùy chỉnh theo ngành nghề
- **Kinh nghiệm làm việc**: Chi tiết theo từng ngành nghề
- **Kỹ năng chuyên môn**: Kỹ năng đặc thù cho từng vị trí
- **Học vấn**: Phù hợp với ngành nghề
- **Chứng chỉ**: (nếu có, cho IT và Kế toán/Tài chính)

## Vị trí lưu file

CVs được lưu tại: `backend/sample_cvs/sample_cvs/`

## Sử dụng CVs

CVs này có thể được sử dụng để:
1. Test chức năng upload CV khi ứng tuyển
2. Test AI screening với các ngành nghề khác nhau
3. Demo hệ thống với dữ liệu đa dạng

## Lưu ý

- Tất cả thông tin trong CV là dữ liệu giả (fake data)
- Tên file được sanitize để tránh lỗi với ký tự đặc biệt
- Mỗi CV có thông tin phù hợp với vị trí ứng tuyển
