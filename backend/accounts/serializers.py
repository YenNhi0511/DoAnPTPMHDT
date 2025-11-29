from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    """Serializer cho User model"""
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'role', 'avatar', 'phone', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer để tạo user mới (đăng ký)"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    account_type = serializers.CharField(write_only=True, required=False)
    # Thông tin bổ sung cho doanh nghiệp
    company_name = serializers.CharField(write_only=True, required=False)
    gender = serializers.CharField(write_only=True, required=False)
    work_location_province = serializers.CharField(write_only=True, required=False)
    work_location_district = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'password', 'password2',
            'first_name', 'last_name', 'phone', 'role', 'account_type',
            'company_name', 'gender', 'work_location_province', 'work_location_district'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Tự động set role dựa trên account_type
        account_type = attrs.pop('account_type', None)
        if account_type:
            if account_type == 'BUSINESS':
                # Doanh nghiệp → RECRUITER (nhà tuyển dụng)
                attrs['role'] = User.Role.RECRUITER
            elif account_type == 'INDIVIDUAL':
                # Cá nhân → CANDIDATE (ứng viên tìm việc)
                attrs['role'] = User.Role.CANDIDATE
        elif 'role' not in attrs:
            # Mặc định là CANDIDATE nếu không có account_type
            attrs['role'] = User.Role.CANDIDATE
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2', None)
        # Đảm bảo có role mặc định
        if 'role' not in validated_data:
            validated_data['role'] = User.Role.CANDIDATE
        
        # Tạo user
        user = User.objects.create_user(**validated_data)
        
        # Gửi email verification cho cả CANDIDATE và ADMIN (nhà tuyển dụng)
        from .tasks import send_verification_email_task
        send_verification_email_task.delay(str(user.id))
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer để cập nhật profile"""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'avatar', 'gender', 'role',
            'company_name', 'work_location_province', 'work_location_district',
            'tax_id', 'website', 'field_of_activity', 'scale', 'address',
            'company_email', 'company_description', 'business_registration_document'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer để đổi mật khẩu"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
