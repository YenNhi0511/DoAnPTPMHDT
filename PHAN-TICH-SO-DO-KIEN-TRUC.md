# PHÂN TÍCH SƠ ĐỒ KIẾN TRÚC TỔNG QUAN (BFD)

## 📋 TỔNG QUAN

Sơ đồ kiến trúc tổng quan (Business Function Diagram - BFD) mô tả hệ thống tuyển dụng với các thành phần chính và luồng tương tác. Dưới đây là phân tích chi tiết về tính chính xác của sơ đồ so với codebase thực tế.

---

## ✅ CÁC PHẦN ĐÚNG

### 1. **Client / Actor Layer** ⚠️

**Sơ đồ mô tả:**

- Nhà tuyển dụng (Recruiter): Lên lịch PV, Quyết định Offer, Lọc hồ sơ, CRUD Job
- Người phỏng vấn (Interviewer): Đăng nhập/Quyền ❌ **THIẾU TÁC ĐỘNG**
- Ứng viên (Candidate): Nộp CV, Xem Job
- Admin: Quản lý User, Xem thống kê

**Thực tế trong code:**

- ✅ User model có đầy đủ 4 roles: `ADMIN`, `RECRUITER`, `INTERVIEWER`, `CANDIDATE`
- ✅ Các chức năng được phân quyền đúng theo role
- ✅ Recruiter có thể: CRUD jobs, lọc applications, lên lịch interview, quyết định offer
- ✅ Candidate có thể: xem jobs, nộp CV
- ✅ Admin có thể: quản lý users, xem thống kê
- ❌ **THIẾU**: INTERVIEWER có nhiều tác động quan trọng:
  - ✅ Xem danh sách interviews được assign trong panel
  - ✅ Tham gia hội đồng phỏng vấn (InterviewPanel)
  - ✅ Chấm điểm ứng viên (score 0-100)
  - ✅ Đưa feedback cho ứng viên
  - ✅ Tác động đến kết quả phỏng vấn (PASS/FAIL) - tự động khi tất cả thành viên chấm điểm
  - ✅ Tác động đến việc tự động tạo OFFER (khi điểm trung bình >= 70)

### 2. **Backend Core - Các Module Chính** ✅

#### 2.1. Quản lý Tin tuyển dụng (Job Management) ✅

- **Sơ đồ:** Nhận "CRUD Job" từ Recruiter, cung cấp "Xem Job" cho Candidate
- **Thực tế:** `backend/jobs/views.py` - `JobViewSet` với đầy đủ CRUD operations

#### 2.2. Quản lý Hồ sơ ứng tuyển (Application Management) ✅

- **Sơ đồ:** Nhận "Lọc hồ sơ" từ Recruiter, "Nộp CV" từ Candidate, kích hoạt async tasks
- **Thực tế:** `backend/applications/views.py` - `ApplicationViewSet` với filtering, CV upload, và signals trigger Celery tasks

#### 2.3. Quản lý Phỏng vấn (Interview Management) ✅

- **Sơ đồ:** Nhận "Lên lịch PV" từ Recruiter, gửi email
- **Thực tế:** `backend/applications/views.py` - `InterviewViewSet` với scheduling và email sending

#### 2.4. Kết quả & Offer (Result & Offer) ✅

- **Sơ đồ:** Nhận "Quyết định Offer" từ Recruiter, tạo PDF
- **Thực tế:** `backend/applications/views.py` - `RecruitmentResultViewSet` với offer generation

#### 2.5. Thông báo & Email (Notifications) ✅

- **Sơ đồ:** Module nội bộ cho notifications
- **Thực tế:** `backend/notifications/` app với `Notification` model và `NotificationViewSet`

#### 2.6. Báo cáo & Phân tích (Reports & Analytics) ⚠️

- **Sơ đồ:** Cung cấp "Xem thống kê" cho Admin
- **Thực tế:** Không có app riêng, nhưng có `stats` action trong `JobViewSet` (`backend/jobs/views.py`) cung cấp đầy đủ thống kê

#### 2.7. Người dùng & Xác thực (User & Auth) ✅

- **Sơ đồ:** Nhận "Đăng nhập/Quyền" từ Interviewer, "Quản lý User" từ Admin
- **Thực tế:** `backend/accounts/views.py` - `UserViewSet` với authentication và user management

### 3. **Hệ thống Tác vụ Nền (Celery Worker)** ✅

#### 3.1. Parse CV Task ✅

- **Sơ đồ:** Được kích hoạt từ Application Management, lưu file vào S3/Storage
- **Thực tế:** `backend/applications/tasks.py` - `parse_cv_task()` parse PDF/DOCX và lưu vào local media storage

#### 3.2. AI Screening Task ✅

