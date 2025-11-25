from django.contrib import admin
from .models import Application, Interview, InterviewPanel, RecruitmentResult


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'job', 'status', 'ai_score', 'applied_at']
    list_filter = ['status', 'applied_at']
    search_fields = ['candidate__email', 'candidate__first_name', 'job__title']
    readonly_fields = ['applied_at', 'updated_at']
    date_hierarchy = 'applied_at'
    
    fieldsets = (
        ('Application Info', {
            'fields': ('job', 'candidate', 'cv_file', 'cover_letter')
        }),
        ('Status', {
            'fields': ('status', 'screener_notes')
        }),
        ('AI Analysis', {
            'fields': ('ai_score', 'ai_analysis'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('applied_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ['application', 'scheduled_at', 'interview_type', 'status', 'result']
    list_filter = ['status', 'interview_type', 'result', 'scheduled_at']
    search_fields = ['application__candidate__email', 'application__job__title']
    date_hierarchy = 'scheduled_at'


class InterviewPanelInline(admin.TabularInline):
    model = InterviewPanel
    extra = 1


@admin.register(InterviewPanel)
class InterviewPanelAdmin(admin.ModelAdmin):
    list_display = ['interviewer', 'interview', 'role', 'score']
    list_filter = ['role']
    search_fields = ['interviewer__email', 'interview__application__job__title']


@admin.register(RecruitmentResult)
class RecruitmentResultAdmin(admin.ModelAdmin):
    list_display = ['application', 'final_decision', 'salary', 'start_date', 'decided_by', 'decided_at']
    list_filter = ['final_decision', 'decided_at']
    search_fields = ['application__candidate__email', 'application__job__title']
    readonly_fields = ['decided_at', 'created_at']
