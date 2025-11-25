from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer cho Notification"""
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'notification_type', 'title', 'content',
            'is_read', 'related_id', 'sent_at', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'sent_at', 'created_at']
