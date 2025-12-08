# PHÂN TÍCH LOGIC CÁC MỐI QUAN HỆ

## KIỂM TRA TỪNG QUAN HỆ

### 1. User ◇──────── Job

**Hiện tại:** Aggregation (kim cương rỗng)

**Câu hỏi:** Xóa User (Recruiter) → Job có bị xóa không?

- ❌ **KHÔNG** - Job phải chuyển cho Recruiter khác
- ✅ Job tồn tại độc lập, có giá trị riêng
- ✅ Có thể re-assign cho User khác

**KẾT LUẬN:** ✅ **ĐÚNG** - Dùng Aggregation ◇

---

### 2. Job ◇──────── Application

**Hiện tại:** Aggregation (kim cương rỗng)

**Câu hỏi:** Xóa Job → Application có bị xóa không?

- ❓ **CÂU HỎI:** Khi đóng/xóa Job, giữ lại hồ sơ ứng tuyển để thống kê?

**TRƯỜNG HỢP 1: Giữ lại Application (Aggregation ◇)**

- ✅ Lưu lịch sử: Candidate đã ứng tuyển Job nào
- ✅ Báo cáo: Số lượt ứng tuyển theo thời gian
- ✅ Application.job_id có thể NULL hoặc tham chiếu Job đã xóa

**TRƯỜNG HỢP 2: Xóa Application (Composition ◆)**

- ✅ Dọn dẹp data: Xóa Job → xóa luôn hồ sơ
- ❌ Mất lịch sử: Không biết ai đã ứng tuyển
- ✅ FK: ON DELETE CASCADE

**GỢI Ý:** ⚠️ **NÊN ĐỔI SANG COMPOSITION ◆**

- Lý do: Application chỉ có ý nghĩa khi Job còn tồn tại
- Xóa Job → nên xóa Application (không giữ hồ sơ "treo")

---

### 3. Application ◇──────── Interview

**Hiện tại:** Aggregation (kim cương rỗng)

**Câu hỏi:** Xóa Application → Interview có bị xóa không?

- ❌ **KHÔNG HỢP LÝ** - Interview không thể tồn tại khi mất Application
- ❌ Interview.application_id là FK NOT NULL
- ❌ Không có lý do giữ lại Interview khi Application bị xóa

**KẾT LUẬN:** ❌ **SAI** - **NÊN ĐỔI SANG COMPOSITION ◆**

- Application ◆──────── Interview
- Xóa Application → xóa tất cả Interview

---

### 4. Interview ◇──────── InterviewPanel

**Hiện tại:** Aggregation (kim cương rỗng)

**Câu hỏi:** Xóa Interview → InterviewPanel có bị xóa không?

- ❌ **KHÔNG HỢP LÝ** - InterviewPanel là đánh giá của Interview
- ❌ InterviewPanel.interview_id là FK NOT NULL
- ❌ Không có lý do giữ InterviewPanel khi Interview bị hủy

**KẾT LUẬN:** ❌ **SAI** - **NÊN ĐỔI SANG COMPOSITION ◆**

- Interview ◆──────── InterviewPanel
- Xóa Interview → xóa tất cả InterviewPanel

---

### 5. User ◇──────── Notification

**Hiện tại:** Aggregation (kim cương rỗng)

**Câu hỏi:** Xóa User → Notification có bị xóa không?

- ❓ **CÂU HỎI:** Giữ lại thông báo cho mục đích gì?

**TRƯỜNG HỢP 1: Giữ Notification (Aggregation ◇)**

- ❌ Không hợp lý: Notification cho ai khi User đã mất?
- ❌ Notification.user_id sẽ trỏ đến User không tồn tại

**TRƯỜNG HỢP 2: Xóa Notification (Composition ◆)**

- ✅ Hợp lý: Xóa User → xóa tất cả thông báo của User
- ✅ Dọn dẹp data

**KẾT LUẬN:** ⚠️ **NÊN ĐỔI SANG COMPOSITION ◆**

- User ◆──────── Notification
- Xóa User → xóa Notification

---

### 6. User ◇──────── RecruitmentProcess

**Hiện tại:** Aggregation (kim cương rỗng)

**Câu hỏi:** Xóa User → RecruitmentProcess có bị xóa không?

- ❌ **KHÔNG** - RecruitmentProcess là quy trình công ty
- ✅ Có thể được tạo bởi nhiều User
- ✅ Là template dùng chung, không phụ thuộc 1 User

**KẾT LUẬN:** ✅ **ĐÚNG** - Dùng Aggregation ◇

---

### 7. RecruitmentProcess ◇──────── ProcessStep

**Hiện tại:** Aggregation (kim cương rỗng)

**Câu hỏi:** Xóa RecruitmentProcess → ProcessStep có bị xóa không?

