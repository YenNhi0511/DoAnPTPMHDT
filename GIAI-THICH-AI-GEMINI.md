# GIẢI THÍCH VỀ AI GEMINI TRONG HỆ THỐNG

## 📋 TỔNG QUAN

**Google Gemini AI** được sử dụng trong hệ thống để **tự động sàng lọc và chấm điểm CV** của ứng viên, giúp nhà tuyển dụng tiết kiệm thời gian và đánh giá khách quan hơn.

---

## 🎯 AI GEMINI CÓ TÁC ĐỘNG GÌ TRONG HỆ THỐNG?

### 1. **Tự động sàng lọc CV (AI Screening)** ✅

**Khi nào chạy:**

- Tự động chạy khi ứng viên **nộp hồ sơ** (Application được tạo)
- Hoặc khi RECRUITER nhấn nút **"Sàng lọc CV"** thủ công

**Luồng hoạt động:**

```
Ứng viên nộp CV
    ↓
Application được tạo (status = PENDING)
    ↓
Signal trigger → Celery Worker
    ↓
1. Parse CV Task (trích xuất text từ PDF/DOCX)
    ↓
2. AI Screening Task (gọi Gemini API)
    ↓
3. Lưu kết quả vào Database:
   - ai_score (0-100)
   - ai_analysis (JSON với chi tiết)
    ↓
Application status = SCREENING
```

### 2. **Chấm điểm CV (0-100)** ✅

AI Gemini đánh giá CV và trả về:

- **Điểm số** (0-100): Mức độ phù hợp với vị trí
- **Điểm mạnh**: Danh sách các điểm mạnh của ứng viên
- **Điểm yếu**: Danh sách các điểm yếu cần cải thiện
- **Mức độ phù hợp**: Rất phù hợp / Phù hợp / Không phù hợp
- **Khuyến nghị**: Nên phỏng vấn / Nên xem xét / Không phù hợp
- **Tóm tắt**: Tóm tắt ngắn gọn về ứng viên

### 3. **Hỗ trợ RECRUITER lọc hồ sơ** ✅

RECRUITER có thể:

- Xem **ai_score** để sắp xếp hồ sơ theo điểm số
- Xem **ai_analysis** để hiểu rõ hơn về ứng viên
- Lọc hồ sơ theo điểm số (ví dụ: chỉ xem hồ sơ >= 70 điểm)
- Đọc **strengths** và **weaknesses** để quyết định có nên mời phỏng vấn không

### 4. **Tự động cập nhật trạng thái** ✅

- Khi AI screening hoàn thành, `application.status` tự động chuyển từ `PENDING` → `SCREENING`
- RECRUITER có thể dựa vào điểm số để quyết định bước tiếp theo

---

## 🔍 DỰA VÀO ĐÂU MÀ AI GEMINI ĐƯA RA ĐIỂM ĐÁNH GIÁ?

### **Input cho AI Gemini:**

#### 1. **Thông tin Vị trí Tuyển dụng (Job Information)** 📋

AI nhận được thông tin chi tiết về vị trí cần tuyển:

```python
THÔNG TIN VỊ TRÍ:
- Tiêu đề: {job.title}
  Ví dụ: "Trưởng phòng Kinh doanh"

- Mô tả: {job.description[:500]}
  Ví dụ: "Chịu trách nhiệm quản lý đội ngũ kinh doanh, phát triển thị trường..."

- Yêu cầu: {job.requirements[:1000]}
  Ví dụ: "- Tốt nghiệp đại học chuyên ngành Kinh tế/Quản trị kinh doanh
          - Có ít nhất 5 năm kinh nghiệm trong lĩnh vực kinh doanh
          - Thành thạo tiếng Anh
          - Kỹ năng quản lý đội ngũ..."

- Kinh nghiệm yêu cầu: {job.experience_years} năm
  Ví dụ: "5 năm"
```

#### 2. **Nội dung CV của Ứng viên** 📄

AI nhận được text đã được trích xuất từ CV (PDF/DOCX):

