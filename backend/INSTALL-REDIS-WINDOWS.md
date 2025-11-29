# 🪟 Cài đặt Redis trên Windows

## ❌ Lỗi hiện tại

```
'redis-cli' is not recognized as an internal or external command
```

**Nguyên nhân:** Redis chưa được cài đặt trên Windows.

---

## ✅ Giải pháp (Chọn 1 trong 3)

### Option 1: Dùng Memurai (Dễ nhất - Recommended) ⭐

**Memurai** là Redis tương thích cho Windows.

#### Bước 1: Download và cài đặt

1. Truy cập: https://www.memurai.com/get-memurai
2. Download **Memurai Developer Edition** (Free)
3. Cài đặt như bình thường

#### Bước 2: Kiểm tra

Memurai sẽ tự động chạy như Windows Service.

```bash
# Kiểm tra service
sc query Memurai

# Hoặc kiểm tra port
netstat -an | findstr 6379
```

#### Bước 3: Test

```bash
# Nếu có redis-cli trong PATH
redis-cli ping

# Hoặc dùng Python
python -c "import redis; r = redis.Redis(); print(r.ping())"
```

---

### Option 2: Dùng WSL (Windows Subsystem for Linux)

#### Bước 1: Cài WSL (nếu chưa có)

```powershell
# Chạy PowerShell as Administrator
wsl --install
```

#### Bước 2: Mở WSL và cài Redis

```bash
# Trong WSL terminal
sudo apt update
sudo apt install redis-server -y
```

#### Bước 3: Chạy Redis

```bash
# Trong WSL
redis-server
```

**Lưu ý:** Cần giữ terminal này mở.

#### Bước 4: Test từ Windows

```bash
# Từ Windows terminal
wsl redis-cli ping
```

---

### Option 3: Dùng Docker (Nếu có Docker Desktop)

#### Bước 1: Cài Docker Desktop

Download: https://www.docker.com/products/docker-desktop

#### Bước 2: Chạy Redis container

```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

#### Bước 3: Kiểm tra

```bash
docker ps
docker exec -it redis redis-cli ping
```

#### Bước 4: Dừng/Start container

```bash
# Dừng
docker stop redis

# Start lại
docker start redis
```

---

## 🚀 Quick Start Script

Tạo file `start-redis.bat` để tự động chạy Redis:

### Nếu dùng Docker:

```batch
@echo off
echo Starting Redis with Docker...
docker start redis 2>nul || docker run -d -p 6379:6379 --name redis redis:latest
echo Redis is running on port 6379
pause
```

### Nếu dùng WSL:

```batch
@echo off
echo Starting Redis with WSL...
wsl redis-server
pause
```

---

## 🧪 Test Redis Connection

### Test 1: Dùng Python

```bash
cd backend
python
```

```python
import redis
r = redis.Redis(host='localhost', port=6379, db=0)
print(r.ping())  # Kết quả: True
```

### Test 2: Dùng Celery

```bash
cd backend
celery -A recruitment_system inspect ping
```

---

## 🔧 Cấu hình Celery

Cấu hình đã được thêm vào `settings.py`:

```python
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
```

Nếu Redis chạy trên host/port khác, sửa trong `.env`:

```env
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

---

## 📝 Checklist

- [ ] Redis/Memurai đã được cài đặt
- [ ] Redis đang chạy (port 6379)
- [ ] Test connection thành công
- [ ] Celery worker chạy không lỗi

---

## 🎯 Recommended: Memurai

**Tại sao chọn Memurai:**
- ✅ Native Windows, không cần WSL/Docker
- ✅ Tự động chạy như service
- ✅ Tương thích 100% với Redis
- ✅ Free cho development
- ✅ Dễ cài đặt

**Sau khi cài Memurai:**
1. Restart terminal
2. Chạy: `celery -A recruitment_system worker -l info`
3. Không cần chạy Redis thủ công (đã chạy như service)

---

## 🐛 Troubleshooting

### Vấn đề: Port 6379 đã được sử dụng

**Giải pháp:**
```bash
# Tìm process đang dùng port 6379
netstat -ano | findstr 6379

# Kill process (thay PID bằng số thực tế)
taskkill /PID <PID> /F
```

### Vấn đề: Celery vẫn không kết nối được

**Giải pháp:**
1. Kiểm tra Redis đang chạy: `netstat -an | findstr 6379`
2. Test connection: `python -c "import redis; r = redis.Redis(); print(r.ping())"`
3. Kiểm tra firewall không block port 6379
4. Restart Celery worker

---

**Sau khi cài Redis, Celery sẽ hoạt động bình thường! 🎉**

