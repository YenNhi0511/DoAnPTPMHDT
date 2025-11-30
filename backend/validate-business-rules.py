"""
Script để kiểm tra business rules của hệ thống
"""
import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from jobs.models import Job
from applications.models import Application, Interview
from accounts.models import User

def check_business_rules():
    """Kiểm tra business rules"""
    print("=" * 60)
    print("KIEM TRA BUSINESS RULES")
    print("=" * 60)
    print()
    
    # 1. Kiểm tra Jobs
    print("[1] Kiem tra Jobs:")
    print("-" * 60)
    
    # Jobs với deadline đã qua nhưng vẫn OPEN
    expired_open_jobs = Job.objects.filter(
        status=Job.Status.OPEN,
        deadline__lt=timezone.now()
    )
    if expired_open_jobs.exists():
        print(f"⚠️  Tim thay {expired_open_jobs.count()} jobs OPEN nhung deadline da qua:")
        for job in expired_open_jobs[:5]:
            print(f"   - {job.title} (Deadline: {job.deadline})")
    else:
        print("✅ Khong co jobs OPEN voi deadline da qua")
    
    # Jobs với deadline trong quá khứ khi tạo
    past_deadline_jobs = Job.objects.filter(deadline__lt=timezone.now() - timedelta(days=30))
    print(f"   Jobs voi deadline qua khu: {past_deadline_jobs.count()}")
    
    print()
    
    # 2. Kiểm tra Applications
    print("[2] Kiem tra Applications:")
    print("-" * 60)
    
    # Applications cho jobs đã CLOSED
    apps_for_closed_jobs = Application.objects.filter(job__status=Job.Status.CLOSED)
    if apps_for_closed_jobs.exists():
        print(f"⚠️  Tim thay {apps_for_closed_jobs.count()} applications cho jobs CLOSED:")
        for app in apps_for_closed_jobs[:5]:
            print(f"   - {app.candidate.email} -> {app.job.title} (Job status: {app.job.status})")
    else:
        print("✅ Khong co applications cho jobs CLOSED")
    
    # Applications trùng lặp (nên không có)
    from django.db.models import Count
    duplicate_apps = Application.objects.values('job', 'candidate').annotate(
        count=Count('id')
    ).filter(count__gt=1)
    if duplicate_apps.exists():
        print(f"❌ Tim thay {duplicate_apps.count()} cap job-candidate trung lap!")
    else:
        print("✅ Khong co applications trung lap")
    
    print()
    
    # 3. Kiểm tra Interviews
    print("[3] Kiem tra Interviews:")
    print("-" * 60)
    
    # Interviews cho applications không ở status INTERVIEW
    invalid_interviews = Interview.objects.exclude(
        application__status=Application.Status.INTERVIEW
    )
    if invalid_interviews.exists():
        print(f"⚠️  Tim thay {invalid_interviews.count()} interviews cho applications khong o status INTERVIEW:")
        for interview in invalid_interviews[:5]:
            print(f"   - Interview {interview.id} -> Application status: {interview.application.status}")
    else:
        print("✅ Tat ca interviews deu cho applications o status INTERVIEW")
    
    # Interviews không có panel members
    interviews_no_panel = Interview.objects.filter(panels__isnull=True)
    if interviews_no_panel.exists():
        print(f"⚠️  Tim thay {interviews_no_panel.count()} interviews khong co panel members")
    else:
        print("✅ Tat ca interviews deu co panel members")
    
    print()
    
    # 4. Kiểm tra Status Workflow
    print("[4] Kiem tra Status Workflow:")
    print("-" * 60)
    
    # Applications có status không hợp lệ
    valid_statuses = [s[0] for s in Application.Status.choices]
    invalid_status_apps = Application.objects.exclude(status__in=valid_statuses)
    if invalid_status_apps.exists():
        print(f"❌ Tim thay {invalid_status_apps.count()} applications voi status khong hop le")
    else:
        print("✅ Tat ca applications deu co status hop le")
    
    print()
    
    # 5. Tổng kết
    print("=" * 60)
    print("TONG KET")
    print("=" * 60)
    print(f"Total Jobs: {Job.objects.count()}")
    print(f"Total Applications: {Application.objects.count()}")
    print(f"Total Interviews: {Interview.objects.count()}")
    print(f"Total Users: {User.objects.count()}")
    print()

if __name__ == "__main__":
    check_business_rules()