- **Sơ đồ:** Nhận chuỗi tác vụ từ Parse CV, gọi Gemini API, lưu ai_score vào DB
- **Thực tế:** `backend/applications/tasks.py` - `screen_cv_task()` sử dụng Gemini API để chấm điểm CV

#### 3.3. Generate Offer PDF ✅

- **Sơ đồ:** Được kích hoạt từ Result & Offer, gửi offer đến Send Email Task
- **Thực tế:** `backend/applications/tasks.py` - `generate_offer_task()` tạo PDF offer letter

#### 3.4. Send Email Task ⚠️

- **Sơ đồ:** Nhận từ Generate Offer PDF và Interview Management, gửi email qua SMTP
- **Thực tế:** Email được gửi **trực tiếp trong views.py** (không qua Celery task riêng), sử dụng Django's `EmailMultiAlternatives`

### 4. **Database** ✅

- **Sơ đồ:** PostgreSQL Database
- **Thực tế:** ✅ Sử dụng PostgreSQL (Neon database)

### 5. **Dịch vụ Bên ngoài (External Services)** ⚠️

#### 5.1. SMTP Server (Email) ✅

- **Sơ đồ:** Nhận requests từ Send Email Task
- **Thực tế:** ✅ Email được gửi qua SMTP (cấu hình trong `settings.py`)

#### 5.2. Gemini API (AI Analysis) ✅

- **Sơ đồ:** Nhận "Gọi API chấm điểm" từ AI Screening Task
- **Thực tế:** ✅ Sử dụng Google Gemini API (`gemini-1.5-pro`) trong `screen_cv_task()`

#### 5.3. S3 / Storage (Media Files) ⚠️

- **Sơ đồ:** Nhận "Lưu file" từ Parse CV Task
- **Thực tế:** ⚠️ Hiện tại sử dụng **local media storage** (Django `MEDIA_ROOT`), không phải S3. File được lưu trong `backend/media/cvs/` và `backend/media/offer_letters/`

---

## ⚠️ CÁC PHẦN CẦN CẬP NHẬT

### 1. **Thiếu Module: Quản lý Hội đồng Phỏng vấn (Interview Panel Management)** ❌

**Vấn đề:**

- Sơ đồ không đề cập đến chức năng quản lý hội đồng phỏng vấn
- Đây là một chức năng quan trọng đã được implement trong hệ thống

**Thực tế trong code:**

- ✅ `InterviewPanel` model trong `backend/applications/models.py`
- ✅ `InterviewPanelViewSet` trong `backend/applications/views.py`
- ✅ Frontend có trang "Hội đồng tuyển dụng" (`InterviewPanels.jsx`)
- ✅ Hệ thống tự động tính điểm trung bình từ các thành viên hội đồng
- ✅ Tự động cập nhật kết quả phỏng vấn (PASS/FAIL) dựa trên điểm trung bình

**Đề xuất cập nhật sơ đồ:**

- Thêm module **"8. Quản lý Hội đồng Phỏng vấn"** trong Backend Core
- Kết nối với:
  - Interview Management (để tạo panel cho interview)
  - User & Auth (để lấy danh sách interviewers)
  - Database (để lưu panel members, scores, feedback)

### 1.1. **Thiếu Tác động của INTERVIEWER** ❌ **QUAN TRỌNG**

**Vấn đề:**

- Sơ đồ chỉ mô tả INTERVIEWER tương tác với "7. User & Auth" cho "Đăng nhập/Quyền"
- **THIẾU HOÀN TOÀN** các tác động quan trọng của INTERVIEWER đến hệ thống

**Thực tế trong code - INTERVIEWER có các tác động:**

1. ✅ **Xem danh sách interviews** được assign trong panel (`InterviewViewSet.get_queryset()` - filter `panels__interviewer=user`)
2. ✅ **Tham gia hội đồng phỏng vấn** (`InterviewPanelViewSet` - INTERVIEWER có thể xem và cập nhật panels của mình)
3. ✅ **Chấm điểm ứng viên** (`InterviewPanelViewSet.perform_update()` - INTERVIEWER cập nhật `score` và `feedback`)
4. ✅ **Tác động đến kết quả phỏng vấn**:
   - Khi tất cả thành viên hội đồng đã chấm điểm
   - Hệ thống tự động tính điểm trung bình (có trọng số: LEAD=1.5, MEMBER=1.0)
   - Tự động cập nhật `interview.result` = PASS (nếu >= 70) hoặc FAIL (nếu < 70)
5. ✅ **Tác động đến việc tự động tạo OFFER**:
   - Khi điểm trung bình >= 70 và interview.result = PASS
   - Hệ thống tự động tạo `RecruitmentResult` với `final_decision = OFFER`
   - Tự động cập nhật `application.status` = OFFER
   - Tự động gửi email và notification cho ứng viên

