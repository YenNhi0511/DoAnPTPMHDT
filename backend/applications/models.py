from django.db import models
from django.conf import settings
from jobs.models import Job
import uuid


class Application(models.Model):
    """Model cho hồ sơ ứng tuyển"""
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        SCREENING = 'SCREENING', 'Screening'
        INTERVIEW = 'INTERVIEW', 'Interview'
        OFFER = 'OFFER', 'Offer'
        REJECTED = 'REJECTED', 'Rejected'
        ACCEPTED = 'ACCEPTED', 'Accepted'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    cv_file = models.FileField(upload_to='cvs/', help_text='CV file (PDF/DOCX)')
    cover_letter = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    ai_score = models.FloatField(null=True, blank=True, help_text='AI score 0-100')
    ai_analysis = models.JSONField(null=True, blank=True, help_text='AI analysis result')
    screener_notes = models.TextField(null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'applications'
        ordering = ['-applied_at']
        unique_together = [['job', 'candidate']]  # Ứng viên chỉ nộp 1 lần/job
        indexes = [
            models.Index(fields=['job', 'status']),
            models.Index(fields=['candidate']),
            models.Index(fields=['status']),
            models.Index(fields=['ai_score']),
        ]
    
    def __str__(self):
        return f"{self.candidate.name} - {self.job.title}"


class Interview(models.Model):
    """Model cho lịch phỏng vấn"""
    
    class Type(models.TextChoices):
        PHONE = 'PHONE', 'Phone'
        VIDEO = 'VIDEO', 'Video'
        ONSITE = 'ONSITE', 'On-site'
    
    class Status(models.TextChoices):
        SCHEDULED = 'SCHEDULED', 'Scheduled'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        RESCHEDULED = 'RESCHEDULED', 'Rescheduled'
    
    class Result(models.TextChoices):
        PASS = 'PASS', 'Pass'
        FAIL = 'FAIL', 'Fail'
        PENDING = 'PENDING', 'Pending'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='interviews'
    )
    scheduled_at = models.DateTimeField()
    duration = models.IntegerField(help_text='Duration in minutes')
    location = models.CharField(max_length=500, null=True, blank=True)
    interview_type = models.CharField(max_length=20, choices=Type.choices, default=Type.VIDEO)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    feedback = models.TextField(null=True, blank=True)
    result = models.CharField(
        max_length=20,
        choices=Result.choices,
        default=Result.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'interviews'
        ordering = ['scheduled_at']
        indexes = [
            models.Index(fields=['scheduled_at', 'status']),
            models.Index(fields=['application']),
        ]
    
    def __str__(self):
        return f"Interview for {self.application.candidate.name} on {self.scheduled_at}"


class InterviewPanel(models.Model):
    """Model cho hội đồng phỏng vấn"""
    
    class Role(models.TextChoices):
        LEAD = 'LEAD', 'Lead'
        MEMBER = 'MEMBER', 'Member'
        OBSERVER = 'OBSERVER', 'Observer'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    interview = models.ForeignKey(
        Interview,
        on_delete=models.CASCADE,
        related_name='panels'
    )
    interviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='interview_panels'
    )
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    feedback = models.TextField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True, help_text='Score 0-100')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'interview_panels'
        unique_together = [['interview', 'interviewer']]
        indexes = [
            models.Index(fields=['interview']),
            models.Index(fields=['interviewer']),
        ]
    
    def __str__(self):
        return f"{self.interviewer.name} - {self.role}"


class RecruitmentResult(models.Model):
    """Model cho kết quả tuyển dụng"""
    
    class Decision(models.TextChoices):
        OFFER = 'OFFER', 'Offer'
        REJECT = 'REJECT', 'Reject'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.OneToOneField(
        Application,
        on_delete=models.CASCADE,
        related_name='result'
    )
    final_decision = models.CharField(max_length=20, choices=Decision.choices)
    offer_letter_file = models.FileField(
        upload_to='offer_letters/',
        null=True,
        blank=True
    )
    salary = models.CharField(max_length=100, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    decided_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='decided_results'
    )
    decided_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'recruitment_results'
        indexes = [
            models.Index(fields=['application']),
            models.Index(fields=['decided_by']),
            models.Index(fields=['decided_at']),
        ]
    
    def __str__(self):
        return f"{self.final_decision} - {self.application.candidate.name}"
