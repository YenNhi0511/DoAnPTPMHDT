from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from .models import User
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    ChangePasswordSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet cho User CRUD operations"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active', 'is_email_verified']
    search_fields = ['email', 'first_name', 'last_name', 'company_name', 'field_of_activity']
    ordering_fields = ['date_joined', 'email']
    ordering = ['-date_joined']
    
    def get_queryset(self):
        """Filter queryset dựa trên query params"""
        queryset = super().get_queryset()
        
        # Filter theo role nếu có
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        
        # Filter chỉ lấy users có company_name nếu cần (cho admin companies page)
        has_company = self.request.query_params.get('has_company')
        if has_company == 'true':
            queryset = queryset.exclude(company_name__isnull=True).exclude(company_name='')
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['create', 'login', 'register']:
            return [AllowAny()]
        # Chỉ ADMIN mới có quyền quản lý users (update, delete, disable)
        if self.action in ['update', 'partial_update', 'destroy', 'disable', 'reset_password']:
            from rest_framework.permissions import IsAdminUser
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Đăng ký tài khoản mới - Tự động verify và login"""
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Tự động login sau khi đăng ký (không cần verify email)
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Đăng ký thành công! Bạn đã được đăng nhập tự động.',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'requires_verification': False,  # Không cần verify nữa
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def verify_email(self, request):
        """Xác nhận email với token (POST - dùng cho frontend)"""
        token = request.data.get('token')
        if not token:
            return Response(
                {'error': 'Token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email_verification_token=token)
            if user.is_email_verified:
                return Response(
                    {'message': 'Email already verified'},
                    status=status.HTTP_200_OK
                )
            
            user.is_email_verified = True
            user.email_verification_token = None
            user.save()
            
            # Tự động login sau khi verify
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Email verified successfully',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired token'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='verify-email/(?P<token>[^/.]+)')
    def verify_email_get(self, request, token=None):
        """Xác nhận email với token (GET - dùng cho link trong email, tự động redirect về login)"""
        from django.shortcuts import redirect
        from django.conf import settings
        
        # Log để debug
        print(f'🔍 Verification request received: token={token}')
        print(f'   Request path: {request.path}')
        print(f'   Request method: {request.method}')
        
        if not token:
            # Redirect về trang verify-email với thông báo lỗi
            frontend_url = settings.FRONTEND_URL or 'http://localhost:3000'
            print(f'❌ No token provided, redirecting to verify-email page')
            return redirect(f'{frontend_url}/verify-email?error=Token is required')
        
        try:
            user = User.objects.get(email_verification_token=token)
            
            if user.is_email_verified:
                # Đã verify rồi, redirect về login
                frontend_url = settings.FRONTEND_URL or 'http://localhost:3000'
                print(f'✅ User {user.email} da duoc verify truoc do, redirect ve login')
                return redirect(f'{frontend_url}/login?verified=already')
            
            # Xác thực email
            user.is_email_verified = True
            user.email_verification_token = None
            user.save()
            
            print(f'✅ Email verified for user {user.email}')
            
            # Tự động login sau khi verify
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            # Redirect về login với token trong URL (sẽ được frontend xử lý)
            frontend_url = settings.FRONTEND_URL or 'http://localhost:3000'
            redirect_url = f'{frontend_url}/login?verified=success&token={access_token}'
            print(f'✅ Redirecting to: {redirect_url}')
            return redirect(redirect_url)
            
        except User.DoesNotExist:
            # Token không hợp lệ, redirect về verify-email với thông báo lỗi
            frontend_url = settings.FRONTEND_URL or 'http://localhost:3000'
            return redirect(f'{frontend_url}/verify-email?error=Invalid or expired token')
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def generate_otp(self, request):
        """Generate OTP code cho user (fallback khi email không hoạt động)"""
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            if user.is_email_verified:
                return Response(
                    {'message': 'Email already verified'},
                    status=status.HTTP_200_OK
                )
            
            # Generate 6-digit OTP
            import random
            otp_code = str(random.randint(100000, 999999))
            
            # Save OTP
            user.otp_code = otp_code
            from django.utils import timezone
            user.otp_sent_at = timezone.now()
            user.otp_attempts = 0
            user.save()
            
            # Try to send via email first
            email_sent = False
            try:
                from django.core.mail import EmailMultiAlternatives
                from django.conf import settings
                subject = "Mã OTP xác thực đăng ký - GoodCV"
                message = f"""
