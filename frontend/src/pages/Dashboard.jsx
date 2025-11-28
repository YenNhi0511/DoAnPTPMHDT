import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJobStats, getJobs, getApplications, getInterviews } from '../services/api';
import {
  Briefcase, Users, Calendar, FileText, TrendingUp, Clock,
  CheckCircle, XCircle, AlertCircle, ArrowRight, Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const { user, isRecruiter, isAdmin } = useAuth();

  // Redirect admin to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          getJobStats(),
          getJobs({ ordering: '-created_at', limit: 5 }),
        ]);
        setStats(statsRes.data);
        setRecentJobs(Array.isArray(jobsRes.data) ? jobsRes.data.slice(0, 5) : jobsRes.data.results?.slice(0, 5) || []);

        if (isRecruiter) {
          const [appsRes, interviewsRes] = await Promise.all([
            getApplications({ ordering: '-applied_at' }),
            getInterviews({ status: 'SCHEDULED', ordering: 'scheduled_at' }),
          ]);
          setRecentApplications(Array.isArray(appsRes.data) ? appsRes.data.slice(0, 5) : appsRes.data.results?.slice(0, 5) || []);
          setUpcomingInterviews(Array.isArray(interviewsRes.data) ? interviewsRes.data.slice(0, 5) : interviewsRes.data.results?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isRecruiter]);

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
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Xin chào, {user?.first_name || 'User'}! 👋
            </h1>
            <p className="text-gray-300">
              {isRecruiter
                ? 'Quản lý quy trình tuyển dụng của bạn tại đây.'
                : 'Tìm kiếm cơ hội việc làm phù hợp với bạn.'}
            </p>
          </div>
          <Link to={isRecruiter ? '/jobs/new' : '/careers'} className="btn-primary flex items-center gap-2">
            {isRecruiter ? 'Đăng tin tuyển dụng' : 'Tìm việc làm'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card animate-fade-in stagger-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats?.total_jobs || 0}</p>
          <p className="text-gray-400 text-sm">Tổng việc làm</p>
        </div>

        <div className="stat-card animate-fade-in stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats?.open_jobs || 0}</p>
          <p className="text-gray-400 text-sm">Đang tuyển</p>
        </div>

        <div className="stat-card animate-fade-in stagger-3">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats?.total_applications || 0}</p>
          <p className="text-gray-400 text-sm">Hồ sơ ứng tuyển</p>
        </div>

        <div className="stat-card animate-fade-in stagger-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats?.conversion_rate || 0}%</p>
          <p className="text-gray-400 text-sm">Tỷ lệ tuyển dụng</p>
        </div>
      </div>

      {/* Charts */}
      {isRecruiter && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="card">
            <h3 className="section-title">Phân bố trạng thái hồ sơ</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.status_stats?.map(s => ({
                      name: statusLabels[s.status] || s.status,
                      value: s.count
                    })) || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.status_stats?.map((entry, index) => (
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
              {stats.status_stats?.map((s, idx) => (
                <div key={s.status} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-sm text-gray-400">{statusLabels[s.status] || s.status}: {s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Applications */}
          <div className="card">
            <h3 className="section-title">Hồ sơ theo tháng</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthly_stats?.map(m => ({
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
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent Data */}
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
                  <div>
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

        {/* Recent Applications or Upcoming Interviews */}
        {isRecruiter ? (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title mb-0">Phỏng vấn sắp tới</h3>
              <Link to="/interviews" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingInterviews.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Không có lịch phỏng vấn</p>
              ) : (
                upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{interview.candidate_name}</h4>
                        <p className="text-sm text-gray-400">{interview.job_title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">
                        {new Date(interview.scheduled_at).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(interview.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="card">
            <h3 className="section-title">Hồ sơ của bạn</h3>
            <div className="space-y-3">
              {recentApplications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Bạn chưa ứng tuyển vị trí nào</p>
                  <Link to="/careers" className="btn-primary mt-4 inline-block">
                    Tìm việc ngay
                  </Link>
                </div>
              ) : (
                recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30"
                  >
                    <div>
                      <h4 className="font-medium text-white">{app.job_title}</h4>
                      <p className="text-sm text-gray-400">
                        Nộp lúc: {new Date(app.applied_at).toLocaleDateString('vi-VN')}
                      </p>
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;

