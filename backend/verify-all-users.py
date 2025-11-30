"""
Script để verify tất cả users (trừ ADMIN - đã tự động verify)
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

def verify_all_users():
    """Verify tất cả users"""
    print("=" * 60)
    print("VERIFY TAT CA USERS")
    print("=" * 60)
    print()
    
    # Lấy tất cả users chưa verify (trừ ADMIN - đã tự động verify khi tạo)
    unverified = User.objects.filter(is_email_verified=False)
    
    print(f"Tong so users chua verify: {unverified.count()}")
    print()
    
    if unverified.count() == 0:
        print("✅ Tat ca users da duoc verify!")
        return
    
    print("Danh sach users chua verify:")
    for user in unverified:
        print(f"  - {user.email} (Role: {user.role}, Active: {user.is_active})")
    print()
    
    # Verify tất cả
    count = 0
    for user in unverified:
        # ADMIN đã được verify tự động khi tạo, nhưng nếu có ADMIN chưa verify thì verify luôn
        user.is_email_verified = True
        user.email_verification_token = None
        user.save()
        count += 1
        print(f"✅ Verified: {user.email}")
    
    print()
    print(f"✅ Da verify {count} users!")
    print()
    print("Bay gio tat ca users co the login!")

if __name__ == "__main__":
    verify_all_users()

