"""
Script để kiểm tra trạng thái email verification
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from django.conf import settings

def check_email_status():
    print("🔍 Kiểm Tra Trạng Thái Email Verification")
    print("=" * 60)
    
    # Nhập email
    email = input("\nNhập email cần kiểm tra (ví dụ: trucnguyen102004.dev+user4@gmail.com): ").strip()
    if not email:
        print("❌ Email không được để trống!")
        return
    
    try:
        # Tìm user
        user = User.objects.get(email=email)
        
        print(f"\n📋 Thông tin User:")
        print(f"   Email: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   Role: {user.role}")
        print(f"   Đã verify: {'✅ Có' if user.is_email_verified else '❌ Chưa'}")
        print(f"   Token: {user.email_verification_token or 'Chưa có'}")
        print(f"   Gửi lúc: {user.email_verification_sent_at or 'Chưa gửi'}")
        
        print(f"\n📧 Thông tin Email:")
        print(f"   Người gửi: {settings.DEFAULT_FROM_EMAIL}")
        print(f"   Backend: {settings.EMAIL_BACKEND}")
        print(f"   SMTP Host: {settings.EMAIL_HOST}")
        print(f"   SMTP Port: {settings.EMAIL_PORT}")
        print(f"   EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
        print(f"   EMAIL_HOST_PASSWORD: {'✅ SET' if settings.EMAIL_HOST_PASSWORD else '❌ NOT SET'}")
        
        if user.email_verification_token:
            verification_url = f"{settings.FRONTEND_URL or 'http://localhost:3000'}/verify-email?token={user.email_verification_token}"
            print(f"\n🔗 Link xác thực:")
            print(f"   {verification_url}")
        
        print(f"\n📬 Email sẽ đến hộp thư:")
        # Extract base email from plus addressing
        if '+' in email and '@' in email:
            base_email = email.split('@')[0].split('+')[0] + '@' + email.split('@')[1]
            print(f"   {base_email} (email gốc)")
            print(f"   Plus addressing: {email} → {base_email}")
        else:
            print(f"   {email}")
        
        print(f"\n💡 Hướng dẫn kiểm tra:")
        print(f"   1. Đăng nhập Gmail: {email.split('@')[1] if '@' in email else 'gmail.com'}")
        print(f"   2. Kiểm tra hộp thư đến")
        print(f"   3. Kiểm tra mục Spam (Thư rác)")
        print(f"   4. Kiểm tra mục Promotions (Quảng cáo)")
        print(f"   5. Kiểm tra mục Updates (Cập nhật)")
        print(f"   6. Kiểm tra mục All Mail (Tất cả thư)")
        print(f"   7. Tìm email từ: {settings.DEFAULT_FROM_EMAIL}")
        print(f"   8. Subject: 'Xác nhận email đăng ký tài khoản - GoodCV'")
        
        if not user.is_email_verified and user.email_verification_token:
            print(f"\n🔄 Bạn có muốn gửi lại email verification không? (y/n): ", end='')
            response = input().strip().lower()
            if response == 'y':
                from accounts.tasks import send_verification_email_task
                try:
                    send_verification_email_task(str(user.id))
                    print(f"✅ Email verification đã được gửi lại!")
                except Exception as e:
                    print(f"❌ Lỗi khi gửi email: {e}")
            
    except User.DoesNotExist:
        print(f"❌ Không tìm thấy user với email: {email}")
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_email_status()

