"""
Script để test route verification email
"""
import os
import sys
import django
import requests

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from django.conf import settings

def test_verification_route():
    """Test route verification email"""
    print("=" * 60)
    print("TEST ROUTE VERIFICATION EMAIL")
    print("=" * 60)
    print()
    
    # Lấy user mới nhất chưa verify
    try:
        user = User.objects.filter(is_email_verified=False).exclude(email_verification_token__isnull=True).first()
        
        if not user:
            print("❌ Khong tim thay user nao chua verify co token")
            print("   Thu dang ky user moi hoac chay script resend verification")
            return
        
        print(f"✅ Tim thay user: {user.email}")
        print(f"   Token: {user.email_verification_token}")
        print()
        
        # Tạo verification URL
        backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
        verification_url = f"{backend_url}/api/users/verify-email/{user.email_verification_token}/"
        
        print(f"Verification URL: {verification_url}")
        print()
        
        # Test route
        print("Test 1: Kiem tra backend server co chay khong...")
        try:
            response = requests.get(f"{backend_url}/api/", timeout=5)
            print(f"✅ Backend server dang chay (Status: {response.status_code})")
        except requests.exceptions.ConnectionError:
            print(f"❌ Backend server KHONG chay tai {backend_url}")
            print(f"   Vui long chay: python manage.py runserver")
            return
        except Exception as e:
            print(f"⚠️  Loi khi ket noi: {e}")
        
        print()
        print("Test 2: Test verification route...")
        try:
            # Follow redirects = False để xem redirect URL
            response = requests.get(verification_url, allow_redirects=False, timeout=10)
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 302:  # Redirect
                redirect_url = response.headers.get('Location', '')
                print(f"✅ Route hoat dong! Redirect to: {redirect_url}")
                
                if 'verified=success' in redirect_url:
                    print("✅ Verification thanh cong!")
                elif 'verified=already' in redirect_url:
                    print("⚠️  User da duoc verify truoc do")
                elif 'error' in redirect_url:
                    print(f"❌ Co loi: {redirect_url}")
            elif response.status_code == 404:
                print("❌ Route KHONG TON TAI (404)")
                print()
                print("💡 Kiem tra:")
                print("   1. Backend server co dang chay khong?")
                print("   2. Route co duoc dang ky dung khong?")
                print("   3. URL pattern co match khong?")
            else:
                print(f"⚠️  Status code khac: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
        except Exception as e:
            print(f"❌ Loi khi test route: {e}")
            import traceback
            traceback.print_exc()
        
        print()
        print("=" * 60)
        print("KET QUA")
        print("=" * 60)
        print()
        print(f"💡 Copy link sau va mo trong trinh duyet:")
        print(f"   {verification_url}")
        print()
        print("   Neu van bi 404:")
        print("   1. Kiem tra backend server co dang chay khong")
        print("   2. Kiem tra URL co dung khong")
        print("   3. Kiem tra token co hop le khong")

if __name__ == "__main__":
    test_verification_route()

