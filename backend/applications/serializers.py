from rest_framework import serializers
from .models import Application, Interview, InterviewPanel, RecruitmentResult
from jobs.models import Job
import os


class ApplicationSerializer(serializers.ModelSerializer):
    """Full serializer cho Application"""
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    candidate_email = serializers.EmailField(source='candidate.email', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    cv_file_url = serializers.SerializerMethodField()
    
    def get_cv_file_url(self, obj):
        """Trả về full URL cho CV file"""
        if obj.cv_file:
            request = self.context.get('request')
            if request:
                # Build absolute URL
                url = obj.cv_file.url
                # Ensure URL starts with /media/
                if not url.startswith('/media/'):
                    url = f"/media/{url.lstrip('/')}"
                absolute_url = request.build_absolute_uri(url)
                # Đảm bảo URL đúng format
                if not absolute_url.startswith('http'):
                    backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
                    absolute_url = f"{backend_url}{url}"
                return absolute_url
            # Fallback nếu không có request
            from django.conf import settings
            url = obj.cv_file.url if hasattr(obj.cv_file, 'url') else obj.cv_file.name
            if not url.startswith('/media/'):
                url = f"/media/{url.lstrip('/')}"
            backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
            return f"{backend_url}{url}"
        return None
    
    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'candidate', 'candidate_name',
            'candidate_email', 'cv_file', 'cv_file_url', 'cover_letter', 'status',
            'ai_score', 'ai_analysis', 'screener_notes',
            'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'candidate', 'applied_at', 'updated_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer để nộp hồ sơ"""
    
    candidate_email = serializers.EmailField(write_only=True, required=False)
    candidate_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Application
        fields = ['job', 'cv_file', 'cover_letter', 'candidate_email', 'candidate_name']
    
    def validate_cv_file(self, value):
        """Validate CV file"""
        if not value:
            raise serializers.ValidationError('CV file is required')
        
        # Check file extension
        ext = value.name.split('.')[-1].lower()
        if ext not in ['pdf', 'doc', 'docx']:
            raise serializers.ValidationError('CV file must be PDF or DOC/DOCX')
        
        # Check file size (10MB)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError('CV file size must not exceed 10MB')
        
        return value
    
    def validate(self, attrs):
        """Validate business rules khi apply job"""
        job = attrs.get('job')
        if not job:
            return attrs
        
        # Kiểm tra job status phải là OPEN
        if job.status != Job.Status.OPEN:
            raise serializers.ValidationError({
                'job': f'Không thể nộp hồ sơ cho job này. Job đang ở trạng thái: {job.get_status_display()}'
            })
        
        # Kiểm tra deadline chưa qua
        from django.utils import timezone
        if job.deadline < timezone.now():
            raise serializers.ValidationError({
                'job': 'Không thể nộp hồ sơ cho job này. Deadline đã qua.'
            })
        
        return attrs
    
    def create(self, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        
        # Kiểm tra unique constraint (1 candidate/job)
        job = validated_data.get('job')
        if user and getattr(user, 'is_authenticated', False):
            # Kiểm tra đã apply chưa
            if Application.objects.filter(job=job, candidate=user).exists():
                raise serializers.ValidationError({
                    'job': 'Bạn đã nộp hồ sơ cho job này rồi.'
                })
            validated_data['candidate'] = user
        else:
            # If anonymous, create a temporary user based on provided email/name
            from accounts.models import User
            email = validated_data.pop('candidate_email', None)
            name = validated_data.pop('candidate_name', None) or 'Candidate'

            if not email:
                raise serializers.ValidationError({'candidate_email': 'This field is required for anonymous applications.'})

            # Kiểm tra email đã apply chưa
            try:
                existing_user = User.objects.get(email=email)
                if Application.objects.filter(job=job, candidate=existing_user).exists():
                    raise serializers.ValidationError({
                        'candidate_email': 'Email này đã nộp hồ sơ cho job này rồi.'
                    })
                validated_data['candidate'] = existing_user
            except User.DoesNotExist:
                # auto generate username
                import uuid
                username = f"anon_{uuid.uuid4().hex[:8]}"
                temp_user = User.objects.create_user(
                    email=email,
                    username=username,
                    password=User.objects.make_random_password(),
                    first_name=name.split(' ')[0] if name else '',
                    last_name=' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else '',
                    role=User.Role.CANDIDATE
                )
                validated_data['candidate'] = temp_user
        
        return super().create(validated_data)


class ApplicationListSerializer(serializers.ModelSerializer):
    """Serializer cho list view"""
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'job_title', 'candidate_name', 'status',
            'ai_score', 'applied_at'
        ]


class InterviewSerializer(serializers.ModelSerializer):
    """Serializer cho Interview"""
    candidate_name = serializers.CharField(
        source='application.candidate.name',
        read_only=True
    )
    job_title = serializers.CharField(
        source='application.job.title',
        read_only=True
    )
    job_id = serializers.UUIDField(
        source='application.job.id',
        read_only=True
    )
    candidate_email = serializers.EmailField(
        source='application.candidate.email',
        read_only=True
    )
    application_cv_file = serializers.SerializerMethodField()
    application_cv_file_url = serializers.SerializerMethodField()
    
    def get_application_cv_file(self, obj):
        """Trả về CV file path"""
        if obj.application and obj.application.cv_file:
            return obj.application.cv_file.name
        return None
    
    def get_application_cv_file_url(self, obj):
        """Trả về full URL cho CV file"""
        if obj.application and obj.application.cv_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.application.cv_file.url)
            # Fallback nếu không có request
            from django.conf import settings
            return f"{settings.MEDIA_URL}{obj.application.cv_file.name}"
        return None
    
    def validate(self, attrs):
        """Validate business rules khi tạo interview"""
        application = attrs.get('application') or (self.instance.application if self.instance else None)
        if application:
            # Cho phép tạo interview từ PENDING, SCREENING, hoặc INTERVIEW
            # Tự động update status thành INTERVIEW khi tạo interview
            if application.status not in [Application.Status.PENDING, Application.Status.SCREENING, Application.Status.INTERVIEW]:
                raise serializers.ValidationError({
                    'application': f'Không thể tạo interview cho application ở trạng thái {application.get_status_display()}. Chỉ có thể tạo interview cho application ở trạng thái PENDING, SCREENING, hoặc INTERVIEW.'
                })
        
        # Kiểm tra scheduled_at phải trong tương lai
        scheduled_at = attrs.get('scheduled_at')
        if scheduled_at:
            from django.utils import timezone
            if scheduled_at < timezone.now():
                raise serializers.ValidationError({
                    'scheduled_at': 'Thời gian phỏng vấn phải trong tương lai.'
                })
        
        return attrs
    
    class Meta:
        model = Interview
        fields = [
            'id', 'application', 'candidate_name', 'candidate_email', 'job_title', 'job_id',
            'application_cv_file', 'application_cv_file_url',
            'scheduled_at', 'duration', 'location', 'interview_type',
            'status', 'feedback', 'result', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class InterviewPanelSerializer(serializers.ModelSerializer):
    """Serializer cho InterviewPanel"""
    interviewer_name = serializers.SerializerMethodField()
    
    def get_interviewer_name(self, obj):
        """Trả về tên interviewer với format "Họ tên - Chức vụ" nếu có"""
        interviewer = obj.interviewer
        if interviewer.first_name and ' - ' in interviewer.first_name:
            # Nếu first_name đã có format "Họ tên - Chức vụ", trả về nguyên
            return interviewer.first_name
        elif interviewer.first_name and interviewer.last_name:
            return f"{interviewer.first_name} {interviewer.last_name}".strip()
        elif interviewer.first_name:
            return interviewer.first_name
        return interviewer.username or interviewer.email
    interviewer_email = serializers.EmailField(source='interviewer.email', read_only=True)
    interview_candidate_name = serializers.CharField(source='interview.application.candidate.name', read_only=True)
    interview_job_title = serializers.CharField(source='interview.application.job.title', read_only=True)
    interview_scheduled_at = serializers.DateTimeField(source='interview.scheduled_at', read_only=True)
    interview_status = serializers.CharField(source='interview.status', read_only=True)
    interview_result = serializers.CharField(source='interview.result', read_only=True)
    average_score = serializers.SerializerMethodField()
    total_panel_members = serializers.SerializerMethodField()
    scored_members = serializers.SerializerMethodField()
    
    def get_average_score(self, obj):
        """Tính điểm trung bình của interview (có trọng số)"""
        interview = obj.interview
        scoring_panels = interview.panels.exclude(role='OBSERVER').exclude(score__isnull=True)
        
        if scoring_panels.count() == 0:
            return None
        
        total_weighted_score = 0
        total_weight = 0
        
        for p in scoring_panels:
            weight = 1.5 if p.role == 'LEAD' else 1.0
            total_weighted_score += p.score * weight
            total_weight += weight
        
        return round(total_weighted_score / total_weight, 2) if total_weight > 0 else None
    
    def get_total_panel_members(self, obj):
        """Tổng số thành viên hội đồng (trừ OBSERVER)"""
        return obj.interview.panels.exclude(role='OBSERVER').count()
    
    def get_scored_members(self, obj):
        """Số thành viên đã chấm điểm"""
        return obj.interview.panels.exclude(role='OBSERVER').exclude(score__isnull=True).count()
    
    class Meta:
        model = InterviewPanel
        fields = [
            'id', 'interview', 'interviewer', 'interviewer_name', 'interviewer_email',
            'role', 'feedback', 'score', 'created_at',
            'interview_candidate_name', 'interview_job_title', 'interview_scheduled_at',
            'interview_status', 'interview_result',
            'average_score', 'total_panel_members', 'scored_members'
        ]
        read_only_fields = ['id', 'created_at']


class RecruitmentResultSerializer(serializers.ModelSerializer):
    """Serializer cho RecruitmentResult"""
    candidate_name = serializers.CharField(
        source='application.candidate.name',
        read_only=True
    )
    job_title = serializers.CharField(
        source='application.job.title',
        read_only=True
    )
    decided_by_name = serializers.CharField(source='decided_by.name', read_only=True)
    
    def validate(self, attrs):
        """Validate business rules khi tạo result"""
        application = attrs.get('application') or (self.instance.application if self.instance else None)
        final_decision = attrs.get('final_decision')
        
        if application and final_decision:
            # Kiểm tra application status phải phù hợp với decision
            if final_decision == RecruitmentResult.Decision.OFFER:
                # OFFER có thể tạo từ INTERVIEW hoặc OFFER status
                # Tự động update status thành OFFER nếu đang ở INTERVIEW
                if application.status not in [Application.Status.INTERVIEW, Application.Status.OFFER]:
                    raise serializers.ValidationError({
                        'application': f'Chỉ có thể tạo OFFER result cho application ở trạng thái INTERVIEW hoặc OFFER. Application hiện tại: {application.get_status_display()}'
                    })
            elif final_decision == RecruitmentResult.Decision.REJECT:
                # REJECT có thể tạo từ bất kỳ status nào (trừ ACCEPTED)
                if application.status == Application.Status.ACCEPTED:
                    raise serializers.ValidationError({
                        'application': 'Không thể REJECT application đã ACCEPTED.'
                    })
        
        return attrs
    
    class Meta:
        model = RecruitmentResult
        fields = [
            'id', 'application', 'candidate_name', 'job_title',
            'final_decision', 'offer_letter_file', 'salary',
            'start_date', 'notes', 'decided_by', 'decided_by_name',
            'decided_at', 'created_at'
        ]
        read_only_fields = ['id', 'decided_by', 'decided_at', 'created_at']
