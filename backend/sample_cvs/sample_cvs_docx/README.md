# 10 CV MẪU DẠNG DOCX ĐỂ TEST

## 📋 TỔNG QUAN

Thư mục này chứa **10 CV mẫu dạng DOCX** cho các lĩnh vực khác nhau trong hệ thống, được tạo tự động để test chức năng upload và AI screening.

---

## 📁 DANH SÁCH CV ĐÃ TẠO

| STT | Tên File | Vị trí | Nhóm nghề |
|-----|---------|-------|-----------|
| 1 | `CV_01_*_Frontend_Developer.docx` | Frontend Developer | Công nghệ Thông tin |
| 2 | `CV_02_*_Backend_Developer.docx` | Backend Developer | Công nghệ Thông tin |
| 3 | `CV_03_*_Digital_Marketing_Specialist.docx` | Digital Marketing Specialist | Marketing/PR/Quảng cáo |
| 4 | `CV_04_*_Kế_toán_tổng_hợp.docx` | Kế toán tổng hợp | Kế toán/Tài chính |
| 5 | `CV_05_*_HR_Manager.docx` | HR Manager | Nhân sự/Hành chính/Pháp chế |
| 6 | `CV_06_*_Sales_ITPhần_mềm.docx` | Sales IT/Phần mềm | Kinh doanh/Bán hàng |
| 7 | `CV_07_*_Data_Analyst.docx` | Data Analyst | Công nghệ Thông tin |
| 8 | `CV_08_*_Brand_Manager.docx` | Brand Manager | Marketing/PR/Quảng cáo |
| 9 | `CV_09_*_Operations_Manager.docx` | Operations Manager | Chăm sóc khách hàng/Vận hành |
| 10 | `CV_10_*_Financial_Analyst.docx` | Financial Analyst | Kế toán/Tài chính |

---

## 📝 NỘI DUNG MỖI CV

Mỗi CV DOCX bao gồm:

1. **Thông tin cá nhân:**
   - Họ tên (tự động tạo)
   - Email
   - Số điện thoại
   - Địa chỉ

2. **Mục tiêu nghề nghiệp:**
   - Phù hợp với vị trí và lĩnh vực

3. **Kinh nghiệm làm việc:**
   - 2-3 công việc trước đó
   - Mô tả công việc chi tiết
   - Phù hợp với vị trí ứng tuyển

4. **Học vấn:**
   - Chuyên ngành phù hợp với lĩnh vực
   - Trường đại học
   - Năm tốt nghiệp

5. **Kỹ năng:**
   - Kỹ năng chuyên môn (5-7 kỹ năng)
   - Kỹ năng mềm

6. **Chứng chỉ:**
   - 1-2 chứng chỉ phù hợp với lĩnh vực

7. **Ngôn ngữ:**
   - Tiếng Việt: Bản ngữ
   - Tiếng Anh: Khá/Tốt/Rất tốt

---

## 🎯 CÁCH SỬ DỤNG ĐỂ TEST

### 1. **Test Upload CV:**
- Đăng nhập với tài khoản CANDIDATE
- Vào trang "Tìm việc làm" (`/careers`)
- Chọn một job phù hợp với CV
- Click "Ứng tuyển"
- Upload một trong các CV DOCX này

### 2. **Test AI Screening:**
- Sau khi upload CV, hệ thống sẽ tự động:
  - Parse CV (trích xuất text từ DOCX)
  - Gọi Gemini API để chấm điểm
  - Lưu `ai_score` và `ai_analysis`
- RECRUITER có thể xem điểm số và phân tích trong trang "Hồ sơ ứng tuyển"

### 3. **Test với các lĩnh vực khác nhau:**
- Upload CV Frontend Developer cho job "Frontend Developer"
- Upload CV Backend Developer cho job "Backend Developer"
- Upload CV Digital Marketing cho job "Digital Marketing Manager"
- ... và tương tự cho các lĩnh vực khác

---

## 🔧 TẠO LẠI CV (Nếu cần)

Nếu muốn tạo lại CV với thông tin mới:

```bash
cd backend/sample_cvs
python generate_10_cvs_docx.py
```

**Yêu cầu:**
- Python 3.7+
- `python-docx`: `pip install python-docx`
- `faker`: `pip install faker`

---

## 📊 THÔNG TIN CHI TIẾT TỪNG CV

### 1. Frontend Developer
- **Kỹ năng:** React, Vue.js, TypeScript, HTML/CSS, JavaScript, Redux, Next.js
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** AWS Certified, Google Cloud, Microsoft Azure

### 2. Backend Developer
- **Kỹ năng:** Python, Django, Node.js, PostgreSQL, RESTful API, MongoDB, Redis
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** AWS Certified, Google Cloud, Microsoft Azure

### 3. Digital Marketing Specialist
- **Kỹ năng:** SEO/SEM, Google Ads, Facebook Ads, Content Marketing, Analytics, Social Media
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** Google Ads Certification, Facebook Blueprint, HubSpot

### 4. Kế toán tổng hợp
- **Kỹ năng:** Kế toán tổng hợp, Excel nâng cao, Phần mềm kế toán, Báo cáo tài chính, Khai báo thuế
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** Chứng chỉ Kế toán viên, ACCA, CPA

### 5. HR Manager
- **Kỹ năng:** Tuyển dụng, Quản lý nhân sự, Đào tạo, HRIS, Chính sách nhân sự, Đánh giá hiệu suất
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** SHRM Certified Professional, HRCI PHR

### 6. Sales IT/Phần mềm
- **Kỹ năng:** Bán hàng B2B, Tư vấn giải pháp, CRM, Cloud Computing, Đàm phán, Quản lý khách hàng
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** Sales Certification, Cloud Certification

### 7. Data Analyst
- **Kỹ năng:** SQL, Python, Tableau, Excel, Power BI, Data Visualization, Statistics
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** Data Analytics Certification, Tableau Certification

### 8. Brand Manager
- **Kỹ năng:** Brand Strategy, Market Research, Campaign Management, Brand Positioning, Marketing Mix
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** Brand Management Certification, Marketing Certification

### 9. Operations Manager
- **Kỹ năng:** Operations Management, Process Optimization, Team Leadership, Supply Chain, Quality Control
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** Operations Management Certification, Lean Six Sigma

### 10. Financial Analyst
- **Kỹ năng:** Phân tích tài chính, Financial Modeling, Excel, Forecasting, Budgeting, Risk Analysis
- **Kinh nghiệm:** 2-6 năm
- **Chứng chỉ:** Financial Analyst Certification, CFA

---

## ✅ ĐÃ KIỂM TRA

- ✅ Tất cả 10 CV đã được tạo thành công
- ✅ Format DOCX đúng chuẩn
- ✅ Nội dung phù hợp với từng lĩnh vực
- ✅ Có đầy đủ thông tin: Thông tin cá nhân, Kinh nghiệm, Học vấn, Kỹ năng, Chứng chỉ
- ✅ Sẵn sàng để test upload và AI screening

---

**Ngày tạo:** 2025-01-XX  
**Script:** `generate_10_cvs_docx.py`  
**Số lượng:** 10 CV DOCX

