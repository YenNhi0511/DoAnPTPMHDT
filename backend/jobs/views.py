from django.db import models as db_models
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job, RecruitmentProcess, ProcessStep, SavedJob
from .serializers import (
    JobSerializer, JobCreateSerializer, JobListSerializer,
    RecruitmentProcessSerializer, RecruitmentProcessCreateSerializer,
    ProcessStepSerializer, SavedJobSerializer
)


class RecruitmentProcessViewSet(viewsets.ModelViewSet):
    """ViewSet cho quản lý quy trình tuyển dụng"""
    queryset = RecruitmentProcess.objects.prefetch_related('steps').select_related('created_by')
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return RecruitmentProcessCreateSerializer
        return RecruitmentProcessSerializer
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """Đặt quy trình làm mặc định"""
        process = self.get_object()
        RecruitmentProcess.objects.update(is_default=False)
        process.is_default = True
        process.save()
        return Response({'status': 'Đã đặt làm quy trình mặc định'})
    
    @action(detail=True, methods=['post'])
    def add_step(self, request, pk=None):
        """Thêm bước vào quy trình"""
        process = self.get_object()
        serializer = ProcessStepSerializer(data=request.data)
        if serializer.is_valid():
            max_order = process.steps.aggregate(db_models.Max('order'))['order__max'] or 0
            serializer.save(process=process, order=max_order + 1)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def default(self, request):
        """Lấy quy trình mặc định"""
        process = RecruitmentProcess.objects.filter(is_default=True).first()
        if process:
            return Response(RecruitmentProcessSerializer(process).data)
        return Response({'message': 'Chưa có quy trình mặc định'}, status=status.HTTP_404_NOT_FOUND)


