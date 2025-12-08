# MÔ TẢ MỐI QUAN Hệ GIỮA CÁC CLASS - ĐỂ VẼ SƠ ĐỒ

## Hướng dẫn vẽ sơ đồ Class Diagram

### Ký hiệu mũi tên:

- **`──>`**: Association (quan hệ liên kết)
- **`──◆>`**: Composition (chứa đựng, phụ thuộc vòng đời)
- **`- - ->`**: Dependency (phụ thuộc)
- **`1`, `*`, `0..*`, `1..*`**: Multiplicity (bản số)

---

## DANH SÁCH CÁC CLASS (10 Entity Classes)

### Vị trí đề xuất trên sơ đồ:

**Hàng 1 (Top):**

- User (trái)
- Job (giữa)
- Application (phải)

**Hàng 2 (Middle):**

- Interview (phải)
- InterviewPanel (phải dưới)

**Hàng 3 (Bottom-Right):**

- RecruitmentResult (giữa phải)

**Hàng 4 (Left-Bottom):**

- Notification (trái dưới)
- SavedJob (giữa dưới)

**Hàng 5 (Bottom):**

- RecruitmentProcess (trái dưới cùng)
- ProcessStep (giữa dưới cùng)

---

## MỐI QUAN HỆ CHI TIẾT - THEO THỨ TỰ VẼ

### 1️⃣ USER - Trung tâm hệ thống

#### Từ User → Job

```
User ───────────────> Job
  1                     *
         creates
```

- **Mô tả:** Một Recruiter tạo nhiều tin tuyển dụng
- **Loại:** Association (mũi tên đơn giản)
- **Vẽ:** User (trái) → Job (giữa)

---

#### Từ User → Application

```
User ───────────────> Application
  1                        *
         applies
```

- **Mô tả:** Một Candidate nộp nhiều hồ sơ
- **Loại:** Association
- **Vẽ:** User (trái) → Application (phải)
- **Chú ý:** Đường này có thể vẽ đường cong đi qua phía trên

---

#### Từ User → InterviewPanel

```
User ───────────────> InterviewPanel
  1                          *
        evaluates
```

- **Mô tả:** Một Interviewer đánh giá nhiều buổi phỏng vấn
- **Loại:** Association
- **Vẽ:** User (trái) → InterviewPanel (phải dưới)
- **Chú ý:** Đường này vẽ đường cong dài đi qua phía dưới

---

#### Từ User → RecruitmentResult

```
User ───────────────> RecruitmentResult
  1                           *
       decided by
```

- **Mô tả:** Một Recruiter quyết định nhiều kết quả tuyển dụng
- **Loại:** Association
- **Vẽ:** User (trái) → RecruitmentResult (giữa phải)

---

#### Từ User → Notification

```
User ───────────────> Notification
  1                        *
        receives
```

- **Mô tả:** Một User nhận nhiều thông báo
- **Loại:** Association
- **Vẽ:** User (trái) đi thẳng xuống → Notification (trái dưới)

---

#### Từ User → RecruitmentProcess

```
User ───────────────> RecruitmentProcess
  1                           *
         owns
```

- **Mô tả:** Một Recruiter tạo nhiều quy trình tuyển dụng
- **Loại:** Association
- **Vẽ:** User (trái) → RecruitmentProcess (trái dưới cùng)
- **Chú ý:** Có thể vẽ qua Notification

---

### 2️⃣ JOB - Trung tâm tuyển dụng

#### Từ Job → Application

```
Job ─────────────────> Application
 1                          *
          has
```

- **Mô tả:** Một Job nhận nhiều hồ sơ ứng tuyển
- **Loại:** Association
- **Vẽ:** Job (giữa) → Application (phải)
- **Vị trí:** Đường ngang trực tiếp

---

#### Từ RecruitmentProcess → Job

```
RecruitmentProcess ──────────> Job
         1                       *
         used by
```

- **Mô tả:** Một quy trình được áp dụng cho nhiều Job
- **Loại:** Association
- **Vẽ:** RecruitmentProcess (trái dưới) → Job (giữa)
- **Chú ý:** Đường dọc đi lên

---

### 3️⃣ APPLICATION - Hồ sơ ứng tuyển

#### Từ Application → Interview

```
Application ─────────────> Interview
     1                          *
            has
```

- **Mô tả:** Một hồ sơ có nhiều lịch phỏng vấn (vòng 1, 2, 3...)
- **Loại:** Association
- **Vẽ:** Application (phải) đi xuống → Interview (phải dưới)

---

#### Từ Application → RecruitmentResult

```
Application ─────────────> RecruitmentResult
     1                            0..1
                has one
```