**Luồng tác động của INTERVIEWER:**

```
INTERVIEWER
    ↓
    Đăng nhập (User & Auth)
    ↓
    Xem interviews được assign (Interview Management)
    ↓
    Tham gia phỏng vấn (Interview Panel Management)
    ↓
    Chấm điểm & Feedback (Interview Panel Management)
    ↓
    [Tự động] Tính điểm trung bình (Interview Panel Management)
    ↓
    [Tự động] Cập nhật kết quả phỏng vấn PASS/FAIL (Interview Management)
    ↓
    [Tự động] Tạo OFFER nếu PASS (Result & Offer)
    ↓
    [Tự động] Gửi email & notification (Notifications)
```

**Đề xuất cập nhật sơ đồ:**

- **Thêm các tương tác của INTERVIEWER:**
  - INTERVIEWER → "3. Quản lý Phỏng vấn": "Xem interviews được assign"
  - INTERVIEWER → "8. Quản lý Hội đồng Phỏng vấn": "Chấm điểm & Feedback"
  - INTERVIEWER → Database: "Lưu điểm & Feedback"
- **Thêm luồng tự động:**
  - "8. Quản lý Hội đồng Phỏng vấn" → "3. Quản lý Phỏng vấn": "Cập nhật kết quả PASS/FAIL"
  - "3. Quản lý Phỏng vấn" → "4. Kết quả & Offer": "Tự động tạo OFFER (nếu PASS)"
  - "4. Kết quả & Offer" → "5. Thông báo & Email": "Gửi email & notification"

### 2. **Send Email Task không phải Celery Task riêng** ⚠️

**Vấn đề:**

- Sơ đồ mô tả "Send Email Task" như một Celery task riêng
- Thực tế email được gửi trực tiếp trong views.py (synchronous)

**Thực tế trong code:**

- Email được gửi trực tiếp trong:
  - `InterviewViewSet.send_result_email()` - Gửi email kết quả phỏng vấn
  - `RecruitmentResultViewSet.send_email()` - Gửi email kết quả tuyển dụng
  - `InterviewViewSet.perform_create()` - Gửi email mời phỏng vấn
  - Sử dụng Django's `EmailMultiAlternatives` (synchronous)

**Đề xuất:**

- **Option 1:** Giữ nguyên sơ đồ nhưng thêm ghi chú rằng email được gửi trực tiếp (không qua Celery)
- **Option 2:** Cập nhật sơ đồ để hiển thị email được gửi trực tiếp từ Backend Core, không qua Celery Worker

### 3. **Storage không phải S3** ⚠️

**Vấn đề:**

- Sơ đồ mô tả sử dụng "S3 / Storage" cho media files
- Thực tế sử dụng local storage

**Thực tế:**

- File được lưu trong `backend/media/` (local filesystem)
- Có thể nâng cấp lên S3 trong tương lai

**Đề xuất:**

- Cập nhật sơ đồ thành "Local Storage / Media Files" hoặc "Storage (Media Files)" (không chỉ định S3)

### 4. **Reports & Analytics không phải module riêng** ⚠️

**Vấn đề:**

- Sơ đồ mô tả "Báo cáo & Phân tích" như một module riêng
- Thực tế chỉ là một action trong `JobViewSet`

**Thực tế:**

- `backend/jobs/views.py` - `JobViewSet.stats()` cung cấp đầy đủ thống kê:
  - Total jobs, applications, interviews
  - Status distribution
  - Monthly trends
  - Conversion rates
  - AI scores

**Đề xuất:**

- Giữ nguyên sơ đồ vì chức năng vẫn tồn tại, chỉ khác về cách tổ chức code

---

## 📊 BẢNG TỔNG HỢP

| Thành phần                 | Sơ đồ            | Thực tế                   | Trạng thái                                   |
| -------------------------- | ---------------- | ------------------------- | -------------------------------------------- |
| **Actors**                 | 4 roles          | 4 roles                   | ⚠️ Đúng nhưng thiếu tác động của INTERVIEWER |
| **Job Management**         | Module riêng     | `jobs/views.py`           | ✅ Đúng                                      |
| **Application Management** | Module riêng     | `applications/views.py`   | ✅ Đúng                                      |
| **Interview Management**   | Module riêng     | `applications/views.py`   | ✅ Đúng                                      |
| **Result & Offer**         | Module riêng     | `applications/views.py`   | ✅ Đúng                                      |
| **Notifications**          | Module riêng     | `notifications/` app      | ✅ Đúng                                      |
| **Reports & Analytics**    | Module riêng     | `jobs/views.py.stats()`   | ⚠️ Đúng (khác cấu trúc)                      |
| **User & Auth**            | Module riêng     | `accounts/views.py`       | ✅ Đúng                                      |
| **Interview Panel**        | ❌ Không có      | ✅ Có đầy đủ              | ❌ Thiếu                                     |
| **Parse CV Task**          | Celery task      | `parse_cv_task()`         | ✅ Đúng                                      |
| **AI Screening Task**      | Celery task      | `screen_cv_task()`        | ✅ Đúng                                      |
| **Generate Offer PDF**     | Celery task      | `generate_offer_task()`   | ✅ Đúng                                      |
| **Send Email Task**        | Celery task      | Gửi trực tiếp trong views | ⚠️ Khác                                      |
| **Database**               | PostgreSQL       | PostgreSQL                | ✅ Đúng                                      |
| **SMTP**                   | External service | SMTP config               | ✅ Đúng                                      |
| **Gemini API**             | External service | Gemini API                | ✅ Đúng                                      |
| **Storage**                | S3               | Local storage             | ⚠️ Khác                                      |

