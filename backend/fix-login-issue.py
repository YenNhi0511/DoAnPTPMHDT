"""
Script để fix vấn đề đăng nhập
"""
import os
import sys
import django

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from django.contrib.auth import authenticate

def check_login_issues():
    """Kiểm tra các vấn đề đăng nhập"""
    print("=" * 60)
    print("KIEM TRA VAN DE DANG NHAP")
    print("=" * 60)
    print()
    
    # 1. Kiểm tra users
    all_users = User.objects.all()
    print(f"[1] Tong so users: {all_users.count()}")
    
    if all_users.count() == 0:
        print("❌ Khong co user nao trong database!")
        print("   Giai phap: Tao user moi hoac chay seed script")
        return
    
    # 2. Kiểm tra users chưa verify
    unverified = User.objects.filter(is_email_verified=False).exclude(role=User.Role.ADMIN)
    print(f"[2] Users chua verify email (trừ ADMIN): {unverified.count()}")
    if unverified.exists():
        print("   Danh sach:")
        for user in unverified[:5]:
            print(f"      - {user.email} (Role: {user.role})")
        print("   ⚠️  Cac users nay se bi chan login cho den khi verify email")
    
    # 3. Kiểm tra ADMIN users
    admin_users = User.objects.filter(role=User.Role.ADMIN)
    print(f"[3] ADMIN users: {admin_users.count()}")
    if admin_users.exists():
        print("   Danh sach:")
        for user in admin_users:
            print(f"      - {user.email} (Verified: {user.is_email_verified}, Active: {user.is_active})")
    
    # 4. Kiểm tra users bị inactive
    inactive = User.objects.filter(is_active=False)
    print(f"[4] Users bi inactive: {inactive.count()}")
    if inactive.exists():
        print("   Danh sach:")
        for user in inactive[:5]:
            print(f"      - {user.email}")
        print("   ⚠️  Cac users nay se bi chan login")
    
    print()
    print("=" * 60)
    print("GIAI PHAP")
    print("=" * 60)
    print()
    
    # Hỏi có muốn verify tất cả users không
    choice = input("Ban co muon verify email cho tat ca users (trừ ADMIN)? (y/n): ").strip().lower()
    if choice == 'y':
        count = 0
        for user in unverified:
            user.is_email_verified = True
            user.save()
            count += 1
        print(f"✅ Da verify {count} users!")
    
    # Hỏi có muốn activate tất cả users không
    choice2 = input("Ban co muon activate tat ca users? (y/n): ").strip().lower()
    if choice2 == 'y':
        count = 0
        for user in inactive:
            user.is_active = True
            user.save()
            count += 1
        print(f"✅ Da activate {count} users!")

if __name__ == "__main__":
    check_login_issues()

