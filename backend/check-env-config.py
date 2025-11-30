"""
Script để kiểm tra cấu hình .env file
"""
import os
import sys
from pathlib import Path

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Load .env file
from dotenv import load_dotenv
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

print("=" * 60)
print("KIEM TRA CAU HINH .ENV FILE")
print("=" * 60)
print()

# Kiểm tra file .env có tồn tại không
if not env_path.exists():
    print("❌ File .env KHONG TON TAI!")
    print(f"   Duong dan: {env_path}")
    print()
    print("💡 Tao file .env:")
    print("   1. Copy file .env.example (neu co)")
    print("   2. Hoac tao file .env moi trong thu muc backend/")
    print("   3. Them cac bien moi truong sau:")
    print()
    print("EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend")
    print("EMAIL_HOST=smtp.gmail.com")
    print("EMAIL_PORT=587")
    print("EMAIL_USE_TLS=True")
    print("EMAIL_HOST_USER=tdyennhi0511@gmail.com")
    print("EMAIL_HOST_PASSWORD=<app-password-here>")
    print("DEFAULT_FROM_EMAIL=tdyennhi0511@gmail.com")
    print("FRONTEND_URL=http://localhost:3000")
    print("BACKEND_URL=http://localhost:8000")
    sys.exit(1)

print(f"✅ File .env ton tai: {env_path}")
print()

# Kiểm tra các biến môi trường
required_vars = {
    'EMAIL_BACKEND': 'django.core.mail.backends.smtp.EmailBackend',
    'EMAIL_HOST': 'smtp.gmail.com',
    'EMAIL_PORT': '587',
    'EMAIL_USE_TLS': 'True',
    'EMAIL_HOST_USER': 'tdyennhi0511@gmail.com',
    'EMAIL_HOST_PASSWORD': None,  # Không hiển thị giá trị
    'DEFAULT_FROM_EMAIL': 'tdyennhi0511@gmail.com',
    'FRONTEND_URL': 'http://localhost:3000',
    'BACKEND_URL': 'http://localhost:8000',
}

print("CAU HINH HIEN TAI:")
print("-" * 60)

all_ok = True
for var_name, expected_value in required_vars.items():
    value = os.environ.get(var_name)
    
    if not value:
        print(f"❌ {var_name}: NOT SET")
        all_ok = False
    else:
        if var_name == 'EMAIL_HOST_PASSWORD':
            # Không hiển thị password
            display_value = 'SET' if value and value != 'your-app-password-here' else 'NOT SET or PLACEHOLDER'
            if display_value == 'NOT SET or PLACEHOLDER':
                print(f"⚠️  {var_name}: {display_value}")
                all_ok = False
            else:
                print(f"✅ {var_name}: {display_value}")
        else:
            if expected_value and value != expected_value:
                print(f"⚠️  {var_name}: {value} (Expected: {expected_value})")
            else:
                print(f"✅ {var_name}: {value}")

print()
print("=" * 60)

if all_ok:
    print("✅ TAT CA CAU HINH DEU OK!")
else:
    print("❌ CO MOT SO CAU HINH CHUA DUNG!")
    print()
    print("💡 Sua lai file .env trong thu muc backend/")
    print("   Sau do restart backend server")

print()
print("=" * 60)

