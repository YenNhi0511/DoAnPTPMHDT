from django.contrib import admin
from .models import Job, RecruitmentProcess, ProcessStep


class ProcessStepInline(admin.TabularInline):
    model = ProcessStep
    extra = 1
    ordering = ['order']


@admin.register(RecruitmentProcess)
class RecruitmentProcessAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_default', 'created_by', 'created_at']
    list_filter = ['is_default', 'created_at']
    search_fields = ['name', 'description']
    inlines = [ProcessStepInline]
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(ProcessStep)
class ProcessStepAdmin(admin.ModelAdmin):
    list_display = ['name', 'process', 'step_type', 'order', 'is_required']
    list_filter = ['step_type', 'is_required', 'process']
    ordering = ['process', 'order']


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'status', 'employment_type', 'location', 'positions_count', 'deadline', 'created_by', 'created_at']
    list_filter = ['status', 'employment_type', 'department', 'created_at']
    search_fields = ['title', 'description', 'location', 'department']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'department', 'description', 'requirements')
        }),
        ('Details', {
            'fields': ('salary', 'salary_min', 'salary_max', 'location', 'employment_type', 'positions_count', 'experience_years', 'status', 'deadline')
        }),
        ('Recruitment Process', {
            'fields': ('recruitment_process',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
