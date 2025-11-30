"""
Script để tạo file .env cho cấu hình email
"""
import os

def create_env_file():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    # Kiểm tra file đã tồn tại chưa
    if os.path.exists(env_path):
        print("⚠️  File .env đã tồn tại!")
        response = input("Bạn có muốn ghi đè không? (y/n): ")
        if response.lower() != 'y':
            print("❌ Hủy bỏ.")
            return
    
    # Lấy thông tin từ user
    print("\n📧 Cấu hình Email SMTP")
    print("=" * 50)
    
    email_backend = input("EMAIL_BACKEND [django.core.mail.backends.smtp.EmailBackend]: ").strip()
    if not email_backend:
        email_backend = "django.core.mail.backends.smtp.EmailBackend"
    
    email_host = input("EMAIL_HOST [smtp.gmail.com]: ").strip()
    if not email_host:
        email_host = "smtp.gmail.com"
    
    email_port = input("EMAIL_PORT [587]: ").strip()
    if not email_port:
        email_port = "587"
    
    email_use_tls = input("EMAIL_USE_TLS [True]: ").strip()
    if not email_use_tls:
        email_use_tls = "True"
    
    email_host_user = input("EMAIL_HOST_USER [tdyennhi0511@gmail.com]: ").strip()
    if not email_host_user:
        email_host_user = "tdyennhi0511@gmail.com"
    
    email_host_password = input("EMAIL_HOST_PASSWORD (App Password): ").strip()
    if not email_host_password:
        print("⚠️  Cảnh báo: EMAIL_HOST_PASSWORD trống!")
    
    default_from_email = input(f"DEFAULT_FROM_EMAIL [{email_host_user}]: ").strip()
    if not default_from_email:
        default_from_email = email_host_user
    
    # Tạo nội dung file .env
    env_content = f"""# Email Configuration
EMAIL_BACKEND={email_backend}
EMAIL_HOST={email_host}
EMAIL_PORT={email_port}
EMAIL_USE_TLS={email_use_tls}
EMAIL_HOST_USER={email_host_user}
EMAIL_HOST_PASSWORD={email_host_password}
DEFAULT_FROM_EMAIL={default_from_email}
"""
    
    # Ghi file
    try:
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(env_content)
        print(f"\n✅ Đã tạo file .env tại: {env_path}")
        print("\n📋 Nội dung file .env:")
        print("-" * 50)
        print(env_content)
        print("-" * 50)
        print("\n⚠️  Lưu ý:")
        print("1. Restart backend server sau khi tạo file .env")
        print("2. Đảm bảo Celery worker đang chạy")
        print("3. Kiểm tra App Password đã đúng chưa")
    except Exception as e:
        print(f"❌ Lỗi khi tạo file .env: {e}")

if __name__ == "__main__":
    create_env_file()

