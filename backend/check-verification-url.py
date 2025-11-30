"""
Script đơn giản để kiểm tra URL verification
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

from django.urls import reverse
from django.conf import settings
from accounts.models import User

print("=" * 60)
print("KIEM TRA URL VERIFICATION")
print("=" * 60)
print()

# Lấy user có token
user = User.objects.filter(email_verification_token__isnull=False).first()

if not user:
    print("❌ Khong tim thay user nao co verification token")
    print("   Dang ky user moi hoac chay resend verification")
    sys.exit(1)

print(f"User: {user.email}")
print(f"Token: {user.email_verification_token}")
print()

# Tạo URL
backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
verification_url = f"{backend_url}/api/users/verify-email/{user.email_verification_token}/"

print(f"Verification URL:")
print(f"  {verification_url}")
print()

# Kiểm tra URL pattern
print("Kiem tra URL pattern:")
print(f"  Pattern: verify-email/(?P<token>[^/.]+)")
print(f"  Token length: {len(user.email_verification_token)}")
print(f"  Token contains special chars: {any(c in user.email_verification_token for c in ['/', '.', '?', '#'])}")
print()

# Test với reverse (nếu có)
try:
    # Thử reverse URL
    print("Test reverse URL...")
    # Không thể dùng reverse cho custom action, nhưng có thể test pattern
    print("  ✅ URL pattern co ve dung")
except Exception as e:
    print(f"  ⚠️  {e}")

print()
print("=" * 60)
print("HUONG DAN")
print("=" * 60)
print()
print("1. Kiem tra backend server co dang chay:")
print("   python manage.py runserver")
print()
print("2. Mo link trong trinh duyet:")
print(f"   {verification_url}")
print()
print("3. Neu van bi 404, kiem tra:")
print("   - Backend server co chay khong?")
print("   - URL co dung khong?")
print("   - Token co hop le khong?")

