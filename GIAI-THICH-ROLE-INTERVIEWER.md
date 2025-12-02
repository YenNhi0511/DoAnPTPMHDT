# GIẢI THÍCH VỀ ROLE INTERVIEWER

## 📋 TỔNG QUAN

**INTERVIEWER** là một **role riêng biệt** trong hệ thống, **KHÔNG phải** là một phần của role RECRUITER. Đây là những người chuyên tham gia **hội đồng phỏng vấn** để đánh giá ứng viên.

---

## 🎭 CÁC ROLE TRONG HỆ THỐNG

Hệ thống có **4 roles chính**:

1. **ADMIN** - Quản trị viên hệ thống
2. **RECRUITER** - Nhà tuyển dụng (tạo job, quản lý applications, lên lịch phỏng vấn)
3. **INTERVIEWER** - Người phỏng vấn (tham gia hội đồng phỏng vấn, chấm điểm)
4. **CANDIDATE** - Ứng viên (nộp hồ sơ, xem kết quả)

---

## 🔍 INTERVIEWER LÀ GÌ?

### Định nghĩa:
- **INTERVIEWER** là những người được **ADMIN tạo ra** để tham gia vào **hội đồng phỏng vấn**
- Họ thường là:
  - **HR Manager** (Trưởng phòng Nhân sự)
  - **Director** (Giám đốc)
  - **Team Lead** (Trưởng nhóm)
  - **Chuyên gia** trong lĩnh vực cần tuyển dụng

### Đặc điểm:
- ✅ **Role riêng biệt**: Không phải là RECRUITER, không phải là CANDIDATE
- ✅ **Được tạo bởi ADMIN**: Chỉ ADMIN mới có quyền tạo INTERVIEWER
- ✅ **Tham gia hội đồng phỏng vấn**: Được RECRUITER mời vào panel để phỏng vấn
- ✅ **Chấm điểm ứng viên**: Mỗi INTERVIEWER chấm điểm riêng (0-100) và đưa feedback
- ✅ **Quyền hạn hạn chế**: Chỉ thấy các interviews mà họ được assign

---

## 🔗 MỐI QUAN HỆ GIỮA RECRUITER VÀ INTERVIEWER

### RECRUITER (Nhà tuyển dụng):
- ✅ **Tạo job** và đăng tin tuyển dụng
- ✅ **Xem và lọc hồ sơ** ứng viên
- ✅ **Lên lịch phỏng vấn** cho ứng viên
- ✅ **Mời INTERVIEWER** vào hội đồng phỏng vấn
- ✅ **Quyết định cuối cùng** (OFFER/REJECT)
- ✅ **Quản lý toàn bộ quy trình** tuyển dụng

### INTERVIEWER (Người phỏng vấn):
- ✅ **Được RECRUITER mời** vào hội đồng phỏng vấn
- ✅ **Tham gia phỏng vấn** ứng viên
- ✅ **Chấm điểm** và đưa feedback
- ❌ **KHÔNG** tạo job
- ❌ **KHÔNG** xem tất cả applications
- ❌ **KHÔNG** quyết định cuối cùng (chỉ đánh giá)

### Mối quan hệ:
```
RECRUITER (Nhà tuyển dụng)
    ↓
    Tạo job → Nhận hồ sơ → Lên lịch phỏng vấn
    ↓
    Mời INTERVIEWER vào hội đồng
    ↓
INTERVIEWER (Người phỏng vấn)
    ↓
    Tham gia phỏng vấn → Chấm điểm → Đưa feedback
    ↓
RECRUITER (Nhà tuyển dụng)
    ↓
    Xem kết quả → Quyết định cuối cùng (OFFER/REJECT)
```

---

## 👥 AI TẠO INTERVIEWER?

### Chỉ ADMIN mới có quyền tạo INTERVIEWER:

1. **Vào trang Admin**: `/admin/interviewers`
2. **Nhấn "Thêm thành viên mới"**
3. **Điền thông tin**:
   - Email (bắt buộc)
   - Tên (bắt buộc)
   - Chức vụ (tùy chọn, sẽ hiển thị dạng "Họ tên - Chức vụ")
   - Số điện thoại (tùy chọn)
   - Mật khẩu (bắt buộc)
   - Role: Tự động là `INTERVIEWER`
