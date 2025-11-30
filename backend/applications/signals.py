from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Application
from .tasks import parse_cv_task, screen_cv_task


@receiver(post_save, sender=Application)
def application_created(sender, instance, created, **kwargs):
    if created:
        # Tạo notification cho ứng viên (không gửi email)
        from notifications.models import Notification
        try:
            Notification.objects.create(
                user=instance.candidate,
                notification_type=Notification.Type.SYSTEM,
                title=f"Đã nhận hồ sơ ứng tuyển - {instance.job.title}",
                content=f"Cảm ơn bạn đã ứng tuyển cho vị trí {instance.job.title} tại {instance.job.location}. Hồ sơ của bạn đã được nhận và đang được xem xét.",
                related_id=instance.id
            )
        except Exception as e:
            print(f'Failed to create application notification: {e}')
        
        # schedule parse and ai tasks
        parse_cv_task.delay(str(instance.id))
        screen_cv_task.delay(str(instance.id))
