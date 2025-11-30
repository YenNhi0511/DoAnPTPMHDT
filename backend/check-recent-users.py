"""
Script để kiểm tra các user mới đăng ký và trạng thái email verification
"""
import os
import sys
import django
from datetime import datetime, timedelta

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User

def check_recent_users():
    print("Kiem Tra User Moi Dang Ky")
    print("=" * 60)
    
    # Lấy các user đăng ký trong 30 phút gần đây
    time_threshold = datetime.now() - timedelta(minutes=30)
    
    recent_users = User.objects.filter(
        date_joined__gte=time_threshold
    ).order_by('-date_joined')
    
    print(f"\nTim thay {recent_users.count()} user dang ky trong 30 phut gan day:\n")
    
    for user in recent_users:
        print(f"Email: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   Role: {user.role}")
        print(f"   Da verify: {'Co' if user.is_email_verified else 'Chua'}")
        print(f"   Token: {user.email_verification_token or 'Chua co'}")
        print(f"   Gui luc: {user.email_verification_sent_at or 'Chua gui'}")
        print(f"   Dang ky luc: {user.date_joined}")
        
        if user.email_verification_token:
            from django.conf import settings
            backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
            verification_url = f"{backend_url}/api/users/verify-email/{user.email_verification_token}/"
            print(f"   Link xac thuc: {verification_url}")
        
        print("-" * 60)
    
    if recent_users.count() == 0:
        print("Khong co user nao dang ky trong 30 phut gan day.")
        print("\nThu tang thoi gian hoac kiem tra tat ca user:")
        all_users = User.objects.all().order_by('-date_joined')[:10]
        print(f"\n10 user moi nhat:")
        for user in all_users:
            print(f"   - {user.email} ({user.date_joined})")

if __name__ == "__main__":
    check_recent_users()

