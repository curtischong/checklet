from django.apps import AppConfig
from .engine_gateway import create_engine

class ResumeApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'resume_api'

    def ready(self) -> None:
        create_engine()
