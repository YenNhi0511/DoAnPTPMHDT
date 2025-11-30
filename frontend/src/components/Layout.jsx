import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';
import {
  Home, Briefcase, Users, Calendar, FileText, Settings,
  BarChart3, Bell, LogOut, Menu, X, ChevronDown, User,
  ClipboardList, Award, Shield, Database, ExternalLink
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isRecruiter, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items CHỈ cho RECRUITER (nhà tuyển dụng)
  const recruiterMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', roles: ['RECRUITER'] },
    { path: '/jobs', icon: Briefcase, label: 'Quản lý việc làm', roles: ['RECRUITER'] },
    { path: '/applications', icon: FileText, label: 'Hồ sơ ứng tuyển', roles: ['RECRUITER'] },
    { path: '/pipeline', icon: ClipboardList, label: 'Pipeline tuyển dụng', roles: ['RECRUITER'] },
    { path: '/interviews', icon: Calendar, label: 'Lịch phỏng vấn', roles: ['RECRUITER'] },
    { path: '/panels', icon: Users, label: 'Hội đồng tuyển dụng', roles: ['RECRUITER'] },
    { path: '/results', icon: Award, label: 'Kết quả tuyển dụng', roles: ['RECRUITER'] },
    { path: '/processes', icon: ClipboardList, label: 'Quy trình tuyển dụng', roles: ['RECRUITER'] },
    { path: '/reports', icon: BarChart3, label: 'Báo cáo thống kê', roles: ['RECRUITER'] },
  ];

  // Menu items CHỈ cho ADMIN (quản trị hệ thống)
  const adminMenuItems = [
    { path: '/admin/dashboard', icon: Shield, label: 'Admin Dashboard', roles: ['ADMIN'] },
    { path: '/admin/users', icon: Users, label: 'Quản lý người dùng', roles: ['ADMIN'] },
    { path: '/admin/companies', icon: Briefcase, label: 'Quản lý công ty', roles: ['ADMIN'] },
    { path: '/admin/jobs', icon: FileText, label: 'Quản lý tin tuyển dụng', roles: ['ADMIN'] },
    { path: '/admin/candidates', icon: User, label: 'Quản lý ứng viên', roles: ['ADMIN'] },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt hệ thống', roles: ['ADMIN'] },
  ];

  // Xác định menu items dựa trên role - MỖI ROLE CHỈ THẤY MENU CỦA MÌNH
  let menuItems = [];
  if (isAdmin) {
    menuItems = adminMenuItems; // ADMIN chỉ thấy admin menu
  } else if (isRecruiter) {
    menuItems = recruiterMenuItems; // RECRUITER chỉ thấy recruiter menu
  }

  // Role-specific accent color
  const accentColor = isAdmin ? 'from-purple-600 to-indigo-700' : 'from-green-600 to-emerald-700';
  const sidebarBg = isAdmin ? 'bg-purple-50 border-purple-200' : 'bg-green-50 border-green-200';
  const sidebarText = isAdmin ? 'text-purple-900' : 'text-green-900';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Accent Bar - Role specific */}
      <div className={`bg-gradient-to-r ${accentColor} h-1 w-full`}></div>
      
      {/* Header */}
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar - Light Theme */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} ${sidebarBg} border-r transition-all duration-300 flex flex-col shadow-sm`}>
          {/* Logo */}
          <div className={`p-4 border-b ${isAdmin ? 'border-purple-200' : 'border-green-200'} flex items-center justify-between`}>
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${accentColor} rounded-lg flex items-center justify-center shadow-md`}>
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl font-bold ${isAdmin ? 'text-purple-900' : 'text-green-900'}`}>
                  GoodCV
                </span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg hover:bg-white/50 ${isAdmin ? 'text-purple-600' : 'text-green-600'} transition-colors`}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? `bg-white shadow-md ${isAdmin ? 'text-purple-700 border-2 border-purple-300' : 'text-green-700 border-2 border-green-300'} font-semibold`
                      : `${isAdmin ? 'text-purple-700 hover:bg-white/50' : 'text-green-700 hover:bg-white/50'}`
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}

            {/* Django Admin Link - Chỉ cho ADMIN */}
            {isAdmin && (
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-lg text-purple-700 hover:bg-white/50 transition-all border-t border-purple-200 mt-2 pt-2 ${sidebarOpen ? '' : 'justify-center'}`}
              >
                <Database className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="flex items-center gap-2">
                    Django Admin
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </a>
            )}
          </nav>

          {/* User section */}
          {sidebarOpen && user && (
            <div className={`p-4 border-t ${isAdmin ? 'border-purple-200' : 'border-green-200'}`}>
              <div className={`flex items-center gap-3 p-3 rounded-lg bg-white/50 shadow-sm`}>
                <div className={`w-10 h-10 bg-gradient-to-br ${accentColor} rounded-full flex items-center justify-center shadow-md`}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isAdmin ? 'text-purple-900' : 'text-green-900'} truncate`}>
                    {user.first_name} {user.last_name}
                  </p>
                  <p className={`text-xs ${isAdmin ? 'text-purple-600' : 'text-green-600'}`}>
                    {isAdmin ? 'Quản trị viên' : 'Nhà tuyển dụng'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 bg-gray-50`}>
          {/* Top bar */}
          <header className="sticky top-16 z-20 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">
                {menuItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
              </h1>

              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${accentColor} rounded-full flex items-center justify-center shadow-md`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
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
                        {(isRecruiter || isAdmin) && (
                          <Link
                            to={isAdmin ? '/admin/settings' : '/settings'}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Cài đặt tài khoản
                          </Link>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
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
          </header>

          {/* Page content */}
          <main className="p-6 flex-1 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
