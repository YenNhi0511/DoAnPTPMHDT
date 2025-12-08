# MÔ TẢ ĐÚNG MỐI QUAN HỆ - THEO FILE DRAWIO

## PHÂN TÍCH FILE CLASS-DIAGRAM.drawio

Sau khi đọc kỹ file XML, có **13 mối quan hệ** được vẽ:

---

## KÝ HIỆU TRONG DRAWIO

### 1. `endArrow=diamondThin;endFill=0` = **AGGREGATION ◇** (Kim cương rỗng)

- Quan hệ "has" yếu, không phụ thuộc vòng đời
- **⚠️ Lưu ý:** Draw.io dùng `diamondThin` (có mũi tên) nhưng UML chuẩn CHỈ có kim cương rỗng ◇ ở phía "whole", KHÔNG có mũi tên

### 2. `endArrow=diamondThin;endFill=1` = **COMPOSITION ◆** (Kim cương đen)

- Quan hệ "contains" mạnh, phụ thuộc vòng đời
- **⚠️ Lưu ý:** Draw.io dùng `diamondThin` (kim cương + mũi tên) nhưng UML chuẩn chỉ có kim cương đen ◆ không có mũi tên

### 3. `endArrow=open;dashed=1` = **DEPENDENCY - - - >** (Nét đứt)

- Tham chiếu yếu, thường là FK

### 4. `endArrow=none` = **ASSOCIATION** (Không mũi tên)

- Quan hệ Many-to-Many qua bảng trung gian

---

## 13 MỐI QUAN HỆ TRONG FILE DRAWIO

### ◇ AGGREGATION - Kim cương rỗng (7 quan hệ)

#### 1. User ◇──────── Job

```xml
<mxCell id="rel-user-job" value=""
  style="endArrow=diamondThin;endFill=0;endSize=24"
  source="User-attr" target="Job">
```

- **Multiplicity:** 1 : \*
- **Tên quan hệ:** creates
- **Mô tả:** User tạo nhiều Job
- **UML chuẩn:** User (1) ◇──────── Job (\*) - kim cương rỗng ở User, không có mũi tên

#### 2. Job ◆──────── Application

```xml
<mxCell id="rel-job-app" value=""
  style="endArrow=diamondThin;endFill=0;endSize=24"
  source="Job-attr" target="Application">
```

⚠️ **LƯU Ý:** File drawio dùng `endFill=0` (Aggregation) nhưng **LOGIC ĐÚNG LÀ COMPOSITION**

- **Multiplicity:** 1 : \*
- **Tên quan hệ:** has
- **Mô tả:** Job có nhiều Application, xóa Job → xóa Application
- **UML chuẩn:** Job (1) ◆──────── Application (\*) - kim cương đen ở Job
- **Lý do:** Application chỉ có ý nghĩa khi Job tồn tại

#### 3. Application ◆──────── Interview

```xml
<mxCell id="rel-app-interview" value=""
  style="endArrow=diamondThin;endFill=0;endSize=24"
  source="Application-attr" target="Interview">
```

⚠️ **LƯU Ý:** File drawio dùng `endFill=0` (Aggregation) nhưng **LOGIC ĐÚNG LÀ COMPOSITION**

- **Multiplicity:** 1 : \*
- **Tên quan hệ:** has
- **Mô tả:** Application có nhiều Interview, xóa Application → xóa Interview
- **UML chuẩn:** Application (1) ◆──────── Interview (\*) - kim cương đen ở Application
- **Lý do:** Interview không thể tồn tại khi mất Application

#### 4. Interview ◆──────── InterviewPanel

```xml
<mxCell id="rel-interview-panel" value=""
  style="endArrow=diamondThin;endFill=0;endSize=24"
  source="Interview" target="InterviewPanel">
```

⚠️ **LƯU Ý:** File drawio dùng `endFill=0` (Aggregation) nhưng **LOGIC ĐÚNG LÀ COMPOSITION**

- **Multiplicity:** 1 : \*
- **Tên quan hệ:** evaluated by
- **Mô tả:** Interview được đánh giá bởi nhiều InterviewPanel, xóa Interview → xóa Panel
- **UML chuẩn:** Interview (1) ◆──────── InterviewPanel (\*) - kim cương đen ở Interview
- **Lý do:** InterviewPanel là đánh giá của Interview, không thể tồn tại độc lập

#### 5. User ◆──────── Notification

```xml
<mxCell id="rel-user-notif" value=""
  style="endArrow=diamondThin;endFill=0;endSize=24"
  source="User" target="Notification">
```

⚠️ **LƯU Ý:** File drawio dùng `endFill=0` (Aggregation) nhưng **LOGIC ĐÚNG LÀ COMPOSITION**

