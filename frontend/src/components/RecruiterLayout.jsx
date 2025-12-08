import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home, Briefcase, Users, Calendar, FileText, Settings,
  BarChart3, Bell, LogOut, Menu, X, ChevronDown, User,
  ClipboardList, Award
} from 'lucide-react';

const RecruiterLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items CHỈ cho RECRUITER
  const recruiterMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Trang chủ', roles: ['RECRUITER'] },
    { path: '/jobs', icon: Briefcase, label: 'Quản lý việc làm', roles: ['RECRUITER'] },
    { path: '/applications', icon: FileText, label: 'Hồ sơ ứng tuyển', roles: ['RECRUITER'] },
    { path: '/pipeline', icon: ClipboardList, label: 'Pipeline tuyển dụng', roles: ['RECRUITER'] },
    { path: '/interviews', icon: Calendar, label: 'Lịch phỏng vấn', roles: ['RECRUITER'] },
    { path: '/panels', icon: Users, label: 'Hội đồng tuyển dụng', roles: ['RECRUITER'] },
    { path: '/results', icon: Award, label: 'Kết quả tuyển dụng', roles: ['RECRUITER'] },
    { path: '/processes', icon: ClipboardList, label: 'Quy trình tuyển dụng', roles: ['RECRUITER'] },
    { path: '/reports', icon: BarChart3, label: 'Báo cáo thống kê', roles: ['RECRUITER'] },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Recruiter Header - Compact, same height as Candidate header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-50 h-16">
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo - Link to Recruiter Dashboard */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  HR GoodCV
                </span>
              </div>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-green-600">
                    {user?.first_name?.[0] || user?.email?.[0] || 'R'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-700">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Hồ sơ cá nhân
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Cài đặt tài khoản
                      </Link>
                      
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 2 Columns Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Sidebar - Fixed width 260px, white background, completely fixed */}
        <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full">
          {/* Sidebar Header - User Info (replaced logo) */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {user?.first_name?.[0] || user?.email?.[0] || 'R'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-green-600 truncate">Nhà tuyển dụng</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-green-600 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu - Scrollable middle section, takes available space */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto min-h-0">
            {recruiterMenuItems.map((item) => {
              const Icon = item.icon;
              // Check if path contains hash
              const hasHash = item.path.includes('#');
              const [basePath, hash] = hasHash ? item.path.split('#') : [item.path, null];
              
              // Check if active - for dashboard with hash, check if we're on dashboard
              const isActive = hasHash
                ? location.pathname === basePath && (location.hash === `#${hash}` || location.hash === '')
                : location.pathname === basePath || location.pathname.startsWith(basePath + '/');
              
              const handleClick = (e) => {
                if (hasHash) {
                  e.preventDefault();
                  navigate(basePath);
                  setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 200);
                }
              };
              
              return (
                <Link
                  key={item.path}
                  to={hasHash ? basePath : item.path}
                  onClick={handleClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-2 border-green-300 font-semibold'
                      : 'text-green-700 hover:bg-green-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer - Settings Button (replaced user info) */}
          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                location.pathname === '/settings'
                  ? 'bg-green-50 text-green-700 border-2 border-green-300 font-semibold'
                  : 'text-green-700 hover:bg-green-50'
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">Cài đặt</span>
            </Link>
          </div>
        </aside>

        {/* Right Column - Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50 min-w-0 overflow-x-hidden">
          <div className="p-6 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
