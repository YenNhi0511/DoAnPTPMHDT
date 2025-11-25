from django.apps import AppConfig


class ApplicationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'applications'

    def ready(self):
        # Import signals to ensure they are registered
        from . import signals  # noqa: F401