- **Multiplicity:** 1 : \*
- **Tên quan hệ:** receives
- **Mô tả:** User nhận nhiều Notification, xóa User → xóa Notification
- **UML chuẩn:** User (1) ◆──────── Notification (\*) - kim cương đen ở User
- **Lý do:** Notification dành cho User cụ thể, không có User thì không có ý nghĩa

#### 6. User ◇──────── RecruitmentProcess

```xml
<mxCell id="rel-user-process" value=""
  style="endArrow=diamondThin;endFill=0;endSize=24"
  source="Notification" target="RecruitmentProcess">
```

**⚠️ LỖI TRONG XML:** Ghi `source="Notification"` nhưng thực tế là User→RecruitmentProcess

- **Multiplicity:** 1 : \*
- **Tên quan hệ:** creates
- **Mô tả:** User tạo nhiều RecruitmentProcess
- **UML chuẩn:** User (1) ◇──────── RecruitmentProcess (\*) - kim cương rỗng ở User

---

### ◆ COMPOSITION - Kim cương đen (1 quan hệ)

#### 7. Application ◆────── RecruitmentResult

```xml
<mxCell id="rel-app-result" value=""
  style="endArrow=diamondThin;endFill=1;endSize=24"
  source="Application" target="RecruitmentResult">
```

- **Multiplicity:** 1 : 0..1
- **Tên quan hệ:** has one
- **Loại:** Composition (kim cương đen)
- **Mô tả:** Application có 1 hoặc 0 RecruitmentResult, phụ thuộc vòng đời
- **Đặc biệt:** Xóa Application → xóa RecruitmentResult
- **⚠️ Lưu ý:** File drawio dùng `endArrow=diamondThin` (kim cương có mũi tên) nhưng trong UML chuẩn, Composition CHỈ có kim cương đen ◆ không có mũi tên

---

### ◇ AGGREGATION (tiếp) - Kim cương rỗng (1 quan hệ nữa)

#### 8. RecruitmentProcess ◆──────── ProcessStep

```xml
<mxCell id="rel-process-step" value=""
  style="endArrow=diamondThin;endFill=0;endSize=24"
  source="RecruitmentProcess-attr" target="ProcessStep">
```

⚠️ **LƯU Ý:** File drawio dùng `endFill=0` (Aggregation) nhưng **LOGIC ĐÚNG LÀ COMPOSITION**

- **Multiplicity:** 1 : \*
- **Tên quan hệ:** has
- **Mô tả:** RecruitmentProcess có nhiều ProcessStep, xóa Process → xóa Step
- **UML chuẩn:** RecruitmentProcess (1) ◆──────── ProcessStep (\*) - kim cương đen ở RecruitmentProcess
- **Lý do:** ProcessStep là các bước của Process, không thể tồn tại độc lập

---

### - - - > DEPENDENCY - Nét đứt (3 quan hệ)

#### 9. User - - - applies - - -> Application

```xml
<mxCell id="rel-user-app" value=""
  style="endArrow=open;html=1;dashed=1"
  source="User" target="Application">
```

- **Multiplicity:** \* : 1
- **Tên quan hệ:** applies
- **Mô tả:** User (candidate) ứng tuyển Application
- **FK:** candidate trong Application

#### 10. InterviewPanel - - - evaluates - - -> User

```xml
<mxCell id="rel-panel-user" value=""
  style="endArrow=open;html=1;dashed=1"
  source="InterviewPanel" target="User">
```

- **Multiplicity:** \* : 1
- **Tên quan hệ:** evaluates
- **Mô tả:** InterviewPanel tham chiếu User (interviewer)
- **FK:** interviewer trong InterviewPanel

#### 11. RecruitmentResult - - - decided by - - -> User

```xml
<mxCell id="rel-result-user" value=""
  style="endArrow=open;html=1;dashed=1"
  source="RecruitmentResult" target="User">
```

- **Multiplicity:** \* : 1
- **Tên quan hệ:** decided by
- **Mô tả:** RecruitmentResult được quyết định bởi User
- **FK:** decided_by trong RecruitmentResult

---

### ASSOCIATION - Không mũi tên (2 quan hệ Many-to-Many)

#### 12. User ←──→ SavedJob

```xml
<mxCell id="rel-savedjob-user" value=""
  style="endArrow=none;html=1"
  source="SavedJob" target="User">
```

- **Multiplicity:** _ : _
- **Mô tả:** User lưu nhiều Job qua SavedJob (Many-to-Many)
- **FK:** user trong SavedJob

#### 13. Job ←──→ SavedJob

```xml
<mxCell id="rel-savedjob-job" value=""
  style="endArrow=none;html=1"
  source="SavedJob" target="Job">
```

