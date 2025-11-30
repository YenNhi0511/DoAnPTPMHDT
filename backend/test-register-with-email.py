"""
Script test đăng ký với email cụ thể
"""
import os
import sys
import django
import requests
import json

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User

def test_register_email():
    """Test đăng ký với email cụ thể"""
    print("=" * 60)
    print("TEST DANG KY VOI EMAIL CU THE")
    print("=" * 60)
    print()
    
    # Nhập email để test
    test_email = input("Nhap email de test dang ky: ").strip()
    if not test_email:
        print("Email khong duoc de trong!")
        return
    
    # Kiểm tra email đã tồn tại chưa
    print(f"\nKiem tra email: {test_email}")
    try:
        existing_user = User.objects.get(email=test_email)
        print(f"❌ Email da ton tai!")
        print(f"   User ID: {existing_user.id}")
        print(f"   Username: {existing_user.username}")
        print(f"   Created: {existing_user.date_joined}")
        print(f"   Verified: {existing_user.is_email_verified}")
        
        # Hỏi có muốn xóa không
        delete = input("\nBan co muon xoa user nay khong? (y/n): ").strip().lower()
        if delete == 'y':
            existing_user.delete()
            print("✅ Da xoa user!")
        else:
            print("Khong xoa user.")
            return
    except User.DoesNotExist:
        print("✅ Email chua ton tai, co the dang ky")
    
    # Tạo username
    import secrets
    username = f"testuser_{secrets.token_hex(4)}"
    
    # Test data
    test_data = {
        'email': test_email,
        'username': username,
        'password': 'Test123456!',
        'password2': 'Test123456!',
        'first_name': 'Test',
        'last_name': 'User',
        'account_type': 'INDIVIDUAL',
    }
    
    print(f"\nDang ky voi:")
    print(f"  Email: {test_data['email']}")
    print(f"  Username: {test_data['username']}")
    print()
    
    # Test API
    backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
    api_url = f"{backend_url}/api/users/register/"
    
    try:
        response = requests.post(
            api_url,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Dang ky thanh cong!")
            result = response.json()
            print(f"   User ID: {result['user']['id']}")
            print(f"   Requires verification: {result.get('requires_verification', False)}")
        elif response.status_code == 400:
            print("❌ Dang ky that bai - Validation error")
            errors = response.json()
            print(f"   Errors:")
            for field, error_list in errors.items():
                if isinstance(error_list, list):
                    for error in error_list:
                        print(f"      - {field}: {error}")
                else:
                    print(f"      - {field}: {error_list}")
        else:
            print(f"⚠️  Status code: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"❌ Loi khi test API: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_register_email()

