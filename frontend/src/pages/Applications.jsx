import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getApplications, updateApplicationStatus, screenApplication } from '../services/api';
import {
  FileText, Search, Filter, Eye, Brain, Mail, CheckCircle,
  XCircle, Clock, Calendar
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
    PENDING: 'badge-warning',
    SCREENING: 'badge-info',
    INTERVIEW: 'badge-info',
    OFFER: 'badge-success',
    REJECTED: 'badge-danger',
    ACCEPTED: 'badge-success',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="page-header">
        <FileText className="w-8 h-8 text-blue-400" />
        Quản lý hồ sơ ứng tuyển
      </h1>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full sm:w-48"
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Chưa có hồ sơ nào</h3>
          <p className="text-gray-400">Các hồ sơ ứng tuyển sẽ xuất hiện ở đây</p>
        </div>
      ) : (
        <div className="card p-0">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Ứng viên</th>
                  <th>Vị trí</th>
                  <th>Ngày nộp</th>
                  <th>Điểm AI</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div>
                        <p className="font-medium text-white">{app.candidate_name}</p>
                        {app.candidate_email && (
                          <p className="text-sm text-gray-400">{app.candidate_email}</p>
                        )}
                      </div>
                    </td>
                    <td>{app.job_title}</td>
                    <td>{new Date(app.applied_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      {app.ai_score ? (
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            app.ai_score >= 70 ? 'bg-green-500/20 text-green-400' :
                            app.ai_score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {app.ai_score.toFixed(0)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${statusColors[app.status]}`}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/applications/${app.id}`}
                          className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {app.status === 'PENDING' && (
                          <button
                            onClick={() => handleScreen(app.id)}
                            className="p-2 rounded-lg hover:bg-slate-700/50 text-blue-400 hover:text-blue-300"
                            title="Sàng lọc AI"
                          >
                            <Brain className="w-4 h-4" />
                          </button>
                        )}
                        {app.status === 'SCREENING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'INTERVIEW')}
                              className="p-2 rounded-lg hover:bg-slate-700/50 text-green-400 hover:text-green-300"
                              title="Chuyển phỏng vấn"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                              className="p-2 rounded-lg hover:bg-slate-700/50 text-red-400 hover:text-red-300"
                              title="Từ chối"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
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

