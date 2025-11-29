import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateMe, getMe } from '../../services/api';
import { User, Camera, CheckCircle, AlertCircle } from 'lucide-react';

const PersonalInfo = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    phone: '',
    avatar: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        gender: user.gender || '',
        phone: user.phone || '',
        avatar: null
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage({ type: '', text: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File ảnh không được vượt quá 5MB' });
        return;
      }
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = new FormData();
      submitData.append('first_name', formData.first_name);
      submitData.append('last_name', formData.last_name);
      submitData.append('phone', formData.phone);
      submitData.append('gender', formData.gender);
      if (formData.avatar) {
        submitData.append('avatar', formData.avatar);
      }

      const response = await updateMe(submitData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      
      // Update user context
      const updatedUser = await getMe();
      setUser(updatedUser.data);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Cập nhật thông tin thất bại. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Account Verification Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Tài khoản xác thực: Cấp 1/3
        </h3>
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4 flex items-center gap-2">
          <span className="text-green-600">⭐</span>
          <span className="text-sm text-green-700">
            Nâng cấp tài khoản lên cấp 2/3 để nhận 100 lượt xem CV ứng viên từ công cụ tìm kiếm CV.
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Vui lòng thực hiện các bước xác thực dưới đây:
        </p>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Xác thực thông tin</span>
            <span className="text-sm text-green-600 font-semibold">Hoàn thành 33%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Xác thực số điện thoại</span>
            <span className="ml-auto text-green-500">→</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
            <span className="text-sm text-gray-500">Cập nhật thông tin công ty</span>
            <span className="ml-auto text-gray-400">→</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
            <span className="text-sm text-gray-500">Xác thực Giấy đăng ký doanh nghiệp</span>
            <span className="ml-auto text-gray-400">→</span>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors">
          Tìm hiểu thêm
        </button>
      </div>

      {/* Update Personal Information */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Cập nhật thông tin cá nhân</h2>

      {message.text && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => document.querySelector('input[type="file"]').click()}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Đổi avatar
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Họ"
            className="input w-full mb-2"
            required
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Tên"
            className="input w-full"
            required
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email: {formData.email}
          </label>
          <p className="text-xs text-gray-500">Email không thể thay đổi</p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giới tính
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={formData.gender === 'MALE'}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Nam</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={formData.gender === 'FEMALE'}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Nữ</span>
            </label>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="input w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;

