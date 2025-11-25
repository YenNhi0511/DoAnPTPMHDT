import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from jobs.models import Job
from datetime import timedelta
from django.utils import timezone

# Tạo users (chỉ tạo nếu chưa tồn tại)
admin, created = User.objects.get_or_create(
    email='admin@recruitment.com',
    defaults={
        'username': 'admin',
        'first_name': 'Admin',
        'last_name': 'User',
        'role': User.Role.ADMIN
    }
)
if created:
    admin.set_password('admin123')
    admin.is_superuser = True
    admin.is_staff = True
    admin.save()

recruiter, created = User.objects.get_or_create(
    email='recruiter@recruitment.com',
    defaults={
        'username': 'recruiter',
        'first_name': 'Recruiter',
        'last_name': 'User',
        'role': User.Role.RECRUITER
    }
)
if created:
    recruiter.set_password('recruiter123')
    recruiter.save()

candidate, created = User.objects.get_or_create(
    email='candidate@recruitment.com',
    defaults={
        'username': 'candidate',
        'first_name': 'Candidate',
        'last_name': 'User',
        'role': User.Role.CANDIDATE
    }
)
if created:
    candidate.set_password('candidate123')
    candidate.save()

# Tạo jobs (chỉ tạo nếu chưa tồn tại)
job1, created = Job.objects.get_or_create(
    title='Senior Java Developer',
    defaults={
        'description': 'We are looking for an experienced Java developer...',
        'requirements': '- 5+ years Java\n- Spring Boot\n- MySQL/PostgreSQL',
        'salary': '1000-2000 USD',
        'location': 'Ha Noi',
        'employment_type': Job.EmploymentType.FULLTIME,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=30),
        'created_by': recruiter
    }
)

job2, created = Job.objects.get_or_create(
    title='Frontend React Developer',
    defaults={
        'description': 'Join our frontend team...',
        'requirements': '- 3+ years React\n- TypeScript\n- Tailwind CSS',
        'salary': '800-1500 USD',
        'location': 'Ho Chi Minh',
        'employment_type': Job.EmploymentType.FULLTIME,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=45),
        'created_by': recruiter
    }
)

print("✅ Seed data created successfully!")
print("Users:")
print(f"  - Admin: {admin.email} / admin123")
print(f"  - Recruiter: {recruiter.email} / recruiter123")
print(f"  - Candidate: {candidate.email} / candidate123")
print("\nJobs:")
print(f"  - {job1.title}")
print(f"  - {job2.title}")
