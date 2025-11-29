from rest_framework import serializers
from .models import Job, RecruitmentProcess, ProcessStep


class ProcessStepSerializer(serializers.ModelSerializer):
    """Serializer cho ProcessStep"""
    
    class Meta:
        model = ProcessStep
        fields = ['id', 'name', 'step_type', 'order', 'description', 'duration_days', 'is_required']
        read_only_fields = ['id']


class RecruitmentProcessSerializer(serializers.ModelSerializer):
    """Serializer cho RecruitmentProcess"""
    steps = ProcessStepSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    
    class Meta:
        model = RecruitmentProcess
        fields = ['id', 'name', 'description', 'is_default', 'steps', 'created_by', 'created_by_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class RecruitmentProcessCreateSerializer(serializers.ModelSerializer):
    """Serializer để tạo quy trình mới với các bước"""
    steps = ProcessStepSerializer(many=True, required=False)
    
    class Meta:
        model = RecruitmentProcess
        fields = ['name', 'description', 'is_default', 'steps']
    
    def create(self, validated_data):
        steps_data = validated_data.pop('steps', [])
        validated_data['created_by'] = self.context['request'].user
        process = RecruitmentProcess.objects.create(**validated_data)
        
        for idx, step_data in enumerate(steps_data):
            step_data['order'] = idx + 1
            ProcessStep.objects.create(process=process, **step_data)
        
        return process
    
    def update(self, instance, validated_data):
        steps_data = validated_data.pop('steps', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if steps_data is not None:
            instance.steps.all().delete()
            for idx, step_data in enumerate(steps_data):
                step_data['order'] = idx + 1
                ProcessStep.objects.create(process=instance, **step_data)
        
        return instance


class JobSerializer(serializers.ModelSerializer):
    """Serializer cho Job model"""
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    applications_count = serializers.IntegerField(
        source='applications.count',
        read_only=True
    )
    process_name = serializers.CharField(source='recruitment_process.name', read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'department', 'description', 'requirements', 
            'salary', 'salary_min', 'salary_max',
            'location', 'employment_type', 'positions_count', 'experience_years',
            'status', 'deadline', 'recruitment_process', 'process_name',
            'created_by', 'created_by_name', 'applications_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class JobCreateSerializer(serializers.ModelSerializer):
    """Serializer để tạo Job mới"""
    
    class Meta:
        model = Job
        fields = [
            'title', 'department', 'description', 'requirements', 
            'salary', 'salary_min', 'salary_max',
            'location', 'employment_type', 'positions_count', 'experience_years',
            'status', 'deadline', 'recruitment_process'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class JobListSerializer(serializers.ModelSerializer):
    """Serializer cho list view (ít fields hơn)"""
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    company_name = serializers.CharField(source='created_by.company_name', read_only=True)
    applications_count = serializers.IntegerField(
        source='applications.count',
        read_only=True
    )
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'department', 'location', 'salary', 'salary_min', 'salary_max',
            'employment_type', 'positions_count', 'experience_years',
            'status', 'deadline', 'created_by_name', 'company_name', 'applications_count',
            'created_at', 'description'
        ]
