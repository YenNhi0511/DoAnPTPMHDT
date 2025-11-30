from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Application, Interview, InterviewPanel, RecruitmentResult
from .serializers import (
    ApplicationSerializer,
    ApplicationCreateSerializer,
    ApplicationListSerializer,
    InterviewSerializer,
    InterviewPanelSerializer,
    RecruitmentResultSerializer
)


class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet cho Application"""
    # Default permissions: read/list require auth for recruiter/admin; allow create for anonymous
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Allow unauthenticated users to create applications
        if self.action == 'create':
            from rest_framework.permissions import AllowAny
            return [AllowAny()]
        return [p() for p in self.permission_classes]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['job', 'status']
    ordering_fields = ['applied_at', 'ai_score']
    ordering = ['-applied_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'RECRUITER']:
            # Company chỉ thấy applications cho jobs của mình
            return Application.objects.filter(
                job__created_by=user
            ).select_related('job', 'candidate')
        # Candidate chỉ thấy applications của mình
        return Application.objects.filter(candidate=user).select_related('job')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ApplicationListSerializer
        elif self.action == 'create':
            return ApplicationCreateSerializer
        return ApplicationSerializer
    
    def get_serializer_context(self):
        """Thêm request vào context để build absolute URL"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def screen(self, request, pk=None):
        """Trigger AI screening cho application"""
        application = self.get_object()
        
        # Import task (sẽ tạo sau)
        from .tasks import screen_cv_task
        screen_cv_task.delay(str(application.id))
        
        return Response({
            'message': 'CV screening started',
            'application_id': application.id
        })
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Cập nhật status của application"""
        application = self.get_object()
        new_status = request.data.get('status')
        screener_notes = request.data.get('screener_notes')
        
        if new_status:
            application.status = new_status
        if screener_notes:
            application.screener_notes = screener_notes
        
        application.save()
        
        return Response(ApplicationSerializer(application).data)


class InterviewViewSet(viewsets.ModelViewSet):
    """ViewSet cho Interview"""
    queryset = Interview.objects.select_related('application__candidate', 'application__job')
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'interview_type', 'result']
    ordering_fields = ['scheduled_at']
    ordering = ['scheduled_at']
    
    def get_serializer_context(self):
        """Thêm request vào context để build absolute URL"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def submit_feedback(self, request, pk=None):
        """Submit feedback cho interview"""
        interview = self.get_object()
        feedback = request.data.get('feedback')
        result = request.data.get('result')
        
        if feedback:
            interview.feedback = feedback
        if result:
            interview.result = result
            interview.status = Interview.Status.COMPLETED
        
        interview.save()
        
        return Response(InterviewSerializer(interview).data)

    def perform_create(self, serializer):
        interview = serializer.save()
        from .tasks import send_interview_email_task
        send_interview_email_task.delay(str(interview.id))


class InterviewPanelViewSet(viewsets.ModelViewSet):
    """ViewSet cho InterviewPanel"""
    queryset = InterviewPanel.objects.select_related('interview', 'interviewer')
    serializer_class = InterviewPanelSerializer
    permission_classes = [IsAuthenticated]


class RecruitmentResultViewSet(viewsets.ModelViewSet):
    """ViewSet cho RecruitmentResult"""
    queryset = RecruitmentResult.objects.select_related(
        'application__candidate',
        'application__job',
        'decided_by'
    )
    serializer_class = RecruitmentResultSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(decided_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def send_email(self, request, pk=None):
        """Gửi email kết quả đến ứng viên"""
        result = self.get_object()
        
        # Import task
        from .tasks import send_result_email_task
        send_result_email_task.delay(str(result.id))
        
        return Response({'message': 'Email sent'})

    @action(detail=True, methods=['post'])
    def generate_offer(self, request, pk=None):
        result = self.get_object()
        from .tasks import generate_offer_task
        generate_offer_task.delay(str(result.id))
        return Response({'message': 'Offer generation started'})