- **Multiplicity:** _ : _
- **Mô tả:** Job được lưu bởi nhiều User qua SavedJob (Many-to-Many)
- **FK:** job trong SavedJob

---

## TỔNG KẾT THEO FILE DRAWIO

| Loại quan hệ    | Ký hiệu XML                         | Số lượng               | ID trong file                                                                                                                       |
| --------------- | ----------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Aggregation** | `endFill=0`                         | 2                      | rel-user-job, rel-user-process                                                                                                      |
| **Composition** | `endFill=1` hoặc nên là `endFill=1` | 6 (drawio: 1, đúng: 6) | rel-app-result, **rel-job-app\***, **rel-app-interview\***, **rel-interview-panel\***, **rel-user-notif\***, **rel-process-step\*** |
| **Dependency**  | `dashed=1`                          | 3                      | rel-user-app, rel-panel-user, rel-result-user                                                                                       |
| **Association** | `endArrow=none`                     | 2                      | rel-savedjob-user, rel-savedjob-job                                                                                                 |
| **TỔNG**        |                                     | **13**                 |                                                                                                                                     |

---

## DANH SÁCH ĐÚNG 13 QUAN HỆ

### ◇ AGGREGATION (2 quan hệ) - Tồn tại độc lập

**Kim cương rỗng ở "whole" (1), KHÔNG có mũi tên ở "part" (\*)**

1. **User** ◇──────── **Job**

   - User (1) ◇──────── Job (\*)
   - Kim cương rỗng ở User
   - ✅ Xóa User → Job KHÔNG bị xóa (chuyển cho Recruiter khác)

2. **User** ◇──────── **RecruitmentProcess**
   - User (1) ◇──────── RecruitmentProcess (\*)
   - Kim cương rỗng ở User
   - ✅ Xóa User → RecruitmentProcess KHÔNG bị xóa (template dùng chung)

### ◆ COMPOSITION (6 quan hệ) - Phụ thuộc vòng đời

**Kim cương đen ở "whole", không có mũi tên**

3. **Job** ◆────── **Application**

   - Job (1) ◆────── Application (\*)
   - Kim cương đen ở Job
   - **Trạng thái:** COMPOSITION - Phụ thuộc vòng đời hoàn toàn
   - **Tính chất:** Application KHÔNG THỂ tồn tại mà không có Job
   - **Database:** FK `job_id` trong Application với `ON DELETE CASCADE`
   - **Logic nghiệp vụ:** Xóa Job (công việc) → tự động xóa tất cả Application (đơn ứng tuyển)
   - ⚠️ Xóa Job → xóa Application

4. **Application** ◆────── **Interview**

   - Application (1) ◆────── Interview (\*)
   - Kim cương đen ở Application
   - **Trạng thái:** COMPOSITION - Phụ thuộc vòng đời
   - **Tính chất:** Interview (buổi phỏng vấn) chỉ có ý nghĩa khi có Application
   - **Database:** FK `application_id` trong Interview với `ON DELETE CASCADE`
   - **Logic nghiệp vụ:** Xóa Application → tự động xóa tất cả Interview liên quan
   - ⚠️ Xóa Application → xóa Interview

5. **Interview** ◆────── **InterviewPanel**

   - Interview (1) ◆────── InterviewPanel (\*)
   - Kim cương đen ở Interview
   - **Trạng thái:** COMPOSITION - Phụ thuộc vòng đời
   - **Tính chất:** InterviewPanel (đánh giá) là BỘ PHẬN của Interview
   - **Database:** FK `interview_id` trong InterviewPanel với `ON DELETE CASCADE`
   - **Logic nghiệp vụ:** Xóa Interview → xóa tất cả đánh giá (Panel) của buổi phỏng vấn đó
   - ⚠️ Xóa Interview → xóa InterviewPanel

6. **User** ◆────── **Notification**

   - User (1) ◆────── Notification (\*)
   - Kim cương đen ở User
   - **Trạng thái:** COMPOSITION - Sở hữu hoàn toàn
   - **Tính chất:** Notification thuộc VỀ User cụ thể, không thể chuyển cho User khác
   - **Database:** FK `user_id` trong Notification với `ON DELETE CASCADE`
   - **Logic nghiệp vụ:** Xóa User → xóa tất cả thông báo của User đó
   - ⚠️ Xóa User → xóa Notification

7. **RecruitmentProcess** ◆────── **ProcessStep**

   - RecruitmentProcess (1) ◆────── ProcessStep (\*)
   - Kim cương đen ở RecruitmentProcess
   - **Trạng thái:** COMPOSITION - Phụ thuộc vòng đời
   - **Tính chất:** ProcessStep (bước) là BỘ PHẬN CẤU THÀNH của RecruitmentProcess
   - **Database:** FK `process_id` trong ProcessStep với `ON DELETE CASCADE`
   - **Logic nghiệp vụ:** Xóa Process → xóa tất cả các bước (Step) trong quy trình đó
   - ⚠️ Xóa Process → xóa ProcessStep

