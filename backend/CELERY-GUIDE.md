# 🔄 Hướng dẫn Celery - Background Tasks

## Celery là gì?

**Celery** là hệ thống xử lý **background tasks** (tác vụ chạy ngầm) cho Django.

### Tại sao cần Celery?

Một số tác vụ mất nhiều thời gian, không nên chạy trong request/response:
- ✅ Gửi email (mất 2-5 giây)
- ✅ Xử lý file CV (parse PDF/DOCX)
- ✅ Sàng lọc CV bằng AI (mất 10-30 giây)
- ✅ Generate PDF (thư mời nhận việc)

**Không dùng Celery:** User phải đợi 30 giây → Trải nghiệm tệ  
**Dùng Celery:** User nhận response ngay, task chạy ngầm → Trải nghiệm tốt

---

## Lệnh Celery

```bash
celery -A recruitment_system worker -l info
```

### Giải thích từng phần:

- `celery` - Lệnh chạy Celery
- `-A recruitment_system` - Tên Django app (trong file `celery.py`)
- `worker` - Chạy worker để xử lý tasks
- `-l info` - Log level: `info` (hiển thị thông tin chi tiết)

### Các log levels:

- `-l debug` - Chi tiết nhất (dùng khi debug)
- `-l info` - Thông tin bình thường (khuyến nghị)
- `-l warning` - Chỉ hiển thị cảnh báo
- `-l error` - Chỉ hiển thị lỗi

---

## Cách sử dụng

### Bước 1: Cài Redis (Message Broker)

Celery cần Redis để gửi/nhận tasks.

#### Windows:

1. Tải Redis từ: https://github.com/microsoftarchive/redis/releases
2. Giải nén và chạy `redis-server.exe`
3. Hoặc dùng WSL: `wsl redis-server`

#### macOS:

```bash
brew install redis
brew services start redis
```

#### Linux:

```bash
sudo apt install redis-server
sudo systemctl start redis
```

#### Kiểm tra Redis đang chạy:

```bash
redis-cli ping
```

Nếu thấy `PONG` → Redis đang chạy ✅

### Bước 2: Cấu hình trong .env

Thêm vào `backend/.env`:

```env
REDIS_URL=redis://localhost:6379/0
```

### Bước 3: Chạy Celery Worker

Mở **Terminal mới** (giữ terminal backend đang chạy):

```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

celery -A recruitment_system worker -l info
```

**Kết quả mong đợi:**
```
[2024-11-27 10:00:00,000: INFO/MainProcess] Connected to redis://localhost:6379/0
[2024-11-27 10:00:00,100: INFO/MainProcess] celery@DESKTOP-XXX ready.
```

✅ Celery worker đang chạy và sẵn sàng nhận tasks!

---

## Các Tasks trong Project

Project có các Celery tasks sau:

### 1. `send_confirmation_email_task`
- **Khi nào chạy:** Khi có hồ sơ ứng tuyển mới
- **Chức năng:** Gửi email xác nhận cho ứng viên
- **Tự động:** Có (qua Django signals)

### 2. `parse_cv_task`
- **Khi nào chạy:** Sau khi nhận hồ sơ
- **Chức năng:** Parse file CV (PDF/DOCX) để lấy text
- **Tự động:** Có

### 3. `screen_cv_task`
- **Khi nào chạy:** Sau khi parse CV
- **Chức năng:** Sàng lọc CV bằng AI (Gemini API)
- **Tự động:** Có

### 4. `send_result_email_task`
- **Khi nào chạy:** Khi có kết quả tuyển dụng
- **Chức năng:** Gửi email thông báo kết quả
- **Tự động:** Có

### 5. `send_interview_email_task`
- **Khi nào chạy:** Khi tạo lịch phỏng vấn
- **Chức năng:** Gửi email thông báo lịch phỏng vấn
- **Tự động:** Có

### 6. `generate_offer_task`
- **Khi nào chạy:** Khi tạo offer letter
- **Chức năng:** Generate PDF thư mời nhận việc
- **Tự động:** Có

---

## Quy trình hoạt động

### Ví dụ: Ứng viên nộp hồ sơ

1. **User nộp hồ sơ** → Django nhận request
2. **Django tạo Application** → Lưu vào database
3. **Django Signal trigger** → Gọi Celery tasks
4. **Celery Worker nhận tasks** → Xử lý ngầm:
   - Gửi email xác nhận
   - Parse CV
   - Sàng lọc bằng AI
5. **User nhận response ngay** → Không phải đợi

---

## Chạy dự án đầy đủ

Để chạy đầy đủ, cần **3 terminals**:

### Terminal 1: Backend Server
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Terminal 2: Frontend Server
```bash
cd frontend
npm start
```

### Terminal 3: Celery Worker
```bash
cd backend
venv\Scripts\activate
celery -A recruitment_system worker -l info
```

---

## Không chạy Celery có sao không?

**Có thể chạy được**, nhưng:

❌ **Không có:**
- Email tự động không gửi được
- CV không được parse
- AI screening không chạy
- PDF không được generate

✅ **Vẫn có:**
- Đăng ký/đăng nhập
- Tạo/sửa/xóa jobs
- Xem danh sách
- API endpoints cơ bản

**Kết luận:** Celery là **optional** nhưng **khuyến nghị** để có đầy đủ tính năng.

---

## Troubleshooting

### Lỗi: `Error: No module named 'celery'`

**Giải pháp:**
```bash
pip install celery redis
```

### Lỗi: `Connection refused` (Redis)

**Giải pháp:**
1. Kiểm tra Redis đang chạy: `redis-cli ping`
2. Nếu chưa chạy, start Redis:
   - Windows: Chạy `redis-server.exe`
   - Mac: `brew services start redis`
   - Linux: `sudo systemctl start redis`

### Lỗi: `ModuleNotFoundError: No module named 'recruitment_system.celery'`

**Giải pháp:**
- Đảm bảo đang ở thư mục `backend/`
- Đảm bảo đã activate venv
- Kiểm tra file `recruitment_system/celery.py` tồn tại

### Tasks không chạy

**Kiểm tra:**
1. Celery worker đang chạy?
2. Redis đang chạy?
3. Logs trong Celery worker có hiển thị lỗi?

---

## Tóm tắt

| Câu hỏi | Trả lời |
|---------|---------|
| **Celery là gì?** | Hệ thống xử lý background tasks |
| **Tại sao cần?** | Để xử lý các tác vụ mất thời gian (email, AI, PDF) |
| **Có bắt buộc không?** | Không, nhưng khuyến nghị |
| **Cần cài gì?** | Redis (message broker) |
| **Lệnh chạy?** | `celery -A recruitment_system worker -l info` |

---

**Chúc bạn sử dụng Celery thành công! 🚀**

