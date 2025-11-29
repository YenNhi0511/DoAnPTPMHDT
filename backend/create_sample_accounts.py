"""
Script để tạo các tài khoản mẫu cho testing
Chạy: python manage.py shell < create_sample_accounts.py
Hoặc: python manage.py shell
     >>> exec(open('create_sample_accounts.py').read())
"""

from accounts.models import User

# Tạo ADMIN accounts
admin_accounts = [
    {
        'email': 'admin@goodcv.com',
        'username': 'admin',
        'password': 'admin123',
        'first_name': 'Admin',
        'last_name': 'User',
        'role': 'ADMIN',
    },
    {
        'email': 'nhiyen@goodcv.com',
        'username': 'nhiyen',
        'password': 'admin123',
        'first_name': 'Nhi',
        'last_name': 'Yến',
        'role': 'ADMIN',
    },
]

# Tạo RECRUITER accounts
recruiter_accounts = [
    {
        'email': 'recruiter@goodcv.com',
        'username': 'recruiter',
        'password': 'recruiter123',
        'first_name': 'Recruiter',
        'last_name': 'User',
        'role': 'RECRUITER',
    },
    {
        'email': 'company1@goodcv.com',
        'username': 'company1',
        'password': 'company123',
        'first_name': 'Công ty',
        'last_name': 'ABC',
        'role': 'RECRUITER',
        'company_name': 'Công ty Công nghệ ABC',
    },
    {
        'email': 'company2@goodcv.com',
        'username': 'company2',
        'password': 'company123',
        'first_name': 'Công ty',
        'last_name': 'XYZ',
        'role': 'RECRUITER',
        'company_name': 'Công ty Tài chính XYZ',
    },
]

# Tạo CANDIDATE accounts
candidate_accounts = [
    {
        'email': 'candidate@goodcv.com',
        'username': 'candidate',
        'password': 'candidate123',
        'first_name': 'Candidate',
        'last_name': 'User',
        'role': 'CANDIDATE',
    },
    {
        'email': 'test1@goodcv.com',
        'username': 'test1',
        'password': 'test123',
        'first_name': 'Nguyễn',
        'last_name': 'Văn A',
        'role': 'CANDIDATE',
    },
    {
        'email': 'test2@goodcv.com',
        'username': 'test2',
        'password': 'test123',
        'first_name': 'Trần',
        'last_name': 'Thị B',
        'role': 'CANDIDATE',
    },
    {
        'email': 'test3@goodcv.com',
        'username': 'test3',
        'password': 'test123',
        'first_name': 'Lê',
        'last_name': 'Văn C',
        'role': 'CANDIDATE',
    },
    {
        'email': 'test4@goodcv.com',
        'username': 'test4',
        'password': 'test123',
        'first_name': 'Phạm',
        'last_name': 'Thị D',
        'role': 'CANDIDATE',
    },
    {
        'email': 'test5@goodcv.com',
        'username': 'test5',
        'password': 'test123',
        'first_name': 'Hoàng',
        'last_name': 'Văn E',
        'role': 'CANDIDATE',
    },
]

def create_accounts():
    created = 0
    skipped = 0
    
    # Tạo ADMIN
    print("Creating ADMIN accounts...")
    for account in admin_accounts:
        if not User.objects.filter(email=account['email']).exists():
            User.objects.create_user(**account)
            print(f"✓ Created ADMIN: {account['email']}")
            created += 1
        else:
            print(f"✗ Skipped (exists): {account['email']}")
            skipped += 1
    
    # Tạo RECRUITER
    print("\nCreating RECRUITER accounts...")
    for account in recruiter_accounts:
        if not User.objects.filter(email=account['email']).exists():
            User.objects.create_user(**account)
            print(f"✓ Created RECRUITER: {account['email']}")
            created += 1
        else:
            print(f"✗ Skipped (exists): {account['email']}")
            skipped += 1
    
    # Tạo CANDIDATE
    print("\nCreating CANDIDATE accounts...")
    for account in candidate_accounts:
        if not User.objects.filter(email=account['email']).exists():
            User.objects.create_user(**account)
            print(f"✓ Created CANDIDATE: {account['email']}")
            created += 1
        else:
            print(f"✗ Skipped (exists): {account['email']}")
            skipped += 1
    
    print(f"\n{'='*50}")
    print(f"Summary: Created {created} accounts, Skipped {skipped} accounts")
    print(f"{'='*50}")

if __name__ == '__main__':
    create_accounts()

