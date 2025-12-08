# MÔ TẢ ĐÚNG MỐI QUAN HỆ - THEO HÌNH CLASS DIAGRAM

## ⚠️ SỬA LẠI SAU KHI PHÂN TÍCH HÌNH

Trong hình bạn gửi, có **3 loại quan hệ:**

### Ký hiệu:

- **◇** (kim cương rỗng) = **AGGREGATION** - quan hệ "has/contains" yếu
- **◆** (kim cương đen) = **COMPOSITION** - phụ thuộc vòng đời
- **- - - >** (đường nét đứt) = **DEPENDENCY** - tham chiếu FK

---

## DANH SÁCH 14 MỐI QUAN HỆ ĐÚNG

### ◇ AGGREGATION - Kim cương rỗng (5 quan hệ)

#### 1. User ◇──creates──> Job

- **Multiplicity:** 1 : \*
- **Vẽ:** Kim cương rỗng ở User, mũi tên đến Job
- **Mô tả:** User "có" nhiều Job (Recruiter tạo nhiều tin)

#### 2. User ◇──receives──> Notification

- **Multiplicity:** 1 : \*
- **Vẽ:** Kim cương rỗng ở User, đi thẳng xuống Notification
- **Mô tả:** User "nhận" nhiều thông báo

#### 3. User ◇──creates──> RecruitmentProcess

- **Multiplicity:** 1 : \*
- **Vẽ:** Kim cương rỗng ở User, đi xuống RecruitmentProcess
- **Mô tả:** User "tạo" nhiều quy trình

#### 4. Job ◇──has──> Application

- **Multiplicity:** 1 : \*
- **Vẽ:** Kim cương rỗng ở Job, mũi tên ngang đến Application
- **Mô tả:** Job "có" nhiều hồ sơ ứng tuyển

#### 5. Application ◇──has──> Interview

- **Multiplicity:** 1 : \*
- **Vẽ:** Kim cương rỗng ở Application, đi xuống Interview
- **Mô tả:** Application "có" nhiều lịch phỏng vấn

---

### ◆ COMPOSITION - Kim cương đen (2 quan hệ)

#### 6. Interview ◆──evaluated by──> InterviewPanel

- **Multiplicity:** 1 : 1..\*
- **Vẽ:** Kim cương đen ở Interview, mũi tên đến InterviewPanel
- **Mô tả:** Interview chứa InterviewPanel, xóa Interview → xóa Panel
- **Đặc biệt:** Phụ thuộc vòng đời

#### 7. RecruitmentProcess ◆──has──> ProcessStep

- **Multiplicity:** 1 : 1..\*
- **Vẽ:** Kim cương đen ở RecruitmentProcess, mũi tên đến ProcessStep
- **Mô tả:** Process chứa Step, xóa Process → xóa Step
- **Đặc biệt:** Phụ thuộc vòng đời

---

### - - - > DEPENDENCY - Đường nét đứt (7 quan hệ)

#### 8. User - - - > Application

- **Multiplicity:** 1 : \*
- **FK:** candidate (trong Application)
- **Vẽ:** Đường nét đứt từ User đến Application
- **Mô tả:** Application tham chiếu User qua FK candidate

#### 9. User - - - > InterviewPanel

- **Multiplicity:** 1 : \*
- **FK:** interviewer (trong InterviewPanel)
- **Vẽ:** Đường nét đứt từ User đến InterviewPanel (góc phải dưới)
- **Mô tả:** InterviewPanel tham chiếu User qua FK interviewer

#### 10. User - - - > RecruitmentResult

- **Multiplicity:** 1 : \*
- **FK:** decided_by (trong RecruitmentResult)
- **Vẽ:** Đường nét đứt từ User đến RecruitmentResult
- **Mô tả:** RecruitmentResult tham chiếu User qua FK decided_by

#### 11. Application - - - > RecruitmentResult

- **Multiplicity:** 1 : 0..1
- **FK:** application (trong RecruitmentResult, quan hệ 1-1)
- **Vẽ:** Đường nét đứt từ Application xuống RecruitmentResult
- **Mô tả:** RecruitmentResult tham chiếu Application (has one)

