from django.db import models
from django.conf import settings
import uuid


class Notification(models.Model):
    """Model cho thông báo"""
    
    class Type(models.TextChoices):
        EMAIL = 'EMAIL', 'Email'
        SYSTEM = 'SYSTEM', 'System'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(
        max_length=20,
        choices=Type.choices,
        default=Type.SYSTEM
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    related_id = models.UUIDField(null=True, blank=True, help_text='Related object ID')
    sent_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-sent_at']
        indexes = [
            models.Index(fields=['user', 'is_read', 'created_at']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.user.name}"
