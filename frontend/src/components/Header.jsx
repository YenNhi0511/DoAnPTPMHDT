import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Briefcase, User, LogOut, Bell, Menu, X, ChevronDown,
  Settings, Building2, FileText
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

  const isCandidate = user?.role === 'CANDIDATE';
  const isRecruiter = user?.role === 'ADMIN' || user?.role === 'RECRUITER';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TopCV</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/careers"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/careers' || location.pathname === '/'
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Việc làm
            </Link>
            {isCandidate && (
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/profile'
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Hồ sơ của tôi
              </Link>
            )}
            {isRecruiter && (
              <>
                <Link
                  to="/jobs"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/jobs')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Quản lý việc làm
                </Link>
                <Link
                  to="/applications"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/applications')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Hồ sơ ứng tuyển
                </Link>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user.first_name} {user.last_name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Hồ sơ cá nhân
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Cài đặt tài khoản
                        </Link>
                        {isRecruiter && (
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Building2 className="w-4 h-4" />
                            Quản lý công ty
                          </Link>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
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
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-4">
              <Link
                to="/careers"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Việc làm
              </Link>
              {isCandidate && (
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hồ sơ của tôi
                </Link>
              )}
              {isRecruiter && (
                <>
                  <Link
                    to="/jobs"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Quản lý việc làm
                  </Link>
                  <Link
                    to="/applications"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hồ sơ ứng tuyển
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

