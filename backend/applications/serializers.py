from rest_framework import serializers
from .models import Application, Interview, InterviewPanel, RecruitmentResult


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
                return request.build_absolute_uri(obj.cv_file.url)
            # Fallback nếu không có request
            from django.conf import settings
            return f"{settings.MEDIA_URL}{obj.cv_file.name}"
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
    
    def create(self, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        # If the user is authenticated, set candidate directly
        if user and getattr(user, 'is_authenticated', False):
            validated_data['candidate'] = user
            return super().create(validated_data)

        # If anonymous, create a temporary user based on provided email/name
        from accounts.models import User
        email = validated_data.pop('candidate_email', None)
        name = validated_data.pop('candidate_name', None) or 'Candidate'

        if not email:
            raise serializers.ValidationError({'candidate_email': 'This field is required for anonymous applications.'})

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
    
    class Meta:
        model = Interview
        fields = [
            'id', 'application', 'candidate_name', 'candidate_email', 'job_title',
            'application_cv_file', 'application_cv_file_url',
            'scheduled_at', 'duration', 'location', 'interview_type',
            'status', 'feedback', 'result', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class InterviewPanelSerializer(serializers.ModelSerializer):
    """Serializer cho InterviewPanel"""
    interviewer_name = serializers.CharField(source='interviewer.name', read_only=True)
    
    class Meta:
        model = InterviewPanel
        fields = [
            'id', 'interview', 'interviewer', 'interviewer_name',
            'role', 'feedback', 'score', 'created_at'
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
    
    class Meta:
        model = RecruitmentResult
        fields = [
            'id', 'application', 'candidate_name', 'job_title',
            'final_decision', 'offer_letter_file', 'salary',
            'start_date', 'notes', 'decided_by', 'decided_by_name',
            'decided_at', 'created_at'
        ]
        read_only_fields = ['id', 'decided_by', 'decided_at', 'created_at']
