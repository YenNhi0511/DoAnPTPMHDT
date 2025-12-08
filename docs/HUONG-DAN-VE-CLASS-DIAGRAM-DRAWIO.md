# HƯỚNG DẪN VẼ CLASS DIAGRAM MỨC PHÂN TÍCH TRONG DRAW.IO

## 📐 CẤU TRÚC SƠ ĐỒ CLASS - HỆ THỐNG TUYỂN DỤNG NHÂN SỰ THÔNG MINH

---

## 🎨 BƯỚC 1: THIẾT LẬP DRAW.IO

### 1.1. Mở Draw.io

- Truy cập: https://app.diagrams.net/ hoặc desktop app
- Chọn: **Blank Diagram** → Đặt tên: `CLASS-DIAGRAM.drawio`

### 1.2. Cài đặt UML Shape Library

- Menu: **More Shapes...** (góc dưới bên trái)
- Tích chọn: ✅ **UML 2.5**
- Click: **Apply**

### 1.3. Thiết lập Canvas

- **Page Setup:**
  - Size: A3 Landscape (để đủ chỗ cho 10 classes)
  - Grid: 10px
  - Background: White

---

## 📦 BƯỚC 2: VẼ 10 CLASSES

### Cách vẽ 1 Class trong Draw.io:

1. Kéo shape **Class** từ UML panel vào canvas
2. Double-click để đổi tên class
3. Click chuột phải → **Edit Style** → Chọn màu nền
4. Thêm attributes và methods

---

## 📋 CHI TIẾT 10 CLASSES

### 1️⃣ CLASS: Job (Màu xanh nhạt - #DAE8FC)

**Vị trí:** Góc trên bên trái

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│          Job                │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - title: String             │
│ - department: String        │
│ - description: Text         │
│ - requirements: Text        │
│ - salary_min: Decimal       │
│ - salary_max: Decimal       │
│ - quantity: Integer         │
│ - location: String          │
│ - employment_type: Enum     │
│   * FULLTIME                │
│   * PARTTIME                │
│   * CONTRACT                │
│   * INTERNSHIP              │
│ - status: Enum              │
│   * DRAFT                   │
│   * OPEN                    │
│   * CLOSED                  │
│ - experience_count: Integer │
│ - experience_years: Integer │
│ - deadline: DateTime        │
│ - created_by: FK(User)      │
│ - created_at: DateTime      │
├─────────────────────────────┤
│ + dang_tin()                │
│ + dong_tin()                │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `Job`
- **Attributes:** Copy paste từ trên (từ dòng `- id: UUID` đến `- created_at: DateTime`)
- **Methods:** Copy paste (từ dòng `+ dang_tin()` đến `+ dong_tin()`)
- **Màu nền:** `#DAE8FC` (xanh nhạt)

---

### 2️⃣ CLASS: Application (Màu xanh nhạt - #DAE8FC)

**Vị trí:** Giữa, bên phải Job

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│       Application           │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - job: FK(Job)              │
│ - candidate: FK(User)       │
│ - cv_file: File             │
│ - cover_letter: Text        │
│ - ai_score: Float           │
│ - ai_analysis: Text         │
│ - status: Enum              │
│   * PENDING                 │
│   * SCREENING               │
│   * INTERVIEW               │
│   * OFFER                   │
│   * ACCEPTED                │
│   * REJECTED                │
│ - applied_at: DateTime      │
│ - screener_notes: Text      │
├─────────────────────────────┤
│ + nop_ho_so()               │
│ + cap_nhat_trang_thai()     │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `Application`
- **Attributes:** Copy từ `- id: UUID` đến `- screener_notes: Text`
- **Methods:** `+ nop_ho_so()` và `+ cap_nhat_trang_thai()`
- **Màu nền:** `#DAE8FC`

---

### 3️⃣ CLASS: Interview (Màu xanh nhạt - #DAE8FC)

