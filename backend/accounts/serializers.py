from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    """Serializer cho User model"""
    name = serializers.SerializerMethodField()
    full_name_with_position = serializers.SerializerMethodField()
    
    def get_name(self, obj):
        """Trả về tên đầy đủ hoặc first_name + last_name"""
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        elif obj.first_name:
            return obj.first_name
        elif obj.last_name:
            return obj.last_name
        return obj.username or obj.email
    
    def get_full_name_with_position(self, obj):
        """Trả về tên với format: "Họ tên - Chức vụ" nếu first_name có chứa dấu '-'"""
        if obj.first_name and ' - ' in obj.first_name:
            # Nếu first_name đã có format "Họ tên - Chức vụ", trả về nguyên
            return obj.first_name
        elif obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        elif obj.first_name:
            return obj.first_name
        return obj.username or obj.email
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'name', 'full_name_with_position',
            'role', 'avatar', 'phone', 'date_joined', 'last_login',
            'is_active', 'is_email_verified', 'company_name',
            'field_of_activity', 'work_location_province', 'work_location_district',
            'scale', 'address', 'website', 'tax_id', 'company_email',
            'company_description'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'name', 'full_name_with_position']


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
    
    def validate_email(self, value):
        """Validate email - kiểm tra đã tồn tại chưa"""
        if value:
            value = value.strip().lower()
            if User.objects.filter(email__iexact=value).exists():
                raise serializers.ValidationError("Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.")
        return value
    
    def validate_username(self, value):
        """Validate username - kiểm tra đã tồn tại chưa"""
        if value:
            value = value.strip()
            if User.objects.filter(username__iexact=value).exists():
                raise serializers.ValidationError("Tên người dùng này đã được sử dụng. Vui lòng chọn tên khác.")
        return value
    
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
        
        # Tự động verify email ngay khi đăng ký (không cần xác thực email)
        user.is_email_verified = True
        user.save()
        
        print(f'✅ User {user.email} đã được tạo và tự động verify email')
        
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