8. **Application** ◆────── **RecruitmentResult**
   - Application (1) ◆────── RecruitmentResult (0..1)
   - Kim cương đen ở Application
   - **Trạng thái:** COMPOSITION - Phụ thuộc vòng đời (1:0..1)
   - **Tính chất:** RecruitmentResult (kết quả) là SẢN PHẨM của Application
   - **Database:** FK `application_id` trong RecruitmentResult với `ON DELETE CASCADE`
   - **Logic nghiệp vụ:** Xóa Application → xóa kết quả tuyển dụng (Result)
   - **Đặc biệt:** Mỗi Application chỉ có TỐI ĐA 1 Result (0..1)
   - ⚠️ Xóa Application → xóa RecruitmentResult

### - - - > DEPENDENCY (3 quan hệ)

**Mũi tên nét đứt từ class phụ thuộc → class bị tham chiếu**

9. **User** ←─ ─ ─ **Application**

   - User (1) ←─ ─ ─ Application (\*)
   - **Trạng thái:** DEPENDENCY - Phụ thuộc yếu (tham chiếu)
   - **Tính chất:** Application THAM CHIẾU đến User (ứng viên)
   - **Database:** FK `candidate_id` trong Application → `User.id`
   - **Hành vi xóa:** `ON DELETE SET NULL` hoặc `PROTECT` (không cascade)
   - **Logic nghiệp vụ:** Xóa User (candidate) → Application vẫn TỒN TẠI (set candidate=NULL)
   - Application có FK: candidate → User
   - Mũi tên từ Application đến User

10. **User** ←─ ─ ─ **InterviewPanel**

    - User (1) ←─ ─ ─ InterviewPanel (\*)
    - **Trạng thái:** DEPENDENCY - Phụ thuộc yếu (tham chiếu)
    - **Tính chất:** InterviewPanel THAM CHIẾU đến User (người phỏng vấn)
    - **Database:** FK `interviewer_id` trong InterviewPanel → `User.id`
    - **Hành vi xóa:** `ON DELETE SET NULL` hoặc `PROTECT`
    - **Logic nghiệp vụ:** Xóa User (interviewer) → Panel vẫn tồn tại (set interviewer=NULL)
    - InterviewPanel có FK: interviewer → User
    - Mũi tên từ InterviewPanel đến User

11. **User** ←─ ─ ─ **RecruitmentResult**
    - User (1) ←─ ─ ─ RecruitmentResult (\*)
    - **Trạng thái:** DEPENDENCY - Phụ thuộc yếu (tham chiếu)
    - **Tính chất:** RecruitmentResult THAM CHIẾU đến User (người quyết định)
    - **Database:** FK `decided_by` trong RecruitmentResult → `User.id`
    - **Hành vi xóa:** `ON DELETE SET NULL` hoặc `PROTECT`
    - **Logic nghiệp vụ:** Xóa User (decider) → Result vẫn tồn tại (set decided_by=NULL)
    - RecruitmentResult có FK: decided_by → User
    - Mũi tên từ RecruitmentResult đến User

### ASSOCIATION (2 quan hệ M-N)

**Hai đầu đều không có mũi tên, quan hệ qua bảng trung gian**

12. **User** ←──→ **SavedJob** ←──→ **Job**
    - User (\*) ←──── SavedJob ────→ Job (\*)
    - **Trạng thái:** ASSOCIATION - Quan hệ Many-to-Many
    - **Tính chất:** SavedJob là BẢNG TRUNG GIAN (junction table) liên kết User và Job
    - **Database:** SavedJob có 2 FK: `user_id` → User.id, `job_id` → Job.id
    - **Hành vi xóa:**
      - Xóa User → xóa các SavedJob của User đó (CASCADE)
      - Xóa Job → xóa các SavedJob liên quan (CASCADE)
      - SavedJob không tồn tại độc lập
    - **Logic nghiệp vụ:** 1 User lưu nhiều Job, 1 Job được lưu bởi nhiều User
    - SavedJob có 2 FK: user_id và job_id
    - Không có mũi tên cả 2 phía

---

## CHÚ THÍCH QUAN TRỌNG

### ⚠️ Lỗi trong file drawio:

- **rel-user-process:** XML ghi `source="Notification"` nhưng thực tế muốn vẽ User→RecruitmentProcess
- Cần sửa lại: `source="User"` hoặc đi từ User thay vì Notification

### ⚠️ So sánh với file mô tả trước:

**File trước (SAI):**

- Ghi 5 Aggregation + 2 Composition + 7 Dependency = 14 quan hệ
- Không đúng với file drawio