```python
NỘI DUNG CV:
{cv_text[:4000]}  # Tối đa 4000 ký tự đầu tiên

Ví dụ CV text:
"NGUYỄN VĂN A
Email: nguyenvana@email.com
Số điện thoại: 0123456789

KINH NGHIỆM LÀM VIỆC:
- 2018-2023: Trưởng phòng Kinh doanh tại Công ty ABC
  + Quản lý đội ngũ 10 nhân viên
  + Tăng doanh thu 30% mỗi năm
  + Phát triển thị trường miền Nam

HỌC VẤN:
- 2010-2014: Đại học Kinh tế TP.HCM
  Chuyên ngành: Quản trị Kinh doanh

KỸ NĂNG:
- Quản lý đội ngũ
- Giao tiếp tiếng Anh tốt
- Thành thạo Excel, PowerPoint
..."
```

### **Prompt gửi cho AI Gemini:**

```python
prompt = f"""Bạn là chuyên gia tuyển dụng. Hãy đánh giá CV của ứng viên cho vị trí "{job.title}".

THÔNG TIN VỊ TRÍ:
- Tiêu đề: {job.title}
- Mô tả: {job.description[:500]}
- Yêu cầu: {job.requirements[:1000]}
- Kinh nghiệm yêu cầu: {job.experience_years or 'Không yêu cầu'} năm

NỘI DUNG CV:
{cv_text[:4000]}

Hãy đánh giá CV và trả về kết quả theo format JSON:
{{
    "score": <số điểm từ 0-100>,
    "strengths": ["điểm mạnh 1", "điểm mạnh 2", ...],
    "weaknesses": ["điểm yếu 1", "điểm yếu 2", ...],
    "match_level": "<Rất phù hợp/Phù hợp/Không phù hợp>",
    "recommendation": "<Nên phỏng vấn/Nên xem xét/Không phù hợp>",
    "summary": "<tóm tắt ngắn gọn về ứng viên>"
}}

Chỉ trả về JSON, không có text thêm."""
```

### **Cách AI Gemini đánh giá:**

AI Gemini sử dụng **kiến thức đã được huấn luyện** (trained on vast amounts of data) để:

1. **So sánh CV với yêu cầu công việc:**

   - Kiểm tra xem ứng viên có đáp ứng các yêu cầu không
   - Đánh giá mức độ phù hợp giữa kinh nghiệm và yêu cầu
   - Xem xét kỹ năng có liên quan đến công việc không

2. **Phân tích chất lượng CV:**

   - Cấu trúc và trình bày CV
   - Tính logic và nhất quán của thông tin
   - Mức độ chi tiết và chuyên nghiệp

3. **Đánh giá kinh nghiệm:**

   - Số năm kinh nghiệm so với yêu cầu
   - Chất lượng và tính liên quan của kinh nghiệm
   - Thành tích và đóng góp trong các vị trí trước

4. **Đánh giá kỹ năng:**

   - Kỹ năng kỹ thuật (hard skills)
   - Kỹ năng mềm (soft skills)
   - Chứng chỉ và bằng cấp

5. **Tổng hợp và đưa ra điểm số:**
   - Tổng hợp tất cả các yếu tố trên
   - Đưa ra điểm số từ 0-100
   - Liệt kê điểm mạnh và điểm yếu
   - Đưa ra khuyến nghị

---

## 📊 VÍ DỤ CỤ THỂ

### **Input:**

**Job:**

- Title: "Trưởng phòng Kinh doanh"
- Requirements: "Tốt nghiệp đại học, 5 năm kinh nghiệm, quản lý đội ngũ"
- Experience: 5 năm

**CV:**

```
NGUYỄN VĂN A
Kinh nghiệm: 6 năm làm Trưởng phòng Kinh doanh
Học vấn: Đại học Kinh tế
Kỹ năng: Quản lý đội ngũ, Giao tiếp tốt
```

### **Output từ AI Gemini:**