class ProcessStepViewSet(viewsets.ModelViewSet):
    """ViewSet cho quản lý các bước trong quy trình"""
    queryset = ProcessStep.objects.select_related('process')
    serializer_class = ProcessStepSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['process', 'step_type']


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
        user = self.request.user
        
        # ADMIN thấy TẤT CẢ jobs trong hệ thống
        # RECRUITER chỉ thấy jobs của mình
        # Anonymous hoặc CANDIDATE, thấy tất cả jobs công khai
        if user.is_authenticated:
            if user.role == 'ADMIN':
                # ADMIN thấy tất cả, không filter
                pass
            elif user.role == 'RECRUITER':
                queryset = queryset.filter(created_by=user)
            else:
                # CANDIDATE: chỉ thấy jobs công khai
                queryset = queryset.filter(status=Job.Status.OPEN)
        else:
            # Anonymous: chỉ hiển thị jobs công khai
            queryset = queryset.filter(status=Job.Status.OPEN)
        
        # Filter by deadline
        if self.request.query_params.get('active'):
            from django.utils import timezone
            queryset = queryset.filter(
                status=Job.Status.OPEN,
                deadline__gte=timezone.now()
            )
        
        # Filter by company name
        company_search = self.request.query_params.get('company_search')
        if company_search:
            queryset = queryset.filter(
                created_by__company_name__icontains=company_search
            ) | queryset.filter(
                created_by__first_name__icontains=company_search
            ) | queryset.filter(
                created_by__last_name__icontains=company_search
            )
        
        # Filter by categories (job categories - can be extended)
        categories = self.request.query_params.get('categories')
        if categories:
            category_list = [c.strip() for c in categories.split(',')]
            # Filter by department or title containing category keywords
            from django.db.models import Q
            category_q = Q()
            for cat in category_list:
                category_q |= Q(department__icontains=cat) | Q(title__icontains=cat)
            queryset = queryset.filter(category_q)
        
        # Filter by experience years
        experience_years = self.request.query_params.get('experience_years')
        if experience_years:
            try:
                exp_years = int(experience_years)
                if exp_years == 0:
                    # Không yêu cầu
                    queryset = queryset.filter(experience_years__lte=0)
                elif exp_years == 1:
                    # Dưới 1 năm hoặc 1 năm
                    queryset = queryset.filter(experience_years__lte=1)
                elif exp_years == 6:
                    # Trên 5 năm
                    queryset = queryset.filter(experience_years__gt=5)
                else:
                    queryset = queryset.filter(experience_years=exp_years)
            except (ValueError, TypeError):
                pass
        
        # Filter by salary range
        salary_min = self.request.query_params.get('salary_min')
        salary_max = self.request.query_params.get('salary_max')
        if salary_min:
            try:
                queryset = queryset.filter(salary_max__gte=int(salary_min))
            except (ValueError, TypeError):
                pass
        if salary_max:
            try:
                queryset = queryset.filter(salary_min__lte=int(salary_max))
            except (ValueError, TypeError):
                pass
        
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
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def applications(self, request, pk=None):
        """Lấy danh sách applications của job"""
        job = self.get_object()
        
        # Chỉ company owner mới xem được applications
        if request.user.role in ['ADMIN', 'RECRUITER']:
            if job.created_by != request.user:
                return Response(
                    {'error': 'You do not have permission to view applications for this job'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        applications = job.applications.select_related('candidate').all()
        
        from applications.serializers import ApplicationListSerializer
        serializer = ApplicationListSerializer(applications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def apply(self, request, pk=None):
        """Public application endpoint (allow anonymous)"""
        try:
            job = self.get_object()
            
            # Kiểm tra job status
            if job.status != Job.Status.OPEN:
                return Response(
                    {'detail': f'Không thể nộp hồ sơ. Job đang ở trạng thái: {job.get_status_display()}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Kiểm tra deadline
            from django.utils import timezone
            if job.deadline and job.deadline < timezone.now():
                return Response(
                    {'detail': 'Không thể nộp hồ sơ. Deadline đã qua.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            from applications.serializers import ApplicationCreateSerializer
            data = request.data.copy()
            data['job'] = str(job.id)
            
            serializer = ApplicationCreateSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                application = serializer.save()
                from applications.serializers import ApplicationSerializer
                return Response(
                    ApplicationSerializer(application, context={'request': request}).data,
                    status=status.HTTP_201_CREATED
                )
            
            # Trả về error message rõ ràng hơn
            error_detail = serializer.errors
            if isinstance(error_detail, dict):
                # Lấy error đầu tiên
                first_key = next(iter(error_detail.keys()))
                first_error = error_detail[first_key]
                if isinstance(first_error, list) and len(first_error) > 0:
                    error_detail = first_error[0]
                elif isinstance(first_error, str):
                    error_detail = first_error
            
            return Response(
                {'detail': str(error_detail) if error_detail else 'Dữ liệu không hợp lệ'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'detail': f'Lỗi khi nộp hồ sơ: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def stats(self, request):
        from django.db.models import Count, Avg, Sum
        from django.db.models.functions import TruncMonth
        from applications.models import Application, Interview, RecruitmentResult
        
        user = request.user
        
        # ADMIN thấy tất cả jobs trong hệ thống, RECRUITER chỉ thấy jobs của mình
        if user.role == 'ADMIN':
            jobs_filter = {}
            apps_filter = {}
        elif user.role == 'RECRUITER':
            jobs_filter = {'created_by': user}
            apps_filter = {'job__created_by': user}
        else:
            # Candidate: chỉ thấy stats của applications của mình
            jobs_filter = {}
            apps_filter = {'candidate': user}
        
        total_jobs = Job.objects.filter(**jobs_filter).count()
        open_jobs = Job.objects.filter(**jobs_filter, status=Job.Status.OPEN).count()
        closed_jobs = Job.objects.filter(**jobs_filter, status=Job.Status.CLOSED).count()
        total_applications = Application.objects.filter(**apps_filter).count()
        avg_ai_score = Application.objects.filter(**apps_filter).aggregate(avg=Avg('ai_score'))['avg']
        
        # Thống kê theo trạng thái ứng viên
        status_stats = Application.objects.filter(**apps_filter).values('status').annotate(count=Count('id'))
        
        # Thống kê theo tháng
        monthly_stats = Application.objects.filter(**apps_filter).annotate(
            month=TruncMonth('applied_at')
        ).values('month').annotate(count=Count('id')).order_by('month')[:12]
        
        # Thống kê phỏng vấn - filter theo application__job__created_by
        if user.role == 'ADMIN':
            interview_filter = {}
            result_filter = {}
        elif user.role == 'RECRUITER':
            interview_filter = {'application__job__created_by': user}
            result_filter = {'application__job__created_by': user}
        else:
            interview_filter = {'application__candidate': user}
            result_filter = {'application__candidate': user}
        
        total_interviews = Interview.objects.filter(**interview_filter).count()
        completed_interviews = Interview.objects.filter(**interview_filter, status='COMPLETED').count()
        
        # Thống kê kết quả
        total_offers = RecruitmentResult.objects.filter(**result_filter, final_decision='OFFER').count()
        total_rejects = RecruitmentResult.objects.filter(**result_filter, final_decision='REJECT').count()
        
        # Tỷ lệ chuyển đổi
        conversion_rate = (total_offers / total_applications * 100) if total_applications > 0 else 0
        
        # Thống kê theo vị trí
        jobs_stats = Job.objects.filter(**jobs_filter).annotate(
            app_count=Count('applications')
        ).values('id', 'title', 'app_count', 'positions_count', 'status')[:10]

        # Thống kê pending applications
        pending_applications = Application.objects.filter(**apps_filter, status='PENDING').count()
        
        # Thống kê upcoming interviews (trong 7 ngày tới)
        from django.utils import timezone
        from datetime import timedelta
        upcoming_interviews = Interview.objects.filter(
            **interview_filter,
            status='SCHEDULED',
            scheduled_at__gte=timezone.now(),
            scheduled_at__lte=timezone.now() + timedelta(days=7)
        ).count()
        
        # Hired count (ACCEPTED applications)
        hired_count = Application.objects.filter(**apps_filter, status='ACCEPTED').count()
        
        # Average salary
        avg_salary = Job.objects.filter(**jobs_filter, status=Job.Status.OPEN).aggregate(
            avg=Avg('salary_min')
        )['avg'] or 0
        
        # Average time to hire (từ applied_at đến decided_at của result)
        # Tính toán thời gian trung bình từ application đến result
        from django.db.models import F, ExpressionWrapper, DurationField
        time_to_hire_data = RecruitmentResult.objects.filter(**result_filter).annotate(
            time_diff=ExpressionWrapper(
                F('decided_at') - F('application__applied_at'),
                output_field=DurationField()
            )
        ).aggregate(avg=Avg('time_diff'))
        
        avg_time_days = 0
        if time_to_hire_data['avg']:
            avg_time_days = time_to_hire_data['avg'].total_seconds() / 86400  # Convert to days
        
        # Monthly jobs stats
        monthly_jobs = Job.objects.filter(**jobs_filter).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(count=Count('id')).order_by('month')[:12]
        
        data = {
            'total_jobs': total_jobs,
            'open_jobs': open_jobs,
            'closed_jobs': closed_jobs,
            'total_applications': total_applications,
            'pending_applications': pending_applications,
            'avg_ai_score': avg_ai_score,
            'status_stats': list(status_stats),
            'monthly_stats': list(monthly_stats),
            'monthly_jobs': list(monthly_jobs),
            'total_interviews': total_interviews,
            'upcoming_interviews': upcoming_interviews,
            'completed_interviews': completed_interviews,
            'total_offers': total_offers,
            'total_rejects': total_rejects,
            'hired_count': hired_count,
            'conversion_rate': round(conversion_rate, 2),
            'avg_salary': round(avg_salary, 0),
            'avg_time_to_hire': round(avg_time_days, 1),
            'jobs_stats': list(jobs_stats),
        }
        return Response(data)
    
    @action(detail=True, methods=['post', 'delete'], permission_classes=[IsAuthenticated])
    def save(self, request, pk=None):
        """Lưu hoặc bỏ lưu job"""
        job = self.get_object()
        user = request.user
        
        if request.method == 'POST':
            # Lưu job
            saved_job, created = SavedJob.objects.get_or_create(
                user=user,
                job=job
            )
            if created:
                return Response({'status': 'Job đã được lưu'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'status': 'Job đã được lưu trước đó'})
        else:
            # DELETE - Bỏ lưu
            try:
                saved_job = SavedJob.objects.get(user=user, job=job)
                saved_job.delete()
                return Response({'status': 'Đã bỏ lưu job'})
            except SavedJob.DoesNotExist:
                return Response({'status': 'Job chưa được lưu'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def is_saved(self, request, pk=None):
        """Kiểm tra job đã được lưu chưa"""
        job = self.get_object()
        user = request.user
        is_saved = SavedJob.objects.filter(user=user, job=job).exists()
        return Response({'is_saved': is_saved})


class SavedJobViewSet(viewsets.ModelViewSet):
    """ViewSet cho SavedJob"""
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related('job', 'user')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
