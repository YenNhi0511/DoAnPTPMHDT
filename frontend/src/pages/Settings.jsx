import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, changePassword } from '../services/api';
import {
  Lock, User, FileText, Building, Settings as SettingsIcon,
  CheckCircle, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import ChangePassword from '../components/settings/ChangePassword';
import PersonalInfo from '../components/settings/PersonalInfo';
import BusinessRegistration from '../components/settings/BusinessRegistration';
import CompanyInfo from '../components/settings/CompanyInfo';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('password');

  const menuItems = [
    { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
    { id: 'personal', label: 'Thông tin cá nhân', icon: User },
    { id: 'registration', label: 'Giấy đăng ký doanh nghiệp', icon: FileText },
    { id: 'company', label: 'Thông tin công ty', icon: Building },
  ];

  const ActiveComponent = () => {
    switch (activeTab) {
      case 'password':
        return <ChangePassword />;
      case 'personal':
        return <PersonalInfo />;
      case 'registration':
        return <BusinessRegistration />;
      case 'company':
        return <CompanyInfo />;
      default:
        return <ChangePassword />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt tài khoản</h1>
        
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

