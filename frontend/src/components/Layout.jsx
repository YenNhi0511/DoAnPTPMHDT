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
  const { user, logout, isRecruiter, isAdmin, isRecruiterOrAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items cho RECRUITER (nhà tuyển dụng)
  const recruiterMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', roles: ['RECRUITER'] },
    { path: '/jobs', icon: Briefcase, label: 'Quản lý việc làm', roles: ['RECRUITER'] },
    { path: '/applications', icon: FileText, label: 'Hồ sơ ứng tuyển', roles: ['RECRUITER'] },
    { path: '/interviews', icon: Calendar, label: 'Lịch phỏng vấn', roles: ['RECRUITER'] },
    { path: '/panels', icon: Users, label: 'Hội đồng tuyển dụng', roles: ['RECRUITER'] },
    { path: '/results', icon: Award, label: 'Kết quả tuyển dụng', roles: ['RECRUITER'] },
    { path: '/processes', icon: ClipboardList, label: 'Quy trình tuyển dụng', roles: ['RECRUITER'] },
    { path: '/reports', icon: BarChart3, label: 'Báo cáo thống kê', roles: ['RECRUITER'] },
  ];

  // Menu items cho ADMIN (cũng có thể quản lý việc làm)
  const adminMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', roles: ['ADMIN'] },
    { path: '/jobs', icon: Briefcase, label: 'Quản lý việc làm', roles: ['ADMIN'] },
    { path: '/applications', icon: FileText, label: 'Hồ sơ ứng tuyển', roles: ['ADMIN'] },
    { path: '/interviews', icon: Calendar, label: 'Lịch phỏng vấn', roles: ['ADMIN'] },
    { path: '/panels', icon: Users, label: 'Hội đồng tuyển dụng', roles: ['ADMIN'] },
    { path: '/results', icon: Award, label: 'Kết quả tuyển dụng', roles: ['ADMIN'] },
    { path: '/processes', icon: ClipboardList, label: 'Quy trình tuyển dụng', roles: ['ADMIN'] },
    { path: '/reports', icon: BarChart3, label: 'Báo cáo thống kê', roles: ['ADMIN'] },
  ];

  // Kết hợp menu items dựa trên role
  const menuItems = isAdmin ? adminMenuItems : recruiterMenuItems;

  // Admin section menu items (separate section cho quản trị hệ thống)
  const adminSectionMenuItems = [
    { path: '/admin/dashboard', icon: Shield, label: 'Admin Dashboard', roles: ['ADMIN'] },
    { path: '/admin/users', icon: Users, label: 'Quản lý người dùng', roles: ['ADMIN'] },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt hệ thống', roles: ['ADMIN'] },
  ];

  // Filter menu items theo role
  const filteredMenuItems = menuItems.filter(item => {
    return item.roles.includes(user?.role);
  });

  // Role-specific accent color
  const accentColor = isAdmin ? 'from-purple-600 to-indigo-700' : 'from-green-600 to-emerald-700';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Accent Bar - Role specific */}
      <div className={`bg-gradient-to-r ${accentColor} h-1 w-full`}></div>
      
      {/* Header */}
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HR System</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Admin Section */}
          {isAdmin && (
            <>
              {sidebarOpen && (
                <div className="pt-4 mt-4 border-t border-slate-700/50">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Quản trị</p>
                </div>
              )}
              {adminSectionMenuItems
                .filter(item => item.roles.includes(user?.role))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`sidebar-link ${isActive ? 'active' : ''} ${sidebarOpen ? '' : 'justify-center'}`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              {/* Django Admin Link */}
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className={`sidebar-link ${sidebarOpen ? '' : 'justify-center'} border-t border-slate-700/50 mt-2 pt-2`}
              >
                <Database className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="flex items-center gap-2">
                    Django Admin
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </a>
            </>
          )}
        </nav>

        {/* User section */}
        {sidebarOpen && user && (
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top bar */}
        <header className="sticky top-16 z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">
              {filteredMenuItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
            </h1>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 animate-fade-in">
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50"
          onClick={() => setUserMenuOpen(false)}
        >
          <User className="w-4 h-4" />
          Hồ sơ cá nhân
        </Link>
        {isRecruiterOrAdmin && (
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50"
            onClick={() => setUserMenuOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Cài đặt tài khoản
          </Link>
        )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1">
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

