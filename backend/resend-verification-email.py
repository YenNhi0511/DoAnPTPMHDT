"""
Script để gửi lại email verification cho user
"""
import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from accounts.tasks import send_verification_email_task

def resend_verification():
    print("📧 Gửi lại Email Verification")
    print("=" * 50)
    
    # Nhập email
    email = input("\nNhập email cần gửi lại verification (ví dụ: trucnguyen102004.dev+user4@gmail.com): ").strip()
    if not email:
        print("❌ Email không được để trống!")
        return
    
    try:
        # Tìm user
        user = User.objects.get(email=email)
        
        print(f"\n📋 Thông tin user:")
        print(f"   Email: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   Role: {user.role}")
        print(f"   Đã verify: {'✅ Có' if user.is_email_verified else '❌ Chưa'}")
        
        if user.is_email_verified:
            print("\n⚠️  User đã verify email rồi, không cần gửi lại!")
            return
        
        # Gửi email verification
        print(f"\n🔄 Đang gửi email verification...")
        try:
            send_verification_email_task(str(user.id))
            print(f"✅ Email verification đã được gửi đến {user.email}")
            print(f"\n📬 Vui lòng kiểm tra:")
            print(f"   - Hộp thư đến")
            print(f"   - Mục Spam")
            print(f"   - Mục Promotions")
        except Exception as e:
            print(f"❌ Lỗi khi gửi email: {e}")
            import traceback
            traceback.print_exc()
            
    except User.DoesNotExist:
        print(f"❌ Không tìm thấy user với email: {email}")
        print(f"\n💡 Gợi ý:")
        print(f"   - Kiểm tra lại email đã đúng chưa")
        print(f"   - Email có thể là: trucnguyen102004.dev+user4@gmail.com (không có dấu cách)")
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    resend_verification()

