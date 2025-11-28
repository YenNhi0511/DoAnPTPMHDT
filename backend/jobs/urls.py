from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, RecruitmentProcessViewSet, ProcessStepViewSet

router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'processes', RecruitmentProcessViewSet, basename='process')
router.register(r'process-steps', ProcessStepViewSet, basename='processstep')

urlpatterns = [
    path('', include(router.urls)),
]
