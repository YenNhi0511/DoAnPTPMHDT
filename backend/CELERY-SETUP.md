# 🔧 Hướng dẫn Setup Celery với Redis

## ❌ Lỗi hiện tại

```
Cannot connect to amqp://guest:**@127.0.0.1:5672//
WinError 10061: No connection could be made
```

**Nguyên nhân:** Celery đang cố kết nối RabbitMQ nhưng RabbitMQ chưa được cài đặt/chạy.

---

## ✅ Giải pháp: Dùng Redis (Đơn giản hơn)

Redis đơn giản hơn và đã có trong `requirements.txt`.

### Bước 1: Cài đặt Redis

#### Windows:

**Option 1: Dùng WSL (Recommended)**
```bash
# Trong WSL
sudo apt update
sudo apt install redis-server
redis-server
```

**Option 2: Dùng Memurai (Windows native)**
1. Download: https://www.memurai.com/get-memurai
2. Cài đặt và chạy

**Option 3: Dùng Docker (Nếu có Docker)**
```bash
docker run -d -p 6379:6379 redis:latest
```

#### Mac:
```bash
brew install redis
brew services start redis
```

#### Linux:
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
```

### Bước 2: Kiểm tra Redis đang chạy

```bash
# Test kết nối
redis-cli ping
# Kết quả: PONG
```

### Bước 3: Cấu hình đã được thêm vào settings.py

Cấu hình Celery đã được thêm vào `settings.py`:
```python
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
```

### Bước 4: Chạy Celery Worker

```bash
cd backend
celery -A recruitment_system worker -l info
```

**Kết quả mong đợi:**
```
[tasks]
  . applications.tasks.parse_cv_task
  . applications.tasks.screen_cv_task
  . applications.tasks.send_confirmation_email_task
  ...
  
[2025-11-29 12:00:00,000: INFO/MainProcess] celery@hostname ready.
```

---

## 🔄 Nếu muốn dùng RabbitMQ

### Cài đặt RabbitMQ

#### Windows:
1. Download Erlang: https://www.erlang.org/downloads
2. Download RabbitMQ: https://www.rabbitmq.com/download.html
3. Cài đặt và chạy RabbitMQ service

#### Mac:
```bash
brew install rabbitmq
brew services start rabbitmq
```

#### Linux:
```bash
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
```

### Cấu hình

Thêm vào `settings.py`:
```python
CELERY_BROKER_URL = 'amqp://guest:guest@localhost:5672//'
CELERY_RESULT_BACKEND = 'rpc://'
```

---

## 🧪 Test Celery

### Test 1: Kiểm tra worker đang chạy

```bash
celery -A recruitment_system inspect active
```

### Test 2: Test task

```bash
python manage.py shell
```

```python
from applications.tasks import debug_task
result = debug_task.delay()
print(result.get())
```

### Test 3: Test với application

1. Nộp hồ sơ qua frontend
2. Xem logs trong Celery worker
3. Kiểm tra database có `ai_score` không

---

## 🐛 Troubleshooting

### Vấn đề: Redis không kết nối được

**Giải pháp:**
1. Kiểm tra Redis đang chạy: `redis-cli ping`
2. Kiểm tra port 6379 không bị block
3. Thử restart Redis

### Vấn đề: Celery vẫn cố kết nối RabbitMQ

**Giải pháp:**
1. Kiểm tra `settings.py` có `CELERY_BROKER_URL` không
2. Restart Django server
3. Restart Celery worker

### Vấn đề: Tasks không chạy

**Giải pháp:**
1. Kiểm tra Celery worker đang chạy
2. Kiểm tra logs: `celery -A recruitment_system worker -l info`
3. Kiểm tra Redis connection

---

## 📝 Checklist

- [ ] Redis đã được cài đặt
- [ ] Redis đang chạy (`redis-cli ping` → PONG)
- [ ] `settings.py` có cấu hình `CELERY_BROKER_URL`
- [ ] Celery worker chạy không lỗi
- [ ] Test task thành công

---

## 🚀 Quick Start

```bash
# Terminal 1: Redis (nếu chưa chạy service)
redis-server

# Terminal 2: Django
python manage.py runserver

# Terminal 3: Celery
celery -A recruitment_system worker -l info
```

---

**Sau khi setup xong, Celery sẽ hoạt động bình thường! 🎉**