```json
{
  "score": 85,
  "strengths": [
    "Có kinh nghiệm phù hợp (6 năm > 5 năm yêu cầu)",
    "Đã từng làm vị trí tương tự (Trưởng phòng Kinh doanh)",
    "Có kỹ năng quản lý đội ngũ",
    "Học vấn phù hợp (Đại học Kinh tế)"
  ],
  "weaknesses": [
    "CV thiếu thông tin chi tiết về thành tích",
    "Chưa thấy thông tin về chứng chỉ hoặc khóa học bổ sung"
  ],
  "match_level": "Rất phù hợp",
  "recommendation": "Nên phỏng vấn",
  "summary": "Ứng viên có kinh nghiệm và kỹ năng phù hợp với vị trí. Nên mời phỏng vấn để đánh giá chi tiết hơn."
}
```

### **Kết quả trong Database:**

```python
application.ai_score = 85.0
application.ai_analysis = {
    "extracted_cv_text": "...",
    "ai_response": "{...}",
    "parsed_response": {
        "score": 85,
        "strengths": [...],
        "weaknesses": [...],
        "match_level": "Rất phù hợp",
        "recommendation": "Nên phỏng vấn",
        "summary": "..."
    },
    "method": "gemini-1.5-pro"
}
application.status = "SCREENING"
```

---

## 🔄 LUỒNG HOẠT ĐỘNG CHI TIẾT

### **Bước 1: Ứng viên nộp CV**

```
Candidate → Frontend: Upload CV file (PDF/DOCX)
    ↓
Frontend → Backend API: POST /api/jobs/{id}/apply/
    ↓
Backend: Tạo Application object
    - cv_file = uploaded file
    - status = PENDING
    - ai_score = null
    - ai_analysis = null
    ↓
Signal trigger: application_created()
```

### **Bước 2: Parse CV (Trích xuất text)**

```
Celery Worker: parse_cv_task.delay(application_id)
    ↓
Đọc CV file từ storage
    ↓
Nếu PDF: Dùng PyPDF2 để extract text
Nếu DOCX: Dùng mammoth để extract text
    ↓
Lưu text vào: application.ai_analysis['extracted_cv_text']
    ↓
application.save()
```

### **Bước 3: AI Screening (Gọi Gemini API)**

```
Celery Worker: screen_cv_task.delay(application_id)
    ↓
Lấy extracted_cv_text từ ai_analysis
    ↓
Lấy thông tin Job (title, description, requirements, experience_years)
    ↓
Tạo prompt với:
    - Thông tin vị trí
    - Nội dung CV
    - Yêu cầu format JSON
    ↓
Gọi Gemini API:
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(prompt)
    ↓
Parse JSON response
    ↓
Lưu kết quả:
    - application.ai_score = response_json['score']
    - application.ai_analysis['parsed_response'] = response_json
    - application.status = SCREENING
    ↓
application.save()
```

### **Bước 4: RECRUITER xem kết quả**

```
RECRUITER → Frontend: Xem danh sách Applications
    ↓
Frontend → Backend API: GET /api/applications/
    ↓
Backend: Trả về applications với ai_score và ai_analysis
    ↓
Frontend: Hiển thị:
    - Điểm số (ai_score)
    - Điểm mạnh/Điểm yếu
    - Khuyến nghị
    - Tóm tắt
    ↓
RECRUITER quyết định:
    - Nếu điểm cao → Mời phỏng vấn
    - Nếu điểm thấp → Từ chối hoặc xem xét thêm
```

---

## 🛡️ FALLBACK SCORING (Khi không có Gemini API)

Nếu **không có GEMINI_API_KEY** hoặc **API lỗi**, hệ thống sử dụng **fallback scoring** (đánh giá cơ bản):

### **Logic Fallback Scoring:**

```python
def calculate_fallback_score(cv_text, job):
    score = 50.0  # Điểm cơ bản

    # 1. Kiểm tra từ khóa trong job title
    # Nếu CV chứa các từ trong job title → +20 điểm (tối đa)

    # 2. Kiểm tra từ khóa về kinh nghiệm
    # Nếu CV chứa: "kinh nghiệm", "experience", "năm", "year" → +15 điểm (tối đa)

    # 3. Kiểm tra từ khóa về kỹ năng
    # Nếu CV chứa: "kỹ năng", "skill", "thành thạo" → +15 điểm (tối đa)

    # Tổng điểm: 50 + 20 + 15 + 15 = 100 (tối đa)
    return min(100, max(0, score))
```

