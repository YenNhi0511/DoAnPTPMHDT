from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'notification_type', 'is_read', 'sent_at']
    list_filter = ['notification_type', 'is_read', 'sent_at']
    search_fields = ['user__email', 'title', 'content']
    readonly_fields = ['sent_at', 'created_at']
    date_hierarchy = 'sent_at'
    
    actions = ['mark_as_read']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected as read"