**Vị trí:** Bên phải Application

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│         Interview           │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - application: FK(App)      │
│ - scheduled_at: DateTime    │
│ - duration: Integer (min)   │
│ - location_link: String     │
│ - type: Enum                │
│   * TECHNICAL               │
│   * HR                      │
│   * ONLINE                  │
│   * OFFLINE                 │
│   * ONSITE                  │
│ - round: String             │
│ - status: Enum              │
│   * SCHEDULED               │
│   * ONGOING                 │
│   * COMPLETED               │
│   * CANCELLED               │
│ - result: Enum              │
│   * PASS                    │
│   * FAIL                    │
│   * PENDING                 │
├─────────────────────────────┤
│ + dat_lich()                │
│ + huy_lich()                │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `Interview`
- **Attributes:** Copy từ `- id: UUID` đến `* PENDING`
- **Methods:** `+ dat_lich()` và `+ huy_lich()`
- **Màu nền:** `#DAE8FC`

---

### 4️⃣ CLASS: User (Màu xanh nhạt - #DAE8FC)

**Vị trí:** Dưới Job, bên trái

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│           User              │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - email: String (unique)    │
│ - password_hash: String     │
│ - role: Enum                │
│   * ADMIN                   │
│   * RECRUITER               │
│   * CANDIDATE               │
│   * INTERVIEWER             │
│ - is_active: Boolean        │
│ - full_name: String         │
│ - phone: String             │
│ - avatar: URL               │
│ - company_name: String      │
│ - website: URL              │
│ - address: Text             │
│ - created_at: DateTime      │
├─────────────────────────────┤
│ + get_full_name(): String   │
│ + has_role(): String        │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `User`
- **Attributes:** Copy từ `- id: UUID` đến `- created_at: DateTime`
- **Methods:** `+ get_full_name(): String` và `+ has_role(): String`
- **Màu nền:** `#DAE8FC`

---

### 5️⃣ CLASS: SavedJob (Màu vàng nhạt - #FFF2CC)

**Vị trí:** Giữa Job và User

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│         SavedJob            │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - user: FK(User)            │
│ - job: FK(Job)              │
│ - saved_at: DateTime        │
├─────────────────────────────┤
│ (Many-to-Many)              │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `SavedJob`
- **Attributes:** Copy từ `- id: UUID` đến `- saved_at: DateTime`
- **Note:** Ghi `(Many-to-Many)` ở phần methods
- **Màu nền:** `#FFF2CC` (vàng nhạt để phân biệt junction table)

---

### 6️⃣ CLASS: RecruitmentResult (Màu trắng - #FFFFFF)

**Vị trí:** Dưới Application

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│    RecruitmentResult        │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - application: FK (1:1)     │
│ - final_decision: Enum      │
│   * OFFER                   │
│   * REJECT                  │
│ - salary_offer: Decimal     │
│ - offer_letter_file: File   │
│ - reason: String            │
│ - notes: Text               │
│ - decided_by: FK(User)      │
│ - decided_at: DateTime      │
├─────────────────────────────┤
│ + gui_offer()               │
│ + tu_choi()                 │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `RecruitmentResult`
- **Attributes:** Copy từ `- id: UUID` đến `- decided_at: DateTime`
- **Methods:** `+ gui_offer()` và `+ tu_choi()`
- **Màu nền:** `#FFFFFF` (trắng)

---

### 7️⃣ CLASS: InterviewPanel (Màu trắng - #FFFFFF)

**Vị trí:** Bên phải Interview

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│      InterviewPanel         │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - interview: FK(Interview)  │
│ - interviewer: FK(User)     │
│ - score: Enum               │
│   * EXCELLENT               │
│   * GOOD                    │
│   * AVERAGE                 │
│   * OBSERVER                │
│   * POOR                    │
│ - feedback: Text            │
│ - score_technical: Float(10)│
├─────────────────────────────┤
│ + danh_gia()                │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `InterviewPanel`
- **Attributes:** Copy từ `- id: UUID` đến `- score_technical: Float(10)`
- **Methods:** `+ danh_gia()`
- **Màu nền:** `#FFFFFF`

