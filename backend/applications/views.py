from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F, Q, Count, Avg
from django.db.models.functions import TruncMonth
from utils.email_sender import send_email
from .models import Application, Interview, InterviewPanel, RecruitmentResult
from .serializers import (
    ApplicationSerializer,
    ApplicationCreateSerializer,
    ApplicationListSerializer,
    InterviewSerializer,
    InterviewPanelSerializer,
    RecruitmentResultSerializer
)


class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet cho Application"""
    # Default permissions: read/list require auth for recruiter/admin; allow create for anonymous
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Allow unauthenticated users to create applications
        if self.action == 'create':
            from rest_framework.permissions import AllowAny
            return [AllowAny()]
        return [p() for p in self.permission_classes]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['job', 'status']
    ordering_fields = ['applied_at', 'ai_score']
    ordering = ['-applied_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'RECRUITER']:
            # Company chỉ thấy applications cho jobs của mình
            return Application.objects.filter(
                job__created_by=user
            ).select_related('job', 'candidate')
        # Candidate chỉ thấy applications của mình
        return Application.objects.filter(candidate=user).select_related('job')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ApplicationListSerializer
        elif self.action == 'create':
            return ApplicationCreateSerializer
        return ApplicationSerializer
    
    def get_serializer_context(self):
        """Thêm request vào context để build absolute URL"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def screen(self, request, pk=None):
        """Trigger AI screening cho application"""
        application = self.get_object()
        
        # Import task (sẽ tạo sau)
        from .tasks import screen_cv_task
        screen_cv_task.delay(str(application.id))
        
        return Response({
            'message': 'CV screening started',
            'application_id': application.id
        })
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Cập nhật status của application"""
        application = self.get_object()
        new_status = request.data.get('status')
        screener_notes = request.data.get('screener_notes')
        
        if new_status:
            application.status = new_status
        if screener_notes:
            application.screener_notes = screener_notes
        
        application.save()
        
        return Response(ApplicationSerializer(application).data)
    
    @action(detail=True, methods=['post'])
    def invite_interview(self, request, pk=None):
        """Mời phỏng vấn ứng viên - gửi email mời phỏng vấn"""
        application = self.get_object()
        
        # Kiểm tra quyền: chỉ recruiter/admin của job mới được mời
        if request.user.role not in ['ADMIN', 'RECRUITER']:
            return Response(
                {'error': 'Bạn không có quyền mời phỏng vấn'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if application.job.created_by != request.user and request.user.role != 'ADMIN':
            return Response(
                {'error': 'Bạn không có quyền mời phỏng vấn cho job này'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Cập nhật status thành INTERVIEW
        application.status = Application.Status.INTERVIEW
        application.save()
        
        # Gửi email mời phỏng vấn
        try:
            from django.template.loader import render_to_string
            
            candidate = application.candidate
            job = application.job
            recruiter = application.job.created_by
            company_name = recruiter.company_name or 'Công ty chúng tôi'
            
            # Chuẩn bị context cho template
            context = {
                'candidate': candidate,
                'job': job,
                'application': application,
                'recruiter': recruiter,
                'company_name': company_name,
            }
            
            # Render email templates
            subject = f"Thư mời phỏng vấn - Vị trí {job.title}"
            text_content = render_to_string('email/interview_invitation.txt', context)
            html_content = render_to_string('email/interview_invitation.html', context)
            
            # Gửi email qua API
            send_email(
                to_email=candidate.email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
            print(f'✅ Email interview invitation sent to {candidate.email}')
        except Exception as e:
            print(f'❌ Failed to send interview invitation email: {e}')
            import traceback
            traceback.print_exc()
        
        # Tạo notification cho ứng viên
        from notifications.models import Notification
        try:
            Notification.objects.create(
                user=application.candidate,
                notification_type=Notification.Type.SYSTEM,
                title=f"Bạn đã được mời phỏng vấn cho vị trí {application.job.title}",
                content=f"Chúc mừng! Hồ sơ của bạn đã được chấp nhận. Chúng tôi muốn mời bạn tham gia phỏng vấn cho vị trí {application.job.title} tại {application.job.location}. Vui lòng kiểm tra email để biết thêm chi tiết.",
                related_id=application.id
            )
        except Exception as e:
            print(f'Failed to create interview invitation notification: {e}')
        
        return Response({
            'message': 'Đã gửi email và thông báo mời phỏng vấn đến ứng viên',
            'application_id': application.id,
            'candidate_email': application.candidate.email
        })


class InterviewViewSet(viewsets.ModelViewSet):
    """ViewSet cho Interview"""
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'interview_type', 'result']
    ordering_fields = ['scheduled_at']
    ordering = ['scheduled_at']
    
    def get_queryset(self):
        """Filter interviews theo role"""
        user = self.request.user
        queryset = Interview.objects.select_related('application__candidate', 'application__job')
        
        # RECRUITER chỉ thấy interviews cho applications của jobs của mình
        if user.role in ['ADMIN', 'RECRUITER']:
            queryset = queryset.filter(application__job__created_by=user)
        # INTERVIEWER chỉ thấy interviews được assign trong panel
        elif user.role == 'INTERVIEWER':
            queryset = queryset.filter(panels__interviewer=user).distinct()
        # CANDIDATE chỉ thấy interviews cho applications của mình
        elif user.role == 'CANDIDATE':
            queryset = queryset.filter(application__candidate=user)
        
        return queryset
    
    def get_serializer_context(self):
        """Thêm request vào context để build absolute URL"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def submit_feedback(self, request, pk=None):
        """Submit feedback cho interview - Tự động tạo OFFER nếu result = PASS"""
        interview = self.get_object()
        feedback = request.data.get('feedback')
        result = request.data.get('result')
        
        if feedback:
            interview.feedback = feedback
        if result:
            interview.result = result
            interview.status = Interview.Status.COMPLETED
        
        interview.save()
        
        # Nếu interview result = PASS, tự động tạo RecruitmentResult với OFFER
        if result == Interview.Result.PASS:
            application = interview.application
            
            # Kiểm tra xem đã có result chưa
            if not hasattr(application, 'result'):
                # Tự động tạo OFFER result
                from .models import RecruitmentResult
                try:
                    recruitment_result = RecruitmentResult.objects.create(
                        application=application,
                        final_decision=RecruitmentResult.Decision.OFFER,
                        decided_by=request.user,
                        notes=f'Tự động tạo từ kết quả phỏng vấn: {interview.feedback or "Đạt yêu cầu"}'
                    )
                    
                    # Update application status thành OFFER
                    application.status = Application.Status.OFFER
                    application.save()
                    
                    # Gửi email và notification
                    try:
                        from django.template.loader import render_to_string
                        
                        candidate = application.candidate
                        job = application.job
                        
                        context = {
                            'result': recruitment_result,
                            'candidate': candidate,
                            'job': job,
                        }
                        
                        subject = f"Chúc mừng! Bạn đã được nhận - {job.title}"
                        text_content = render_to_string('email/result_notification.txt', context)
                        html_content = render_to_string('email/result_notification.html', context)
                        
                        # Gửi email qua API
                        send_email(
                            to_email=candidate.email,
                            subject=subject,
                            html_content=html_content,
                            text_content=text_content
                        )
                        print(f'✅ Email offer notification sent to {candidate.email}')
                    except Exception as e:
                        print(f'❌ Failed to send offer email: {e}')
                    
                    # Tạo notification
                    from notifications.models import Notification
                    try:
                        Notification.objects.create(
                            user=candidate,
                            notification_type=Notification.Type.SYSTEM,
                            title=f"✅ ĐẬU - Chúc mừng! Bạn đã được nhận - {job.title}",
                            content=f"✅ ĐẬU - Chúc mừng! Bạn đã vượt qua vòng phỏng vấn và được nhận vào vị trí {job.title} tại {job.location}. Vui lòng kiểm tra email để biết thêm chi tiết về offer.",
                            related_id=application.id
                        )
                    except Exception as e:
                        print(f'Failed to create offer notification: {e}')
                    
                    print(f'✅ Auto-created OFFER result for application {application.id}')
                except Exception as e:
                    print(f'Failed to auto-create OFFER result: {e}')
                    import traceback
                    traceback.print_exc()
        
        return Response(InterviewSerializer(interview).data)

    def perform_create(self, serializer):
        interview = serializer.save()
        
        # Tự động update application status thành INTERVIEW khi tạo interview
        application = interview.application
        if application.status != Application.Status.INTERVIEW:
            application.status = Application.Status.INTERVIEW
            application.save()
            print(f'✅ Updated application {application.id} status to INTERVIEW')
        
        # Gửi email thông báo lịch phỏng vấn
        try:
            from django.template.loader import render_to_string
            
            candidate = interview.application.candidate
            job = interview.application.job
            
            # Chuẩn bị context cho template
            context = {
                'interview': interview,
                'candidate': candidate,
                'job': job,
            }
            
            # Render email templates
            subject = f"Thông báo lịch phỏng vấn - {job.title}"
            text_content = render_to_string('email/interview_notification.txt', context)
            html_content = render_to_string('email/interview_notification.html', context)
            
            # Gửi email qua API
            send_email(
                to_email=candidate.email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
            print(f'✅ Email interview notification sent to {candidate.email}')
        except Exception as e:
            print(f'❌ Failed to send interview email: {e}')
            import traceback
            traceback.print_exc()
        
        # Tạo notification cho ứng viên
        from notifications.models import Notification
        try:
            candidate = interview.application.candidate
            job = interview.application.job
            Notification.objects.create(
                user=candidate,
                notification_type=Notification.Type.SYSTEM,
                title=f"Lịch phỏng vấn đã được lên lịch - {job.title}",
                content=f"Lịch phỏng vấn của bạn cho vị trí {job.title} đã được lên lịch vào {interview.scheduled_at.strftime('%d/%m/%Y %H:%M')} tại {interview.location or 'Địa điểm sẽ được thông báo sau'}. Vui lòng kiểm tra email để biết thêm chi tiết.",
                related_id=interview.id
            )
        except Exception as e:
            print(f'Failed to create interview notification: {e}')
    
    @action(detail=True, methods=['post'])
    def send_result_email(self, request, pk=None):
        """Gửi email và notification kết quả phỏng vấn đến ứng viên"""
        interview = self.get_object()
        
        if not interview.result or interview.result == Interview.Result.PENDING:
            return Response(
                {'error': 'Interview chưa có kết quả. Vui lòng nhập kết quả phỏng vấn trước.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        candidate = interview.application.candidate
        job = interview.application.job
        
        # Gửi email kết quả phỏng vấn
        try:
            from django.template.loader import render_to_string
            
            # Chuẩn bị context cho template
            context = {
                'interview': interview,
                'candidate': candidate,
                'job': job,
                'result': interview.result,
                'feedback': interview.feedback or '',
            }
            
            # Render email templates
            if interview.result == Interview.Result.PASS:
                subject = f"Chúc mừng! Bạn đã vượt qua vòng phỏng vấn - {job.title}"
                text_content = render_to_string('email/interview_result_pass.txt', context)
                html_content = render_to_string('email/interview_result_pass.html', context)
            else:
                subject = f"Kết quả phỏng vấn - {job.title}"
                text_content = render_to_string('email/interview_result_fail.txt', context)
                html_content = render_to_string('email/interview_result_fail.html', context)
            
            # Gửi email qua API
            send_email(
                to_email=candidate.email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
            print(f'✅ Email interview result sent to {candidate.email}')
        except Exception as e:
            print(f'❌ Failed to send interview result email: {e}')
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Không thể gửi email: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Tạo notification cho ứng viên
        from notifications.models import Notification
        try:
            if interview.result == Interview.Result.PASS:
                title = f"✅ ĐẬU - Chúc mừng! Bạn đã vượt qua vòng phỏng vấn - {job.title}"
                content = f"✅ ĐẬU - Chúc mừng! Bạn đã vượt qua vòng phỏng vấn cho vị trí {job.title}. Vui lòng kiểm tra email để biết thêm chi tiết về bước tiếp theo."
            else:
                title = f"❌ KHÔNG ĐẬU - Kết quả phỏng vấn - {job.title}"
                content = f"❌ KHÔNG ĐẬU - Kết quả phỏng vấn cho vị trí {job.title} đã được cập nhật. Vui lòng kiểm tra email để biết thêm chi tiết."
            
            Notification.objects.create(
                user=candidate,
                notification_type=Notification.Type.SYSTEM,
                title=title,
                content=content,
                related_id=interview.id
            )
            print(f'✅ Notification created for candidate {candidate.email}')
        except Exception as e:
            print(f'Failed to create interview result notification: {e}')
        
        return Response({
            'message': 'Đã gửi email và thông báo kết quả phỏng vấn đến ứng viên',
            'result': interview.result
        })


class InterviewPanelViewSet(viewsets.ModelViewSet):
    """ViewSet cho InterviewPanel"""
    queryset = InterviewPanel.objects.select_related(
        'interview', 
        'interviewer',
        'interview__application__candidate',
        'interview__application__job'
    )
    serializer_class = InterviewPanelSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['interview', 'interviewer', 'role']
    ordering_fields = ['created_at', 'score']
    ordering = ['-created_at']
    
    def perform_update(self, serializer):
        """Khi cập nhật score/feedback, tự động tính điểm trung bình và cập nhật interview result"""
        panel = serializer.save()
        interview = panel.interview
        
        # Lấy tất cả panels của interview (trừ OBSERVER)
        scoring_panels = interview.panels.exclude(role='OBSERVER')
        scored_panels = scoring_panels.exclude(score__isnull=True)
        
        # Nếu tất cả thành viên (LEAD và MEMBER) đã chấm điểm
        if scored_panels.count() == scoring_panels.count() and scoring_panels.count() > 0:
            # Tính điểm trung bình (trọng số: LEAD = 1.5, MEMBER = 1.0)
            total_weighted_score = 0
            total_weight = 0
            
            for p in scored_panels:
                weight = 1.5 if p.role == 'LEAD' else 1.0
                total_weighted_score += p.score * weight
                total_weight += weight
            
            avg_score = total_weighted_score / total_weight if total_weight > 0 else 0
            
            # Tự động đưa ra quyết định dựa trên điểm trung bình
            # PASS nếu >= 70, FAIL nếu < 70
            if avg_score >= 70 and interview.result == Interview.Result.PENDING:
                interview.result = Interview.Result.PASS
                interview.status = Interview.Status.COMPLETED
                # Tổng hợp feedback từ tất cả thành viên
                feedbacks = [p.feedback for p in scored_panels if p.feedback]
                if feedbacks:
                    interview.feedback = '\n\n'.join([f"{p.interviewer.name} ({p.role}): {p.feedback}" for p in scored_panels if p.feedback])
                interview.save()
                
                # Tự động tạo OFFER nếu chưa có
                application = interview.application
                if not hasattr(application, 'result'):
                    from .models import RecruitmentResult
                    try:
                        recruitment_result = RecruitmentResult.objects.create(
                            application=application,
                            final_decision=RecruitmentResult.Decision.OFFER,
                            decided_by=self.request.user,
                            notes=f'Tự động tạo từ kết quả phỏng vấn. Điểm trung bình: {avg_score:.1f}/100'
                        )
                        application.status = Application.Status.OFFER
                        application.save()
                        
                        # Gửi email và notification
                        try:
                            from django.template.loader import render_to_string
                            
                            candidate = application.candidate
                            job = application.job
                            
                            context = {
                                'result': recruitment_result,
                                'candidate': candidate,
                                'job': job,
                                'avg_score': avg_score,
                            }
                            
                            subject = f"Chúc mừng! Bạn đã được nhận - {job.title}"
                            text_content = render_to_string('email/result_notification.txt', context)
                            html_content = render_to_string('email/result_notification.html', context)
                            
                            # Gửi email qua API
                            send_email(
                                to_email=candidate.email,
                                subject=subject,
                                html_content=html_content,
                                text_content=text_content
                            )
                            print(f'✅ Email offer notification sent to {candidate.email}')
                        except Exception as e:
                            print(f'❌ Failed to send offer email: {e}')
                        
                        # Tạo notification
                        from notifications.models import Notification
                        try:
                            Notification.objects.create(
                                user=candidate,
                                notification_type=Notification.Type.SYSTEM,
                                title=f"✅ ĐẬU - Chúc mừng! Bạn đã được nhận - {job.title}",
                                content=f"✅ ĐẬU - Chúc mừng! Bạn đã vượt qua vòng phỏng vấn với điểm số {avg_score:.1f}/100 và được nhận vào vị trí {job.title} tại {job.location}. Vui lòng kiểm tra email để biết thêm chi tiết về offer.",
                                related_id=application.id
                            )
                        except Exception as e:
                            print(f'Failed to create offer notification: {e}')
                        
                        print(f'✅ Auto-created OFFER result for application {application.id} with avg score {avg_score:.1f}')
                    except Exception as e:
                        print(f'Failed to auto-create OFFER result: {e}')
            elif avg_score < 70 and interview.result == Interview.Result.PENDING:
                interview.result = Interview.Result.FAIL
                interview.status = Interview.Status.COMPLETED
                feedbacks = [p.feedback for p in scored_panels if p.feedback]
                if feedbacks:
                    interview.feedback = '\n\n'.join([f"{p.interviewer.name} ({p.role}): {p.feedback}" for p in scored_panels if p.feedback])
                interview.save()
                print(f'✅ Interview {interview.id} marked as FAIL with avg score {avg_score:.1f}')
    
    def get_queryset(self):
        """Filter panels theo role"""
        user = self.request.user
        queryset = super().get_queryset()
        
        # RECRUITER chỉ thấy panels cho interviews của jobs của mình
        if user.role in ['ADMIN', 'RECRUITER']:
            queryset = queryset.filter(interview__application__job__created_by=user)
        # INTERVIEWER chỉ thấy panels của mình
        elif user.role == 'INTERVIEWER':
            queryset = queryset.filter(interviewer=user)
        # CANDIDATE chỉ thấy panels cho interviews của applications của mình
        elif user.role == 'CANDIDATE':
            queryset = queryset.filter(interview__application__candidate=user)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Thống kê về hội đồng tuyển dụng"""
        user = request.user
        
        # Filter theo role
        if user.role in ['ADMIN', 'RECRUITER']:
            panels_filter = {'interview__application__job__created_by': user}
            interviews_filter = {'application__job__created_by': user}
        elif user.role == 'INTERVIEWER':
            panels_filter = {'interviewer': user}
            interviews_filter = {}
        else:
            panels_filter = {}
            interviews_filter = {}
        
        # Tổng số panels
        total_panels = InterviewPanel.objects.filter(**panels_filter).count()
        
        # Số panels đã chấm điểm
        scored_panels = InterviewPanel.objects.filter(**panels_filter).exclude(score__isnull=True).count()
        
        # Điểm trung bình
        avg_score = InterviewPanel.objects.filter(**panels_filter).exclude(score__isnull=True).aggregate(
            avg=Avg('score')
        )['avg'] or 0
        
        # Thống kê theo role
        role_stats = InterviewPanel.objects.filter(**panels_filter).values('role').annotate(
            count=Count('id'),
            avg_score=Avg('score')
        )
        
        # Thống kê theo tháng
        monthly_stats = InterviewPanel.objects.filter(**panels_filter).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            count=Count('id'),
            scored_count=Count('id', filter=Q(score__isnull=False))
        ).order_by('month')[:12]
        
        # Thống kê interviews có đủ điểm
        interviews_with_scores = Interview.objects.filter(
            **interviews_filter
        ).annotate(
            panel_count=Count('panels', filter=~Q(panels__role='OBSERVER')),
            scored_count=Count('panels', filter=Q(panels__score__isnull=False) & ~Q(panels__role='OBSERVER'))
        ).filter(panel_count__gt=0)
        
        completed_scoring = interviews_with_scores.filter(
            panel_count=F('scored_count')
        ).count()
        
        return Response({
            'total_panels': total_panels,
            'scored_panels': scored_panels,
            'avg_score': round(avg_score, 2),
            'role_stats': list(role_stats),
            'monthly_stats': list(monthly_stats),
            'completed_scoring_count': completed_scoring,
            'pending_scoring_count': interviews_with_scores.count() - completed_scoring,
        })


class RecruitmentResultViewSet(viewsets.ModelViewSet):
    """ViewSet cho RecruitmentResult"""
    queryset = RecruitmentResult.objects.select_related(
        'application__candidate',
        'application__job',
        'decided_by'
    )
    serializer_class = RecruitmentResultSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        result = serializer.save(decided_by=self.request.user)
        
        # Tự động update application status khi tạo result
        application = result.application
        if result.final_decision == RecruitmentResult.Decision.OFFER:
            # Nếu tạo OFFER, update application status thành OFFER
            if application.status != Application.Status.OFFER:
                application.status = Application.Status.OFFER
                application.save()
                print(f'✅ Updated application {application.id} status to OFFER')
        elif result.final_decision == RecruitmentResult.Decision.REJECT:
            # Nếu tạo REJECT, update application status thành REJECTED
            if application.status != Application.Status.REJECTED:
                application.status = Application.Status.REJECTED
                application.save()
                print(f'✅ Updated application {application.id} status to REJECTED')
    
    @action(detail=True, methods=['post'])
    def send_email(self, request, pk=None):
        """Gửi email kết quả tuyển dụng đến ứng viên"""
        result = self.get_object()
        
        # Gửi email kết quả
        try:
            from django.template.loader import render_to_string
            
            candidate = result.application.candidate
            job = result.application.job
            
            # Chuẩn bị context cho template
            context = {
                'result': result,
                'candidate': candidate,
                'job': job,
            }
            
            # Render email templates
            decision_text = {
                'OFFER': 'Chúc mừng! Bạn đã được nhận',
                'REJECT': 'Cảm ơn bạn đã quan tâm',
            }.get(result.final_decision, 'Kết quả tuyển dụng')
            
            subject = f"Kết quả tuyển dụng - {job.title}"
            text_content = render_to_string('email/result_notification.txt', context)
            html_content = render_to_string('email/result_notification.html', context)
            
            # Gửi email qua API
            send_email(
                to_email=candidate.email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
            print(f'✅ Email result notification sent to {candidate.email}')
        except Exception as e:
            print(f'❌ Failed to send result email: {e}')
            import traceback
            traceback.print_exc()
        
        # Tạo notification cho ứng viên
        from notifications.models import Notification
        try:
            candidate = result.application.candidate
            job = result.application.job
            decision_text = {
                'OFFER': '✅ ĐẬU - Chúc mừng! Bạn đã được nhận vào vị trí',
                'REJECT': '❌ KHÔNG ĐẬU - Cảm ơn bạn đã quan tâm đến vị trí',
            }.get(result.final_decision, 'Kết quả tuyển dụng cho vị trí')
            
            # Tạo title rõ ràng với kết quả
            result_badge = "✅ ĐẬU" if result.final_decision == 'OFFER' else "❌ KHÔNG ĐẬU"
            notification_title = f"{result_badge} - Kết quả tuyển dụng - {job.title}"
            
            Notification.objects.create(
                user=candidate,
                notification_type=Notification.Type.SYSTEM,
                title=notification_title,
                content=f"{decision_text} {job.title}. {result.notes or ''}",
                related_id=result.application.id
            )
        except Exception as e:
            print(f'Failed to create result notification: {e}')
        
        return Response({'message': 'Email và notification đã được gửi'})

    @action(detail=True, methods=['post'])
    def generate_offer(self, request, pk=None):
        result = self.get_object()
        from .tasks import generate_offer_task
        generate_offer_task.delay(str(result.id))
        return Response({'message': 'Offer generation started'})
