"""
Email utility using Resend API
Alternative to Django SMTP for better deliverability
"""
import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_email_resend(to_email, subject, html_content, text_content=None):
    """
    Gửi email qua Resend API
    
    Args:
        to_email (str hoặc list): Email người nhận
        subject (str): Tiêu đề email
        html_content (str): Nội dung HTML
        text_content (str, optional): Nội dung text thuần
        
    Returns:
        dict: Response từ Resend API
        
    Raises:
        Exception: Nếu gửi email thất bại
    """
    try:
        # Lấy API key từ settings
        api_key = getattr(settings, 'RESEND_API_KEY', None)
        if not api_key:
            raise ValueError("RESEND_API_KEY not configured in settings")
        
        # Chuẩn bị to_email
        if isinstance(to_email, str):
            to_emails = [to_email]
        else:
            to_emails = to_email
        
        # Chuẩn bị from_email
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'delivered@resend.dev')
        
        # Payload cho Resend API
        payload = {
            'from': from_email,
            'to': to_emails,
            'subject': subject,
            'html': html_content,
        }
        
        # Thêm text content nếu có
        if text_content:
            payload['text'] = text_content
        
        # Headers
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        }
        
        # Gửi request đến Resend API
        response = requests.post(
            'https://api.resend.com/emails',
            json=payload,
            headers=headers,
            timeout=10
        )
        
        # Check response
        response.raise_for_status()
        
        result = response.json()
        logger.info(f"✅ Email sent successfully to {to_emails} via Resend. ID: {result.get('id')}")
        
        return result
        
    except requests.exceptions.RequestException as e:
        logger.error(f"❌ Failed to send email via Resend: {e}")
        raise Exception(f"Resend API error: {str(e)}")
    except Exception as e:
        logger.error(f"❌ Unexpected error sending email: {e}")
        raise


def send_email_sendgrid(to_email, subject, html_content, text_content=None):
    """
    Gửi email qua SendGrid API (alternative)
    
    Args:
        to_email (str hoặc list): Email người nhận
        subject (str): Tiêu đề email
        html_content (str): Nội dung HTML
        text_content (str, optional): Nội dung text thuần
        
    Returns:
        dict: Response từ SendGrid API
    """
    try:
        api_key = getattr(settings, 'SENDGRID_API_KEY', None)
        if not api_key:
            raise ValueError("SENDGRID_API_KEY not configured")
        
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com')
        
        # Chuẩn bị to_email
        if isinstance(to_email, str):
            to_emails = [{'email': to_email}]
        else:
            to_emails = [{'email': email} for email in to_email]
        
        # Payload cho SendGrid
        payload = {
            'personalizations': [{
                'to': to_emails,
                'subject': subject
            }],
            'from': {'email': from_email},
            'content': [
                {'type': 'text/html', 'value': html_content}
            ]
        }
        
        if text_content:
            payload['content'].insert(0, {'type': 'text/plain', 'value': text_content})
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        }
        
        response = requests.post(
            'https://api.sendgrid.com/v3/mail/send',
            json=payload,
            headers=headers,
            timeout=10
        )
        
        response.raise_for_status()
        
        logger.info(f"✅ Email sent successfully to {[e['email'] for e in to_emails]} via SendGrid")
        
        return {'status': 'sent', 'provider': 'sendgrid'}
        
    except Exception as e:
        logger.error(f"❌ Failed to send email via SendGrid: {e}")
        raise


def send_email(to_email, subject, html_content, text_content=None, provider='resend'):
    """
    Wrapper function gửi email - auto fallback giữa các provider
    
    Args:
        to_email: Email người nhận
        subject: Tiêu đề
        html_content: Nội dung HTML
        text_content: Nội dung text (optional)
        provider: 'resend' hoặc 'sendgrid' (default: resend)
        
    Returns:
        dict: Response từ email provider
    """
    try:
        if provider == 'sendgrid':
            return send_email_sendgrid(to_email, subject, html_content, text_content)
        else:
            return send_email_resend(to_email, subject, html_content, text_content)
    except Exception as e:
        # Fallback: nếu resend fail thì thử sendgrid
        if provider == 'resend':
            logger.warning(f"Resend failed, trying SendGrid as fallback...")
            try:
                return send_email_sendgrid(to_email, subject, html_content, text_content)
            except:
                pass
        raise Exception(f"All email providers failed: {str(e)}")