Xin chào {user.get_full_name() or user.username},

Mã OTP xác thực tài khoản của bạn là: {otp_code}

Mã này có hiệu lực trong 10 phút.

Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.

Trân trọng,
Đội ngũ GoodCV
                """
                msg = EmailMultiAlternatives(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
                msg.send()
                email_sent = True
                print(f'✅ OTP email sent to {user.email}')
            except Exception as e:
                print(f'⚠️ Failed to send OTP email: {e}')
                email_sent = False
            
            # Return OTP code (sẽ hiển thị trên frontend nếu email không gửi được)
            return Response({
                'message': 'OTP generated successfully',
                'otp_code': otp_code if not email_sent else None,  # Chỉ trả về OTP nếu email không gửi được
                'email_sent': email_sent,
                'expires_in': 600  # 10 minutes
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def verify_otp(self, request):
        """Verify OTP code"""
        email = request.data.get('email')
        otp_code = request.data.get('otp_code')
        
        if not email or not otp_code:
            return Response(
                {'error': 'Email and OTP code are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            
            if user.is_email_verified:
                return Response(
                    {'message': 'Email already verified'},
                    status=status.HTTP_200_OK
                )
            
            # Check OTP attempts (max 5 attempts)
            if user.otp_attempts >= 5:
                return Response(
                    {'error': 'Too many failed attempts. Please request a new OTP.'},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            
            # Check if OTP exists and not expired (10 minutes)
            if not user.otp_code:
                return Response(
                    {'error': 'No OTP code found. Please request a new OTP.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            from django.utils import timezone
            from datetime import timedelta
            if user.otp_sent_at and (timezone.now() - user.otp_sent_at) > timedelta(minutes=10):
                return Response(
                    {'error': 'OTP code expired. Please request a new OTP.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Verify OTP
            if user.otp_code == otp_code:
                # Success
                user.is_email_verified = True
                user.otp_code = None
                user.otp_verified = True
                user.otp_attempts = 0
                user.save()
                
                # Auto login
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': 'OTP verified successfully',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                })
            else:
                # Wrong OTP
                user.otp_attempts += 1
                user.save()
                remaining_attempts = 5 - user.otp_attempts
                return Response(
                    {'error': f'Invalid OTP code. {remaining_attempts} attempts remaining.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def resend_verification(self, request):
        """Gửi lại email verification"""
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            if user.is_email_verified:
                return Response(
                    {'message': 'Email already verified'},
                    status=status.HTTP_200_OK
                )
            
            from .tasks import send_verification_email_task
            send_verification_email_task.delay(str(user.id))
            
            return Response({
                'message': 'Verification email sent'
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Đăng nhập - Bắt buộc phải verify email trước (trừ ADMIN)"""
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')
        
        # Validate input
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not password:
            return Response(
                {'error': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Authenticate user
        user = authenticate(username=email, password=password)
        
        if user:
            # Tự động verify email nếu chưa verify (backward compatibility)
            if not user.is_email_verified:
                user.is_email_verified = True
                user.save()
            
            # Kiểm tra tài khoản có bị vô hiệu hóa không
            if not user.is_active:
                return Response(
                    {'error': 'Tài khoản đã bị vô hiệu hóa'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        
        # Invalid credentials
        return Response(
            {'error': 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        """Lấy và cập nhật thông tin user hiện tại"""
        if request.method == 'GET':
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(UserSerializer(request.user).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Đổi mật khẩu"""
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get('old_password')):
                return Response(
                    {'old_password': 'Wrong password'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({'message': 'Password updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def disable(self, request, pk=None):
        """Vô hiệu hóa hoặc kích hoạt user (chỉ ADMIN)"""
        try:
            user = self.get_object()
            user.is_active = not user.is_active
            user.save()
            return Response({
                'message': f'User {"disabled" if not user.is_active else "enabled"} successfully',
                'is_active': user.is_active
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        """Đặt lại mật khẩu cho user (chỉ ADMIN)"""
        try:
            user = self.get_object()
            new_password = request.data.get('new_password')
            if not new_password:
                return Response(
                    {'error': 'new_password is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successfully'})
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
