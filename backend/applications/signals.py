from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Application
from .tasks import send_confirmation_email_task, parse_cv_task, screen_cv_task


@receiver(post_save, sender=Application)
def application_created(sender, instance, created, **kwargs):
    if created:
        # send confirmation email
        send_confirmation_email_task.delay(str(instance.id))
        # schedule parse and ai tasks
        parse_cv_task.delay(str(instance.id))
        screen_cv_task.delay(str(instance.id))
