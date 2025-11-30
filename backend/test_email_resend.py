"""
Script test gửi email với Resend SMTP
Chạy: python test_email_resend.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    """Test gửi email đơn giản"""
    print("=" * 50)
    print("🧪 TEST GỬI EMAIL VỚI RESEND SMTP")
    print("=" * 50)
    
    # Kiểm tra cấu hình
    print(f"\n📋 Cấu hình hiện tại:")
    print(f"   EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"   EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"   EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"   EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"   EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    print(f"   DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    print(f"   EMAIL_HOST_PASSWORD: {'✅ Đã cấu hình' if settings.EMAIL_HOST_PASSWORD else '❌ Chưa cấu hình'}")
    
    # Nhập email để test
    print("\n" + "=" * 50)
    recipient = input("📧 Nhập email nhận thử nghiệm (hoặc Enter để dùng email mặc định): ").strip()
    if not recipient:
        recipient = "your-email@gmail.com"  # Thay bằng email của bạn
        print(f"   Sử dụng email mặc định: {recipient}")
    
    # Gửi email
    print("\n🚀 Đang gửi email...")
    try:
        send_mail(
            subject='✅ Test Email từ Django + Resend SMTP',
            message='''
Xin chào!

Đây là email test từ hệ thống tuyển dụng sử dụng Resend SMTP.

Nếu bạn nhận được email này, nghĩa là cấu hình email đã thành công! 🎉

Thông tin:
- Backend: Django
- Email Service: Resend SMTP
- Database: Neon PostgreSQL

Trân trọng,
Hệ thống Tuyển dụng
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
        )
        print("\n✅ Email đã được gửi thành công!")
        print(f"   📬 Kiểm tra inbox của: {recipient}")
        print(f"   ⚠️  Nếu không thấy, kiểm tra thư mục Spam")
        print(f"   📊 Xem logs tại: https://resend.com/emails")
        
    except Exception as e:
        print(f"\n❌ Lỗi gửi email: {e}")
        print("\n🔍 Kiểm tra:")
        print("   1. API key đã đúng chưa? (bắt đầu bằng 're_')")
        print("   2. Domain đã verify chưa? (hoặc dùng domain test)")
        print("   3. Kiểm tra file .env có đúng cấu hình không?")
        print("   4. Xem logs tại: https://resend.com/emails")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 50)

if __name__ == '__main__':
    test_email()

