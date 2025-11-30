"""
Script tạo các thành viên hội đồng tuyển dụng (HR)
Chạy: python manage.py shell < seed_interviewers.py
Hoặc: python seed_interviewers.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from django.contrib.auth.hashers import make_password

# Danh sách các thành viên HR với format: (email, tên đầy đủ, chức vụ, phone)
HR_MEMBERS = [
    {
        'email': 'hr.manager@recruitment.com',
        'name': 'Nguyễn Thị Lan',
        'position': 'Trưởng phòng Nhân sự',
        'phone': '0912345678',
        'password': 'hr123456'
    },
    {
        'email': 'hr.director@recruitment.com',
        'name': 'Trần Văn Đức',
        'position': 'Giám đốc Nhân sự',
        'phone': '0912345679',
        'password': 'hr123456'
    },
    {
        'email': 'hr.senior@recruitment.com',
        'name': 'Lê Thị Hương',
        'position': 'Chuyên viên Tuyển dụng Cấp cao',
        'phone': '0912345680',
        'password': 'hr123456'
    },
    {
        'email': 'hr.specialist@recruitment.com',
        'name': 'Phạm Văn Minh',
        'position': 'Chuyên viên Tuyển dụng',
        'phone': '0912345681',
        'password': 'hr123456'
    },
    {
        'email': 'hr.assistant@recruitment.com',
        'name': 'Hoàng Thị Mai',
        'position': 'Trợ lý Tuyển dụng',
        'phone': '0912345682',
        'password': 'hr123456'
    },
    {
        'email': 'hr.lead@recruitment.com',
        'name': 'Vũ Văn Hùng',
        'position': 'Trưởng nhóm Tuyển dụng',
        'phone': '0912345683',
        'password': 'hr123456'
    },
    {
        'email': 'hr.coordinator@recruitment.com',
        'name': 'Đỗ Thị Linh',
        'position': 'Điều phối viên Tuyển dụng',
        'phone': '0912345684',
        'password': 'hr123456'
    },
    {
        'email': 'hr.consultant@recruitment.com',
        'name': 'Bùi Văn Tuấn',
        'position': 'Tư vấn Tuyển dụng',
        'phone': '0912345685',
        'password': 'hr123456'
    },
]

def create_hr_members():
    """Tạo các thành viên HR với role INTERVIEWER"""
    created_count = 0
    updated_count = 0
    
    for hr_data in HR_MEMBERS:
        # Tách tên và chức vụ
        full_name = hr_data['name']
        position = hr_data['position']
        
        # Tách họ và tên (giả sử tên cuối cùng là tên, phần còn lại là họ)
        name_parts = full_name.split()
        if len(name_parts) >= 2:
            first_name = ' '.join(name_parts[:-1])  # Họ và tên đệm
            last_name = name_parts[-1]  # Tên
        else:
            first_name = full_name
            last_name = ''
        
        # Tạo username từ email
        username = hr_data['email'].split('@')[0]
        
        # Tạo hoặc cập nhật user
        user, created = User.objects.get_or_create(
            email=hr_data['email'],
            defaults={
                'username': username,
                'first_name': f"{full_name} - {position}",  # Lưu format "Họ tên - Chức vụ" vào first_name
                'last_name': '',  # Để trống, vì đã có trong first_name
                'phone': hr_data.get('phone', ''),
                'role': User.Role.INTERVIEWER,
                'is_email_verified': True,
                'is_active': True,
            }
        )
        
        if created:
            # Set password cho user mới
            user.set_password(hr_data['password'])
            user.save()
            created_count += 1
            print(f"✅ Đã tạo: {full_name} - {position} ({hr_data['email']})")
        else:
            # Cập nhật thông tin nếu user đã tồn tại
            user.first_name = f"{full_name} - {position}"
            user.role = User.Role.INTERVIEWER
            user.is_email_verified = True
            user.is_active = True
            if hr_data.get('phone'):
                user.phone = hr_data['phone']
            user.save()
            updated_count += 1
            print(f"🔄 Đã cập nhật: {full_name} - {position} ({hr_data['email']})")
    
    print(f"\n{'='*60}")
    print(f"📊 Tổng kết:")
    print(f"   ✅ Đã tạo: {created_count} thành viên mới")
    print(f"   🔄 Đã cập nhật: {updated_count} thành viên")
    print(f"   📝 Tổng cộng: {len(HR_MEMBERS)} thành viên HR")
    print(f"{'='*60}")
    print(f"\n💡 Các thành viên HR có thể đăng nhập với:")
    print(f"   Email: hr.manager@recruitment.com")
    print(f"   Password: hr123456")
    print(f"   (Tương tự cho các email khác)")

if __name__ == '__main__':
    create_hr_members()

