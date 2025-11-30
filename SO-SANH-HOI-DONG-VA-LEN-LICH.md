# So sánh: Tạo Hội đồng Tuyển dụng vs Lên lịch Phỏng vấn

## 📋 Tổng quan

Hệ thống có **2 chức năng** liên quan đến phỏng vấn:
1. **Lên lịch Phỏng vấn** (trang `/interviews`)
2. **Tạo Hội đồng Tuyển dụng** (trang `/interview-panels`)

Cả 2 đều tạo **Interview** và **InterviewPanel**, nhưng có mục đích và workflow khác nhau.

---

## 🔄 Lên lịch Phỏng vấn (`/interviews`)

### Mục đích:
- **Lên lịch phỏng vấn nhanh** cho ứng viên đã được chọn
- Tập trung vào **quản lý lịch phỏng vấn** (scheduled, completed, cancelled)
- Phù hợp cho **workflow tuyển dụng thông thường**

### Khi nào dùng:
✅ Khi bạn đã **chọn được ứng viên** và muốn lên lịch phỏng vấn ngay  
✅ Khi cần **quản lý nhiều lịch phỏng vấn** trong một nơi  
✅ Khi muốn **xem tất cả lịch phỏng vấn** (scheduled, completed, cancelled)  
✅ Khi cần **thêm/xóa thành viên hội đồng** sau khi đã tạo interview  

### Workflow:
1. Chọn **Application** (ứng viên đã nộp hồ sơ)
2. Điền thông tin phỏng vấn:
   - Thời gian (`scheduled_at`)
   - Thời lượng (`duration`)
   - Hình thức (`VIDEO`, `PHONE`, `ONSITE`)
   - Địa điểm/Link (`location`)
3. (Tùy chọn) Chọn **thành viên hội đồng** ngay khi tạo
4. Tạo interview → Tự động tạo panel members nếu có
5. Quản lý interview: xem, chỉnh sửa, hủy, thêm feedback

### Đặc điểm:
- **Tập trung vào lịch phỏng vấn**: Xem tất cả interviews, filter theo status/type
- **Quản lý đơn giản**: Tạo interview nhanh, không cần setup phức tạp
- **Thêm thành viên sau**: Có thể thêm/xóa panel members sau khi tạo interview
- **Feedback trực tiếp**: Có thể submit feedback và result ngay trong trang này

---

## 👥 Tạo Hội đồng Tuyển dụng (`/interview-panels`)

### Mục đích:
- **Tạo và quản lý hội đồng tuyển dụng** một cách có tổ chức
- Tập trung vào **quản lý thành viên hội đồng** và **chấm điểm**
- Phù hợp cho **quy trình tuyển dụng chính thức** với nhiều thành viên

### Khi nào dùng:
✅ Khi cần **tạo hội đồng tuyển dụng chính thức** với nhiều thành viên  
✅ Khi muốn **quản lý hội đồng độc lập** (không chỉ gắn với 1 interview)  
✅ Khi cần **chấm điểm ứng viên** bởi nhiều thành viên  
✅ Khi muốn **tự động tính điểm trung bình** và đưa ra quyết định  
✅ Khi cần **tạo interview mới** kèm theo hội đồng ngay từ đầu  

### Workflow:
1. Chọn **Job** (vị trí tuyển dụng)
2. Chọn cách tạo:
   - **Tạo interview mới**: Chọn ứng viên, điền thông tin interview
   - **Sử dụng interview có sẵn**: Chọn interview đã có
3. **Thêm thành viên hội đồng** (bắt buộc):
   - Chọn từ danh sách users (RECRUITER, ADMIN, INTERVIEWER)
   - Gán role: LEAD, MEMBER, OBSERVER
4. Tạo hội đồng → Tự động tạo interview (nếu chọn tạo mới)
5. **Chấm điểm**: Mỗi thành viên chấm điểm (0-100) và đưa feedback
6. **Tự động đưa ra quyết định**:
   - Khi tất cả thành viên đã chấm điểm
   - Tính điểm trung bình (có trọng số: LEAD = 1.5, MEMBER = 1.0)
   - Điểm >= 70: PASS → Tự động tạo OFFER
   - Điểm < 70: FAIL

### Đặc điểm:
- **Tập trung vào hội đồng**: Xem tất cả panels, filter theo job/status
- **Quản lý thành viên**: Thêm/xóa thành viên, gán role
- **Chấm điểm chi tiết**: Mỗi thành viên chấm điểm riêng, có feedback
- **Tự động hóa**: Tự động tính điểm, đưa ra quyết định, tạo OFFER
- **Thống kê**: Xem điểm trung bình, số thành viên đã chấm

---

## 📊 So sánh chi tiết

| Tiêu chí | Lên lịch Phỏng vấn | Tạo Hội đồng Tuyển dụng |
|----------|-------------------|------------------------|
| **Mục đích chính** | Quản lý lịch phỏng vấn | Quản lý hội đồng và chấm điểm |
| **Tập trung vào** | Interview (lịch, status) | Panel (thành viên, điểm số) |
| **Tạo interview** | ✅ Bắt buộc | ✅ Tùy chọn (có thể dùng interview có sẵn) |
| **Thêm thành viên** | ✅ Tùy chọn (có thể thêm sau) | ✅ Bắt buộc (phải có ít nhất 1 thành viên) |
| **Chấm điểm** | ❌ Không có | ✅ Có (mỗi thành viên chấm riêng) |
| **Tự động tính điểm** | ❌ Không | ✅ Có (có trọng số) |
| **Tự động đưa ra quyết định** | ❌ Không (phải submit thủ công) | ✅ Có (PASS/FAIL tự động) |
| **Tự động tạo OFFER** | ❌ Không | ✅ Có (khi điểm >= 70) |
| **Quản lý lịch** | ✅ Tốt (xem tất cả interviews) | ⚠️ Hạn chế (chỉ xem panels) |
| **Quản lý thành viên** | ⚠️ Hạn chế (thêm/xóa đơn giản) | ✅ Tốt (quản lý chi tiết) |
| **Phù hợp cho** | Workflow đơn giản, nhanh | Quy trình chính thức, nhiều thành viên |