#### 12. RecruitmentProcess - - - > Job

- **Multiplicity:** 1 : \*
- **FK:** process (trong Job)
- **Vẽ:** Đường nét đứt từ RecruitmentProcess đi lên Job
- **Mô tả:** Job tham chiếu RecruitmentProcess qua FK process

#### 13. User - - - > SavedJob

- **Multiplicity:** 1 : \*
- **FK:** user (trong SavedJob)
- **Vẽ:** Đường nét đứt từ User đến SavedJob
- **Mô tả:** SavedJob tham chiếu User (Many-to-Many)

#### 14. Job - - - > SavedJob

- **Multiplicity:** 1 : \*
- **FK:** job (trong SavedJob)
- **Vẽ:** Đường nét đứt từ Job xuống SavedJob
- **Mô tả:** SavedJob tham chiếu Job (Many-to-Many)

---

## TỔNG KẾT

| Loại quan hệ    | Ký hiệu | Số lượng | Mô tả                                       |
| --------------- | ------- | -------- | ------------------------------------------- |
| **Aggregation** | ◇       | 5        | Quan hệ "has" yếu, không phụ thuộc vòng đời |
| **Composition** | ◆       | 2        | Quan hệ "contains" mạnh, phụ thuộc vòng đời |
| **Dependency**  | - - - > | 7        | Tham chiếu qua Foreign Key                  |
| **TỔNG**        |         | **14**   |                                             |

---

## CHECKLIST VẼ SƠ ĐỒ

### Bước 1: Vẽ 10 class boxes

- [ ] User (trái trên)
- [ ] Job (giữa trên)
- [ ] Application (phải trên)
- [ ] Interview (phải giữa)
- [ ] InterviewPanel (phải dưới)
- [ ] RecruitmentResult (giữa phải)
- [ ] Notification (trái dưới)
- [ ] SavedJob (giữa dưới)
- [ ] RecruitmentProcess (trái dưới cùng)
- [ ] ProcessStep (giữa dưới cùng)

### Bước 2: Vẽ 5 Aggregation (◇ rỗng)

- [ ] User ◇──> Job (1:\*)
- [ ] User ◇──> Notification (1:\*)
- [ ] User ◇──> RecruitmentProcess (1:\*)
- [ ] Job ◇──> Application (1:\*)
- [ ] Application ◇──> Interview (1:\*)

### Bước 3: Vẽ 2 Composition (◆ đen)

- [ ] Interview ◆──> InterviewPanel (1:1..\*)
- [ ] RecruitmentProcess ◆──> ProcessStep (1:1..\*)

### Bước 4: Vẽ 7 Dependency (- - - nét đứt)

- [ ] User - - -> Application (1:\*) [FK: candidate]
- [ ] User - - -> InterviewPanel (1:\*) [FK: interviewer]
- [ ] User - - -> RecruitmentResult (1:\*) [FK: decided_by]
- [ ] Application - - -> RecruitmentResult (1:0..1) [1-1]
- [ ] RecruitmentProcess - - -> Job (1:\*)
- [ ] User - - -> SavedJob (1:\*)
- [ ] Job - - -> SavedJob (1:\*)

### Bước 5: Ghi nhãn

- [ ] Multiplicity (1, _, 0..1, 1.._)
- [ ] Tên quan hệ (creates, has, receives, evaluated by...)
- [ ] FK name cho Dependency

---

## PHÂN BIỆT 3 LOẠI QUAN HỆ

### ◇ Aggregation (Kim cương rỗng)

**Khi nào dùng:**

- Quan hệ "has" (có)
- Lớp cha chứa lớp con
- Xóa cha, con vẫn tồn tại độc lập

**Ví dụ:**

- `User ◇──> Job`: User có nhiều Job, xóa User nhưng Job không bị xóa
- `Job ◇──> Application`: Job có nhiều Application

### ◆ Composition (Kim cương đen)

