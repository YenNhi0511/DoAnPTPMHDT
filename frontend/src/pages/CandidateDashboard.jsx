import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApplications } from '../services/api';
import {
  Briefcase, FileText, CheckCircle, Clock, XCircle, ArrowRight,
  Search, Eye, TrendingUp, Calendar, MapPin, Building2
} from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getApplications({ ordering: '-applied_at' });
        setApplications(Array.isArray(res.data) ? res.data : res.data.results || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const statusLabels = {
    PENDING: 'Chờ xử lý',
    SCREENING: 'Đang sàng lọc',
    INTERVIEW: 'Phỏng vấn',
    OFFER: 'Đã gửi offer',
    REJECTED: 'Từ chối',
    ACCEPTED: 'Đã nhận việc',
  };

  const statusColors = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    SCREENING: 'bg-blue-50 text-blue-700 border-blue-200',
    INTERVIEW: 'bg-purple-50 text-purple-700 border-purple-200',
    OFFER: 'bg-green-50 text-green-700 border-green-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const statusIcons = {
    PENDING: Clock,
    SCREENING: Eye,
    INTERVIEW: Briefcase,
    OFFER: CheckCircle,
    REJECTED: XCircle,
    ACCEPTED: CheckCircle,
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'PENDING' || app.status === 'SCREENING').length,
    interview: applications.filter(app => app.status === 'INTERVIEW').length,
    accepted: applications.filter(app => app.status === 'ACCEPTED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 md:p-12 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Xin chào, {user?.first_name} {user?.last_name}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Quản lý hồ sơ ứng tuyển và tìm kiếm cơ hội việc làm phù hợp
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                Tìm việc làm ngay
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                <FileText className="w-5 h-5" />
                Cập nhật hồ sơ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</p>
          <p className="text-gray-600 text-sm font-medium">Tổng hồ sơ ứng tuyển</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-yellow-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.pending}</p>
          <p className="text-gray-600 text-sm font-medium">Đang chờ xử lý</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.interview}</p>
          <p className="text-gray-600 text-sm font-medium">Đang phỏng vấn</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.accepted}</p>
          <p className="text-gray-600 text-sm font-medium">Đã nhận việc</p>
        </div>
      </div>

      {/* My Applications Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hồ sơ ứng tuyển của tôi</h2>
              <p className="text-sm text-gray-600 mt-1">Theo dõi trạng thái các đơn ứng tuyển</p>
            </div>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:bg-blue-50 rounded-lg transition-colors"
            >
              Tìm thêm việc
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có hồ sơ ứng tuyển</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Bắt đầu tìm kiếm và ứng tuyển các vị trí phù hợp với bạn. Hãy tạo hồ sơ ứng tuyển đầu tiên!
              </p>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                Tìm việc làm ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const StatusIcon = statusIcons[app.status] || FileText;
                return (
                  <Link
                    key={app.id}
                    to={`/jobs/${app.job}`}
                    className="block p-5 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-3">
                          <div className={`w-12 h-12 ${statusColors[app.status]} rounded-xl flex items-center justify-center border-2 flex-shrink-0`}>
                            <StatusIcon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {app.job_title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span className="font-medium">{app.company_name}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Nộp: {new Date(app.applied_at).toLocaleDateString('vi-VN')}</span>
                              </div>
                              {app.ai_score && (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-3.5 h-3.5" />
                                  <span className="font-semibold text-blue-600">Điểm AI: {app.ai_score.toFixed(0)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 ${statusColors[app.status]}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusLabels[app.status] || app.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/careers"
          className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Tìm việc làm mới</h3>
              <p className="text-sm text-gray-600">Khám phá hàng nghìn cơ hội việc làm</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/profile"
          className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Cập nhật hồ sơ</h3>
              <p className="text-sm text-gray-600">Tối ưu hóa hồ sơ để tăng cơ hội</p>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-600 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CandidateDashboard;
