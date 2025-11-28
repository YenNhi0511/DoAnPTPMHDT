import React, { useState } from 'react';
import {
  Settings, Database, Mail, Shield, Bell, Globe, Key,
  Save, RefreshCw, AlertCircle, CheckCircle, Server, Lock, ExternalLink
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState({
    general: {
      siteName: 'HR Recruitment System',
      siteDescription: 'Hệ thống tuyển dụng nhân sự',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@hrsystem.com',
      fromName: 'HR System',
    },
    security: {
      sessionTimeout: '30',
      passwordMinLength: '8',
      requireTwoFactor: false,
      allowRegistration: true,
    },
    database: {
      dbType: 'PostgreSQL',
      dbHost: 'ep-withered-river-a1e3hteu-pooler.ap-southeast-1.aws.neon.tech',
      dbName: 'recruitment_db',
      dbStatus: 'Connected',
    },
    notifications: {
      emailNotifications: true,
      applicationReceived: true,
      interviewScheduled: true,
      resultPublished: true,
      weeklyReport: true,
    },
  });

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: 'general', label: 'Tổng quan', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Cài đặt hệ thống</h1>
        <p className="text-gray-400">Quản lý cấu hình và thiết lập hệ thống</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="card p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Cài đặt tổng quan</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label">Tên hệ thống</label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                        className="input"
                        placeholder="HR Recruitment System"
                      />
                    </div>

                    <div>
                      <label className="label">Mô tả hệ thống</label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                        className="input"
                        rows="3"
                        placeholder="Mô tả về hệ thống..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Múi giờ</label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                          className="input"
                        >
                          <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York</option>
                        </select>
                      </div>

                      <div>
                        <label className="label">Ngôn ngữ</label>
                        <select
                          value={settings.general.language}
                          onChange={(e) => handleChange('general', 'language', e.target.value)}
                          className="input"
                        >
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Cài đặt Email</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">SMTP Host</label>
                        <input
                          type="text"
                          value={settings.email.smtpHost}
                          onChange={(e) => handleChange('email', 'smtpHost', e.target.value)}
                          className="input"
                          placeholder="smtp.gmail.com"
                        />
                      </div>

                      <div>
                        <label className="label">SMTP Port</label>
                        <input
                          type="text"
                          value={settings.email.smtpPort}
                          onChange={(e) => handleChange('email', 'smtpPort', e.target.value)}
                          className="input"
                          placeholder="587"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">SMTP Username</label>
                      <input
                        type="text"
                        value={settings.email.smtpUser}
                        onChange={(e) => handleChange('email', 'smtpUser', e.target.value)}
                        className="input"
                        placeholder="your-email@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="label">SMTP Password</label>
                      <input
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) => handleChange('email', 'smtpPassword', e.target.value)}
                        className="input"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Email gửi từ</label>
                        <input
                          type="email"
                          value={settings.email.fromEmail}
                          onChange={(e) => handleChange('email', 'fromEmail', e.target.value)}
                          className="input"
                          placeholder="noreply@hrsystem.com"
                        />
                      </div>

                      <div>
                        <label className="label">Tên người gửi</label>
                        <input
                          type="text"
                          value={settings.email.fromName}
                          onChange={(e) => handleChange('email', 'fromName', e.target.value)}
                          className="input"
                          placeholder="HR System"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-300">
                          <p className="font-medium mb-1">Lưu ý về Gmail:</p>
                          <p>Để sử dụng Gmail, bạn cần tạo "App Password" trong tài khoản Google của mình.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Cài đặt bảo mật</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label">Thời gian hết hạn phiên (phút)</label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleChange('security', 'sessionTimeout', e.target.value)}
                        className="input"
                        min="5"
                        max="1440"
                      />
                    </div>

                    <div>
                      <label className="label">Độ dài mật khẩu tối thiểu</label>
                      <input
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => handleChange('security', 'passwordMinLength', e.target.value)}
                        className="input"
                        min="6"
                        max="32"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Yêu cầu xác thực 2 yếu tố</p>
                        <p className="text-sm text-gray-400">Bảo mật tài khoản bằng 2FA</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.requireTwoFactor}
                          onChange={(e) => handleChange('security', 'requireTwoFactor', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Cho phép đăng ký</p>
                        <p className="text-sm text-gray-400">Cho phép người dùng tự đăng ký</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.allowRegistration}
                          onChange={(e) => handleChange('security', 'allowRegistration', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Database Settings */}
            {activeTab === 'database' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Thông tin Database</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Server className="w-5 h-5 text-green-400" />
                        <span className="font-medium text-white">Trạng thái: {settings.database.dbStatus}</span>
                      </div>
                    </div>

                    <div>
                      <label className="label">Loại Database</label>
                      <input
                        type="text"
                        value={settings.database.dbType}
                        disabled
                        className="input bg-slate-700/50"
                      />
                    </div>

                    <div>
                      <label className="label">Database Host</label>
                      <input
                        type="text"
                        value={settings.database.dbHost}
                        disabled
                        className="input bg-slate-700/50"
                      />
                    </div>

                    <div>
                      <label className="label">Database Name</label>
                      <input
                        type="text"
                        value={settings.database.dbName}
                        disabled
                        className="input bg-slate-700/50"
                      />
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-300">
                          <p className="font-medium mb-1">Lưu ý:</p>
                          <p>Thông tin database được cấu hình trong file .env. Chỉ admin có quyền thay đổi.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <Database className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-gray-300">
                            <p className="font-medium mb-1">Django Admin Panel</p>
                            <p>Truy cập giao diện quản trị Django để quản lý dữ liệu trực tiếp.</p>
                          </div>
                        </div>
                        <a
                          href="http://localhost:8000/admin/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex items-center gap-2 whitespace-nowrap"
                        >
                          Mở Django Admin
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Cài đặt thông báo</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Bật thông báo email</p>
                        <p className="text-sm text-gray-400">Bật/tắt tất cả thông báo email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => handleChange('notifications', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div className="space-y-3 pl-4 border-l-2 border-slate-700/50">
                      <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                        <div>
                          <p className="font-medium text-white">Nhận hồ sơ mới</p>
                          <p className="text-sm text-gray-400">Thông báo khi có hồ sơ ứng tuyển mới</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.applicationReceived}
                            onChange={(e) => handleChange('notifications', 'applicationReceived', e.target.checked)}
                            className="sr-only peer"
                            disabled={!settings.notifications.emailNotifications}
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 peer-disabled:opacity-50"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                        <div>
                          <p className="font-medium text-white">Lịch phỏng vấn</p>
                          <p className="text-sm text-gray-400">Thông báo khi có lịch phỏng vấn mới</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.interviewScheduled}
                            onChange={(e) => handleChange('notifications', 'interviewScheduled', e.target.checked)}
                            className="sr-only peer"
                            disabled={!settings.notifications.emailNotifications}
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 peer-disabled:opacity-50"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                        <div>
                          <p className="font-medium text-white">Kết quả tuyển dụng</p>
                          <p className="text-sm text-gray-400">Thông báo khi có kết quả tuyển dụng</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.resultPublished}
                            onChange={(e) => handleChange('notifications', 'resultPublished', e.target.checked)}
                            className="sr-only peer"
                            disabled={!settings.notifications.emailNotifications}
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 peer-disabled:opacity-50"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                        <div>
                          <p className="font-medium text-white">Báo cáo tuần</p>
                          <p className="text-sm text-gray-400">Nhận báo cáo thống kê hàng tuần</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.weeklyReport}
                            onChange={(e) => handleChange('notifications', 'weeklyReport', e.target.checked)}
                            className="sr-only peer"
                            disabled={!settings.notifications.emailNotifications}
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 peer-disabled:opacity-50"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-700/50">
              <div>
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Đã lưu thành công!</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button className="btn-secondary flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Đặt lại
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