**File drawio (ĐÚNG):**

- 7 Aggregation + 1 Composition + 3 Dependency + 2 Association = 13 quan hệ

---

## CHECKLIST VẼ LẠI SƠ ĐỒ

### Bước 1: Vẽ 2 Aggregation (◇ rỗng - KHÔNG có mũi tên)

- [ ] User ◇──── Job (1:\*)
- [ ] User ◇──── RecruitmentProcess (1:\*)

**Chú ý:** Kim cương rỗng ở phía "whole" (1), KHÔNG có mũi tên ở phía "part" (\*)

### Bước 2: Vẽ 6 Composition (◆ đen - KHÔNG có mũi tên)

- [ ] Job ◆── Application (1:\*)
- [ ] Application ◆── Interview (1:\*)
- [ ] Interview ◆── InterviewPanel (1:\*)
- [ ] User ◆── Notification (1:\*)
- [ ] RecruitmentProcess ◆── ProcessStep (1:\*)
- [ ] Application ◆── RecruitmentResult (1:0..1)

**Chú ý:** Kim cương đen ở phía "whole", KHÔNG có mũi tên. Xóa "whole" → tự động xóa "part"

### Bước 3: Vẽ 3 Dependency (nét đứt)

- [ ] User - - -> Application [candidate]
- [ ] InterviewPanel - - -> User [interviewer]
- [ ] RecruitmentResult - - -> User [decided_by]

### Bước 4: Vẽ 2 Association M-N (không mũi tên)

- [ ] SavedJob ← User (_:_)
- [ ] SavedJob ← Job (_:_)

---

## VÍ DỤ CODE XML

### Aggregation (◇):

```xml
<mxCell id="rel-user-job" value=""
  style="endArrow=diamondThin;endFill=0;endSize=24;html=1"
  source="User" target="Job" edge="1">
```

### Composition (◆ - KHÔNG có mũi tên trong UML chuẩn):

```xml
<mxCell id="rel-app-result" value=""
  style="endArrow=diamondThin;endFill=1;endSize=24;html=1"
  source="Application" target="RecruitmentResult" edge="1">
```

**Lưu ý:** Draw.io dùng `diamondThin` (có mũi tên) nhưng khi vẽ UML chuẩn, Composition chỉ có kim cương đen ◆ ở phía "whole", không có mũi tên.

### Dependency (- - ->):

```xml
<mxCell id="rel-user-app" value=""
  style="endArrow=open;html=1;dashed=1;edgeStyle=orthogonalEdgeStyle"
  source="User" target="Application" edge="1">
```

### Association (←→):

```xml
<mxCell id="rel-savedjob-user" value=""
  style="endArrow=none;html=1"
  source="SavedJob" target="User" edge="1">
```

---

## KẾT LUẬN

File drawio có **13 mối quan hệ** nhưng có **5 LỖI LOGIC:**

**TRONG FILE DRAWIO (SAI):**

- ❌ 7 Aggregation (`endFill=0`) - Quá nhiều
- ❌ 1 Composition (`endFill=1`) - Quá ít
- ✅ 3 Dependency (`dashed=1`)
- ✅ 2 Association (`endArrow=none`)

**LOGIC ĐÚNG (NÊN SỬA):**

- ✅ **2 Aggregation** (User→Job, User→RecruitmentProcess)
- ✅ **6 Composition** (Job→Application, Application→Interview, Interview→Panel, User→Notification, Process→Step, Application→Result)
- ✅ **3 Dependency** (giữ nguyên)
- ✅ **2 Association** (giữ nguyên)

⚠️ **Cần sửa file drawio:** Đổi 5 quan hệ từ `endFill=0` sang `endFill=1`

---

## MÔ TẢ CHI TIẾT 10 ĐỐI TƯỢNG TRONG CLASS DIAGRAM

### 1. 👤 Lớp Người Dùng (User)

**Mục đích:** Quản lý thông tin định danh của toàn bộ các tác nhân trong hệ thống (Admin, Recruiter, Candidate, Interviewer).

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính duy nhất
- `email`: String (unique) - Email đăng nhập, phải duy nhất
- `password_hash`: String - Mật khẩu được mã hóa (bảo mật)
- `role`: Enum - Vai trò phân quyền: ADMIN, RECRUITER, CANDIDATE, INTERVIEWER
- `is_active`: Boolean - Trạng thái kích hoạt tài khoản
- `full_name`: String - Họ tên đầy đủ
- `phone`: String - Số điện thoại liên hệ
- `avatar`: URL - Link ảnh đại diện
- `company_name`: String - Tên công ty (cho Recruiter)
- `website`: URL - Website cá nhân/công ty
- `address`: Text - Địa chỉ

