"""
Script test API đăng ký
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

def test_register():
    """Test API đăng ký"""
    print("=" * 60)
    print("TEST API DANG KY")
    print("=" * 60)
    print()
    
    backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
    api_url = f"{backend_url}/api/users/register/"
    
    # Test data
    import secrets
    test_email = f"test_{secrets.token_hex(4)}@example.com"
    
    test_data = {
        'email': test_email,
        'username': f"testuser_{secrets.token_hex(4)}",
        'password': 'Test123456!',
        'password2': 'Test123456!',
        'first_name': 'Test',
        'last_name': 'User',
        'account_type': 'INDIVIDUAL',
    }
    
    print(f"Test data:")
    print(f"  Email: {test_data['email']}")
    print(f"  Username: {test_data['username']}")
    print()
    
    print(f"Test 1: Kiem tra backend server co chay khong...")
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
    print(f"Test 2: Test API dang ky...")
    try:
        response = requests.post(
            api_url,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 201:
            print("✅ Dang ky thanh cong!")
            result = response.json()
            if result.get('requires_verification'):
                print("✅ User can verify email")
        elif response.status_code == 400:
            print("❌ Dang ky that bai - Validation error")
            errors = response.json()
            print(f"   Errors: {json.dumps(errors, indent=2, ensure_ascii=False)}")
        else:
            print(f"⚠️  Status code khac: {response.status_code}")
    except Exception as e:
        print(f"❌ Loi khi test API: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_register()

