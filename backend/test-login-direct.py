"""
Test login trực tiếp qua API
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

def test_login_api():
    """Test login qua API"""
    print("=" * 60)
    print("TEST LOGIN QUA API")
    print("=" * 60)
    print()
    
    backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
    api_url = f"{backend_url}/api/users/login/"
    
    print(f"API URL: {api_url}")
    print()
    
    # Lấy user để test
    test_user = User.objects.filter(is_email_verified=True).first()
    if not test_user:
        print("❌ Khong co user nao da verify de test!")
        return
    
    print(f"Testing với user: {test_user.email}")
    print(f"  Role: {test_user.role}")
    print(f"  Verified: {test_user.is_email_verified}")
    print()
    
    # Test với password sai
    print("Test 1: Password sai")
    try:
        response = requests.post(
            api_url,
            json={'email': test_user.email, 'password': 'wrong_password'},
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    print()
    
    # Test với email/password đúng (cần biết password)
    print("Test 2: Email/Password đúng")
    print("  (Cần biết password của user để test)")
    print("  Có thể test bằng cách:")
    print("    1. Dùng admin@recruitment.com / admin123")
    print("    2. Hoặc reset password cho user này")

if __name__ == "__main__":
    test_login_api()

