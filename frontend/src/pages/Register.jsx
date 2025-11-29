import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle, Building2, UserCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone: '',
    account_type: 'INDIVIDUAL', // INDIVIDUAL hoặc BUSINESS
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState('INDIVIDUAL');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      // Lưu account type để hiển thị message
      setAccountType(formData.account_type);
      
      // Tự động set role dựa trên account_type
      const registerData = {
        ...formData,
        role: formData.account_type === 'BUSINESS' ? 'ADMIN' : 'CANDIDATE',
      };
      
      const result = await register(registerData);
      
      // Nếu cần verify email (CANDIDATE hoặc BUSINESS)
      if (result.requires_verification) {
        navigate(`/verify-email?email=${formData.email}`);
        return;
      }
      
      setSuccess(true);
      
      // Nếu không cần verify (đã tự động login)
      const redirectPath = formData.account_type === 'BUSINESS' ? '/admin/dashboard' : '/dashboard';
      setTimeout(() => navigate(redirectPath), 1500);
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Đăng ký thành công!</h2>
          <p className="text-gray-400">
            {accountType === 'BUSINESS' 
              ? 'Đang chuyển hướng đến trang quản trị...'
              : 'Đang chuyển hướng đến trang chủ...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl mb-4 shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Tạo tài khoản</h1>
          <p className="text-gray-400">Tham gia hệ thống tuyển dụng</p>
        </div>

        {/* Register form */}
        <div className="card animate-fade-in">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selection */}
            <div>
              <label className="label mb-3">Loại tài khoản</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative cursor-pointer ${formData.account_type === 'INDIVIDUAL' ? 'ring-2 ring-blue-500' : ''}`}>
                  <input
                    type="radio"
                    name="account_type"
                    value="INDIVIDUAL"
                    checked={formData.account_type === 'INDIVIDUAL'}
                    onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-lg border-2 transition-all ${
                    formData.account_type === 'INDIVIDUAL'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-700/30 hover:border-slate-600'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.account_type === 'INDIVIDUAL'
                          ? 'bg-blue-500/20'
                          : 'bg-slate-600/50'
                      }`}>
                        <UserCircle className={`w-5 h-5 ${
                          formData.account_type === 'INDIVIDUAL' ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <p className={`font-medium ${
                          formData.account_type === 'INDIVIDUAL' ? 'text-white' : 'text-gray-300'
                        }`}>Cá nhân</p>
                        <p className="text-xs text-gray-400">Ứng viên tìm việc</p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className={`relative cursor-pointer ${formData.account_type === 'BUSINESS' ? 'ring-2 ring-blue-500' : ''}`}>
                  <input
                    type="radio"
                    name="account_type"
                    value="BUSINESS"
                    checked={formData.account_type === 'BUSINESS'}
                    onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-lg border-2 transition-all ${
                    formData.account_type === 'BUSINESS'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-700/30 hover:border-slate-600'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.account_type === 'BUSINESS'
                          ? 'bg-blue-500/20'
                          : 'bg-slate-600/50'
                      }`}>
                        <Building2 className={`w-5 h-5 ${
                          formData.account_type === 'BUSINESS' ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <p className={`font-medium ${
                          formData.account_type === 'BUSINESS' ? 'text-white' : 'text-gray-300'
                        }`}>Doanh nghiệp</p>
                        <p className="text-xs text-gray-400">Tuyển dụng nhân sự</p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {formData.account_type === 'BUSINESS' 
                  ? 'Tài khoản doanh nghiệp sẽ có quyền quản trị đầy đủ: đăng tin tuyển dụng, quản lý hồ sơ, phỏng vấn, báo cáo'
                  : 'Tài khoản cá nhân dùng để tìm việc và ứng tuyển vào các vị trí'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Họ</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="input pl-11"
                  placeholder="your@email.com"
                  required
                />
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
                  onChange={handleChange}
                  className="input pl-11"
                  placeholder="username"
                  required
                />
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
                  onChange={handleChange}
                  className="input pl-11"
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div>
              <label className="label">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-11 pr-11"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  className="input pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