**Phương thức:**

- `get_full_name()`: String - Lấy họ tên đầy đủ
- `has_role()`: String (property) - Kiểm tra vai trò

**Đặc điểm:**

- Là **lớp trung tâm** của hệ thống, tất cả tác nhân đều kế thừa từ User
- Sử dụng **role-based access control (RBAC)** để phân quyền
- Mật khẩu được **hash** trước khi lưu database (bcrypt/argon2)
- Email phải **unique** để đăng nhập

---

### 2. 💼 Lớp Tin Tuyển Dụng (Job)

**Mục đích:** Đại diện cho một bài đăng tuyển dụng (Job Posting).

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính
- `title`: String - Tiêu đề tin tuyển dụng
- `department`: String - Phòng ban tuyển dụng
- `description`: Text - Mô tả chi tiết công việc
- `requirements`: Text - Yêu cầu ứng viên
- `salary_min`: Decimal - Mức lương tối thiểu
- `salary_max`: Decimal - Mức lương tối đa
- `quantity`: Integer - Số lượng cần tuyển
- `location`: String - Địa điểm làm việc
- `employment_type`: Enum - Loại hợp đồng: FULLTIME, PARTTIME, CONTRACT, INTERNSHIP
- `status`: Enum - Trạng thái: DRAFT, OPEN, CLOSED
- `experience_count`: Integer - Số năm kinh nghiệm yêu cầu
- `experience_years`: Integer - Số năm kinh nghiệm
- `deadline`: DateTime - Hạn nộp hồ sơ
- `created_by`: FK(User) - Người tạo tin (Recruiter)
- `created_at`: DateTime - Ngày tạo

**Phương thức:**

- `dang_tin()` - Đăng tin tuyển dụng (chuyển status: DRAFT → OPEN)
- `dong_tin()` - Đóng tin tuyển dụng (chuyển status: OPEN → CLOSED)

**Đặc điểm:**

- Có **deadline** để quản lý thời hạn nhận hồ sơ
- **Status** kiểm soát vòng đời: DRAFT (nháp) → OPEN (đang tuyển) → CLOSED (đã đóng)
- **Salary range** (min-max) để ứng viên biết mức lương dự kiến
- Quan hệ **Aggregation** với User (Recruiter có thể chuyển Job cho người khác)

---

### 3. 📄 Lớp Hồ Sơ Ứng Tuyển (Application)

**Mục đích:** Đối tượng trung tâm xử lý quy trình tuyển dụng, lưu trữ hồ sơ ứng tuyển của ứng viên.

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính
- `candidate`: FK(User) - Ứng viên (Dependency)
- `job`: FK(Job) - Tin tuyển dụng (Composition)
- `cv_file`: File - File CV ứng viên (PDF/DOCX)
- `cover_letter`: Text - Thư xin việc
- `ai_score`: Float - Điểm số do AI chấm (0-100)
- `ai_analysis`: Text - Dữ liệu JSON phân tích chi tiết từ AI
- `status`: Enum - Trạng thái hồ sơ: PENDING, SCREENING, INTERVIEW, OFFER, ACCEPTED, REJECTED
- `applied_at`: DateTime - Ngày nộp hồ sơ
- `screener_notes`: Text - Ghi chú sơ tuyển

**Phương thức:**

- `nop_ho_so()` - Nộp hồ sơ ứng tuyển
- `cap_nhat_trang_thai()` - Cập nhật trạng thái hồ sơ

**Đặc điểm:**

- Là **đối tượng trung tâm** của quy trình tuyển dụng
- **AI-powered screening:** `ai_score` và `ai_analysis` để lọc hồ sơ tự động
- **Status** quản lý vòng đời: PENDING → SCREENING → INTERVIEW → OFFER → ACCEPTED/REJECTED
- **Composition** với Job (xóa Job → xóa Application)
- **Dependency** với User/candidate (xóa User → Application vẫn tồn tại, set candidate=NULL)

---

### 4. 🎤 Lớp Buổi Phỏng Vấn (Interview)

**Mục đích:** Lưu trữ thông tin về lịch hẹn phỏng vấn.

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính
- `application`: FK(Application) - Hồ sơ ứng tuyển (Composition)
- `scheduled_at`: DateTime - Thời gian bắt đầu phỏng vấn
- `duration`: Integer (min) - Thời lượng phỏng vấn (phút)
- `location_link`: String - Link Google Meet hoặc địa chỉ phòng họp
- `type`: Enum - Hình thức phỏng vấn: TECHNICAL, HR, ONLINE, OFFLINE, ONSITE
- `round`: String - Vòng phỏng vấn (Round 1, Round 2, Final)
- `status`: Enum - Trạng thái: SCHEDULED, ONGOING, COMPLETED, CANCELLED, PENDING
- `result`: Enum - Kết quả: PASS, FAIL, PENDING
- `notes`: Text - Ghi chú sau phỏng vấn

