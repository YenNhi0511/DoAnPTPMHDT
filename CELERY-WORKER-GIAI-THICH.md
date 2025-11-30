# 🔄 Celery Worker - Chức năng và Tại sao cần?

## 📋 Celery Worker là gì?

**Celery Worker** là một background worker xử lý các tác vụ chạy ngầm (asynchronous tasks) trong Django.

### Tại sao cần Celery?

Một số tác vụ mất nhiều thời gian, **KHÔNG NÊN** chạy trong request/response vì:
- ❌ User phải đợi 30 giây → Trải nghiệm tệ
- ❌ Server bị block → Không xử lý được request khác
- ❌ Timeout errors → Request bị lỗi

**Với Celery:**
- ✅ User nhận response ngay (1-2 giây)
- ✅ Task chạy ngầm trong background
- ✅ Server vẫn xử lý được request khác
- ✅ Trải nghiệm tốt hơn

---

## 🎯 Các chức năng Celery xử lý trong project này:

### 1. **Gửi Email** (`send_confirmation_email_task`)
- Khi ứng viên nộp CV → Gửi email xác nhận
- Khi có kết quả → Gửi email thông báo
- Khi có lịch phỏng vấn → Gửi email mời
- **Thời gian:** 2-5 giây

### 2. **Parse CV** (`parse_cv_task`)
- Đọc file CV (PDF/DOCX)
- Trích xuất thông tin: tên, email, kinh nghiệm, kỹ năng
- Lưu vào database
- **Thời gian:** 3-10 giây

### 3. **AI Screening CV** (`screen_cv_task`)
- Gửi CV đến Google Gemini API
- AI đánh giá CV phù hợp với job
- Tính điểm (0-100)
- Phân tích điểm mạnh/yếu
- **Thời gian:** 10-30 giây

### 4. **Generate Offer Letter** (`generate_offer_task`)
- Tạo file PDF thư mời nhận việc
- Điền thông tin: vị trí, lương, ngày bắt đầu
- Lưu vào media folder
- **Thời gian:** 2-5 giây

---

## 💡 Ví dụ thực tế:

### **KHÔNG có Celery:**
```
User nộp CV → Đợi 30 giây → Nhận response
❌ Trải nghiệm tệ, có thể timeout
```

### **CÓ Celery:**
```
User nộp CV → Nhận response ngay (1 giây) → Task chạy ngầm
✅ Trải nghiệm tốt, không phải đợi
```

---

## ⚠️ Nếu KHÔNG chạy Celery Worker:

- ❌ Email sẽ **KHÔNG được gửi**
- ❌ CV sẽ **KHÔNG được parse**
- ❌ AI screening sẽ **KHÔNG chạy**
- ❌ Offer letter sẽ **KHÔNG được tạo**
- ✅ Nhưng các chức năng khác vẫn hoạt động bình thường (UI, đăng nhập, xem danh sách...)

**Kết luận:** Celery **QUAN TRỌNG** nhưng **KHÔNG BẮT BUỘC** để test UI cơ bản.

---

## 🚀 Cách chạy Celery:

```bash
cd backend
venv\Scripts\activate
celery -A recruitment_system worker -l info --pool=solo
```

**Lưu ý:** 
- Cần Redis đang chạy trước
- `--pool=solo` chỉ cần cho Windows
- Mac/Linux: bỏ `--pool=solo`

