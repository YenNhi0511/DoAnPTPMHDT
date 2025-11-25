from rest_framework import serializers
from .models import Application, Interview, InterviewPanel, RecruitmentResult


class ApplicationSerializer(serializers.ModelSerializer):
    """Full serializer cho Application"""
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    candidate_email = serializers.EmailField(source='candidate.email', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'candidate', 'candidate_name',
            'candidate_email', 'cv_file', 'cover_letter', 'status',
            'ai_score', 'ai_analysis', 'screener_notes',
            'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'candidate', 'applied_at', 'updated_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer để nộp hồ sơ"""
    
    class Meta:
        model = Application
        fields = ['job', 'cv_file', 'cover_letter']
    
    def create(self, validated_data):
        validated_data['candidate'] = self.context['request'].user
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
    
    class Meta:
        model = Interview
        fields = [
            'id', 'application', 'candidate_name', 'job_title',
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