**Phương thức:**

- `dat_lich()` - Đặt lịch phỏng vấn
- `huy_lich()` - Hủy lịch phỏng vấn

**Đặc điểm:**

- Hỗ trợ **cả Online và Offline** (location_link có thể là Google Meet hoặc địa chỉ phòng)
- **Round** để quản lý nhiều vòng phỏng vấn (Technical → HR → Final)
- **Composition** với Application (xóa Application → xóa Interview)
- **Status** theo dõi tiến trình: SCHEDULED → ONGOING → COMPLETED

---

### 5. 📊 Lớp Bảng Đánh Giá Phỏng Vấn (InterviewPanel)

**Mục đích:** Lưu trữ đánh giá chi tiết của từng interviewer cho một buổi phỏng vấn.

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính
- `interview`: FK(Interview) - Buổi phỏng vấn (Composition)
- `interviewer`: FK(User) - Người phỏng vấn (Dependency)
- `score`: Enum - Điểm đánh giá: EXCELLENT, GOOD, AVERAGE, OBSERVER, POOR
- `feedback`: Text - Nhận xét chi tiết
- `score_technical`: Float(0-10) - Điểm kỹ thuật (nếu có)

**Phương thức:**

- `danh_gia()` - Ghi nhận đánh giá

**Đặc điểm:**

- **Một Interview có nhiều InterviewPanel** (nhiều người phỏng vấn cùng lúc)
- **Score** dạng Enum để chuẩn hóa đánh giá: EXCELLENT > GOOD > AVERAGE > POOR
- **Composition** với Interview (xóa Interview → xóa Panel)
- **Dependency** với User/interviewer (xóa User → Panel vẫn tồn tại, set interviewer=NULL)

---

### 6. ✅ Lớp Kết Quả Tuyển Dụng (RecruitmentResult)

**Mục đích:** Lưu trữ quyết định cuối cùng của nhà tuyển dụng (Offer/Reject).

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính
- `application`: FK(Application) - Hồ sơ ứng tuyển (Composition, 1:0..1)
- `final_decision`: Enum - Quyết định cuối: OFFER, REJECT
- `salary_offer`: Decimal - Mức lương đề nghị (nếu OFFER)
- `offer_letter_file`: File - File PDF Offer Letter
- `reason`: String - Lý do từ chối (nếu REJECT)
- `notes`: Text - Ghi chú thêm
- `decided_by`: FK(User) - Người quyết định (Dependency)
- `decided_at`: DateTime - Ngày quyết định

**Phương thức:**

- `gui_offer()` - Gửi thư mời nhận việc
- `tu_choi()` - Từ chối ứng viên

**Đặc điểm:**

- **1 Application chỉ có TỐI ĐA 1 Result** (Composition 1:0..1)
- **Offer Letter** được lưu dưới dạng file PDF
- **Salary offer** là mức lương chính thức đề nghị (có thể khác với Job.salary)
- **Composition** với Application (xóa Application → xóa Result)
- **Dependency** với User/decided_by (xóa User → Result vẫn tồn tại)

---

### 7. 🔔 Lớp Thông Báo (Notification)

**Mục đích:** Lưu trữ các thông báo hệ thống gửi đến người dùng.

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính
- `user`: FK(User) - Người nhận thông báo (Composition)
- `type`: Enum - Loại thông báo: EMAIL, SYSTEM, SMS
- `title`: String - Tiêu đề thông báo
- `content`: Text - Nội dung thông báo
- `is_read`: Boolean - Trạng thái đã đọc/chưa đọc
- `created_at`: DateTime - Ngày tạo
- `sent_at`: DateTime - Ngày gửi

**Phương thức:**

- `gui_thong_bao()` - Gửi thông báo
- `danh_dau_da_doc()` - Đánh dấu đã đọc

**Đặc điểm:**

- **Type** hỗ trợ nhiều kênh: EMAIL, SYSTEM (in-app), SMS
- **is_read** để quản lý trạng thái đọc (hiển thị badge "unread")
- **Composition** với User (xóa User → xóa tất cả Notification của User đó)
- Thông báo **thuộc về User cụ thể**, không thể chuyển cho User khác

---

### 8. 💾 Lớp Công Việc Đã Lưu (SavedJob)

**Mục đích:** Bảng trung gian (Junction Table) quản lý quan hệ Many-to-Many giữa User và Job (User lưu nhiều Job, Job được lưu bởi nhiều User).

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính
- `user`: FK(User) - Người dùng lưu Job (Association)
- `job`: FK(Job) - Tin tuyển dụng được lưu (Association)
- `saved_at`: DateTime - Ngày lưu

