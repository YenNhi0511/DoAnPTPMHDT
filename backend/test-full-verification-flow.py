"""
Script test toàn bộ flow email verification
"""
import os
import sys
import django
from datetime import datetime

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from django.conf import settings
from accounts.models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
import secrets
from django.utils import timezone

def test_email_config():
    """Test cấu hình email"""
    print("=" * 60)
    print("TEST 1: Kiem tra cau hinh email")
    print("=" * 60)
    
    print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    print(f"EMAIL_HOST_PASSWORD: {'SET' if settings.EMAIL_HOST_PASSWORD else 'NOT SET'}")
    print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    print(f"FRONTEND_URL: {settings.FRONTEND_URL}")
    
    if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
        print("\n⚠️ WARNING: EMAIL_BACKEND la console, email se khong gui that!")
        return False
    
    if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
        print("\n⚠️ WARNING: EMAIL_HOST_USER hoac EMAIL_HOST_PASSWORD chua duoc set!")
        return False
    
    print("\n✅ Cau hinh email OK")
    return True

def test_send_simple_email():
    """Test gửi email đơn giản"""
    print("\n" + "=" * 60)
    print("TEST 2: Test gui email don gian")
    print("=" * 60)
    
    test_email = input("Nhap email de test (hoac Enter de bo qua): ").strip()
    if not test_email:
        print("Bo qua test gui email")
        return True
    
    try:
        subject = "Test Email - GoodCV"
        message = "Day la email test tu he thong GoodCV. Neu ban nhan duoc email nay, cau hinh email da hoat dong!"
        msg = EmailMultiAlternatives(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [test_email]
        )
        msg.send()
        print(f"✅ Email test da duoc gui den {test_email}")
        return True
    except Exception as e:
        print(f"❌ Loi khi gui email: {e}")
        print(f"   Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

def test_verification_email():
    """Test gửi email verification"""
    print("\n" + "=" * 60)
    print("TEST 3: Test gui email verification")
    print("=" * 60)
    
    email = input("Nhap email user de test (hoac Enter de bo qua): ").strip()
    if not email:
        print("Bo qua test verification email")
        return True
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        print(f"❌ User voi email {email} khong ton tai")
        return False
    
    # Tạo token
    if not user.email_verification_token:
        user.email_verification_token = secrets.token_urlsafe(32)
        user.email_verification_sent_at = timezone.now()
        user.save()
    
    # Tạo verification URL
    backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
    verification_url = f"{backend_url}/api/users/verify-email/{user.email_verification_token}/"
    
    subject = "Xac nhan email dang ky tai khoan - GoodCV"
    context = {
        'user': user,
        'verification_url': verification_url,
        'token': user.email_verification_token,
        'current_year': datetime.now().year,
    }
    
    try:
        text_content = render_to_string('email/verify_email.txt', context)
        html_content = render_to_string('email/verify_email.html', context)
    except Exception as e:
        print(f"⚠️ Template error: {e}")
        text_content = f"Xin chao {user.get_full_name() or user.username},\n\nVui long click vao link sau de xac nhan email:\n{verification_url}"
        html_content = None
    
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [user.email])
    if html_content:
        msg.attach_alternative(html_content, 'text/html')
    
    try:
        msg.send()
        print(f"✅ Email verification da duoc gui den {user.email}")
        print(f"   Link verification: {verification_url}")
        return True
    except Exception as e:
        print(f"❌ Loi khi gui email verification: {e}")
        print(f"   Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

def test_verification_link():
    """Test verification link"""
    print("\n" + "=" * 60)
    print("TEST 4: Test verification link")
    print("=" * 60)
    
    email = input("Nhap email user de test link (hoac Enter de bo qua): ").strip()
    if not email:
        print("Bo qua test verification link")
        return True
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        print(f"❌ User voi email {email} khong ton tai")
        return False
    
    if not user.email_verification_token:
        print(f"⚠️ User chua co verification token")
        return False
    
    backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
    verification_url = f"{backend_url}/api/users/verify-email/{user.email_verification_token}/"
    
    frontend_url = settings.FRONTEND_URL or 'http://localhost:3000'
    expected_redirect = f"{frontend_url}/login?verified=success&token=..."
    
    print(f"Verification URL: {verification_url}")
    print(f"Expected redirect: {expected_redirect}")
    print(f"\n💡 Copy link tren va mo trong trinh duyet de test")
    print(f"   Link se redirect ve: {frontend_url}/login?verified=success&token=...")
    
    return True

def main():
    print("\n" + "=" * 60)
    print("KIEM TRA TOAN BO EMAIL VERIFICATION FLOW")
    print("=" * 60)
    
    results = []
    
    # Test 1: Cấu hình email
    results.append(("Cau hinh email", test_email_config()))
    
    # Test 2: Gửi email đơn giản
    results.append(("Gui email don gian", test_send_simple_email()))
    
    # Test 3: Gửi email verification
    results.append(("Gui email verification", test_verification_email()))
    
    # Test 4: Test verification link
    results.append(("Test verification link", test_verification_link()))
    
    # Tổng kết
    print("\n" + "=" * 60)
    print("KET QUA")
    print("=" * 60)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    all_passed = all(result for _, result in results)
    
    if all_passed:
        print("\n✅ TAT CA TEST DEU PASS!")
    else:
        print("\n❌ CO MOT SO TEST FAIL, VUI LONG KIEM TRA LAI")

if __name__ == "__main__":
    main()

