"""
Script test đăng nhập
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

def test_login():
    """Test đăng nhập"""
    print("=" * 60)
    print("TEST DANG NHAP")
    print("=" * 60)
    print()
    
    # Hiển thị tất cả users
    all_users = User.objects.all()
    print(f"Tong so users: {all_users.count()}")
    print()
    
    if all_users.count() == 0:
        print("❌ Khong co user nao trong database!")
        return
    
    print("Danh sach users:")
    for user in all_users[:10]:
        print(f"  - {user.email} ({user.username}) - Role: {user.role} - Verified: {user.is_email_verified} - Active: {user.is_active}")
    print()
    
    # Test login với từng user
    print("=" * 60)
    print("TEST LOGIN")
    print("=" * 60)
    print()
    
    test_email = input("Nhap email de test login (hoac Enter de test tat ca): ").strip()
    
    if test_email:
        # Test với email cụ thể
        try:
            user = User.objects.get(email=test_email)
            print(f"\nUser: {user.email}")
            print(f"  Role: {user.role}")
            print(f"  Verified: {user.is_email_verified}")
            print(f"  Active: {user.is_active}")
            print(f"  Username: {user.username}")
            print()
            
            # Test authenticate
            password = input("Nhap password: ").strip()
            authenticated_user = authenticate(username=user.email, password=password)
            
            if authenticated_user:
                print("✅ Authenticate thanh cong!")
                if user.role != User.Role.ADMIN and not user.is_email_verified:
                    print("⚠️  User chua verify email - se bi chan login")
                else:
                    print("✅ User co the login")
            else:
                print("❌ Authenticate that bai - password sai!")
        except User.DoesNotExist:
            print(f"❌ Khong tim thay user voi email: {test_email}")
    else:
        # Test với tất cả users
        print("Test login voi tat ca users (password = 'test123'):")
        for user in all_users[:5]:
            print(f"\n  Testing: {user.email}")
            authenticated = authenticate(username=user.email, password='test123')
            if authenticated:
                print(f"    ✅ Authenticate OK")
                if user.role != User.Role.ADMIN and not user.is_email_verified:
                    print(f"    ⚠️  Se bi chan vi chua verify email")
                else:
                    print(f"    ✅ Co the login")
            else:
                print(f"    ❌ Authenticate FAIL - password sai hoac user khong ton tai")

if __name__ == "__main__":
    test_login()

