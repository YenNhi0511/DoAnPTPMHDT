from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job
from .serializers import JobSerializer, JobCreateSerializer, JobListSerializer


class JobViewSet(viewsets.ModelViewSet):
    """ViewSet cho Job CRUD operations"""
    queryset = Job.objects.select_related('created_by').prefetch_related('applications')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'employment_type', 'location']
    search_fields = ['title', 'description', 'requirements']
    ordering_fields = ['created_at', 'deadline', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        elif self.action == 'create':
            return JobCreateSerializer
        return JobSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by deadline
        if self.request.query_params.get('active'):
            from django.utils import timezone
            queryset = queryset.filter(
                status=Job.Status.OPEN,
                deadline__gte=timezone.now()
            )
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def publish(self, request, pk=None):
        """Publish job (change status to OPEN)"""
        job = self.get_object()
        if job.created_by != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to publish this job'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        job.status = Job.Status.OPEN
        job.save()
        return Response({'status': 'job published'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def close(self, request, pk=None):
        """Close job"""
        job = self.get_object()
        if job.created_by != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to close this job'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        job.status = Job.Status.CLOSED
        job.save()
        return Response({'status': 'job closed'})
    
    @action(detail=True, methods=['get'])
    def applications(self, request, pk=None):
        """Lấy danh sách applications của job"""
        job = self.get_object()
        applications = job.applications.select_related('candidate').all()
        
        from applications.serializers import ApplicationListSerializer
        serializer = ApplicationListSerializer(applications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def apply(self, request, pk=None):
        """Public application endpoint (allow anonymous)"""
        job = self.get_object()
        from applications.serializers import ApplicationCreateSerializer
        data = request.data.copy()
        data['job'] = str(job.id)
        serializer = ApplicationCreateSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            application = serializer.save()
            from applications.serializers import ApplicationSerializer
            return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def stats(self, request):
        from django.db.models import Count, Avg
        total_jobs = Job.objects.count()
        open_jobs = Job.objects.filter(status=Job.Status.OPEN).count()
        closed_jobs = Job.objects.filter(status=Job.Status.CLOSED).count()
        total_applications = 0
        try:
            from applications.models import Application
            total_applications = Application.objects.count()
            avg_ai_score = Application.objects.aggregate(avg=Avg('ai_score'))['avg']
        except Exception:
            avg_ai_score = None

        data = {
            'total_jobs': total_jobs,
            'open_jobs': open_jobs,
            'closed_jobs': closed_jobs,
            'total_applications': total_applications,
            'avg_ai_score': avg_ai_score,
        }
        return Response(data)