**Ví dụ:**

- CV có từ "Trưởng phòng" và job title là "Trưởng phòng Kinh doanh" → +20 điểm
- CV có từ "kinh nghiệm 5 năm" → +15 điểm
- CV có từ "kỹ năng quản lý" → +15 điểm
- **Tổng: 50 + 20 + 15 + 15 = 100 điểm**

---

## 📈 TÁC ĐỘNG CỦA AI SCORE TRONG HỆ THỐNG

### 1. **Lọc và Sắp xếp Hồ sơ** ✅

RECRUITER có thể:

- Sắp xếp hồ sơ theo `ai_score` (từ cao xuống thấp)
- Lọc chỉ xem hồ sơ có điểm >= 70
- Xem hồ sơ có điểm cao nhất trước

### 2. **Hỗ trợ Quyết định** ✅

- **Điểm >= 80**: Rất phù hợp → Nên mời phỏng vấn ngay
- **Điểm 60-79**: Phù hợp → Nên xem xét, có thể mời phỏng vấn
- **Điểm < 60**: Không phù hợp → Có thể từ chối hoặc xem xét thêm

### 3. **Thống kê và Báo cáo** ✅

- Tính điểm trung bình của tất cả hồ sơ
- Xem phân bố điểm số
- Đánh giá chất lượng ứng viên

---

## 🔧 CẤU HÌNH AI GEMINI

### **Yêu cầu:**

1. **API Key:**

   - Lấy từ [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Thêm vào `.env`: `GEMINI_API_KEY=your_api_key_here`

2. **Model sử dụng:**

   - `gemini-1.5-pro` (model mới nhất, hiệu năng cao)

3. **Package:**
   - `google-generativeai>=0.3` (đã có trong `requirements.txt`)

### **Cách hoạt động:**

```python
import google.generativeai as genai

# Configure API key
genai.configure(api_key=GEMINI_API_KEY)

# Create model
model = genai.GenerativeModel('gemini-1.5-pro')

# Generate content
response = model.generate_content(prompt)
```

---

## 📝 TÓM TẮT

### **AI Gemini đánh giá dựa trên:**

1. ✅ **Thông tin Vị trí Tuyển dụng:**

   - Tiêu đề công việc
   - Mô tả công việc
   - Yêu cầu (requirements)
   - Số năm kinh nghiệm yêu cầu

2. ✅ **Nội dung CV của Ứng viên:**

   - Text đã được trích xuất từ CV (PDF/DOCX)
   - Thông tin về kinh nghiệm, học vấn, kỹ năng

3. ✅ **Kiến thức AI đã được huấn luyện:**
   - Hiểu biết về thị trường lao động
   - Kinh nghiệm đánh giá CV từ hàng triệu CV
   - Khả năng so sánh và đánh giá

### **AI Gemini trả về:**

- **Điểm số (0-100)**: Mức độ phù hợp
- **Điểm mạnh**: Danh sách điểm mạnh
- **Điểm yếu**: Danh sách điểm yếu
- **Mức độ phù hợp**: Rất phù hợp / Phù hợp / Không phù hợp
- **Khuyến nghị**: Nên phỏng vấn / Nên xem xét / Không phù hợp
- **Tóm tắt**: Tóm tắt về ứng viên

### **Tác động trong hệ thống:**

1. ✅ Tự động sàng lọc CV khi ứng viên nộp hồ sơ
2. ✅ Hỗ trợ RECRUITER lọc và sắp xếp hồ sơ
3. ✅ Cung cấp thông tin chi tiết để quyết định
4. ✅ Tiết kiệm thời gian cho nhà tuyển dụng
5. ✅ Đánh giá khách quan, không thiên vị

---

**Ngày tạo:** 2025-01-XX  
**Phiên bản:** Hiện tại  
**Model sử dụng:** Gemini 1.5 Pro