---

### 8️⃣ CLASS: Notification (Màu xanh nhạt - #DAE8FC)

**Vị trí:** Dưới User

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│       Notification          │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - user: FK(User)            │
│ - type: Enum                │
│   * EMAIL                   │
│   * SYSTEM                  │
│   * SMS                     │
│ - title: String             │
│ - content: Text             │
│ - is_read: Boolean          │
│ - created_at: DateTime      │
│ - sent_at: DateTime         │
├─────────────────────────────┤
│ + gui_thong_bao()           │
│ + danh_dau_da_doc()         │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `Notification`
- **Attributes:** Copy từ `- id: UUID` đến `- sent_at: DateTime`
- **Methods:** `+ gui_thong_bao()` và `+ danh_dau_da_doc()`
- **Màu nền:** `#DAE8FC`

---

### 9️⃣ CLASS: RecruitmentProcess (Màu xanh lá nhạt - #D5E8D4)

**Vị trí:** Góc dưới bên phải

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│    RecruitmentProcess       │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - name: String              │
│ - description: Text         │
│ - is_default: Boolean       │
│ - created_by: FK(User)      │
│ - created_at: DateTime      │
│ - updated_at: DateTime      │
├─────────────────────────────┤
│ + tao_quy_trinh()           │
│ + cap_nhat()                │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `RecruitmentProcess`
- **Attributes:** Copy từ `- id: UUID` đến `- updated_at: DateTime`
- **Methods:** `+ tao_quy_trinh()` và `+ cap_nhat()`
- **Màu nền:** `#D5E8D4` (xanh lá nhạt)

---

### 🔟 CLASS: ProcessStep (Màu xanh lá nhạt - #D5E8D4)

**Vị trí:** Bên phải RecruitmentProcess

**Cấu trúc Class:**

```
┌─────────────────────────────┐
│        ProcessStep          │
├─────────────────────────────┤
│ - id: UUID (PK)             │
│ - process: FK(Process)      │
│ - step_name: String         │
│ - step_type: Enum           │
│   * SCREENING               │
│   * CV_REVIEW               │
│   * TECHNICAL_TEST          │
│   * INTERVIEW               │
│   * HR_INTERVIEW            │
│   * FINAL_REVIEW            │
│   * OFFER                   │
│ - order: Integer            │
│ - description: Text         │
│ - is_required: Boolean      │
├─────────────────────────────┤
│ + them_buoc()               │
│ + xoa_buoc()                │
└─────────────────────────────┘
```

**Cách nhập vào Draw.io:**

- **Class name:** `ProcessStep`
- **Attributes:** Copy từ `- id: UUID` đến `- is_required: Boolean`
- **Methods:** `+ them_buoc()` và `+ xoa_buoc()`
- **Màu nền:** `#D5E8D4`

---

## 🔗 BƯỚC 3: VẼ CÁC MỐI QUAN HỆ (RELATIONSHIPS)

### Cách vẽ quan hệ trong Draw.io:

#### 📍 A. AGGREGATION (◇ - Kim cương rỗng)

**Cách vẽ:**

1. Chọn connector từ toolbar
2. Kéo từ class "part" (nhiều) đến class "whole" (1)
3. Click chuột phải vào connector → **Edit Style**
4. Tìm và chỉnh:
   - `endArrow=diamondThin`
   - `endFill=0` (rỗng)
   - `endSize=24`
5. Thêm label: Click vào connector → Nhập text

---

#### 📍 B. COMPOSITION (◆ - Kim cương đen)

**Cách vẽ:**

1. Chọn connector từ toolbar
2. Kéo từ class "part" đến class "whole"
3. Click chuột phải → **Edit Style**
4. Chỉnh:
   - `endArrow=diamondThin`
   - `endFill=1` (đen - QUAN TRỌNG!)
   - `endSize=24`
