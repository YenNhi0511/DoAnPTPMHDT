"""
Script để kiểm tra users trùng lặp trong database
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

def check_duplicates():
    """Kiểm tra users trùng lặp"""
    print("=" * 60)
    print("KIEM TRA USERS TRUNG LAP")
    print("=" * 60)
    print()
    
    # Lấy tất cả users
    all_users = User.objects.all().order_by('email')
    
    print(f"Tong so users: {all_users.count()}")
    print()
    
    # Kiểm tra email trùng
    emails = {}
    for user in all_users:
        email = user.email.lower().strip()
        if email in emails:
            emails[email].append(user)
        else:
            emails[email] = [user]
    
    duplicate_emails = {email: users for email, users in emails.items() if len(users) > 1}
    
    if duplicate_emails:
        print(f"⚠️  Tim thay {len(duplicate_emails)} email trung lap:")
        for email, users in duplicate_emails.items():
            print(f"\n   Email: {email}")
            for user in users:
                print(f"      - ID: {user.id}, Username: {user.username}, Created: {user.date_joined}")
    else:
        print("✅ Khong co email trung lap")
    
    print()
    
    # Kiểm tra username trùng
    usernames = {}
    for user in all_users:
        username = user.username.lower().strip()
        if username in usernames:
            usernames[username].append(user)
        else:
            usernames[username] = [user]
    
    duplicate_usernames = {username: users for username, users in usernames.items() if len(users) > 1}
    
    if duplicate_usernames:
        print(f"⚠️  Tim thay {len(duplicate_usernames)} username trung lap:")
        for username, users in duplicate_usernames.items():
            print(f"\n   Username: {username}")
            for user in users:
                print(f"      - ID: {user.id}, Email: {user.email}, Created: {user.date_joined}")
    else:
        print("✅ Khong co username trung lap")
    
    print()
    print("=" * 60)
    print("DANH SACH 10 USER MOI NHAT:")
    print("=" * 60)
    recent_users = User.objects.all().order_by('-date_joined')[:10]
    for user in recent_users:
        print(f"  - {user.email} ({user.username}) - {user.date_joined}")

if __name__ == "__main__":
    check_duplicates()