- **Mô tả:** Một hồ sơ có tối đa một kết quả tuyển dụng cuối cùng
- **Loại:** Association (quan hệ 1-1)
- **Vẽ:** Application (phải) đi xuống → RecruitmentResult (giữa phải)
- **Đặc biệt:** Multiplicity là `0..1` (không bắt buộc)

---

### 4️⃣ INTERVIEW - Lịch phỏng vấn

#### Từ Interview → InterviewPanel

```
Interview ──────◆────────> InterviewPanel
    1                           1..*
         evaluated by
```

- **Mô tả:** Một buổi phỏng vấn bao gồm nhiều người đánh giá
- **Loại:** **COMPOSITION** (mũi tên kim cương đặc ◆)
- **Vẽ:** Interview (phải) → InterviewPanel (phải dưới)
- **Đặc biệt:** Dùng kim cương đen ◆ (phụ thuộc mạnh)

---

### 5️⃣ RECRUITMENT PROCESS - Quy trình

#### Từ RecruitmentProcess → ProcessStep

```
RecruitmentProcess ──────◆────────> ProcessStep
         1                               1..*
                  has
```

- **Mô tả:** Một quy trình bao gồm nhiều bước
- **Loại:** **COMPOSITION** (mũi tên kim cương đặc ◆)
- **Vẽ:** RecruitmentProcess (trái dưới) → ProcessStep (giữa dưới)
- **Đặc biệt:** Dùng kim cương đen ◆ (phụ thuộc mạnh)

---

### 6️⃣ SAVEDJOB - Many-to-Many

#### SavedJob kết nối User và Job

```
User ←────── SavedJob ──────→ Job
 *               *               *
    saves                   saved by
```

- **Mô tả:** Bảng trung gian Many-to-Many
- **Loại:** Association (2 mũi tên)
- **Vẽ:**
  - SavedJob (giữa dưới) → User (trái)
  - SavedJob (giữa dưới) → Job (giữa)
- **Đặc biệt:** SavedJob ở giữa, nối 2 đầu

---

## TÓM TẮT CÁC MŨI TÊN THEO LOẠI

### ASSOCIATION (mũi tên đơn giản `────>`)

1. User → Job (1 : \*)
2. User → Application (1 : \*)
3. User → InterviewPanel (1 : \*)
4. User → RecruitmentResult (1 : \*)
5. User → Notification (1 : \*)
6. User → RecruitmentProcess (1 : \*)
7. Job → Application (1 : \*)
8. Application → Interview (1 : \*)
9. Application → RecruitmentResult (1 : 0..1)
10. RecruitmentProcess → Job (1 : \*)
11. SavedJob → User (_ : _)
12. SavedJob → Job (_ : _)

**Tổng: 12 Association**

---

### COMPOSITION (mũi tên kim cương `────◆────>`)

1. Interview ──◆──> InterviewPanel (1 : 1..\*)
2. RecruitmentProcess ──◆──> ProcessStep (1 : 1..\*)

**Tổng: 2 Composition**

---

## SƠ ĐỒ ASCII ĐƠN GIẢN HÓA

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     HƯỚNG DẪN VẼ CLASS DIAGRAM                          │
└─────────────────────────────────────────────────────────────────────────┘

                        CẤP ĐỘ 1 (TOP)
    ┌─────────┐                ┌─────────┐              ┌──────────────┐
    │  User   │───creates(1:*)─→│   Job   │───has(1:*)──→│ Application  │
    │         │                 │         │              │              │
    └────┬────┘                 └────┬────┘              └──────┬───────┘
         │                           │                          │
         │                           │                          │
         │                           │                          │has(1:*)
    receives                    used by                         ↓
    (1:*)│                      (1:*)│                  ┌──────────────┐
         │                           │                  │  Interview   │
         ↓                           ↓                  │              │
┌────────────────┐        ┌─────────────────────┐      └──────┬───────┘
│ Notification   │        │ RecruitmentProcess  │             │
└────────────────┘        └──────────┬──────────┘             │
                                     │                         │
                                     │has(1:1..*)              │evaluated by
                                     │◆ COMPOSITION            │◆ COMPOSITION
                                     ↓                         │(1:1..*)
                          ┌─────────────────┐                 ↓
                          │  ProcessStep    │      ┌────────────────────┐
                          └─────────────────┘      │  InterviewPanel    │
                                                    └────────────────────┘
                                                             ↑
                                                             │evaluates
                                                             │(1:*)
                                                             │
                                                        (từ User)


         CẤP ĐỘ 2 (BOTTOM)
                          ┌─────────────┐
                          │  SavedJob   │ (Many-to-Many)
                          └──────┬──────┘
                                 │
                    ┌────────────┴───────────┐
                    ↓                        ↓
                  User                      Job
                  (*)                       (*)


         CẤP ĐỘ 3 (RESULT)
                                    ┌────────────────────┐
                          has one   │ RecruitmentResult  │
          Application ──(1:0..1)───→│   (OFFER/REJECT)   │
                                    └────────────────────┘
                                             ↑
                                             │decided by
                                             │(1:*)
                                             │
                                        (từ User)
