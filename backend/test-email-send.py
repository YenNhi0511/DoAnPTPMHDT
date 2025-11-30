"""
Script để test gửi email
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    print("📧 Test Gửi Email")
    print("=" * 50)
    
    # Kiểm tra cấu hình
    print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    password_status = 'SET' if settings.EMAIL_HOST_PASSWORD else 'NOT SET'
    if settings.EMAIL_HOST_PASSWORD:
        # Kiểm tra xem có phải placeholder không
        if 'your-app-password' in settings.EMAIL_HOST_PASSWORD.lower() or 'placeholder' in settings.EMAIL_HOST_PASSWORD.lower():
            password_status = 'PLACEHOLDER (Cần thay bằng App Password thật)'
        else:
            password_status = f'SET (Length: {len(settings.EMAIL_HOST_PASSWORD)})'
    print(f"EMAIL_HOST_PASSWORD: {password_status}")
    print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    print("-" * 50)
    
    # Cảnh báo nếu là console backend
    if 'console' in settings.EMAIL_BACKEND.lower():
        print("⚠️  CẢNH BÁO: Đang dùng Console Backend (chỉ in ra terminal, không gửi email thật)")
        print("   Cần set EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend trong file .env")
        print("-" * 50)
    
    # Nhập email nhận
    to_email = input("\nNhập email để test (ví dụ: trucnguyen102004@gmail.com): ").strip()
    if not to_email:
        to_email = "trucnguyen102004@gmail.com"
        print(f"Sử dụng email mặc định: {to_email}")
    
    # Gửi email test
    try:
        print("\n🔄 Đang gửi email...")
        send_mail(
            subject='Test Email từ GoodCV',
            message='Đây là email test từ hệ thống GoodCV. Nếu bạn nhận được email này, cấu hình email đã hoạt động!',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
        print(f"✅ Email đã được gửi đến {to_email}")
        print("\n📬 Vui lòng kiểm tra:")
        print("   - Hộp thư đến")
        print("   - Mục Spam")
        print("   - Mục Promotions")
    except Exception as e:
        print(f"❌ Lỗi khi gửi email: {e}")
        print(f"   Loại lỗi: {type(e).__name__}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_email()

