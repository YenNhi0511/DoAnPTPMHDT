import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Kiểm tra query params khi component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const verified = searchParams.get('verified');
    const token = searchParams.get('token');
    
    if (verified === 'success' && token) {
      // Tự động login với token từ email verification
      localStorage.setItem('access_token', token);
      setSuccess('Email đã được xác thực thành công! Đang đăng nhập...');
      
      // Lấy user info và redirect
      import('../services/api').then((module) => {
        module.getMe().then(res => {
          const user = res.data;
          let redirectPath = '/';
          if (user.role === 'ADMIN') {
            redirectPath = '/admin/dashboard';
          } else if (user.role === 'CANDIDATE') {
            redirectPath = '/careers';
          } else if (user.role === 'RECRUITER') {
            redirectPath = '/dashboard';
          }
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 1500);
        }).catch(err => {
          console.error('Failed to get user info:', err);
          setSuccess('Email đã được xác thực thành công! Vui lòng đăng nhập.');
        });
      });
    } else if (verified === 'already') {
      setSuccess('Email đã được xác thực trước đó. Vui lòng đăng nhập.');
    }
  }, []);
  
  // Lấy role từ environment variable
  const APP_ROLE = process.env.REACT_APP_ROLE || 'ALL';
  
  // Thông tin tài khoản admin mẫu
  const adminAccounts = [
    {
      email: 'admin@recruitment.com',
      password: 'admin123',
      role: 'ADMIN',
      name: 'Admin User'
    },
    {
      email: 'admin@goodcv.com',
      password: 'admin123',
      role: 'ADMIN',
      name: 'Admin GoodCV'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      // Redirect dựa trên role
      let redirectPath = '/careers';
      if (result?.user?.role === 'ADMIN') {
        redirectPath = '/admin/dashboard';
      } else if (result?.user?.role === 'RECRUITER') {
        redirectPath = '/dashboard';
      } else if (result?.user?.role === 'CANDIDATE') {
        redirectPath = '/careers';
      }
      navigate(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      
      // Không cần xử lý verify email nữa - đã tự động verify trong backend
      if (err.response?.status === 401) {
        setError(err.response?.data?.error || 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.');
      } else if (err.response?.status === 403) {
        setError(err.response?.data?.error || 'Tài khoản đã bị vô hiệu hóa hoặc chưa được xác thực.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || 'Thông tin đăng nhập không hợp lệ.');
      } else if (!err.response) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
      } else {
        setError(err.response?.data?.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập vào GoodCV</h1>
            <p className="text-gray-600">Chào mừng bạn trở lại!</p>
          </div>

          {/* Admin Account Info - Chỉ hiển thị khi APP_ROLE là ADMIN */}
          {APP_ROLE === 'ADMIN' && (
            <div className="mb-6 space-y-3">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-purple-900 mb-1">Tài khoản Admin</h3>
                    <p className="text-xs text-purple-700">Chọn một tài khoản để đăng nhập</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {adminAccounts.map((account, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-purple-900 mb-1">{account.name}</p>
                          <div className="space-y-0.5 text-xs text-purple-800">
                            <p><strong>Email:</strong> {account.email}</p>
                            <p><strong>Mật khẩu:</strong> {account.password}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail(account.email);
                            setPassword(account.password);
                          }}
                          className="ml-3 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                        >
                          Sử dụng
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700 text-sm text-center mb-3">
                Hoặc xem việc làm mà không cần đăng nhập
              </p>
              <Link
                to="/careers"
                className="block w-full py-2.5 text-center text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Xem việc làm công khai
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
