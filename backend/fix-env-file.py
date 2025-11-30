"""
Script để tự động sửa file .env - thêm các biến môi trường còn thiếu
"""
import os
import sys
from pathlib import Path

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Đường dẫn file .env
env_path = Path(__file__).parent / '.env'

# Các biến môi trường cần thêm
required_vars = {
    'EMAIL_BACKEND': 'django.core.mail.backends.smtp.EmailBackend',
    'EMAIL_HOST': 'smtp.gmail.com',
    'EMAIL_PORT': '587',
    'EMAIL_USE_TLS': 'True',
    'EMAIL_HOST_USER': 'tdyennhi0511@gmail.com',
    'EMAIL_HOST_PASSWORD': '',  # Giữ nguyên giá trị hiện tại
    'DEFAULT_FROM_EMAIL': 'tdyennhi0511@gmail.com',
    'FRONTEND_URL': 'http://localhost:3000',
    'BACKEND_URL': 'http://localhost:8000',
}

print("=" * 60)
print("SUA FILE .ENV - THEM CAC BIEN MOI TRUONG CON THIEU")
print("=" * 60)
print()

# Kiểm tra file .env có tồn tại không
if not env_path.exists():
    print(f"❌ File .env khong ton tai: {env_path}")
    print("   Tao file .env moi...")
    
    # Tạo file .env mới
    with open(env_path, 'w', encoding='utf-8') as f:
        for var_name, var_value in required_vars.items():
            if var_name == 'EMAIL_HOST_PASSWORD':
                f.write(f"{var_name}=your-app-password-here\n")
            else:
                f.write(f"{var_name}={var_value}\n")
    
    print(f"✅ Da tao file .env moi: {env_path}")
    print()
    print("⚠️  QUAN TRONG: Sua EMAIL_HOST_PASSWORD trong file .env")
    print("   Thay 'your-app-password-here' bang App Password cua Gmail")
    sys.exit(0)

# Đọc file .env hiện tại
print(f"✅ File .env ton tai: {env_path}")
print()

# Đọc các dòng hiện tại
existing_lines = []
existing_vars = {}

if env_path.exists():
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                if '=' in line:
                    var_name = line.split('=')[0].strip()
                    var_value = '='.join(line.split('=')[1:]).strip()
                    existing_vars[var_name] = var_value
            existing_lines.append(line)

# Kiểm tra các biến còn thiếu
missing_vars = {}
for var_name, default_value in required_vars.items():
    if var_name not in existing_vars:
        missing_vars[var_name] = default_value

if not missing_vars:
    print("✅ TAT CA CAC BIEN MOI TRUONG DEU DA CO!")
    print("   Khong can them gi")
    sys.exit(0)

print(f"⚠️  Tim thay {len(missing_vars)} bien con thieu:")
for var_name in missing_vars:
    print(f"   - {var_name}")

print()
print("Them cac bien con thieu vao file .env...")

# Thêm các biến còn thiếu vào cuối file
with open(env_path, 'a', encoding='utf-8') as f:
    f.write('\n')
    f.write('# Added by fix-env-file.py\n')
    for var_name, default_value in missing_vars.items():
        if var_name == 'EMAIL_HOST_PASSWORD':
            # Nếu EMAIL_HOST_PASSWORD chưa có, thêm placeholder
            f.write(f"{var_name}=your-app-password-here\n")
        else:
            f.write(f"{var_name}={default_value}\n")

print("✅ Da them cac bien con thieu vao file .env")
print()

# Kiểm tra lại
print("KIEM TRA LAI:")
print("-" * 60)

from dotenv import load_dotenv
load_dotenv(env_path)

all_ok = True
for var_name, expected_value in required_vars.items():
    value = os.environ.get(var_name)
    
    if not value:
        print(f"❌ {var_name}: NOT SET")
        all_ok = False
    else:
        if var_name == 'EMAIL_HOST_PASSWORD':
            display_value = 'SET' if value and value != 'your-app-password-here' else 'NOT SET or PLACEHOLDER'
            if display_value == 'NOT SET or PLACEHOLDER':
                print(f"⚠️  {var_name}: {display_value}")
                all_ok = False
            else:
                print(f"✅ {var_name}: {display_value}")
        else:
            print(f"✅ {var_name}: {value}")

print()
print("=" * 60)

if all_ok:
    print("✅ TAT CA CAU HINH DEU OK!")
    print()
    print("💡 Restart backend server de ap dung cau hinh moi")
else:
    print("⚠️  VAN CON MOT SO CAU HINH CHUA DUNG!")
    if os.environ.get('EMAIL_HOST_PASSWORD') == 'your-app-password-here':
        print()
        print("💡 QUAN TRONG: Sua EMAIL_HOST_PASSWORD trong file .env")
        print("   Thay 'your-app-password-here' bang App Password cua Gmail")
        print("   Xem huong dan: backend/HUONG-DAN-CAU-HINH-EMAIL.md")

print()
print("=" * 60)