5. Thêm label và multiplicity

---

#### 📍 C. DEPENDENCY (- - - >)

**Cách vẽ:**

1. Chọn connector
2. Kéo từ class phụ thuộc đến class bị tham chiếu
3. Click chuột phải → **Edit Style**
4. Chỉnh:
   - `endArrow=open`
   - `dashed=1` (nét đứt)
   - `html=1`

---

#### 📍 D. ASSOCIATION (←→)

**Cách vẽ:**

1. Chọn connector
2. Kéo từ junction table đến 2 classes
3. Click chuột phải → **Edit Style**
4. Chỉnh:
   - `endArrow=none` (không mũi tên)

---

## 📊 CHI TIẾT 13 MỐI QUAN HỆ

### ✅ NHÓM 1: AGGREGATION (2 quan hệ)

#### 1. User ◇──────── Job

- **Loại:** Aggregation
- **Multiplicity:** User (1) ◇──── Job (\*)
- **Label:** "creates"
- **Hướng kim cương:** Ở User (whole)
- **Ý nghĩa:** User tạo nhiều Job, xóa User → Job KHÔNG bị xóa

**Cách vẽ:**

```
User ────────────◇ Job
  1                 *
     creates
```

**Style trong Draw.io:**

- Source: `Job` (attributes section)
- Target: `User`
- Style: `endArrow=diamondThin;endFill=0;endSize=24`

---

#### 2. User ◇──────── RecruitmentProcess

- **Loại:** Aggregation
- **Multiplicity:** User (1) ◇──── RecruitmentProcess (\*)
- **Label:** "creates"
- **Hướng kim cương:** Ở User
- **Ý nghĩa:** User tạo quy trình, xóa User → Process vẫn tồn tại (template dùng chung)

**Cách vẽ:**

```
User ────────────◇ RecruitmentProcess
  1                       *
     creates
```

**Style trong Draw.io:**

- Source: `RecruitmentProcess`
- Target: `User`
- Style: `endArrow=diamondThin;endFill=0;endSize=24`

---

### ✅ NHÓM 2: COMPOSITION (6 quan hệ)

#### 3. Job ◆──────── Application

- **Loại:** Composition
- **Multiplicity:** Job (1) ◆──── Application (\*)
- **Label:** "has"
- **Hướng kim cương:** Ở Job (whole)
- **Ý nghĩa:** Job có nhiều Application, xóa Job → XÓA Application (CASCADE)

**Cách vẽ:**

```
Job ────────────◆ Application
 1                    *
      has
```

**Style trong Draw.io:**

- Source: `Application`
- Target: `Job`
- Style: `endArrow=diamondThin;endFill=1;endSize=24` ⚠️ **endFill=1 là QUAN TRỌNG!**

---

#### 4. Application ◆──────── Interview

- **Loại:** Composition
- **Multiplicity:** Application (1) ◆──── Interview (\*)
- **Label:** "has"
- **Hướng kim cương:** Ở Application
- **Ý nghĩa:** Application có nhiều Interview, xóa Application → XÓA Interview

**Cách vẽ:**

```
Application ────────────◆ Interview
     1                         *
          has
```

**Style:**

- Source: `Interview`
- Target: `Application`
- Style: `endArrow=diamondThin;endFill=1;endSize=24`

---

#### 5. Interview ◆──────── InterviewPanel

- **Loại:** Composition
- **Multiplicity:** Interview (1) ◆──── InterviewPanel (\*)
- **Label:** "evaluated by"
- **Hướng kim cương:** Ở Interview
- **Ý nghĩa:** Interview có nhiều Panel (đánh giá), xóa Interview → XÓA Panel

**Cách vẽ:**

```
Interview ────────────◆ InterviewPanel
    1                         *
       evaluated by
```

**Style:**

- Source: `InterviewPanel`
- Target: `Interview`
- Style: `endArrow=diamondThin;endFill=1;endSize=24`

---

#### 6. User ◆──────── Notification

