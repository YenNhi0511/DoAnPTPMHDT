"""
Script để xóa các công việc có lương 0 đồng
Chạy: python manage.py shell < delete_zero_salary_jobs.py
Hoặc: python manage.py runscript delete_zero_salary_jobs (nếu dùng django-extensions)
Hoặc: python delete_zero_salary_jobs.py (sau khi set Django environment)
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from jobs.models import Job

def delete_zero_salary_jobs():
    """Xóa các công việc có lương 0 đồng"""
    
    # Tìm các job có salary_min = 0 hoặc salary_max = 0 hoặc cả hai = 0
    # Hoặc cả hai đều null và salary là "0" hoặc rỗng
    zero_salary_jobs = Job.objects.filter(
        models.Q(salary_min=0) | 
        models.Q(salary_max=0) |
        models.Q(salary_min=0, salary_max=0) |
        models.Q(salary_min__isnull=True, salary_max__isnull=True, salary__in=['0', '0 đồng', ''])
    )
    
    # Đếm số lượng trước khi xóa
    count = zero_salary_jobs.count()
    
    if count == 0:
        print("✅ Không có công việc nào có lương 0 đồng.")
        return
    
    print(f"📊 Tìm thấy {count} công việc có lương 0 đồng:")
    print("-" * 80)
    
    # Hiển thị danh sách trước khi xóa
    for job in zero_salary_jobs:
        print(f"  - ID: {job.id}")
        print(f"    Tiêu đề: {job.title}")
        print(f"    Công ty: {job.created_by.company_name or job.created_by.email}")
        print(f"    Lương min: {job.salary_min or 'N/A'}")
        print(f"    Lương max: {job.salary_max or 'N/A'}")
        print(f"    Lương: {job.salary or 'N/A'}")
        print(f"    Trạng thái: {job.status}")
        print()
    
    # Xác nhận trước khi xóa
    print("-" * 80)
    confirm = input(f"⚠️  Bạn có chắc chắn muốn xóa {count} công việc này? (yes/no): ")
    
    if confirm.lower() in ['yes', 'y', 'có', 'c']:
        # Xóa các job
        deleted_count, _ = zero_salary_jobs.delete()
        print(f"✅ Đã xóa thành công {deleted_count} công việc có lương 0 đồng.")
    else:
        print("❌ Đã hủy thao tác xóa.")

if __name__ == '__main__':
    from django.db import models
    delete_zero_salary_jobs()

