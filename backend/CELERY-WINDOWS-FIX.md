# 🔧 Sửa lỗi Celery trên Windows

## ❌ Lỗi hiện tại

```
PermissionError: [WinError 5] Access is denied
```

**Nguyên nhân:** Celery đang dùng `prefork` pool (multiprocessing) không hoạt động tốt trên Windows.

---

## ✅ Giải pháp

### Option 1: Chạy với `--pool=solo` (Recommended)

**Windows không hỗ trợ tốt multiprocessing**, nên cần dùng `solo` pool:

```bash
celery -A recruitment_system worker -l info --pool=solo
```

**Hoặc dùng script:**
```bash
start-celery-windows.bat
```

### Option 2: Cấu hình tự động trong settings.py

Đã thêm cấu hình tự động trong `settings.py`:
- Windows: Tự động dùng `solo` pool
- Linux/Mac: Dùng `prefork` pool

**Nhưng vẫn cần chạy với flag:**
```bash
celery -A recruitment_system worker -l info --pool=solo
```

---

## 🎯 Kết quả mong đợi

Sau khi chạy với `--pool=solo`:

```
celery@DESKTOP-DA5JMVJ ready.
[tasks]
  . applications.tasks.parse_cv_task
  . applications.tasks.screen_cv_task
  ...
```

**Không còn lỗi PermissionError!**

---

## ⚠️ Lưu ý

### Solo Pool vs Prefork Pool

**Solo Pool (Windows):**
- ✅ Hoạt động tốt trên Windows
- ✅ Không có lỗi permission
- ❌ Single-threaded (chậm hơn)
- ❌ Không parallel processing

**Prefork Pool (Linux/Mac):**
- ✅ Multiprocessing (nhanh hơn)
- ✅ Parallel task execution
- ❌ Không hoạt động tốt trên Windows

### Khi nào dùng gì?

- **Development trên Windows:** Dùng `solo` pool
- **Production trên Linux:** Dùng `prefork` pool (mặc định)
- **Docker:** Dùng `prefork` pool

---

## 🧪 Test

Sau khi chạy với `--pool=solo`:

1. **Test task:**
   ```bash
   python manage.py shell
   ```
   ```python
   from applications.tasks import debug_task
   result = debug_task.delay()
   print(result.get())
   ```

2. **Test với application:**
   - Nộp hồ sơ qua frontend
   - Xem logs trong Celery worker
   - Kiểm tra tasks được xử lý

---

## 📝 Checklist

- [x] Redis đang chạy
- [x] Celery kết nối Redis thành công
- [ ] Chạy với `--pool=solo` flag
- [ ] Không còn lỗi PermissionError
- [ ] Tasks được xử lý thành công

---

## 🚀 Quick Start

```bash
# Chạy Celery với solo pool (Windows)
celery -A recruitment_system worker -l info --pool=solo

# Hoặc dùng script
start-celery-windows.bat
```

---

**Sau khi chạy với `--pool=solo`, Celery sẽ hoạt động bình thường trên Windows! 🎉**