- **Loại:** Composition
- **Multiplicity:** User (1) ◆──── Notification (\*)
- **Label:** "receives"
- **Hướng kim cương:** Ở User
- **Ý nghĩa:** User nhận nhiều Notification, xóa User → XÓA Notification

**Cách vẽ:**

```
User ────────────◆ Notification
  1                      *
      receives
```

**Style:**

- Source: `Notification`
- Target: `User`
- Style: `endArrow=diamondThin;endFill=1;endSize=24`

---

#### 7. RecruitmentProcess ◆──────── ProcessStep

- **Loại:** Composition
- **Multiplicity:** RecruitmentProcess (1) ◆──── ProcessStep (\*)
- **Label:** "has"
- **Hướng kim cương:** Ở RecruitmentProcess
- **Ý nghĩa:** Process có nhiều Step, xóa Process → XÓA Step

**Cách vẽ:**

```
RecruitmentProcess ────────────◆ ProcessStep
        1                              *
             has
```

**Style:**

- Source: `ProcessStep`
- Target: `RecruitmentProcess`
- Style: `endArrow=diamondThin;endFill=1;endSize=24`

---

#### 8. Application ◆──────── RecruitmentResult

- **Loại:** Composition
- **Multiplicity:** Application (1) ◆──── RecruitmentResult (0..1)
- **Label:** "has one"
- **Hướng kim cương:** Ở Application
- **Ý nghĩa:** Application có TỐI ĐA 1 Result, xóa Application → XÓA Result

**Cách vẽ:**

```
Application ────────────◆ RecruitmentResult
     1                         0..1
         has one
```

**Style:**

- Source: `RecruitmentResult`
- Target: `Application`
- Style: `endArrow=diamondThin;endFill=1;endSize=24`

**Lưu ý đặc biệt:** Multiplicity là **0..1** (không phải \*)

---

### ✅ NHÓM 3: DEPENDENCY (3 quan hệ)

#### 9. User ←─ ─ ─ Application

- **Loại:** Dependency (nét đứt)
- **Multiplicity:** User (1) ←─ ─ ─ Application (\*)
- **Label:** "applies" (ứng tuyển)
- **Hướng mũi tên:** Từ Application → User
- **FK:** `candidate` trong Application → `User.id`
- **Ý nghĩa:** Application tham chiếu đến User (candidate)

**Cách vẽ:**

```
User ←─ ─ ─ ─ ─ Application
 1                    *
       applies
```

**Style:**

- Source: `Application`
- Target: `User`
- Style: `endArrow=open;html=1;dashed=1`

---

#### 10. User ←─ ─ ─ InterviewPanel

- **Loại:** Dependency
- **Multiplicity:** User (1) ←─ ─ ─ InterviewPanel (\*)
- **Label:** "evaluates"
- **Hướng mũi tên:** Từ InterviewPanel → User
- **FK:** `interviewer` trong InterviewPanel → `User.id`
- **Ý nghĩa:** InterviewPanel tham chiếu đến User (interviewer)

**Cách vẽ:**

```
User ←─ ─ ─ ─ ─ InterviewPanel
 1                     *
       evaluates
```

**Style:**

- Source: `InterviewPanel`
- Target: `User`
- Style: `endArrow=open;html=1;dashed=1`

---

#### 11. User ←─ ─ ─ RecruitmentResult

- **Loại:** Dependency
- **Multiplicity:** User (1) ←─ ─ ─ RecruitmentResult (\*)
- **Label:** "decided by"
- **Hướng mũi tên:** Từ RecruitmentResult → User
- **FK:** `decided_by` trong RecruitmentResult → `User.id`
- **Ý nghĩa:** RecruitmentResult tham chiếu đến User (người quyết định)

**Cách vẽ:**

```
User ←─ ─ ─ ─ ─ RecruitmentResult
 1                      *
      decided by
```

**Style:**

- Source: `RecruitmentResult`
- Target: `User`
- Style: `endArrow=open;html=1;dashed=1`

