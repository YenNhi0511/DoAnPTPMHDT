import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJobStats, getJobs, getApplications, getUsers } from '../services/api';
import {
  Briefcase, Users, Calendar, FileText, TrendingUp, Clock,
  CheckCircle, XCircle, ArrowRight, Award, UserPlus,
  DollarSign, Building, Activity, Target, Zap, ExternalLink, Settings, Shield
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes, appsRes, usersRes] = await Promise.all([
          getJobStats(),
          getJobs({ ordering: '-created_at', limit: 5 }),
          getApplications({ ordering: '-applied_at', limit: 10 }),
          getUsers({ limit: 100 }),
        ]);

        setStats(statsRes.data);
        setRecentJobs(Array.isArray(jobsRes.data) ? jobsRes.data.slice(0, 5) : jobsRes.data.results?.slice(0, 5) || []);
        setRecentApplications(Array.isArray(appsRes.data) ? appsRes.data.slice(0, 10) : appsRes.data.results?.slice(0, 10) || []);

        // Tính toán user stats (chỉ 3 roles: ADMIN, RECRUITER, CANDIDATE)
        const users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.results || [];
        const userStatsData = {
          total: users.length,
          byRole: {
            ADMIN: users.filter(u => u.role === 'ADMIN').length,
            RECRUITER: users.filter(u => u.role === 'RECRUITER').length,
            CANDIDATE: users.filter(u => u.role === 'CANDIDATE').length,
          }
        };
        setUserStats(userStatsData);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#7c3aed', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899'];

  const statusLabels = {
    PENDING: 'Chờ xử lý',
    SCREENING: 'Đang sàng lọc',
    INTERVIEW: 'Phỏng vấn',
    OFFER: 'Đã gửi offer',
    REJECTED: 'Từ chối',
    ACCEPTED: 'Đã nhận việc',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Chào mừng, {user?.first_name} {user?.last_name}! 👋
                </h1>
                <p className="text-purple-100 text-lg">
                  Bảng điều khiển quản trị hệ thống tuyển dụng GoodCV
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5" />
                Quản lý người dùng
              </Link>
              <Link
                to="/admin/settings"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                <Settings className="w-5 h-5" />
                Cài đặt hệ thống
              </Link>
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                <Activity className="w-5 h-5" />
                Django Admin
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.total_jobs || 0}</p>
          <p className="text-gray-600 text-sm font-medium">Tổng việc làm</p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <span className="text-green-600 font-semibold">{stats?.open_jobs || 0}</span> đang tuyển
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-indigo-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{userStats?.total || 0}</p>
          <p className="text-gray-600 text-sm font-medium">Tổng người dùng</p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <span className="text-blue-600 font-semibold">{userStats?.byRole?.CANDIDATE || 0}</span> ứng viên
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.total_applications || 0}</p>
          <p className="text-gray-600 text-sm font-medium">Hồ sơ ứng tuyển</p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <span className="text-yellow-600 font-semibold">{stats?.pending_applications || 0}</span> chờ xử lý
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7 text-emerald-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.conversion_rate || 0}%</p>
          <p className="text-gray-600 text-sm font-medium">Tỷ lệ tuyển dụng</p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <span className="text-purple-600 font-semibold">{stats?.hired_count || 0}</span> đã tuyển
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.upcoming_interviews || 0}</p>
              <p className="text-sm text-gray-600 font-medium">Phỏng vấn sắp tới</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.avg_salary ? new Intl.NumberFormat('vi-VN').format(stats.avg_salary / 1000000) + 'M' : '0'}đ
              </p>
              <p className="text-sm text-gray-600 font-medium">Lương trung bình</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.avg_time_to_hire || 0} ngày</p>
              <p className="text-sm text-gray-600 font-medium">Thời gian tuyển TB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Phân bố người dùng theo vai trò</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userStats ? [
                    { name: 'Quản trị viên', value: userStats.byRole.ADMIN },
                    { name: 'Nhà tuyển dụng', value: userStats.byRole.RECRUITER },
                    { name: 'Ứng viên', value: userStats.byRole.CANDIDATE },
                  ].filter(item => item.value > 0) : []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[0, 1, 2].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#111827', fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {userStats && [
              { label: 'Quản trị viên', count: userStats.byRole.ADMIN, color: COLORS[0] },
              { label: 'Nhà tuyển dụng', count: userStats.byRole.RECRUITER, color: COLORS[1] },
              { label: 'Ứng viên', count: userStats.byRole.CANDIDATE, color: COLORS[2] },
            ].filter(item => item.count > 0).map((item, idx) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600 font-medium">{item.label}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Phân bố trạng thái hồ sơ</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.status_stats?.map(s => ({
                    name: statusLabels[s.status] || s.status,
                    value: s.count
                  })) || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.status_stats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#111827', fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {stats?.status_stats?.map((s, idx) => (
              <div key={s.status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-sm text-gray-600 font-medium">{statusLabels[s.status] || s.status}: {s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Xu hướng hồ sơ theo tháng</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthly_stats?.map(m => ({
                month: new Date(m.month).toLocaleDateString('vi-VN', { month: 'short' }),
                count: m.count
              })) || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#111827', fontWeight: '600' }}
                />
                <Area type="monotone" dataKey="count" stroke="#7c3aed" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Việc làm theo tháng</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthly_jobs?.map(m => ({
                month: new Date(m.month).toLocaleDateString('vi-VN', { month: 'short' }),
                count: m.count
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#111827', fontWeight: '600' }}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Việc làm gần đây</h3>
                <p className="text-sm text-gray-600 mt-1">Toàn bộ việc làm trong hệ thống</p>
              </div>
              <Link to="/jobs" className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1">
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentJobs.length === 0 ? (
                <p className="text-gray-600 text-center py-4">Chưa có việc làm nào</p>
              ) : (
                recentJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600">{job.location} • {job.employment_type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        job.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                        job.status === 'CLOSED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status === 'OPEN' ? 'Đang tuyển' : job.status === 'CLOSED' ? 'Đã đóng' : 'Nháp'}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Hồ sơ mới nhất</h3>
                <p className="text-sm text-gray-600 mt-1">Toàn bộ hồ sơ ứng tuyển</p>
              </div>
              <Link to="/applications" className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1">
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentApplications.length === 0 ? (
                <p className="text-gray-600 text-center py-4">Chưa có hồ sơ nào</p>
              ) : (
                recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{app.candidate_name || 'N/A'}</h4>
                        <p className="text-sm text-gray-600">{app.job_title} • {new Date(app.applied_at).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        app.status === 'INTERVIEW' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="group p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Quản lý người dùng</h3>
              <p className="text-sm text-gray-600">Xem và quản lý tất cả người dùng</p>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-600 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="group p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Cài đặt hệ thống</h3>
              <p className="text-sm text-gray-600">Cấu hình và quản lý hệ thống</p>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-600 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <a
          href="http://localhost:8000/admin/"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Django Admin</h3>
              <p className="text-sm text-gray-600">Truy cập admin panel</p>
            </div>
            <ExternalLink className="w-5 h-5 text-blue-600 ml-auto group-hover:scale-110 transition-transform" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
