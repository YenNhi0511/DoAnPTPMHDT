from django.db import models
from django.conf import settings
import uuid


class RecruitmentProcess(models.Model):
    """Model cho quy trình tuyển dụng"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, help_text='Tên quy trình')
    description = models.TextField(null=True, blank=True)
    is_default = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_processes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recruitment_processes'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class ProcessStep(models.Model):
    """Model cho các bước trong quy trình tuyển dụng"""
    
    class StepType(models.TextChoices):
        SCREENING = 'SCREENING', 'Sàng lọc hồ sơ'
        PHONE_INTERVIEW = 'PHONE_INTERVIEW', 'Phỏng vấn điện thoại'
        TECHNICAL_TEST = 'TECHNICAL_TEST', 'Bài test kỹ thuật'
        INTERVIEW = 'INTERVIEW', 'Phỏng vấn'
        FINAL_INTERVIEW = 'FINAL_INTERVIEW', 'Phỏng vấn cuối'
        OFFER = 'OFFER', 'Gửi offer'
        ONBOARDING = 'ONBOARDING', 'Onboarding'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    process = models.ForeignKey(
        RecruitmentProcess,
        on_delete=models.CASCADE,
        related_name='steps'
    )
    name = models.CharField(max_length=255)
    step_type = models.CharField(max_length=30, choices=StepType.choices)
    order = models.IntegerField(default=0)
    description = models.TextField(null=True, blank=True)
    duration_days = models.IntegerField(default=7, help_text='Thời gian dự kiến (ngày)')
    is_required = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'process_steps'
        ordering = ['order']
        unique_together = [['process', 'order']]
    
    def __str__(self):
        return f"{self.order}. {self.name}"


class Job(models.Model):
    """Model cho vị trí tuyển dụng"""
    
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        OPEN = 'OPEN', 'Open'
        CLOSED = 'CLOSED', 'Closed'
        CANCELLED = 'CANCELLED', 'Cancelled'
    
    class EmploymentType(models.TextChoices):
        FULLTIME = 'FULLTIME', 'Full-time'
        PARTTIME = 'PARTTIME', 'Part-time'
        CONTRACT = 'CONTRACT', 'Contract'
        INTERN = 'INTERN', 'Intern'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField()
    requirements = models.TextField(help_text='Job Description (JD)')
    salary_min = models.DecimalField(max_digits=15, decimal_places=0, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=15, decimal_places=0, null=True, blank=True)
    salary = models.CharField(max_length=100, null=True, blank=True)
    location = models.CharField(max_length=255)
    employment_type = models.CharField(
        max_length=20,
        choices=EmploymentType.choices,
        default=EmploymentType.FULLTIME
    )
    positions_count = models.IntegerField(default=1, help_text='Số lượng vị trí cần tuyển')
    experience_years = models.IntegerField(null=True, blank=True, help_text='Số năm kinh nghiệm yêu cầu')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    deadline = models.DateTimeField()
    recruitment_process = models.ForeignKey(
        RecruitmentProcess,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='jobs'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_jobs'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'jobs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['deadline']),
            models.Index(fields=['created_by']),
        ]
    
    def __str__(self):
        return self.title