```

---

## CHECKLIST VẼ SƠ ĐỒ

### Bước 1: Vẽ các Class (10 boxes)

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

### Bước 2: Vẽ các mũi tên Association (12 đường)

- [ ] User → Job (1:\*)
- [ ] User → Application (1:\*)
- [ ] User → InterviewPanel (1:\*)
- [ ] User → RecruitmentResult (1:\*)
- [ ] User → Notification (1:\*)
- [ ] User → RecruitmentProcess (1:\*)
- [ ] Job → Application (1:\*)
- [ ] Application → Interview (1:\*)
- [ ] Application → RecruitmentResult (1:0..1)
- [ ] RecruitmentProcess → Job (1:\*)
- [ ] SavedJob → User (_:_)
- [ ] SavedJob → Job (_:_)

### Bước 3: Vẽ các mũi tên Composition (2 đường - dùng ◆)

- [ ] Interview ──◆──> InterviewPanel (1:1..\*)
- [ ] RecruitmentProcess ──◆──> ProcessStep (1:1..\*)

### Bước 4: Ghi nhãn

- [ ] Ghi multiplicity (1, _, 0..1, 1.._)
- [ ] Ghi tên quan hệ (creates, has, evaluates, owns, receives...)

---

## LƯU Ý QUAN TRỌNG

### 1. Composition (◆) vs Association (→)

**Composition (◆):** Dùng khi lớp con phụ thuộc hoàn toàn vào lớp cha

- `Interview ──◆──> InterviewPanel`: Khi xóa Interview, tất cả InterviewPanel bị xóa
- `RecruitmentProcess ──◆──> ProcessStep`: Khi xóa Process, tất cả Step bị xóa

**Association (→):** Quan hệ thông thường

- `User → Job`: Xóa User không xóa Job (Job vẫn tồn tại)

### 2. Multiplicity (Bản số)

- `1`: Đúng 1
- `*`: Nhiều (0 hoặc nhiều)
- `0..1`: Không có hoặc 1
- `1..*`: Ít nhất 1

### 3. Hướng mũi tên

- **Mũi tên chỉ chiều:** Quan hệ 1 chiều (A biết B, B không cần biết A)
- **Không có mũi tên:** Quan hệ 2 chiều (A biết B, B biết A)

### 4. Tên quan hệ

- Đặt ở giữa đường nối
- Nên dùng động từ: creates, has, owns, receives, evaluates...

---

## VÍ DỤ VẼ TỪNG QUAN HỆ

### Ví dụ 1: User creates Job

```
┌─────────────┐                      ┌─────────────┐
│    User     │                      │     Job     │
│             │                      │             │
│ - id        │───────creates────────>│ - id        │
│ - email     │         1 : *        │ - title     │
│ - role      │                      │ - created_by│
└─────────────┘                      └─────────────┘
```

### Ví dụ 2: Interview ◆ InterviewPanel (Composition)

```
┌──────────────┐                        ┌─────────────────┐
│  Interview   │                        │ InterviewPanel  │
│              │                        │                 │
│ - id         │────────◆───────────────>│ - id            │
│ - status     │      1 : 1..*          │ - interview_id  │
│              │   evaluated by         │ - score         │
└──────────────┘                        └─────────────────┘
        ↑
        │
    Kim cương đen ◆
    (Composition)
```

### Ví dụ 3: SavedJob (Many-to-Many)

```
┌─────────┐            ┌───────────┐            ┌─────────┐
│  User   │            │ SavedJob  │            │   Job   │
│         │←───────────│           │───────────→│         │
│ - id    │     *      │ - user_id │      *     │ - id    │
│ - email │            │ - job_id  │            │ - title │
└─────────┘            └───────────┘            └─────────┘
```

---

## KẾT LUẬN

**Tổng số quan hệ:** 14 quan hệ

- **Association:** 12 quan hệ (mũi tên đơn giản)
- **Composition:** 2 quan hệ (mũi tên kim cương ◆)

**Class trung tâm:** User (có 6 mũi tên đi ra)
**Class quan trọng:** Application (nối Job, Interview, RecruitmentResult)

---

_Sử dụng tài liệu này để vẽ lại Class Diagram trong draw.io hoặc bất kỳ công cụ UML nào._