4. **Tạo mới** → INTERVIEWER được tạo

### Lưu ý:
- ❌ **RECRUITER KHÔNG thể tạo INTERVIEWER**
- ❌ **INTERVIEWER KHÔNG thể tự tạo**
- ✅ **Chỉ ADMIN** mới có quyền này

---

## 🎯 INTERVIEWER ĐƯỢC SỬ DỤNG NHƯ THẾ NÀO?

### Bước 1: RECRUITER lên lịch phỏng vấn
- RECRUITER vào trang **"Lên lịch Phỏng vấn"** (`/interviews`)
- Chọn ứng viên và tạo interview
- (Tùy chọn) Chọn **thành viên hội đồng** ngay khi tạo

### Bước 2: RECRUITER mời INTERVIEWER vào panel
- RECRUITER vào trang **"Hội đồng Tuyển dụng"** (`/interview-panels`)
- Chọn interview đã tạo
- **Thêm thành viên hội đồng**: Chọn từ danh sách INTERVIEWER
- Gán role: **LEAD** (Trưởng hội đồng), **MEMBER** (Thành viên), hoặc **OBSERVER** (Quan sát viên)

### Bước 3: INTERVIEWER tham gia phỏng vấn
- INTERVIEWER đăng nhập vào hệ thống
- Xem danh sách interviews mà họ được assign
- Tham gia phỏng vấn (theo lịch đã được RECRUITER sắp xếp)

### Bước 4: INTERVIEWER chấm điểm
- Sau khi phỏng vấn, INTERVIEWER vào trang **"Hội đồng Tuyển dụng"**
- Chọn interview đã tham gia
- **Chấm điểm** (0-100) và đưa feedback
- Hệ thống tự động tính điểm trung bình khi tất cả thành viên đã chấm

### Bước 5: RECRUITER xem kết quả và quyết định
- RECRUITER xem điểm trung bình và feedback từ hội đồng
- Quyết định cuối cùng: **OFFER** (nhận) hoặc **REJECT** (từ chối)

---

## 🔐 QUYỀN HẠN CỦA INTERVIEWER

### INTERVIEWER CÓ THỂ:
- ✅ Đăng nhập vào hệ thống
- ✅ Xem **danh sách interviews** mà họ được assign trong panel
- ✅ Xem **thông tin ứng viên** trong các interviews đó
- ✅ **Chấm điểm** và đưa feedback cho ứng viên
- ✅ Xem **kết quả phỏng vấn** (PASS/FAIL) sau khi hội đồng đã chấm xong

### INTERVIEWER KHÔNG THỂ:
- ❌ Tạo job
- ❌ Xem tất cả applications (chỉ thấy ứng viên trong interviews được assign)
- ❌ Lên lịch phỏng vấn mới
- ❌ Quyết định cuối cùng (OFFER/REJECT) - chỉ RECRUITER mới có quyền này
- ❌ Tạo INTERVIEWER mới

---

## 📊 VÍ DỤ THỰC TẾ

### Tình huống: Tuyển dụng vị trí "Trưởng phòng Kinh doanh"

1. **RECRUITER (Nguyễn Văn A)**:
   - Tạo job "Trưởng phòng Kinh doanh"
   - Nhận được 10 hồ sơ ứng tuyển
   - Chọn 3 ứng viên tốt nhất để phỏng vấn

2. **RECRUITER lên lịch phỏng vấn**:
   - Tạo 3 interviews cho 3 ứng viên
   - Mời 3 INTERVIEWER vào hội đồng:
     - **INTERVIEWER 1**: Nguyễn Thị Lan - Trưởng phòng Nhân sự (LEAD)
     - **INTERVIEWER 2**: Trần Văn Bình - Giám đốc Kinh doanh (MEMBER)
     - **INTERVIEWER 3**: Lê Thị Mai - Trưởng phòng Marketing (MEMBER)

