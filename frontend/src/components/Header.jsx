import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Briefcase, User, LogOut, Bell, Menu, X, ChevronDown,
  Settings, Building2, FileText, Search, Home, BarChart3
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 3 Roles chính:
  // 1. ADMIN - Quản trị viên hệ thống
  // 2. CANDIDATE - Ứng viên tìm việc
  // 3. RECRUITER - Nhà tuyển dụng
  const isCandidate = user?.role === 'CANDIDATE';
  const isRecruiter = user?.role === 'RECRUITER';
  const isAdmin = user?.role === 'ADMIN';

  // Role display names
  const roleNames = {
    CANDIDATE: 'Ứng viên',
    RECRUITER: 'Nhà tuyển dụng',
    ADMIN: 'Quản trị viên'
  };

  return (
    <>
      {/* Top Accent Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-1 w-full"></div>
      
      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  GoodCV
                </span>
                <p className="text-xs text-gray-500 -mt-1">Tuyển dụng thông minh</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Public/Common Links */}
              <Link
                to="/careers"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/careers' || location.pathname === '/' || location.pathname.startsWith('/jobs/')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Tìm việc làm
              </Link>

              {/* CANDIDATE Navigation */}
              {isCandidate && (
                <>
                  <Link
                    to="/candidate/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/candidate/dashboard')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/profile'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Hồ sơ của tôi
                  </Link>
                </>
              )}

              {/* RECRUITER Navigation */}
              {isRecruiter && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/dashboard'
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/jobs"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/jobs' || location.pathname.startsWith('/jobs/new') || location.pathname.includes('/jobs/') && location.pathname.includes('/edit')
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Quản lý việc làm
                  </Link>
                  <Link
                    to="/applications"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/applications')
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Hồ sơ ứng tuyển
                  </Link>
                </>
              )}

              {/* ADMIN Navigation */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/admin/dashboard')
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Quản trị hệ thống
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/dashboard' && !location.pathname.startsWith('/admin')
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Quản lý việc làm
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/admin/users')
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Quản lý người dùng
                  </Link>
                </>
              )}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* Notifications */}
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        isCandidate ? 'bg-blue-600' :
                        isRecruiter ? 'bg-green-600' :
                        'bg-purple-600'
                      }`}>
                        {user.first_name?.[0] || user.email?.[0] || 'U'}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{roleNames[user.role]}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                              isCandidate ? 'bg-blue-100 text-blue-700' :
                              isRecruiter ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {roleNames[user.role]}
                            </span>
                          </div>
                          
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Hồ sơ cá nhân
                          </Link>
                          
                          {(isRecruiter || isAdmin) && (
                            <Link
                              to="/settings"
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              Cài đặt tài khoản
                            </Link>
                          )}
                          
                          {isAdmin && (
                            <Link
                              to="/admin/dashboard"
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <BarChart3 className="w-4 h-4" />
                              Quản trị hệ thống
                            </Link>
                          )}
                          
                          <div className="border-t border-gray-100 my-1"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-2">
                <Link
                  to="/careers"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tìm việc làm
                </Link>
                {isCandidate && (
                  <>
                    <Link
                      to="/candidate/dashboard"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Trang chủ
                    </Link>
                    <Link
                      to="/profile"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Hồ sơ của tôi
                    </Link>
                  </>
                )}
                {isRecruiter && (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Trang chủ
                    </Link>
                    <Link
                      to="/jobs"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Quản lý việc làm
                    </Link>
                    <Link
                      to="/applications"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Hồ sơ ứng tuyển
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Quản trị hệ thống
                    </Link>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Quản lý việc làm
                    </Link>
                    <Link
                      to="/admin/users"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Quản lý người dùng
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
