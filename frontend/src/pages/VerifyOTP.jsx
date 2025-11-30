import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyOTP, generateOTP } from '../services/api';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');
  const initialOTP = searchParams.get('otp'); // OTP từ registration response
  
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('pending'); // pending, verifying, success, error
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpFromEmail, setOtpFromEmail] = useState(initialOTP || '');

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-fill OTP if provided
  useEffect(() => {
    if (initialOTP && initialOTP.length === 6) {
      const otpArray = initialOTP.split('');
      setOtpCode(otpArray);
      setOtpFromEmail(initialOTP);
    }
  }, [initialOTP]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: clear current and focus previous
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split('');
      setOtpCode(otpArray);
      // Focus last input
      const lastInput = document.getElementById('otp-5');
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otpCode.join('');
    
    if (fullOtp.length !== 6) {
      setMessage('Vui lòng nhập đầy đủ 6 chữ số');
      return;
    }

    if (!email) {
      setMessage('Email không hợp lệ');
      return;
    }

    setLoading(true);
    setStatus('verifying');
    setMessage('');

    try {
      const response = await verifyOTP(email, fullOtp);
      setStatus('success');
      setMessage('Xác thực thành công! Đang đăng nhập...');
      
      // Auto login
      if (response.data.access && response.data.user) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Redirect based on role
        const user = response.data.user;
        let redirectPath = '/';
        if (user.role === 'ADMIN') {
          redirectPath = '/admin/dashboard';
        } else if (user.role === 'CANDIDATE') {
          redirectPath = '/careers';
        } else if (user.role === 'RECRUITER') {
          redirectPath = '/dashboard';
        }
        
        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Mã OTP không hợp lệ. Vui lòng thử lại.');
      
      // Clear OTP on error
      setOtpCode(['', '', '', '', '', '']);
      const firstInput = document.getElementById('otp-0');
      if (firstInput) firstInput.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage('Email không hợp lệ');
      return;
    }

    setResending(true);
    setMessage('');

    try {
      const response = await generateOTP(email);
      if (response.data.otp_code) {
        // Email không gửi được, hiển thị OTP trên màn hình
        setOtpFromEmail(response.data.otp_code);
        setMessage(`Mã OTP mới: ${response.data.otp_code} (Email không gửi được, hiển thị trực tiếp)`);
      } else {
        // Email đã gửi thành công
        setMessage('Mã OTP mới đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
        setOtpFromEmail('');
      }
      setCountdown(60); // 60 seconds cooldown
    } catch (error) {
      setMessage(error.response?.data?.error || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
    } finally {
      setResending(false);
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
            <span>Đang chuyển đến trang chủ...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-blue-600 font-bold text-xl">GoodCV</Link>
          <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            {/* Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực bằng mã OTP</h1>
              <p className="text-gray-600 text-sm">
                Nhập mã OTP 6 chữ số đã được gửi đến
              </p>
              <p className="text-gray-900 font-semibold mt-1">{email}</p>
            </div>

            {/* OTP Display (if email failed) */}
            {otpFromEmail && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>⚠️ Email không gửi được.</strong> Mã OTP của bạn:
                </p>
                <div className="text-3xl font-bold text-yellow-900 text-center tracking-widest">
                  {otpFromEmail}
                </div>
                <p className="text-xs text-yellow-700 text-center mt-2">
                  Vui lòng nhập mã này vào các ô bên dưới
                </p>
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Success/Info Message */}
            {message && status !== 'error' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                {message}
              </div>
            )}

            {/* OTP Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                Mã OTP
              </label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || otpCode.join('').length !== 6}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Đang xác thực...
                </span>
              ) : (
                'Xác thực'
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Không nhận được mã OTP?
              </p>
              <button
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {resending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
                    Đang gửi...
                  </>
                ) : countdown > 0 ? (
                  `Gửi lại sau ${countdown}s`
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Gửi lại mã OTP
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Mã OTP có hiệu lực trong 10 phút. Nếu bạn không nhận được email, mã OTP sẽ được hiển thị trực tiếp trên màn hình.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