---

## 🎯 KẾT LUẬN

### Độ chính xác tổng thể: **~75%** ⚠️ (Giảm từ 85% do thiếu tác động của INTERVIEWER)

**Điểm mạnh:**

- ✅ Sơ đồ mô tả đúng cấu trúc tổng thể của hệ thống
- ✅ Các luồng dữ liệu chính đều chính xác
- ✅ Các thành phần chính (Backend Core, Celery Worker, Database, External Services) đều đúng

**Cần cập nhật:**

1. ❌ **Thêm module "Quản lý Hội đồng Phỏng vấn"** - Đây là chức năng quan trọng đã được implement
2. ❌ **Thêm tác động của INTERVIEWER** - INTERVIEWER có nhiều tác động quan trọng nhưng sơ đồ chỉ mô tả "Đăng nhập/Quyền"
3. ⚠️ **Làm rõ cách gửi email** - Email được gửi trực tiếp, không qua Celery task riêng
4. ⚠️ **Cập nhật storage** - Hiện tại là local storage, không phải S3
5. ⚠️ **Làm rõ Reports & Analytics** - Là action trong JobViewSet, không phải module riêng

**Đề xuất:**

- Cập nhật sơ đồ để bao gồm "Interview Panel Management"
- Thêm ghi chú về cách gửi email (synchronous trong views)
- Cập nhật storage từ "S3" thành "Local Storage / Media Files"
- Giữ nguyên Reports & Analytics nhưng thêm ghi chú về implementation

---

## 📝 GỢI Ý CẬP NHẬT SƠ ĐỒ

### Thêm vào Backend Core:

```
8. Quản lý Hội đồng Phỏng vấn (Interview Panel Management):
   - Nhận "Tạo hội đồng" từ Recruiter
   - Nhận "Chấm điểm & Feedback" từ INTERVIEWER
   - Quản lý thành viên hội đồng (Interviewers)
   - Tính điểm trung bình (có trọng số)
   - Tự động cập nhật kết quả phỏng vấn (PASS/FAIL)
   - Tự động tạo OFFER nếu điểm >= 70
   - Tương tác với Database để lưu panel data, scores, feedback
```

### Cập nhật Client / Actor Layer:

```
Người phỏng vấn (INTERVIEWER):
- Đăng nhập/Quyền → 7. User & Auth
- Xem interviews được assign → 3. Quản lý Phỏng vấn
- Chấm điểm & Feedback → 8. Quản lý Hội đồng Phỏng vấn
- [Tác động gián tiếp] → 4. Kết quả & Offer (tự động tạo OFFER)
- [Tác động gián tiếp] → 5. Thông báo & Email (tự động gửi notification)
```

### Thêm luồng tự động:

```
Luồng tự động khi INTERVIEWER chấm điểm:
1. INTERVIEWER chấm điểm → 8. Quản lý Hội đồng Phỏng vấn
2. Khi tất cả thành viên đã chấm → Tính điểm trung bình
3. Điểm >= 70 → 3. Quản lý Phỏng vấn: Cập nhật result = PASS
4. result = PASS → 4. Kết quả & Offer: Tự động tạo OFFER
5. OFFER được tạo → 5. Thông báo & Email: Gửi email & notification
```

### Cập nhật Celery Worker:

```
Send Email Task:
- Ghi chú: Email được gửi trực tiếp từ Backend Core (synchronous)
- Hoặc: Tách thành Celery task riêng để xử lý bất đồng bộ
```

### Cập nhật External Services:

```
Storage (Media Files):
- Thay "S3 / Storage" thành "Local Storage / Media Files"
- Hoặc: "Storage (Media Files)" - có thể nâng cấp lên S3
```

---

**Ngày phân tích:** 2025-01-XX  
**Phiên bản codebase:** Hiện tại (sau khi hoàn thiện Interview Panel và Email notifications)
