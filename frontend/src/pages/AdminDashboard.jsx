import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJobStats, getJobs, getApplications, getUsers } from '../services/api';
import {
  Briefcase, Users, Calendar, FileText, TrendingUp, Clock,
  CheckCircle, XCircle, AlertCircle, ArrowRight, Award, UserPlus,
  DollarSign, Building, Activity, Target, Zap, ExternalLink, Settings
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

        // Tính toán user stats
        const users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.results || [];
        const userStatsData = {
          total: users.length,
          byRole: {
            ADMIN: users.filter(u => u.role === 'ADMIN').length,
            RECRUITER: users.filter(u => u.role === 'RECRUITER').length,
            INTERVIEWER: users.filter(u => u.role === 'INTERVIEWER').length,
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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-blue-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Chào mừng, {user?.first_name || 'Admin'}! 👋
            </h1>
            <p className="text-gray-300">
              Bảng điều khiển quản trị hệ thống tuyển dụng
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/users" className="btn-primary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Quản lý người dùng
            </Link>
            <Link to="/admin/settings" className="btn-secondary flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Cài đặt hệ thống
            </Link>
            <a
              href="http://localhost:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2 border-purple-500/30 hover:bg-purple-500/10"
            >
              <Settings className="w-4 h-4" />
              Django Admin
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card animate-fade-in stagger-1 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-blue-400" />
            </div>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +12%
            </span>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{stats?.total_jobs || 0}</p>
          <p className="text-gray-400 text-sm">Tổng việc làm</p>
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-gray-500">
              <span className="text-green-400">{stats?.open_jobs || 0}</span> đang tuyển
            </p>
          </div>
        </div>

        <div className="stat-card animate-fade-in stagger-2 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-green-400" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{userStats?.total || 0}</p>
          <p className="text-gray-400 text-sm">Tổng người dùng</p>
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-gray-500">
              <span className="text-blue-400">{userStats?.byRole?.CANDIDATE || 0}</span> ứng viên
            </p>
          </div>
        </div>

        <div className="stat-card animate-fade-in stagger-3 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-orange-400" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{stats?.total_applications || 0}</p>
          <p className="text-gray-400 text-sm">Hồ sơ ứng tuyển</p>
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-gray-500">
              <span className="text-yellow-400">{stats?.pending_applications || 0}</span> chờ xử lý
            </p>
          </div>
        </div>

        <div className="stat-card animate-fade-in stagger-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7 text-purple-400" />
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{stats?.conversion_rate || 0}%</p>
          <p className="text-gray-400 text-sm">Tỷ lệ tuyển dụng</p>
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-gray-500">
              <span className="text-purple-400">{stats?.hired_count || 0}</span> đã tuyển
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.upcoming_interviews || 0}</p>
              <p className="text-sm text-gray-400">Phỏng vấn sắp tới</p>
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-pink-500/10 to-pink-600/10 border-pink-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.avg_salary ? new Intl.NumberFormat('vi-VN').format(stats.avg_salary) : '0'}đ
              </p>
              <p className="text-sm text-gray-400">Lương trung bình</p>
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.avg_time_to_hire || 0} ngày</p>
              <p className="text-sm text-gray-400">Thời gian tuyển TB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <div className="card">
          <h3 className="section-title">Phân bố người dùng theo vai trò</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userStats ? [
                    { name: 'Admin', value: userStats.byRole.ADMIN },
                    { name: 'Recruiter', value: userStats.byRole.RECRUITER },
                    { name: 'Interviewer', value: userStats.byRole.INTERVIEWER },
                    { name: 'Candidate', value: userStats.byRole.CANDIDATE },
                  ] : []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[0, 1, 2, 3].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {userStats && [
              { label: 'Admin', count: userStats.byRole.ADMIN, color: COLORS[0] },
              { label: 'Recruiter', count: userStats.byRole.RECRUITER, color: COLORS[1] },
              { label: 'Interviewer', count: userStats.byRole.INTERVIEWER, color: COLORS[2] },
              { label: 'Candidate', count: userStats.byRole.CANDIDATE, color: COLORS[3] },
            ].map((item, idx) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-400">{item.label}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="card">
          <h3 className="section-title">Phân bố trạng thái hồ sơ</h3>
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
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {stats?.status_stats?.map((s, idx) => (
              <div key={s.status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-sm text-gray-400">{statusLabels[s.status] || s.status}: {s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title">Xu hướng hồ sơ theo tháng</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthly_stats?.map(m => ({
                month: new Date(m.month).toLocaleDateString('vi-VN', { month: 'short' }),
                count: m.count
              })) || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Việc làm theo tháng</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthly_jobs?.map(m => ({
                month: new Date(m.month).toLocaleDateString('vi-VN', { month: 'short' }),
                count: m.count
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">Việc làm gần đây</h3>
            <Link to="/jobs" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentJobs.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Chưa có việc làm nào</p>
            ) : (
              recentJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{job.title}</h4>
                    <p className="text-sm text-gray-400">{job.location} • {job.employment_type}</p>
                  </div>
                  <span className={`badge ${job.status === 'OPEN' ? 'badge-success' : job.status === 'CLOSED' ? 'badge-danger' : 'badge-gray'}`}>
                    {job.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">Hồ sơ mới nhất</h3>
            <Link to="/applications" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentApplications.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Chưa có hồ sơ nào</p>
            ) : (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{app.candidate_name || 'N/A'}</h4>
                    <p className="text-sm text-gray-400">{app.job_title} • {new Date(app.applied_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <span className={`badge ${
                    app.status === 'ACCEPTED' ? 'badge-success' :
                    app.status === 'REJECTED' ? 'badge-danger' :
                    app.status === 'INTERVIEW' ? 'badge-info' :
                    'badge-warning'
                  }`}>
                    {statusLabels[app.status] || app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

