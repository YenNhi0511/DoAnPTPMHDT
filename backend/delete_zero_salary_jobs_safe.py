"""
Script an toàn hơn để xóa các công việc có lương 0 đồng
Script này sẽ:
1. Liệt kê các job có lương 0
2. Cho phép xem chi tiết
3. Xác nhận trước khi xóa
4. Có thể xóa từng job hoặc tất cả

Chạy: python manage.py shell
Sau đó: exec(open('delete_zero_salary_jobs_safe.py').read())
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from django.db import models
from jobs.models import Job

def delete_zero_salary_jobs_safe():
    """Xóa các công việc có lương 0 đồng (phiên bản an toàn)"""
    
    # Tìm các job có lương 0
    # Điều kiện: salary_min = 0 HOẶC salary_max = 0 HOẶC cả hai = 0
    # HOẶC cả hai null và salary là "0" hoặc rỗng
    zero_salary_jobs = Job.objects.filter(
        models.Q(salary_min=0) | 
        models.Q(salary_max=0) |
        models.Q(salary_min=0, salary_max=0) |
        models.Q(salary_min__isnull=True, salary_max__isnull=True, salary__in=['0', '0 đồng', ''])
    ).order_by('-created_at')
    
    count = zero_salary_jobs.count()
    
    if count == 0:
        print("✅ Không có công việc nào có lương 0 đồng.")
        return
    
    print("=" * 80)
    print(f"📊 TÌM THẤY {count} CÔNG VIỆC CÓ LƯƠNG 0 ĐỒNG")
    print("=" * 80)
    print()
    
    # Hiển thị danh sách
    for idx, job in enumerate(zero_salary_jobs, 1):
        company_name = job.created_by.company_name if hasattr(job.created_by, 'company_name') else job.created_by.email
        print(f"{idx}. {job.title}")
        print(f"   ID: {job.id}")
        print(f"   Công ty: {company_name}")
        print(f"   Lương min: {job.salary_min or 'N/A'}")
        print(f"   Lương max: {job.salary_max or 'N/A'}")
        print(f"   Lương (text): {job.salary or 'N/A'}")
        print(f"   Trạng thái: {job.status}")
        print(f"   Ngày tạo: {job.created_at.strftime('%d/%m/%Y %H:%M')}")
        print()
    
    print("=" * 80)
    print("LỰA CHỌN:")
    print("  1. Xóa TẤT CẢ các công việc trên")
    print("  2. Xem chi tiết từng công việc trước khi xóa")
    print("  3. Hủy")
    print("=" * 80)
    
    choice = input("Nhập lựa chọn (1/2/3): ").strip()
    
    if choice == '1':
        # Xóa tất cả
        confirm = input(f"⚠️  Bạn có CHẮC CHẮN muốn xóa {count} công việc? (yes/no): ")
        if confirm.lower() in ['yes', 'y', 'có', 'c']:
            deleted_count, _ = zero_salary_jobs.delete()
            print(f"✅ Đã xóa thành công {deleted_count} công việc.")
        else:
            print("❌ Đã hủy thao tác.")
    
    elif choice == '2':
        # Xóa từng cái một
        deleted_count = 0
        for job in zero_salary_jobs:
            company_name = job.created_by.company_name if hasattr(job.created_by, 'company_name') else job.created_by.email
            print()
            print("-" * 80)
            print(f"Tiêu đề: {job.title}")
            print(f"Công ty: {company_name}")
            print(f"Lương min: {job.salary_min or 'N/A'}")
            print(f"Lương max: {job.salary_max or 'N/A'}")
            print(f"Lương (text): {job.salary or 'N/A'}")
            print(f"Trạng thái: {job.status}")
            print(f"Mô tả: {job.description[:100]}..." if len(job.description) > 100 else f"Mô tả: {job.description}")
            print("-" * 80)
            
            confirm = input("Xóa công việc này? (yes/no/skip): ").strip().lower()
            if confirm in ['yes', 'y', 'có', 'c']:
                job.delete()
                deleted_count += 1
                print("✅ Đã xóa.")
            elif confirm in ['skip', 's', 'bỏ qua']:
                print("⏭️  Đã bỏ qua.")
            else:
                print("❌ Đã hủy.")
                break
        
        print()
        print(f"✅ Đã xóa {deleted_count}/{count} công việc.")
    
    else:
        print("❌ Đã hủy thao tác.")

if __name__ == '__main__':
    delete_zero_salary_jobs_safe()