**Khi nào dùng:**

- Quan hệ "contains" (chứa đựng mạnh)
- Phụ thuộc hoàn toàn vòng đời
- Xóa cha → tự động xóa con

**Ví dụ:**

- `Interview ◆──> InterviewPanel`: Xóa Interview → xóa tất cả InterviewPanel
- `RecruitmentProcess ◆──> ProcessStep`: Xóa Process → xóa tất cả Step

### - - - > Dependency (Đường nét đứt)

**Khi nào dùng:**

- Tham chiếu qua Foreign Key
- Không có quan hệ chứa đựng
- Quan hệ yếu

**Ví dụ:**

- `User - - -> Application`: Application có FK candidate trỏ đến User
- `User - - -> InterviewPanel`: InterviewPanel có FK interviewer trỏ đến User

---

## VÍ DỤ VẼ CHI TIẾT

### Ví dụ 1: Aggregation - User ◇ Job

```
┌─────────────┐                      ┌─────────────┐
│    User     │                      │     Job     │
│             │                      │             │
│ - id        │───◇───creates────────>│ - id        │
│ - email     │    1      *          │ - title     │
│ - role      │                      │ - created_by│
└─────────────┘                      └─────────────┘
        ↑
    Kim cương rỗng ◇ ở User
    (User "has" Job)
```

### Ví dụ 2: Composition - Interview ◆ InterviewPanel

```
┌──────────────┐                        ┌─────────────────┐
│  Interview   │                        │ InterviewPanel  │
│              │                        │                 │
│ - id         │────◆──evaluated by─────>│ - id            │
│ - status     │    1      1..*         │ - interview_id  │
│              │                        │ - score         │
└──────────────┘                        └─────────────────┘
        ↑
    Kim cương đen ◆ ở Interview
    (Xóa Interview → xóa Panel)
```

### Ví dụ 3: Dependency - User - - -> Application

```
┌─────────────┐                      ┌──────────────┐
│    User     │                      │ Application  │
│             │                      │              │
│ - id        │- - - - - - - - - - ->│ - id         │
│ - email     │    1      *          │ - candidate  │ ← FK
│ - role      │   (candidate)        │ - job_id     │
└─────────────┘                      └──────────────┘
        Đường nét đứt
        (Application tham chiếu User qua FK)
```

### Ví dụ 4: Many-to-Many - SavedJob

```
┌─────────┐            ┌───────────┐            ┌─────────┐
│  User   │            │ SavedJob  │            │   Job   │
│         │◄- - - - - -│           │- - - - - - >│         │
│ - id    │     1  *   │ - user_id │  *   1     │ - id    │
│ - email │            │ - job_id  │            │ - title │
└─────────┘            └───────────┘            └─────────┘
     Cả 2 đều là Dependency (nét đứt)
     SavedJob tham chiếu cả User và Job
```

---

## SO SÁNH VỚI FILE CŨ (SAI)

### ❌ File cũ SAI:

- Tất cả 12 quan hệ đều ghi là **Association** → **SAI**
- Không phân biệt Aggregation, Composition, Dependency

### ✅ File mới ĐÚNG (theo hình):

- ◇ **Aggregation:** 5 quan hệ (kim cương rỗng)
- ◆ **Composition:** 2 quan hệ (kim cương đen)
- **- - ->** **Dependency:** 7 quan hệ (nét đứt)

---

## CLASS TRUNG TÂM

**User** có nhiều quan hệ nhất (6 quan hệ):

1. User ◇──> Job (Aggregation)
2. User ◇──> Notification (Aggregation)
3. User ◇──> RecruitmentProcess (Aggregation)
4. User - - -> Application (Dependency)
5. User - - -> InterviewPanel (Dependency)
6. User - - -> RecruitmentResult (Dependency)

**Application** là điểm nối quan trọng:

- Nhận từ: Job, User
- Đi đến: Interview, RecruitmentResult

---

_Tài liệu này đã được sửa lại ĐÚNG theo hình Class Diagram bạn gửi._
