# HƯỚNG DẪN VẼ SƠ ĐỒ KIẾN TRÚC VÀ PHÂN RÃ CHỨC NĂNG TRÊN DRAW.IO

---

## 1. SƠ ĐỒ KIẾN TRÚC HỆ THỐNG (System Architecture Diagram)

### 📋 Mục đích

Thể hiện các tầng (layers) của hệ thống và cách chúng tương tác với nhau từ người dùng → frontend → backend → database → external services.

### 🎨 Các thành phần cần vẽ

#### **Bước 1: Tầng Client (Client Layer)**

**Hình dạng:** Rectangle (hình chữ nhật bo góc)  
**Màu sắc:** Xanh nhạt (#E3F2FD)  
**Vị trí:** Đầu tiên (trên cùng)

Nội dung bên trong:

```
┌─────────────────────────────────────────┐
│          CLIENT LAYER (React 18)        │
├─────────────────────────────────────────┤
│   [Admin]    [Recruiter]   [Candidate]  │
│   Portal      Portal        Portal      │
│   Port 3003   Port 3002     Port 3001   │
└─────────────────────────────────────────┘
```

**Cách vẽ:**

1. Kéo hình **Rectangle** từ thanh bên trái
2. Chia làm 3 ô nhỏ bên trong bằng cách vẽ thêm 3 hình chữ nhật nhỏ
3. Mỗi ô ghi: **Admin Portal**, **Recruiter Portal**, **Candidate Portal**
4. Dưới mỗi tên ghi: **React App - Port 300X**
5. Dùng icon **User** (đầu người) từ thư viện icons

---

#### **Bước 2: Mũi tên kết nối đến API Gateway**

**Hình dạng:** Arrow (mũi tên đơn, hướng xuống)  
**Màu:** Đen hoặc xanh đậm  
**Label:** `HTTPS / REST API`

**Cách vẽ:**

1. Từ Client Layer, kéo mũi tên xuống dưới
2. Double-click vào mũi tên, ghi text: **HTTPS/REST API**
3. Style: **Straight Arrow** (mũi tên thẳng)

---

#### **Bước 3: Tầng API Gateway**

**Hình dạng:** Rectangle  
**Màu sắc:** Vàng nhạt (#FFF9C4)

Nội dung:

```
┌──────────────────────────────────────┐
│       API GATEWAY LAYER              │
├──────────────────────────────────────┤
│ • JWT Authentication                 │
│ • Rate Limiting                      │
│ • CORS Handling                      │
│ • Request Logging                    │
└──────────────────────────────────────┘
```

**Cách vẽ:**

1. Vẽ rectangle phía dưới mũi tên
2. Ghi tiêu đề: **API GATEWAY LAYER**
3. Liệt kê 4 chức năng bằng bullet points
4. Dùng icon **Shield** (khiên) cho authentication

---

#### **Bước 4: Tầng Application (Backend)**

**Hình dạng:** Rectangle lớn chứa các module nhỏ bên trong  
**Màu sắc:** Xanh lá nhạt (#E8F5E9)

Nội dung:

```
┌────────────────────────────────────────────┐
│     APPLICATION LAYER                      │
│     Django REST Framework 5.0              │
├────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐         │
│  │ Users  │ │  Jobs  │ │  Apps  │         │
│  │ Module │ │ Module │ │ Module │         │
│  └────────┘ └────────┘ └────────┘         │
│  ┌────────┐ ┌────────┐ ┌────────┐         │
│  │Interview│ │ Result │ │ Notify │         │
│  │ Module │ │ Module │ │ Module │         │
│  └────────┘ └────────┘ └────────┘         │
└────────────────────────────────────────────┘
```

**Cách vẽ:**

1. Vẽ rectangle lớn
2. Bên trong vẽ 6 hình chữ nhật nhỏ (2 hàng x 3 cột)
3. Mỗi ô ghi tên module: **Users**, **Jobs**, **Applications**, **Interviews**, **Results**, **Notifications**
4. Dùng icon **Gear** (bánh răng) hoặc **Package** (hộp) cho mỗi module

---

#### **Bước 5: Tầng Data & Services**

**Hình dạng:** 3 cylinders (hình trụ database) + 3 clouds (external services)  
**Màu sắc:**

- Database: Xám (#E0E0E0)
- Redis: Đỏ nhạt (#FFEBEE)
- Celery: Xanh lam nhạt (#E1F5FE)

**Cách vẽ:**

1. Từ Application Layer, kéo 3 mũi tên xuống
2. Vẽ 3 hình **Cylinder** (database icon):

   - **PostgreSQL** - Cơ sở dữ liệu chính
   - **Redis** - Cache & Message Broker
   - **Celery Worker** - Background Tasks

3. Dưới đó vẽ **Cloud** shape cho External Services:
   - **Google Gemini AI** (icon: brain/star)
   - **Gmail SMTP** (icon: email)
   - **Cloud Storage** (icon: folder)

---

#### **Bước 6: Kết nối các thành phần**

**Mũi tên:**

- Client → API Gateway: **đơn chiều, xuống**
- API Gateway → Application: **đơn chiều, xuống**
- Application → Database: **hai chiều** (đọc/ghi)
- Application → Redis: **hai chiều**
- Application → Celery: **đơn chiều** (gửi task)
- Celery → External Services: **đơn chiều** (gọi API)

**Label cho mũi tên:**

- REST API
- SQL Queries
- Cache/Queue
- AI API Call
- SMTP Protocol

---

### 📐 Layout tổng thể (từ trên xuống dưới)

```
┌───────────────────────────────────────────┐
│     1. CLIENT LAYER (3 portals)           │ ← Top
└───────────────────────────────────────────┘
              ↓ (HTTPS/REST API)
┌───────────────────────────────────────────┐
│     2. API GATEWAY                        │
└───────────────────────────────────────────┘
              ↓
┌───────────────────────────────────────────┐
│     3. APPLICATION LAYER                  │
│        (6 modules)                        │
└───────────────────────────────────────────┘
              ↓ (3 mũi tên)
┌─────────┐  ┌─────────┐  ┌─────────┐
│PostgreSQL│  │  Redis  │  │ Celery  │
└─────────┘  └─────────┘  └─────────┘
              ↓
┌───────────────────────────────────────────┐
│     EXTERNAL SERVICES                     │
│   [Gemini] [Gmail] [Cloud Storage]        │ ← Bottom
└───────────────────────────────────────────┘
```

---

## 2. SƠ ĐỒ PHÂN RÃ CHỨC NĂNG (Functional Decomposition Diagram)

### 📋 Mục đích

Thể hiện cách hệ thống được chia thành các module chức năng và các chức năng con bên trong mỗi module.

### 🎨 Các thành phần cần vẽ

#### **Cấu trúc tổng thể**

```
                    HỆ THỐNG TUYỂN DỤNG
                            |
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    MODULE 1            MODULE 2            MODULE 3
   Quản lý User      Quản lý Jobs      Quản lý Applications
        │                   │                   │
    ┌───┴───┐          ┌────┴────┐         ┌───┴───┐
   F1.1 F1.2         F2.1  F2.2           F3.1 F3.2
```

---

#### **Bước 1: Hệ thống gốc (Root)**

**Hình dạng:** Rounded Rectangle lớn  
**Màu:** Xanh dương đậm (#1976D2)  
**Text:** `HỆ THỐNG TUYỂN DỤNG NHÂN SỰ`  
**Vị trí:** Trên cùng, giữa trang

**Icon:** House hoặc Server

---

#### **Bước 2: Các Module chính (Level 1)**

**Hình dạng:** Rectangle bo góc  
**Màu:** Xanh nhạt (#42A5F5)  
**Kết nối:** Từ hệ thống gốc kéo mũi tên xuống

Vẽ 7 module song song:

1. **Quản lý Người dùng (Users)**
2. **Quản lý Công việc (Jobs)**
3. **Quản lý Hồ sơ (Applications)**
4. **Sàng lọc AI (AI Screening)**
5. **Quản lý Phỏng vấn (Interviews)**
6. **Quản lý Kết quả (Results)**
7. **Thông báo (Notifications)**

**Icon mỗi module:**

- Users: 👤 (User icon)
- Jobs: 💼 (Briefcase)
- Applications: 📄 (Document)
- AI: 🤖 (Robot)
- Interviews: 📅 (Calendar)
- Results: ✅ (Checkmark)
- Notifications: 🔔 (Bell)

---

#### **Bước 3: Chức năng con (Level 2)**

Từ mỗi module, kéo mũi tên xuống và tạo các chức năng con:

**1. Module Users:**

```
Quản lý Người dùng
        ├── Đăng ký / Đăng nhập
        ├── Quản lý Profile
        ├── Phân quyền (RBAC)
        └── Quản lý Session
```

**2. Module Jobs:**

```
Quản lý Công việc
        ├── Tạo tin tuyển dụng
        ├── Chỉnh sửa tin
        ├── Đóng/Mở tin
        └── Tìm kiếm tin
```

**3. Module Applications:**

```
Quản lý Hồ sơ
        ├── Nộp hồ sơ (Upload CV)
        ├── Xem danh sách hồ sơ
        ├── Lọc và tìm kiếm
        └── Cập nhật trạng thái
```

**4. Module AI Screening:**

```
Sàng lọc AI
        ├── Parse CV (PDF/DOCX)
        ├── Phân tích nội dung
        ├── Chấm điểm ứng viên
        └── Đề xuất hành động
```

**5. Module Interviews:**

```
Quản lý Phỏng vấn
        ├── Lên lịch phỏng vấn
        ├── Phân công hội đồng
        ├── Ghi nhận điểm
        └── Tổng hợp kết quả
```

**6. Module Results:**

```
Quản lý Kết quả
        ├── Ra quyết định (Hire/Reject)
        ├── Tạo thư mời nhận việc
        ├── Lưu trữ kết quả
        └── Thống kê tỷ lệ
```

**7. Module Notifications:**

```
Thông báo
        ├── Gửi email tự động
        ├── Thông báo in-app
        ├── Lịch sử thông báo
        └── Cài đặt preferences
```

---

#### **Bước 4: Cách vẽ trên Draw.io**

1. **Tạo hình gốc:**

   - Kéo **Rounded Rectangle** lên canvas
   - Đặt tên: **HỆ THỐNG TUYỂN DỤNG NHÂN SỰ**
   - Màu nền: Xanh đậm
   - Font size: 16pt, Bold

2. **Tạo 7 module (Level 1):**

   - Kéo 7 hình **Rectangle** nhỏ hơn
   - Xếp thành 1 hàng ngang phía dưới
   - Màu: Xanh nhạt
   - Font: 14pt

3. **Kết nối gốc → modules:**

   - Chọn **Arrow/Connector** tool
   - Từ hình gốc, kéo 7 đường xuống mỗi module
   - Style: **Tree** hoặc **Straight**

4. **Tạo chức năng con (Level 2):**

   - Dưới mỗi module, vẽ 4 hình **Rectangle** nhỏ
   - Màu: Trắng hoặc xanh rất nhạt
   - Font: 12pt
   - Kết nối bằng mũi tên từ module cha

5. **Thêm icons:**
   - Click vào thanh tìm kiếm Draw.io
   - Search: "user", "briefcase", "document", "robot", etc.
   - Kéo icon vào góc trên bên trái của mỗi hình

---

### 📐 Layout tổng thể (dạng cây)

```
                    [HỆ THỐNG TUYỂN DỤNG]
                             |
        ┌────────┬───────┬───┴───┬───────┬────────┬────────┐
        │        │       │       │       │        │        │
    [Users]  [Jobs]  [Apps]   [AI]  [Interview] [Result] [Notify]
        │        │       │       │       │        │        │
    ┌───┼──┐  ┌──┼──┐ ┌──┼──┐ ┌──┼──┐ ┌──┼──┐  ┌──┼──┐  ┌──┼──┐
   F1.1 ... F2.1 ... F3.1 ... F4.1 ... F5.1 ... F6.1 ... F7.1 ...
```

---

## 3. MÀU SẮC GỢI Ý

| Thành phần        | Màu HEX   | Mô tả           |
| ----------------- | --------- | --------------- |
| Client Layer      | `#E3F2FD` | Xanh dương nhạt |
| API Gateway       | `#FFF9C4` | Vàng nhạt       |
| Application       | `#E8F5E9` | Xanh lá nhạt    |
| Database          | `#E0E0E0` | Xám nhạt        |
| External Services | `#F3E5F5` | Tím nhạt        |
| Module chính      | `#42A5F5` | Xanh dương      |
| Chức năng con     | `#FFFFFF` | Trắng           |

---

## 4. FONT & KÍCH THƯỚC

| Phần tử                | Font Size | Style   |
| ---------------------- | --------- | ------- |
| Tiêu đề chính (System) | 16-18pt   | Bold    |
| Module Level 1         | 14pt      | Bold    |
| Chức năng Level 2      | 12pt      | Regular |
| Label mũi tên          | 10pt      | Italic  |

---

## 5. CHECKLIST HOÀN THÀNH

### Sơ đồ Kiến trúc:

- ☐ Client Layer (3 portals)
- ☐ API Gateway (4 chức năng)
- ☐ Application Layer (6 modules)
- ☐ Database + Redis + Celery
- ☐ External Services (3 services)
- ☐ Tất cả mũi tên có label
- ☐ Màu sắc phân biệt rõ ràng

### Sơ đồ Phân rã Chức năng:

- ☐ Hệ thống gốc ở trên cùng
- ☐ 7 modules chính
- ☐ Mỗi module có 4 chức năng con
- ☐ Có icons cho mỗi module
- ☐ Kết nối dạng cây rõ ràng

---

**Lưu ý:** File `.drawio` cuối cùng nên export sang PNG hoặc SVG với độ phân giải cao (300 DPI) để đưa vào báo cáo Word/PDF.
