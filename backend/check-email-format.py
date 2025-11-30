"""
Script để kiểm tra format email và test gửi
"""
import os
import django
import re

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from django.core.mail import send_mail
from django.conf import settings

def validate_email_format(email):
    """Kiểm tra format email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def check_email():
    print("🔍 Kiểm Tra Format Email")
    print("=" * 60)
    
    email = input("\nNhập email để kiểm tra (ví dụ: trucnguyen102004.dev+user4@gmail.com): ").strip()
    if not email:
        email = "trucnguyen102004.dev+user4@gmail.com"
        print(f"Sử dụng email mặc định: {email}")
    
    print(f"\n📋 Kiểm tra email: {email}")
    
    # Kiểm tra format
    is_valid = validate_email_format(email)
    print(f"   Format hợp lệ: {'✅ Có' if is_valid else '❌ Không'}")
    
    if not is_valid:
        print(f"\n❌ Email không đúng format!")
        print(f"   Email hợp lệ phải có dạng: username@domain.com")
        return
    
    # Kiểm tra có dấu cách không
    if ' ' in email:
        print(f"\n⚠️  CẢNH BÁO: Email có dấu cách!")
        print(f"   Email đúng: {email.replace(' ', '')}")
        email = email.replace(' ', '')
    
    # Kiểm tra user trong database
    try:
        user = User.objects.get(email=email)
        print(f"\n✅ Tìm thấy user trong database:")
        print(f"   Email: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   Role: {user.role}")
    except User.DoesNotExist:
        print(f"\n⚠️  Không tìm thấy user trong database với email: {email}")
        print(f"   Email có thể chưa được đăng ký hoặc format sai")
    
    # Test gửi email
    print(f"\n🧪 Test gửi email đến: {email}")
    response = input("   Bạn có muốn test gửi email không? (y/n): ").strip().lower()
    
    if response == 'y':
        try:
            print(f"\n🔄 Đang gửi email test...")
            send_mail(
                subject='Test Email Format - GoodCV',
                message=f'Đây là email test để kiểm tra format email: {email}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            print(f"✅ Email đã được gửi thành công!")
            print(f"\n📬 Vui lòng kiểm tra:")
            if '+' in email and '@' in email:
                base_email = email.split('@')[0].split('+')[0] + '@' + email.split('@')[1]
                print(f"   Email gốc: {base_email}")
            else:
                print(f"   Email: {email}")
            print(f"   - Hộp thư đến")
            print(f"   - Mục Spam")
            print(f"   - Mục Promotions")
        except Exception as e:
            print(f"\n❌ Lỗi khi gửi email: {e}")
            print(f"   Loại lỗi: {type(e).__name__}")
            
            # Phân tích lỗi
            error_str = str(e).lower()
            if 'address couldn\'t be found' in error_str or 'unable to receive mail' in error_str:
                print(f"\n💡 Nguyên nhân có thể:")
                print(f"   1. Email không tồn tại hoặc không hợp lệ")
                print(f"   2. Plus addressing không hoạt động với email này")
                print(f"   3. Email bị chặn hoặc không nhận được mail")
                print(f"\n🔧 Giải pháp:")
                print(f"   - Thử đăng ký với email gốc: trucnguyen102004@gmail.com")
                print(f"   - Hoặc thử email khác không có plus addressing")
                print(f"   - Kiểm tra email có đúng format không")
            
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    check_email()

