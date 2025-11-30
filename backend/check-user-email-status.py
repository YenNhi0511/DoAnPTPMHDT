"""
Script để kiểm tra trạng thái user và email verification
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from accounts.tasks import send_verification_email_task
from django.conf import settings
from django.core.mail import send_mail

def check_and_resend():
    print("🔍 Kiểm Tra User và Email Verification")
    print("=" * 60)
    
    email = input("\nNhập email để kiểm tra (ví dụ: trucnguyen102004+user5@gmail.com): ").strip()
    if not email:
        email = "trucnguyen102004+user5@gmail.com"
        print(f"Sử dụng email mặc định: {email}")
    
    try:
        # Tìm user
        user = User.objects.get(email=email)
        
        print(f"\n✅ Tìm thấy user:")
        print(f"   Email: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   Role: {user.role}")
        print(f"   Đã verify: {'✅ Có' if user.is_email_verified else '❌ Chưa'}")
        print(f"   Token: {user.email_verification_token or 'Chưa có'}")
        print(f"   Gửi lúc: {user.email_verification_sent_at or 'Chưa gửi'}")
        
        # Hiển thị link xác thực
        if user.email_verification_token:
            verification_url = f"{settings.FRONTEND_URL or 'http://localhost:3000'}/verify-email?token={user.email_verification_token}"
            print(f"\n🔗 Link xác thực trực tiếp:")
            print(f"   {verification_url}")
        
        # Email sẽ đến đâu
        base_email = email.split('+')[0] + '@' + email.split('@')[1] if '+' in email else email
        print(f"\n📬 Email sẽ đến hộp thư:")
        print(f"   {base_email} (email gốc)")
        
        # Test gửi email đơn giản
        print(f"\n🧪 Test 1: Gửi email đơn giản...")
        try:
            send_mail(
                subject='Test Email - GoodCV',
                message=f'Đây là email test cho {email}. Nếu bạn nhận được email này, cấu hình email đang hoạt động!',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            print(f"   ✅ Email test đã được gửi!")
        except Exception as e:
            print(f"   ❌ Lỗi khi gửi email test: {e}")
            print(f"   Loại lỗi: {type(e).__name__}")
        
        # Test gửi email verification
        if not user.is_email_verified:
            print(f"\n🧪 Test 2: Gửi email verification...")
            try:
                send_verification_email_task(str(user.id))
                print(f"   ✅ Email verification đã được gửi!")
            except Exception as e:
                print(f"   ❌ Lỗi khi gửi email verification: {e}")
                print(f"   Loại lỗi: {type(e).__name__}")
                import traceback
                traceback.print_exc()
        
        print(f"\n📋 Hướng dẫn kiểm tra:")
        print(f"   1. Đăng nhập Gmail: {base_email}")
        print(f"   2. Kiểm tra hộp thư đến")
        print(f"   3. Kiểm tra mục Spam (Thư rác)")
        print(f"   4. Kiểm tra mục Promotions (Quảng cáo)")
        print(f"   5. Kiểm tra mục Updates (Cập nhật)")
        print(f"   6. Kiểm tra mục All Mail (Tất cả thư)")
        print(f"   7. Tìm email từ: {settings.DEFAULT_FROM_EMAIL}")
        
        if user.email_verification_token:
            print(f"\n💡 Hoặc dùng link xác thực trực tiếp ở trên (không cần email)")
            
    except User.DoesNotExist:
        print(f"\n❌ Không tìm thấy user với email: {email}")
        print(f"\n💡 Có thể:")
        print(f"   - User chưa được đăng ký")
        print(f"   - Email format sai")
        print(f"\n🔧 Giải pháp:")
        print(f"   - Đăng ký tài khoản mới với email: {email}")
        print(f"   - Hoặc kiểm tra lại email đã đúng chưa")
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_and_resend()