3. **3 INTERVIEWER tham gia phỏng vấn**:
   - Mỗi người đăng nhập và xem lịch phỏng vấn của mình
   - Tham gia phỏng vấn ứng viên (có thể cùng lúc hoặc riêng lẻ)
   - Sau phỏng vấn, mỗi người chấm điểm:
     - INTERVIEWER 1 (LEAD): 85 điểm
     - INTERVIEWER 2 (MEMBER): 80 điểm
     - INTERVIEWER 3 (MEMBER): 75 điểm

4. **Hệ thống tự động tính điểm**:
   - Điểm trung bình có trọng số: (85×1.5 + 80×1.0 + 75×1.0) / (1.5+1.0+1.0) = **80 điểm**
   - Vì điểm >= 70 → **PASS** → Tự động tạo OFFER

5. **RECRUITER quyết định cuối cùng**:
   - Xem điểm trung bình và feedback từ hội đồng
   - Quyết định: **OFFER** (gửi thư mời nhận việc)

---

## ❓ CÂU HỎI THƯỜNG GẶP

### Q1: INTERVIEWER có phải là nhân viên của công ty RECRUITER không?
**A:** Không nhất thiết. INTERVIEWER có thể là:
- Nhân viên trong cùng công ty với RECRUITER
- Chuyên gia bên ngoài được mời
- Quản lý cấp cao trong công ty

### Q2: RECRUITER có thể tự phỏng vấn không?
**A:** Có, RECRUITER có thể:
- Tự tham gia phỏng vấn (tạo interview và tự thêm mình vào panel)
- Hoặc chỉ mời INTERVIEWER khác

### Q3: Một người có thể vừa là RECRUITER vừa là INTERVIEWER không?
**A:** Không, mỗi user chỉ có **1 role** duy nhất. Tuy nhiên:
- RECRUITER có thể được thêm vào panel như một thành viên (vì hệ thống cho phép RECRUITER, ADMIN, INTERVIEWER đều có thể làm thành viên hội đồng)
- Nhưng role chính của họ vẫn là RECRUITER

### Q4: INTERVIEWER có thể xem tất cả jobs không?
**A:** Không, INTERVIEWER chỉ thấy:
- Các interviews mà họ được assign trong panel
- Thông tin ứng viên trong các interviews đó
- Không thể xem danh sách jobs hoặc applications khác

### Q5: Ai có thể tạo INTERVIEWER?
**A:** Chỉ **ADMIN** mới có quyền tạo INTERVIEWER thông qua trang `/admin/interviewers`.

---

## 📝 TÓM TẮT

| Đặc điểm | RECRUITER | INTERVIEWER |
|----------|-----------|-------------|
| **Role** | Nhà tuyển dụng | Người phỏng vấn |
| **Ai tạo?** | Tự đăng ký (với company_name) | ADMIN tạo |
| **Quyền hạn** | Quản lý toàn bộ quy trình tuyển dụng | Chỉ tham gia phỏng vấn và chấm điểm |
| **Tạo job** | ✅ Có | ❌ Không |
| **Lên lịch phỏng vấn** | ✅ Có | ❌ Không |
| **Mời vào hội đồng** | ✅ Có (mời INTERVIEWER) | ❌ Không |
| **Tham gia phỏng vấn** | ✅ Có (có thể tự tham gia) | ✅ Có |
| **Chấm điểm** | ✅ Có (nếu tham gia panel) | ✅ Có |
| **Quyết định cuối cùng** | ✅ Có (OFFER/REJECT) | ❌ Không |

---

## 🎯 KẾT LUẬN

**INTERVIEWER là một role riêng biệt**, không phải là một phần của RECRUITER. Họ là những người chuyên tham gia **hội đồng phỏng vấn** để đánh giá ứng viên, được **ADMIN tạo ra** và được **RECRUITER mời** vào các buổi phỏng vấn cụ thể.

**Mối quan hệ:**
- **ADMIN** → Tạo INTERVIEWER
- **RECRUITER** → Mời INTERVIEWER vào hội đồng phỏng vấn
- **INTERVIEWER** → Tham gia phỏng vấn và chấm điểm
- **RECRUITER** → Xem kết quả và quyết định cuối cùng

---

**Ngày tạo:** 2025-01-XX  
**Phiên bản:** Hiện tại