---

### ✅ NHÓM 4: ASSOCIATION (2 quan hệ M-N)

#### 12. User ←──→ SavedJob

- **Loại:** Association (Many-to-Many)
- **Multiplicity:** User (\*) ←──── SavedJob
- **Label:** Không có
- **Hướng:** KHÔNG có mũi tên
- **Ý nghĩa:** SavedJob là junction table, liên kết User và Job

**Cách vẽ:**

```
User ←──────── SavedJob
 *
```

**Style:**

- Source: `SavedJob`
- Target: `User`
- Style: `endArrow=none;html=1`

---

#### 13. Job ←──→ SavedJob

- **Loại:** Association
- **Multiplicity:** Job (\*) ←──── SavedJob
- **Label:** Không có
- **Hướng:** KHÔNG có mũi tên
- **Ý nghĩa:** SavedJob liên kết Job với User

**Cách vẽ:**

```
Job ←──────── SavedJob
 *
```

**Style:**

- Source: `SavedJob`
- Target: `Job`
- Style: `endArrow=none;html=1`

---

## 🎨 BƯỚC 4: THÊM CHI TIẾT VÀ ĐỊNH DẠNG

### 4.1. Thêm Multiplicity (1, \*, 0..1)

- Click vào connector
- Chọn **Edit** từ context menu
- Thêm label ở 2 đầu:
  - Đầu "whole": `1`
  - Đầu "part": `*` hoặc `0..1`

### 4.2. Thêm Label quan hệ

- Double-click vào connector
- Nhập tên quan hệ: `creates`, `has`, `evaluates`, etc.

### 4.3. Sắp xếp Layout

**Bố cục đề xuất:**

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  Job ◆──→ Application ◆──→ Interview ◆──→ InterviewPanel │
│   ↑ ◇          ↓ ◆              ↑                ↓        │
│   │           Result         (dependency)    (dependency) │
│   │                                                ↓       │
│  User ◆──→ Notification                         User      │
│   ↑ ◇                                                     │
│   │                                                       │
│  SavedJob (M-N)                                          │
│   ↓                                                       │
│  RecruitmentProcess ◆──→ ProcessStep                     │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### 4.4. Màu sắc Class

