from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ApplicationViewSet,
    InterviewViewSet,
    InterviewPanelViewSet,
    RecruitmentResultViewSet
)

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'interviews', InterviewViewSet, basename='interview')
router.register(r'interview-panels', InterviewPanelViewSet, basename='interviewpanel')
router.register(r'results', RecruitmentResultViewSet, basename='result')

urlpatterns = [
    path('', include(router.urls)),
]
