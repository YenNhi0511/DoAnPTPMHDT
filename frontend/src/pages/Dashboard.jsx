import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJobStats, getJobs, getApplications, getInterviews } from '../services/api';
import {
  Briefcase, Users, FileText, TrendingUp,
  CheckCircle, ArrowRight, Award, Plus, Eye, Building2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const { user, isRecruiterOrAdmin, isAdmin } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [isRecruiterOrAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        getJobStats(),
        getJobs({ ordering: '-created_at', limit: 5 }),
      ]);
      setStats(statsRes.data);
      setRecentJobs(Array.isArray(jobsRes.data) ? jobsRes.data.slice(0, 5) : jobsRes.data.results?.slice(0, 5) || []);

      if (isRecruiterOrAdmin) {
        const [appsRes, interviewsRes] = await Promise.all([
          getApplications({ ordering: '-applied_at' }),
          getInterviews({ status: 'SCHEDULED', ordering: 'scheduled_at' }),
        ]);
        setRecentApplications(Array.isArray(appsRes.data) ? appsRes.data : appsRes.data.results || []);
        setUpcomingInterviews(Array.isArray(interviewsRes.data) ? interviewsRes.data.slice(0, 5) : interviewsRes.data.results?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const statusLabels = {
    PENDING: 'Chờ xử lý',
    SCREENING: 'Đang sàng lọc',
    INTERVIEW: 'Phỏng vấn',
    OFFER: 'Đã gửi offer',
    REJECTED: 'Từ chối',
    ACCEPTED: 'Đã nhận việc',
  };


  // Redirect admin to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Xin chào, {user?.first_name} {user?.last_name}! 👋
                </h1>
                <p className="text-green-100 text-lg">
                  Quản lý quy trình tuyển dụng và tìm kiếm ứng viên tài năng
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/jobs/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Đăng tin tuyển dụng mới
              </Link>
              <Link
                to="/applications"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                <Eye className="w-5 h-5" />
                Xem hồ sơ ứng tuyển
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Cân đối với màu sắc thống nhất (Green theme) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.total_jobs || 0}</p>
          <p className="text-gray-600 text-sm font-medium">Tổng việc làm</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.open_jobs || 0}</p>
          <p className="text-gray-600 text-sm font-medium">Đang tuyển</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.total_applications || 0}</p>
          <p className="text-gray-600 text-sm font-medium">Hồ sơ ứng tuyển</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-7 h-7 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.conversion_rate || 0}%</p>
          <p className="text-gray-600 text-sm font-medium">Tỷ lệ tuyển dụng</p>
        </div>
      </div>

      {/* Charts Section */}
      {isRecruiterOrAdmin && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Phân bố trạng thái hồ sơ</h3>
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
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ color: '#111827', fontWeight: '600' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {stats.status_stats?.map((s, idx) => (
                <div key={s.status} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-sm text-gray-600 font-medium">{statusLabels[s.status] || s.status}: {s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Applications */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Hồ sơ theo tháng</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthly_stats?.map(m => ({
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
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent Jobs Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Việc làm của tôi</h3>
              <p className="text-sm text-gray-600 mt-1">Danh sách việc làm gần đây</p>
            </div>
            <Link to="/jobs" className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center gap-1">
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Chưa có việc làm nào</p>
                <Link
                  to="/jobs/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tạo việc làm mới
                </Link>
              </div>
            ) : (
              recentJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-1">
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


      {/* Quick Actions - Thống nhất màu sắc Green theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/jobs/new"
          className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Đăng tin mới</h3>
              <p className="text-sm text-gray-600">Tạo việc làm mới</p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/applications"
          className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Xem hồ sơ</h3>
              <p className="text-sm text-gray-600">Quản lý ứng viên</p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

    </div>
  );
};

export default Dashboard;
