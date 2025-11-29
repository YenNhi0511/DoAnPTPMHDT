import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMe, changePassword } from '../services/api';
import { User, Mail, Phone, Lock, Save, AlertCircle, CheckCircle, Camera, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user: authUser, login } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
      setFormData({
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        username: res.data.username || '',
      });
    } catch (err) {
      setError('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Update user profile
      const { updateMe } = await import('../services/api');
      const res = await updateMe(formData);
      setUser(res.data);
      setSuccess('Cập nhật thông tin thành công!');
      
      // Reload user to refresh data
      await loadUser();
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Cập nhật thất bại. Vui lòng thử lại.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.new_password2) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setSaving(true);

    try {
      await changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setSuccess('Đổi mật khẩu thành công!');
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password2: '',
      });
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">Không thể tải thông tin người dùng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-400">Quản lý thông tin tài khoản của bạn</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'profile'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Thông tin cá nhân
          </div>
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'password'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Đổi mật khẩu
          </div>
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-700">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-400">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                {user.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Họ</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Nguyễn"
                  required
                />
              </div>
              <div>
                <label className="label">Tên</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Văn A"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input pl-11"
                  placeholder="your@email.com"
                  required
                  disabled
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  Không thể thay đổi
                </span>
              </div>
            </div>

            <div>
              <label className="label">Tên đăng nhập</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input pl-11"
                  placeholder="username"
                  required
                  disabled
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  Không thể thay đổi
                </span>
              </div>
            </div>

            <div>
              <label className="label">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input pl-11"
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Đổi mật khẩu</h2>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="label">Mật khẩu hiện tại</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  className="input pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="input pl-11"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Tối thiểu 8 ký tự</p>
            </div>

            <div>
              <label className="label">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="new_password2"
                  value={passwordData.new_password2}
                  onChange={handlePasswordChange}
                  className="input pl-11"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Đổi mật khẩu
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;

