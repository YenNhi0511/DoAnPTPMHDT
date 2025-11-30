import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Shield, Users, Settings, Building2, FileText, User as UserIcon,
  LogOut, Menu, X, ChevronDown, Bell, Database, ExternalLink, UserCheck
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items CHỈ cho ADMIN
  const adminMenuItems = [
    { path: '/admin/dashboard', icon: Shield, label: 'Tổng quan', roles: ['ADMIN'] },
    { path: '/admin/users', icon: Users, label: 'Quản lý người dùng', roles: ['ADMIN'] },
    { path: '/admin/companies', icon: Building2, label: 'Quản lý công ty', roles: ['ADMIN'] },
    { path: '/admin/jobs', icon: FileText, label: 'Quản lý tin tuyển dụng', roles: ['ADMIN'] },
    { path: '/admin/interviewers', icon: UserCheck, label: 'Quản lý thành viên hội đồng', roles: ['ADMIN'] },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt hệ thống', roles: ['ADMIN'] },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Top Accent Bar - Purple for Admin */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 h-1 w-full flex-shrink-0"></div>
      
      {/* Admin Header - Fixed */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-50 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Link to Admin Dashboard */}
            <Link to="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent block truncate">
                  Quản lý hệ thống tuyển dụng GoodCV
                </span>
                <p className="text-xs text-gray-700 -mt-1 truncate">Hệ thống quản trị</p>
              </div>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-purple-600">
                    {user?.first_name?.[0] || user?.email?.[0] || 'A'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-700">Quản trị viên</p>
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
                        <span className="inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          Quản trị viên
                        </span>
                      </div>
                      
                      <Link
                        to="/admin/settings"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Cài đặt hệ thống
                      </Link>
                      
                      <a
                        href="/admin/"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Database className="w-4 h-4" />
                        Django Admin
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </a>
                      
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Purple theme for Admin - Fixed */}
        <aside className={`${sidebarOpen ? 'w-[280px]' : 'w-20'} bg-purple-50 border-r border-purple-200 transition-all duration-300 flex flex-col shadow-sm flex-shrink-0 h-full overflow-hidden`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-purple-200 flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-lg font-bold text-purple-900 block truncate">
                    GoodCV Admin
                  </span>
                  <p className="text-xs text-purple-600 truncate">Hệ thống quản trị</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/50 text-purple-600 transition-colors flex-shrink-0"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white shadow-md text-purple-700 border-2 border-purple-300 font-semibold'
                      : 'text-purple-700 hover:bg-white/50'
                  }`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer - User Info */}
          {sidebarOpen && (
            <div className="p-4 border-t border-purple-200 bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {user?.first_name?.[0] || user?.email?.[0] || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-purple-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-purple-600 truncate">Quản trị viên</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

