"""
Script nhanh để xóa các công việc có lương 0 đồng (không cần xác nhận)
CHỈ DÙNG KHI BẠN CHẮC CHẮN MUỐN XÓA TẤT CẢ

Chạy: python manage.py shell
Sau đó: exec(open('delete_zero_salary_jobs_quick.py').read())
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from django.db import models
from jobs.models import Job

# Tìm và xóa các job có lương 0
zero_salary_jobs = Job.objects.filter(
    models.Q(salary_min=0) | 
    models.Q(salary_max=0) |
    models.Q(salary_min=0, salary_max=0) |
    models.Q(salary_min__isnull=True, salary_max__isnull=True, salary__in=['0', '0 đồng', ''])
)

count = zero_salary_jobs.count()
print(f"Tìm thấy {count} công việc có lương 0 đồng")

if count > 0:
    deleted_count, _ = zero_salary_jobs.delete()
    print(f"✅ Đã xóa {deleted_count} công việc.")
else:
    print("✅ Không có công việc nào có lương 0 đồng.")

