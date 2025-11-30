# Hướng dẫn xóa các công việc có lương 0 đồng

## 📋 Tổng quan

Script này sẽ tìm và xóa các công việc có:
- `salary_min = 0` HOẶC
- `salary_max = 0` HOẶC
- Cả hai `salary_min` và `salary_max` đều = 0 HOẶC
- Cả hai đều null và `salary` là "0" hoặc rỗng

## 🚀 Cách sử dụng

### Cách 1: Sử dụng script an toàn (KHUYẾN NGHỊ)

1. Mở terminal/command prompt
2. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```

3. Chạy script:
   ```bash
   python manage.py shell
   ```
   
4. Trong Django shell, chạy:
   ```python
   exec(open('delete_zero_salary_jobs_safe.py').read())
   ```

5. Script sẽ:
   - Hiển thị danh sách các công việc có lương 0
   - Cho bạn 3 lựa chọn:
     - **1**: Xóa tất cả
     - **2**: Xem chi tiết và xóa từng cái một
     - **3**: Hủy

### Cách 2: Sử dụng batch file (Windows)

1. Double-click vào file `delete-zero-salary-jobs.bat` trong thư mục `backend`
2. Script sẽ tự động chạy và hiển thị menu

### Cách 3: Script nhanh (KHÔNG KHUYẾN NGHỊ - Xóa ngay không hỏi)

⚠️ **CẢNH BÁO**: Script này sẽ xóa TẤT CẢ các công việc có lương 0 mà không hỏi lại!

```bash
cd backend
python manage.py shell
```

Sau đó:
```python
exec(open('delete_zero_salary_jobs_quick.py').read())
```

## 📊 Kiểm tra trước khi xóa

Để xem có bao nhiêu công việc có lương 0 trước khi xóa:

```bash
cd backend
python manage.py shell
```

Sau đó chạy:
```python
from jobs.models import Job
from django.db import models

zero_salary_jobs = Job.objects.filter(
    models.Q(salary_min=0) | 
    models.Q(salary_max=0) |
    models.Q(salary_min=0, salary_max=0) |
    models.Q(salary_min__isnull=True, salary_max__isnull=True, salary__in=['0', '0 đồng', ''])
)

print(f"Tìm thấy {zero_salary_jobs.count()} công việc có lương 0 đồng")

# Xem danh sách
for job in zero_salary_jobs[:10]:
    print(f"  - {job.title} (ID: {job.id})")
    print(f"    Lương min: {job.salary_min}, Lương max: {job.salary_max}")
    print(f"    Công ty: {job.created_by.company_name or job.created_by.email}")
    print()
```

## ⚠️ Lưu ý quan trọng

1. **Backup database trước khi xóa**: Đảm bảo bạn đã backup database trước khi chạy script xóa
2. **Kiểm tra kỹ**: Script sẽ hiển thị danh sách trước khi xóa, hãy kiểm tra kỹ
3. **Không thể hoàn tác**: Một khi đã xóa, không thể khôi phục (trừ khi có backup)
4. **Xóa cả applications**: Khi xóa job, tất cả applications liên quan cũng sẽ bị xóa (do foreign key cascade)

## 🔍 Các file script

- `delete_zero_salary_jobs_safe.py` - Script an toàn với menu lựa chọn (KHUYẾN NGHỊ)
- `delete_zero_salary_jobs_quick.py` - Script nhanh, xóa ngay không hỏi
- `delete_zero_salary_jobs.py` - Script cơ bản với xác nhận
- `delete-zero-salary-jobs.bat` - Batch file để chạy trên Windows

## 📝 Ví dụ output

```
==================================================
📊 TÌM THẤY 5 CÔNG VIỆC CÓ LƯƠNG 0 ĐỒNG
==================================================

1. Nhân viên bán hàng
   ID: abc-123-def-456
   Công ty: Công ty ABC
   Lương min: 0
   Lương max: 0
   Lương (text): N/A
   Trạng thái: OPEN
   Ngày tạo: 27/11/2024 10:30

...

==================================================
LỰA CHỌN:
  1. Xóa TẤT CẢ các công việc trên
  2. Xem chi tiết từng công việc trước khi xóa
  3. Hủy
==================================================
Nhập lựa chọn (1/2/3):
```

## ✅ Sau khi xóa

Sau khi xóa thành công, bạn có thể kiểm tra lại:

```python
from jobs.models import Job
from django.db import models

zero_salary_jobs = Job.objects.filter(
    models.Q(salary_min=0) | 
    models.Q(salary_max=0)
)

print(f"Còn lại {zero_salary_jobs.count()} công việc có lương 0 đồng")
```

