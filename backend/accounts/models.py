from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    """Custom User model với roles"""
    
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        RECRUITER = 'RECRUITER', 'Recruiter'
        INTERVIEWER = 'INTERVIEWER', 'Interviewer'
        CANDIDATE = 'CANDIDATE', 'Candidate'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CANDIDATE)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    
    # Email verification
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, null=True, blank=True)
    email_verification_sent_at = models.DateTimeField(null=True, blank=True)
    
    # OTP verification (fallback khi email không hoạt động)
    otp_code = models.CharField(max_length=6, null=True, blank=True, help_text='6-digit OTP code')
    otp_sent_at = models.DateTimeField(null=True, blank=True)
    otp_verified = models.BooleanField(default=False)
    otp_attempts = models.IntegerField(default=0, help_text='Số lần nhập sai OTP')
    
    # Thông tin bổ sung cho doanh nghiệp
    company_name = models.CharField(max_length=255, null=True, blank=True, help_text='Tên công ty')
    gender = models.CharField(max_length=10, null=True, blank=True, choices=[('MALE', 'Nam'), ('FEMALE', 'Nữ')])
    work_location_province = models.CharField(max_length=100, null=True, blank=True, help_text='Tỉnh/Thành phố')
    work_location_district = models.CharField(max_length=100, null=True, blank=True, help_text='Quận/Huyện')
    
    # Thông tin công ty chi tiết
    tax_id = models.CharField(max_length=50, null=True, blank=True, help_text='Mã số thuế')
    website = models.URLField(null=True, blank=True, help_text='Website công ty')
    field_of_activity = models.CharField(max_length=255, null=True, blank=True, help_text='Lĩnh vực hoạt động')
    scale = models.CharField(max_length=100, null=True, blank=True, help_text='Quy mô công ty')
    address = models.TextField(null=True, blank=True, help_text='Địa chỉ công ty')
    company_email = models.EmailField(null=True, blank=True, help_text='Email công ty')
    company_description = models.TextField(null=True, blank=True, help_text='Mô tả công ty')
    business_registration_document = models.FileField(upload_to='business_registrations/', null=True, blank=True, help_text='Giấy đăng ký doanh nghiệp')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    @property
    def name(self):
        """Compatibility property"""
        return self.get_full_name() or self.username
