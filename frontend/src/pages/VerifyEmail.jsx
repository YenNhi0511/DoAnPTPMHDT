import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../services/api';
import { Mail, Send, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState('pending'); // pending, verifying, success, error
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState(email || '');

  useEffect(() => {
    if (token) {
      handleVerify(token);
    }
  }, [token]);

  const handleVerify = async (verifyToken) => {
    setStatus('verifying');
    try {
      const response = await verifyEmail(verifyToken);
      setStatus('success');
      setMessage('Email đã được xác thực thành công! Bạn sẽ được chuyển đến trang đăng nhập...');
      
      // Auto login và redirect về trang login
      if (response.data.access && response.data.user) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Redirect về trang login sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Nếu không có token, chỉ redirect về login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Token không hợp lệ hoặc đã hết hạn');
    }
  };

  const handleResend = async () => {
    if (!userEmail) {
      setMessage('Vui lòng nhập email');
      return;
    }
    
    try {
      await resendVerification(userEmail);
      setMessage('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Không thể gửi email. Vui lòng thử lại.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Xác thực thành công!</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
            <span>Đang chuyển đến trang đăng nhập...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-blue-900">
      {/* Header */}
      <div className="bg-teal-800/50 border-b border-teal-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-teal-400 font-bold text-xl">GoodCV</div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white text-sm flex items-center gap-2">
              <span>👤</span>
              <span>HR Insider</span>
            </button>
            <button className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-lg text-white flex items-center justify-center">
              ?
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          Xác thực email nhà tuyển dụng của bạn
        </h1>

        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center justify-center">
                <div className="text-6xl">📧</div>
                <div className="ml-8">
                  <div className="text-4xl mb-2">💻</div>
                  <div className="text-2xl">✉️</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card max-w-2xl mx-auto mb-6">
          {status === 'error' && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {status === 'verifying' ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Đang xác thực email...</p>
            </div>
          ) : (
            <>
              <p className="text-gray-300 mb-4">
                Email xác thực tài khoản đã được gửi đến email <span className="text-white font-semibold">{userEmail || 'của bạn'}</span>.
              </p>
              <p className="text-gray-300 mb-4">
                Vui lòng kiểm tra hộp thư, bao gồm cả mục <strong>Promotions (Quảng cáo)</strong>, <strong>Spam (Thư rác)</strong> và <strong>Update (Cập nhật)</strong>.
              </p>
              <p className="text-gray-300 mb-6">
                Bạn cũng có thể yêu cầu hệ thống gửi lại email xác thực.
              </p>

              {!userEmail && (
                <div className="mb-4">
                  <label className="label mb-2">Email của bạn</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    className="input w-full"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleResend}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gửi lại
                </button>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost flex items-center justify-center gap-2"
                >
                  Mở Gmail
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center text-gray-600 text-sm">
          <p>Không nhận được email? <button onClick={handleResend} className="text-blue-400 hover:text-blue-300">Gửi lại email xác thực</button></p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
