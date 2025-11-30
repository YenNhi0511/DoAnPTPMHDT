"""
Script để test gửi email verification trực tiếp (giống như khi đăng ký)
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from accounts.tasks import send_verification_email_task
from django.conf import settings

def test_verification_email():
    print("📧 Test Gửi Email Verification (Giống Khi Đăng Ký)")
    print("=" * 60)
    
    # Kiểm tra cấu hình
    print(f"\n📋 Cấu hình Email:")
    print(f"   EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"   EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"   EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    print(f"   DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    print(f"   EMAIL_HOST_PASSWORD: {'✅ SET' if settings.EMAIL_HOST_PASSWORD else '❌ NOT SET'}")
    
    # Nhập email
    email = input("\nNhập email để test (ví dụ: trucnguyen102004.dev+user4@gmail.com): ").strip()
    if not email:
        email = "trucnguyen102004.dev+user4@gmail.com"
        print(f"Sử dụng email mặc định: {email}")
    
    try:
        # Tìm hoặc tạo user
        try:
            user = User.objects.get(email=email)
            print(f"\n✅ Tìm thấy user:")
            print(f"   Email: {user.email}")
            print(f"   Role: {user.role}")
            print(f"   Đã verify: {'✅ Có' if user.is_email_verified else '❌ Chưa'}")
        except User.DoesNotExist:
            print(f"\n❌ Không tìm thấy user với email: {email}")
            print(f"   Vui lòng đăng ký tài khoản trước!")
            return
        
        # Gửi email verification (giống như khi đăng ký)
        print(f"\n🔄 Đang gửi email verification...")
        print(f"   (Sử dụng cùng method như khi đăng ký)")
        
        try:
            # Gửi đồng bộ (giống như trong serializers.py)
            send_verification_email_task(str(user.id))
            
            print(f"\n✅ Email verification đã được gửi!")
            print(f"   To: {user.email}")
            print(f"   From: {settings.DEFAULT_FROM_EMAIL}")
            
            # Hiển thị link xác thực
            if user.email_verification_token:
                verification_url = f"{settings.FRONTEND_URL or 'http://localhost:3000'}/verify-email?token={user.email_verification_token}"
                print(f"\n🔗 Link xác thực:")
                print(f"   {verification_url}")
            
            print(f"\n📬 Vui lòng kiểm tra:")
            # Extract base email
            if '+' in email and '@' in email:
                base_email = email.split('@')[0].split('+')[0] + '@' + email.split('@')[1]
                print(f"   Email gốc: {base_email}")
            else:
                base_email = email
                print(f"   Email: {base_email}")
            
            print(f"   - Hộp thư đến")
            print(f"   - Mục Spam (Thư rác)")
            print(f"   - Mục Promotions (Quảng cáo)")
            print(f"   - Mục Updates (Cập nhật)")
            print(f"   - Mục All Mail (Tất cả thư)")
            print(f"\n   Tìm email từ: {settings.DEFAULT_FROM_EMAIL}")
            print(f"   Subject: 'Xác nhận email đăng ký tài khoản - GoodCV'")
            
        except Exception as e:
            print(f"\n❌ Lỗi khi gửi email verification: {e}")
            print(f"   Loại lỗi: {type(e).__name__}")
            import traceback
            traceback.print_exc()
            
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_verification_email()