**Phương thức:**

- `luu_tin()` - Lưu tin tuyển dụng
- `bo_luu()` - Bỏ lưu tin

**Đặc điểm:**

- **Junction Table** cho quan hệ Many-to-Many (User ←→ Job)
- **Không có mũi tên** ở cả hai phía (Association)
- Xóa User hoặc Job → xóa các SavedJob liên quan (CASCADE)
- **SavedJob không tồn tại độc lập**, chỉ là bảng liên kết

---

### 9. 🔄 Lớp Quy Trình Tuyển Dụng (RecruitmentProcess)

**Mục đích:** Lưu trữ template quy trình tuyển dụng chuẩn của công ty (Process Template).

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính
- `name`: String - Tên quy trình (vd: "Quy trình tuyển Developer")
- `description`: Text - Mô tả chi tiết quy trình
- `is_default`: Boolean - Quy trình mặc định
- `created_by`: FK(User) - Người tạo (Aggregation)
- `created_at`: DateTime - Ngày tạo
- `updated_at`: DateTime - Ngày cập nhật

**Phương thức:**

- `tao_quy_trinh()` - Tạo quy trình mới
- `cap_nhat()` - Cập nhật quy trình

**Đặc điểm:**

- Là **template dùng chung** cho nhiều Job (không phụ thuộc vào một User cụ thể)
- **Aggregation** với User (xóa User → Process vẫn tồn tại, chuyển cho Admin khác)
- **Composition** với ProcessStep (xóa Process → xóa tất cả các Step)
- **is_default** đánh dấu quy trình mặc định áp dụng cho Job mới

---

### 10. 📝 Lớp Bước Quy Trình (ProcessStep)

**Mục đích:** Lưu trữ các bước chi tiết trong một quy trình tuyển dụng.

**Thuộc tính quan trọng:**

- `id`: UUID (PK) - Khóa chính
- `process`: FK(RecruitmentProcess) - Quy trình (Composition)
- `step_name`: String - Tên bước (vd: "Sơ tuyển CV")
- `step_type`: Enum - Loại bước: SCREENING, CV_REVIEW, TECHNICAL_TEST, INTERVIEW, HR_INTERVIEW, OFFER
- `order`: Integer - Thứ tự bước trong quy trình
- `description`: Text - Mô tả chi tiết bước
- `is_required`: Boolean - Bước bắt buộc hay không

**Phương thức:**

- `them_buoc()` - Thêm bước vào quy trình
- `xoa_buoc()` - Xóa bước khỏi quy trình

**Đặc điểm:**

- **Composition** với RecruitmentProcess (xóa Process → xóa tất cả Step)
- **Order** để sắp xếp thứ tự các bước (1 → 2 → 3...)
- **step_type** chuẩn hóa loại bước: SCREENING → CV_REVIEW → TECHNICAL_TEST → INTERVIEW → OFFER
- **is_required** để đánh dấu bước bắt buộc (không thể bỏ qua)
- Các bước là **bộ phận cấu thành** của Process, không thể tồn tại độc lập

---

## BẢNG TỔNG HỢP THUỘC TÍNH QUAN TRỌNG

| Lớp                    | Thuộc tính quan trọng nhất                               | Enum/Type quan trọng                                   |
| ---------------------- | -------------------------------------------------------- | ------------------------------------------------------ |
| **User**               | email (unique), password_hash, role, is_active           | role: ADMIN, RECRUITER, CANDIDATE, INTERVIEWER         |
| **Job**                | title, status, deadline, salary_min/max, employment_type | status: DRAFT, OPEN, CLOSED                            |
| **Application**        | cv_file, ai_score, ai_analysis, status                   | status: PENDING, SCREENING, INTERVIEW, OFFER, REJECTED |
| **Interview**          | scheduled_at, location_link, type, status, result        | type: ONLINE, OFFLINE, ONSITE; result: PASS, FAIL      |
| **InterviewPanel**     | score, feedback, score_technical                         | score: EXCELLENT, GOOD, AVERAGE, POOR                  |
| **RecruitmentResult**  | final_decision, salary_offer, offer_letter_file          | final_decision: OFFER, REJECT                          |
| **Notification**       | type, content, is_read                                   | type: EMAIL, SYSTEM, SMS                               |
| **SavedJob**           | user, job, saved_at (Junction Table)                     | -                                                      |
| **RecruitmentProcess** | name, is_default                                         | -                                                      |
| **ProcessStep**        | step_name, step_type, order, is_required                 | step_type: SCREENING, INTERVIEW, TECHNICAL_TEST, OFFER |

---

_Tài liệu này được tạo bằng cách đọc kỹ file XML drawio, không dựa vào hình ảnh._