- ❌ **KHÔNG HỢP LÝ** - ProcessStep là các bước của Process
- ❌ ProcessStep.process_id là FK NOT NULL
- ❌ Không có lý do giữ Step khi Process bị xóa

**KẾT LUẬN:** ❌ **SAI** - **NÊN ĐỔI SANG COMPOSITION ◆**

- RecruitmentProcess ◆──────── ProcessStep
- Xóa Process → xóa tất cả Step

---

### 8. Application ◆──────── RecruitmentResult

**Hiện tại:** Composition (kim cương đen)

**Câu hỏi:** Xóa Application → RecruitmentResult có bị xóa không?

- ✅ **CÓ** - Result là kết quả của Application
- ✅ RecruitmentResult.application_id là FK NOT NULL (1-1)
- ✅ Không thể tồn tại Result khi mất Application

**KẾT LUẬN:** ✅ **ĐÚNG** - Dùng Composition ◆

---

### 9-11. Dependency (User ←─ ─ ─ Application, InterviewPanel, RecruitmentResult)

**Hiện tại:** Dependency (nét đứt)

**Phân tích:**

- ✅ Application có FK: candidate → User
- ✅ InterviewPanel có FK: interviewer → User
- ✅ RecruitmentResult có FK: decided_by → User
- ✅ Đây là tham chiếu yếu, không phải quan hệ chứa đựng

**KẾT LUẬN:** ✅ **ĐÚNG** - Dùng Dependency

---

### 12-13. Association (User ←→ SavedJob ←→ Job)

**Hiện tại:** Association M-N

**Phân tích:**

- ✅ SavedJob là bảng trung gian Many-to-Many
- ✅ User có thể lưu nhiều Job
- ✅ Job có thể được lưu bởi nhiều User
- ✅ Không có mũi tên 2 phía

**KẾT LUẬN:** ✅ **ĐÚNG** - Dùng Association

---

## TỔNG KẾT: CÁC LỖI CẦN SỬA

| STT | Quan hệ                          | Hiện tại      | Nên là        | Lý do                           |
| --- | -------------------------------- | ------------- | ------------- | ------------------------------- |
| 2   | Job → Application                | ◇ Aggregation | ◆ Composition | Application phụ thuộc Job       |
| 3   | Application → Interview          | ◇ Aggregation | ◆ Composition | Interview phụ thuộc Application |
| 4   | Interview → InterviewPanel       | ◇ Aggregation | ◆ Composition | Panel phụ thuộc Interview       |
| 5   | User → Notification              | ◇ Aggregation | ◆ Composition | Notification phụ thuộc User     |
| 7   | RecruitmentProcess → ProcessStep | ◇ Aggregation | ◆ Composition | Step phụ thuộc Process          |

---

## ĐỀ XUẤT MỐI QUAN HỆ ĐÚNG

### ◇ AGGREGATION (2 quan hệ) - Tồn tại độc lập

1. User ◇──────── Job (1:\*)
2. User ◇──────── RecruitmentProcess (1:\*)

### ◆ COMPOSITION (6 quan hệ) - Phụ thuộc vòng đời

3. Job ◆──────── Application (1:\*)
4. Application ◆──────── Interview (1:\*)
5. Interview ◆──────── InterviewPanel (1:\*)
6. User ◆──────── Notification (1:\*)
7. RecruitmentProcess ◆──────── ProcessStep (1:\*)
8. Application ◆──────── RecruitmentResult (1:0..1)

### - - - > DEPENDENCY (3 quan hệ) - Tham chiếu FK

9. Application ─ ─ ─> User [FK: candidate]
10. InterviewPanel ─ ─ ─> User [FK: interviewer]
11. RecruitmentResult ─ ─ ─> User [FK: decided_by]

### ASSOCIATION (2 quan hệ) - Many-to-Many

12. User ←──── SavedJob ────→ Job

**TỔNG:** 2 Aggregation + 6 Composition + 3 Dependency + 2 Association = **13 quan hệ**

---

## NGUYÊN TẮC PHÂN BIỆT

### Dùng COMPOSITION ◆ khi:

✅ Xóa "whole" → PHẢI xóa "part"
✅ FK NOT NULL và ON DELETE CASCADE
✅ "Part" không có ý nghĩa khi mất "whole"

### Dùng AGGREGATION ◇ khi:

✅ Xóa "whole" → "part" VẪN TỒN TẠI
✅ "Part" có giá trị độc lập
✅ Có thể re-assign "part" cho "whole" khác

---

## KẾT LUẬN

File drawio hiện tại có **5 lỗi logic**:

1. ❌ Job → Application (nên là ◆)
2. ❌ Application → Interview (nên là ◆)
3. ❌ Interview → InterviewPanel (nên là ◆)
4. ❌ User → Notification (nên là ◆)
5. ❌ RecruitmentProcess → ProcessStep (nên là ◆)

**Cần sửa lại để đúng với thực tế hệ thống tuyển dụng!**
