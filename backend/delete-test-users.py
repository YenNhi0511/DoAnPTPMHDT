"""
Script để xóa users test cũ
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
from datetime import datetime, timedelta

def delete_test_users():
    """Xóa users test"""
    print("=" * 60)
    print("XOA USERS TEST")
    print("=" * 60)
    print()
    
    # Hiển thị tất cả users
    all_users = User.objects.all().order_by('-date_joined')
    print(f"Tong so users: {all_users.count()}")
    print()
    
    # Lọc users test (có thể là users với email test hoặc users mới tạo gần đây)
    print("Danh sach users:")
    for i, user in enumerate(all_users, 1):
        print(f"  {i}. {user.email} ({user.username}) - {user.date_joined}")
    
    print()
    print("=" * 60)
    
    # Hỏi có muốn xóa users test không
    choice = input("Ban co muon xoa users test? (y/n): ").strip().lower()
    
    if choice != 'y':
        print("Khong xoa users.")
        return
    
    # Xóa users test (có thể filter theo email pattern hoặc date)
    print()
    print("Chon cach xoa:")
    print("  1. Xoa users theo email pattern (vd: test@, user@)")
    print("  2. Xoa users theo so luong (xoa N users moi nhat)")
    print("  3. Xoa user cu the theo email")
    
    delete_choice = input("Chon (1/2/3): ").strip()
    
    if delete_choice == '1':
        pattern = input("Nhap email pattern (vd: test, user): ").strip().lower()
        if pattern:
            users_to_delete = User.objects.filter(email__icontains=pattern)
            print(f"\nTim thay {users_to_delete.count()} users voi pattern '{pattern}':")
            for user in users_to_delete:
                print(f"  - {user.email}")
            
            confirm = input("\nXac nhan xoa? (y/n): ").strip().lower()
            if confirm == 'y':
                count = users_to_delete.count()
                users_to_delete.delete()
                print(f"✅ Da xoa {count} users!")
    
    elif delete_choice == '2':
        try:
            count = int(input("Nhap so luong users muon xoa (tu moi nhat): ").strip())
            users_to_delete = User.objects.all().order_by('-date_joined')[:count]
            print(f"\nSe xoa {users_to_delete.count()} users moi nhat:")
            for user in users_to_delete:
                print(f"  - {user.email} ({user.date_joined})")
            
            confirm = input("\nXac nhan xoa? (y/n): ").strip().lower()
            if confirm == 'y':
                deleted_count = 0
                for user in users_to_delete:
                    user.delete()
                    deleted_count += 1
                print(f"✅ Da xoa {deleted_count} users!")
        except ValueError:
            print("❌ So khong hop le!")
    
    elif delete_choice == '3':
        email = input("Nhap email user muon xoa: ").strip().lower()
        try:
            user = User.objects.get(email__iexact=email)
            print(f"\nTim thay user: {user.email} ({user.username})")
            confirm = input("Xac nhan xoa? (y/n): ").strip().lower()
            if confirm == 'y':
                user.delete()
                print(f"✅ Da xoa user {email}!")
        except User.DoesNotExist:
            print(f"❌ Khong tim thay user voi email: {email}")
    
    print()
    print("=" * 60)
    remaining = User.objects.count()
    print(f"Con lai {remaining} users trong database")

if __name__ == "__main__":
    delete_test_users()

