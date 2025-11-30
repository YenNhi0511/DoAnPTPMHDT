"""
Celery tasks cho accounts app
"""
from __future__ import absolute_import, unicode_literals
from recruitment_system.celery import app
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
import secrets
import os
from .models import User


@app.task(bind=True)
def send_verification_email_task(self, user_id):
    """Gửi email xác nhận cho user mới đăng ký"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        print(f'❌ User with ID {user_id} not found')
        return
    
    # Tạo token nếu chưa có
    if not user.email_verification_token:
        user.email_verification_token = secrets.token_urlsafe(32)
        user.email_verification_sent_at = timezone.now()
        user.save()
    
    # Tạo verification URL - dùng GET endpoint để tự động redirect về login
    # Backend URL để tạo link xác thực
    backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
    verification_url = f"{backend_url}/api/users/verify-email/{user.email_verification_token}/"
    
    subject = "Xác nhận email đăng ký tài khoản - GoodCV"
    to_email = [user.email]
    from datetime import datetime
    context = {
        'user': user,
        'verification_url': verification_url,
        'token': user.email_verification_token,
        'current_year': datetime.now().year,
    }
    
    # Render email template
    try:
        text_content = render_to_string('email/verify_email.txt', context)
        html_content = render_to_string('email/verify_email.html', context)
    except:
        # Fallback nếu không có template
        text_content = f"""
Xin chào {user.get_full_name()},

Cảm ơn bạn đã đăng ký tài khoản!

Vui lòng click vào link sau để xác nhận email:
{verification_url}

Link này có hiệu lực trong 24 giờ.

Trân trọng,
Đội ngũ Tuyển dụng
        """
        html_content = None
    
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, to_email)
    if html_content:
        msg.attach_alternative(html_content, 'text/html')
    
    try:
        msg.send()
        print(f'✅ Verification email sent to {user.email}')
        print(f'   From: {settings.DEFAULT_FROM_EMAIL}')
        print(f'   Backend: {settings.EMAIL_BACKEND}')
    except Exception as e:
        print(f'❌ Failed to send verification email to {user.email}: {e}')
        print(f'   Error type: {type(e).__name__}')
        print(f'   Backend: {settings.EMAIL_BACKEND}')
        print(f'   EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}')
        import traceback
        traceback.print_exc()

