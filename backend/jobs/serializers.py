from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    """Serializer cho Job model"""
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    applications_count = serializers.IntegerField(
        source='applications.count',
        read_only=True
    )
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'requirements', 'salary',
            'location', 'employment_type', 'status', 'deadline',
            'created_by', 'created_by_name', 'applications_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class JobCreateSerializer(serializers.ModelSerializer):
    """Serializer để tạo Job mới"""
    
    class Meta:
        model = Job
        fields = [
            'title', 'description', 'requirements', 'salary',
            'location', 'employment_type', 'status', 'deadline'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class JobListSerializer(serializers.ModelSerializer):
    """Serializer cho list view (ít fields hơn)"""
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    applications_count = serializers.IntegerField(
        source='applications.count',
        read_only=True
    )
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'location', 'salary', 'employment_type',
            'status', 'deadline', 'created_by_name', 'applications_count',
            'created_at'
        ]