- **Màu xanh nhạt (#DAE8FC):** Job, Application, Interview, User, Notification
- **Màu vàng nhạt (#FFF2CC):** SavedJob (junction table)
- **Màu trắng (#FFFFFF):** RecruitmentResult, InterviewPanel
- **Màu xanh lá nhạt (#D5E8D4):** RecruitmentProcess, ProcessStep

---

## ⚙️ BƯỚC 5: CHỈNH SỬA STYLE NÂNG CAO

### Cách chỉnh style chi tiết:

1. Click chuột phải vào connector → **Edit Style**
2. Cửa sổ Style sẽ hiện ra với dạng text:

**Ví dụ style cho Composition:**

```
endArrow=diamondThin;endFill=1;endSize=24;html=1;rounded=0;
```

**Ví dụ style cho Aggregation:**

```
endArrow=diamondThin;endFill=0;endSize=24;html=1;rounded=0;
```

**Ví dụ style cho Dependency:**

```
endArrow=open;html=1;dashed=1;edgeStyle=orthogonalEdgeStyle;
```

**Ví dụ style cho Association:**

```
endArrow=none;html=1;rounded=0;
```

---

## 📝 BƯỚC 6: THÊM GHI CHÚ (NOTES)

### Thêm tiêu đề sơ đồ:

1. Chọn **Text** shape
2. Nhập: `HỆ THỐNG TUYỂN DỤNG NHÂN SỰ THÔNG MINH`
3. Font: **Arial Bold, 18pt**
4. Đặt ở góc trên cùng

### Thêm chú thích:

1. Chọn **Rectangle** shape
2. Nhập:

```
◇ Aggregation: Part tồn tại độc lập
◆ Composition: Part phụ thuộc vòng đời
- - → Dependency: Tham chiếu FK
←→ Association: Many-to-Many
```

---

## ✅ CHECKLIST HOÀN THÀNH

### Classes (10):

- [ ] Job (xanh nhạt)
- [ ] Application (xanh nhạt)
- [ ] Interview (xanh nhạt)
- [ ] User (xanh nhạt)
- [ ] SavedJob (vàng nhạt)
- [ ] RecruitmentResult (trắng)
- [ ] InterviewPanel (trắng)
- [ ] Notification (xanh nhạt)
- [ ] RecruitmentProcess (xanh lá nhạt)
- [ ] ProcessStep (xanh lá nhạt)

### Aggregation (2):

- [ ] User ◇──→ Job (`endFill=0`)
- [ ] User ◇──→ RecruitmentProcess (`endFill=0`)

### Composition (6):

- [ ] Job ◆──→ Application (`endFill=1`)
- [ ] Application ◆──→ Interview (`endFill=1`)
- [ ] Interview ◆──→ InterviewPanel (`endFill=1`)
- [ ] User ◆──→ Notification (`endFill=1`)
- [ ] RecruitmentProcess ◆──→ ProcessStep (`endFill=1`)
- [ ] Application ◆──→ RecruitmentResult (`endFill=1`)

### Dependency (3):

- [ ] User ←─ ─ ─ Application (`dashed=1`)
- [ ] User ←─ ─ ─ InterviewPanel (`dashed=1`)
- [ ] User ←─ ─ ─ RecruitmentResult (`dashed=1`)

### Association (2):

- [ ] User ←──→ SavedJob (`endArrow=none`)
- [ ] Job ←──→ SavedJob (`endArrow=none`)

---

## 🔧 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: Kim cương không đúng màu

**Nguyên nhân:** `endFill` sai
**Giải pháp:**

- Aggregation: `endFill=0` (rỗng)
- Composition: `endFill=1` (đen)

### Lỗi 2: Mũi tên sai hướng

**Nguyên nhân:** Source và Target bị đảo
**Giải pháp:**

- Kim cương luôn ở phía "whole" (1)
- Mũi tên Dependency hướng từ class phụ thuộc → class bị tham chiếu

### Lỗi 3: Multiplicity không hiển thị

**Nguyên nhân:** Chưa thêm label
**Giải pháp:**

- Double-click vào đầu connector
- Thêm text: `1`, `*`, `0..1`

---

## 📤 BƯỚC 7: EXPORT

### Export PNG (cho báo cáo):

1. **File** → **Export as** → **PNG**
2. Chọn:
   - **Zoom:** 100%
   - **Border:** 10px
   - **Transparent background:** ❌ (để trắng)
   - **Resolution:** 300 DPI
3. **Export**

### Export PDF (cho in ấn):

1. **File** → **Export as** → **PDF**
2. Chọn:
   - **Fit to 1 page**
   - **Include copy of diagram**

### Lưu file gốc:

1. **File** → **Save as**
2. Chọn format: **Editable Vector Graphics (.svg)** hoặc **.drawio**

---

## 🎯 KẾT LUẬN

Bạn đã hoàn thành vẽ Class Diagram mức phân tích cho Hệ Thống Tuyển Dụng Nhân Sự Thông Minh với:

- ✅ 10 classes đầy đủ attributes và methods
- ✅ 13 relationships đúng chuẩn UML
- ✅ Phân biệt rõ Aggregation, Composition, Dependency, Association
- ✅ Màu sắc phân loại hợp lý
- ✅ Multiplicity đầy đủ

**Lưu ý quan trọng:**

- **Aggregation (◇):** `endFill=0` - Part tồn tại độc lập
- **Composition (◆):** `endFill=1` - Part phụ thuộc vòng đời, CASCADE delete

---

_Tài liệu này được tạo dựa trên phân tích class diagram từ file CLASS-DIAGRAM.drawio_