---

## 🎯 Khi nào dùng cái nào?

### Dùng **Lên lịch Phỏng vấn** khi:
1. ✅ Bạn đã chọn được ứng viên và muốn lên lịch ngay
2. ✅ Chỉ cần 1-2 người phỏng vấn (không cần hội đồng chính thức)
3. ✅ Muốn quản lý tất cả lịch phỏng vấn ở một nơi
4. ✅ Cần linh hoạt thêm/xóa thành viên sau
5. ✅ Phỏng vấn đơn giản, không cần chấm điểm chi tiết

### Dùng **Tạo Hội đồng Tuyển dụng** khi:
1. ✅ Cần hội đồng tuyển dụng chính thức (3+ thành viên)
2. ✅ Cần chấm điểm chi tiết bởi nhiều thành viên
3. ✅ Muốn tự động tính điểm và đưa ra quyết định
4. ✅ Cần quản lý role của thành viên (LEAD, MEMBER, OBSERVER)
5. ✅ Muốn tự động tạo OFFER khi ứng viên đạt điểm cao
6. ✅ Quy trình tuyển dụng chính thức, có nhiều vòng

---

## 📝 Khi nào ứng viên xuất hiện trong dropdown?

### Trong "Tạo Hội đồng Tuyển dụng":
Ứng viên xuất hiện trong dropdown khi:
- ✅ Application có **status** là một trong: `PENDING`, `SCREENING`, `INTERVIEW`
- ✅ Application thuộc về **Job** đã chọn
- ✅ Application chưa bị REJECTED hoặc ACCEPTED

### Trong "Lên lịch Phỏng vấn":
Ứng viên xuất hiện trong dropdown khi:
- ✅ Application có **status** là một trong: `PENDING`, `SCREENING`, `INTERVIEW`
- ✅ Application thuộc về các Job của recruiter (hoặc tất cả nếu là ADMIN)

### Lưu ý:
- ❌ Application với status `OFFER`, `REJECTED`, `ACCEPTED` **KHÔNG** xuất hiện
- ✅ Application mới nộp (status `PENDING`) sẽ xuất hiện ngay
- ✅ Application đang được AI screening (status `SCREENING`) cũng xuất hiện
- ✅ Application đã có interview (status `INTERVIEW`) vẫn có thể tạo interview mới (vòng 2, vòng 3...)

---

## 🔧 Tạo thành viên hội đồng

### Cách 1: Tạo user với role INTERVIEWER
1. Vào **Admin → Quản lý thành viên hội đồng** (`/admin/interviewers`)
2. Nhấn **"Thêm thành viên mới"**
3. Điền thông tin:
   - Email (bắt buộc)
   - Tên (bắt buộc)
   - Số điện thoại (tùy chọn)
   - Mật khẩu (bắt buộc)
   - Role: Tự động là `INTERVIEWER`
4. Nhấn **"Tạo mới"**

### Cách 2: Dùng user có sẵn
- Users với role `RECRUITER`, `ADMIN`, hoặc `INTERVIEWER` đều có thể làm thành viên hội đồng
- Khi tạo hội đồng, hệ thống sẽ tự động lấy danh sách users có các role này

### Vai trò trong hội đồng:
- **LEAD** (Trưởng hội đồng): Trọng số 1.5 khi tính điểm trung bình
- **MEMBER** (Thành viên): Trọng số 1.0 khi tính điểm trung bình
- **OBSERVER** (Quan sát viên): Không tham gia chấm điểm, chỉ quan sát

---

## 💡 Best Practices

1. **Lên lịch phỏng vấn đơn giản** → Dùng `/interviews`
2. **Hội đồng tuyển dụng chính thức** → Dùng `/interview-panels`
3. **Tạo thành viên hội đồng trước** → Vào `/admin/interviewers` để tạo
4. **Chấm điểm chi tiết** → Dùng `/interview-panels` để mỗi thành viên chấm riêng
5. **Tự động hóa quyết định** → Dùng `/interview-panels` để tự động tính điểm và tạo OFFER

---

## 🎓 Tóm tắt

| | Lên lịch Phỏng vấn | Tạo Hội đồng Tuyển dụng |
|---|---|---|
| **Dùng khi** | Cần lên lịch nhanh, đơn giản | Cần hội đồng chính thức, chấm điểm |
| **Tính năng chính** | Quản lý lịch, thêm feedback | Quản lý thành viên, chấm điểm, tự động quyết định |
| **Tự động hóa** | Thấp | Cao (tính điểm, đưa ra quyết định, tạo OFFER) |

Cả 2 chức năng đều tạo **Interview** và **InterviewPanel**, nhưng phục vụ các mục đích khác nhau trong quy trình tuyển dụng.

