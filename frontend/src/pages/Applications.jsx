import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getApplications, updateApplicationStatus, screenApplication } from '../services/api';
import {
  FileText, Search, Filter, Eye, Brain, Mail, CheckCircle,
  XCircle, Clock, Calendar, Download, User
} from 'lucide-react';

const Applications = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [jobFilter, setJobFilter] = useState(searchParams.get('job') || '');

  const fetchApplications = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (jobFilter) params.job = jobFilter;

      const res = await getApplications(params);
      setApplications(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, jobFilter]);

  const handleScreen = async (id) => {
    try {
      await screenApplication(id);
      alert('Đã bắt đầu sàng lọc CV bằng AI');
      fetchApplications();
    } catch (error) {
      alert('Không thể sàng lọc');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, { status });
      fetchApplications();
    } catch (error) {
      alert('Không thể cập nhật trạng thái');
    }
  };

  const statusLabels = {
    PENDING: 'Chờ xử lý',
    SCREENING: 'Đang sàng lọc',
    INTERVIEW: 'Phỏng vấn',
    OFFER: 'Đã gửi offer',
    REJECTED: 'Từ chối',
    ACCEPTED: 'Đã nhận việc',
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    SCREENING: 'bg-blue-100 text-blue-700 border-blue-200',
    INTERVIEW: 'bg-purple-100 text-purple-700 border-purple-200',
    OFFER: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    ACCEPTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ ứng tuyển</h1>
        <p className="text-gray-600">Quản lý và đánh giá các hồ sơ ứng tuyển</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="SCREENING">Đang sàng lọc</option>
            <option value="INTERVIEW">Phỏng vấn</option>
            <option value="OFFER">Đã gửi offer</option>
            <option value="REJECTED">Từ chối</option>
            <option value="ACCEPTED">Đã nhận việc</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có hồ sơ ứng tuyển</h3>
          <p className="text-gray-600">Các hồ sơ ứng tuyển sẽ hiển thị tại đây</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Ứng viên</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Vị trí</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Ngày nộp</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Điểm AI</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Trạng thái</th>
                  <th className="text-right py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-medium text-sm">
                            {app.candidate_name?.[0] || app.candidate_email?.[0] || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{app.candidate_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{app.candidate_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{app.job_title}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(app.applied_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {app.ai_score ? (
                        <span className={`font-semibold ${
                          app.ai_score >= 70 ? 'text-green-600' : 
                          app.ai_score >= 50 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {app.ai_score.toFixed(0)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[app.status] || statusColors.PENDING}`}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/applications/${app.id}`}
                          className="p-2 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {app.cv_file && (
                          <a
                            href={app.cv_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                            title="Tải CV"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
