import React, { useState, useEffect } from 'react';
import { getUsers, getApplications } from '../services/api';
import {
  User, Search, FileText, Eye, Calendar, CheckCircle, XCircle,
  Mail, Phone, TrendingUp, Building2, Briefcase, AlertCircle
} from 'lucide-react';

const AdminCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesRes, appsRes] = await Promise.all([
        getUsers({ role: 'CANDIDATE' }),
        getApplications()
      ]);
      setCandidates(Array.isArray(candidatesRes.data) ? candidatesRes.data : candidatesRes.data.results || []);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : appsRes.data.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateModal(true);
  };

  const getCandidateApplications = (candidateId) => {
    return applications.filter(app => app.candidate === candidateId);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const stats = {
    total: candidates.length,
    active: candidates.filter(c => c.is_active !== false).length,
    withApplications: candidates.filter(c => getCandidateApplications(c.id).length > 0).length,
    verified: candidates.filter(c => c.is_email_verified).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý ứng viên</h1>
          <p className="text-gray-600">Thống kê và quản lý tất cả ứng viên trên hệ thống</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600 font-medium">Tổng số ứng viên</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-600 font-medium">Đang hoạt động</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.withApplications}</p>
              <p className="text-sm text-gray-600 font-medium">Có hồ sơ ứng tuyển</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
              <p className="text-sm text-gray-600 font-medium">Đã xác thực</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Ứng viên</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Email</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Số hồ sơ</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Trạng thái</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Ngày đăng ký</th>
                <th className="text-right py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    Không tìm thấy ứng viên nào
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => {
                  const candidateApps = getCandidateApplications(candidate.id);
                  return (
                    <tr
                      key={candidate.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-medium text-sm">
                              {candidate.first_name?.[0] || candidate.email?.[0] || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {candidate.first_name} {candidate.last_name}
                            </p>
                            <p className="text-sm text-gray-500">@{candidate.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {candidate.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">{candidateApps.length}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          {candidate.is_active !== false ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Hoạt động
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                              <XCircle className="w-4 h-4" />
                              Đã khóa
                            </span>
                          )}
                          {candidate.is_email_verified ? (
                            <span className="flex items-center gap-1 text-blue-600 font-medium text-xs">
                              <CheckCircle className="w-3 h-3" />
                              Đã xác thực
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-600 font-medium text-xs">
                              <AlertCircle className="w-3 h-3" />
                              Chưa xác thực
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {candidate.date_joined
                          ? new Date(candidate.date_joined).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewCandidate(candidate)}
                            className="p-2 rounded-lg hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết ứng viên</h2>
                <button
                  onClick={() => {
                    setShowCandidateModal(false);
                    setSelectedCandidate(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Candidate Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white font-bold">
                    {selectedCandidate.first_name?.[0] || selectedCandidate.email?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedCandidate.first_name} {selectedCandidate.last_name}
                  </h3>
                  <p className="text-gray-600">{selectedCandidate.email}</p>
                </div>
              </div>

              {/* Applications */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Hồ sơ ứng tuyển ({getCandidateApplications(selectedCandidate.id).length})</h4>
                {getCandidateApplications(selectedCandidate.id).length === 0 ? (
                  <p className="text-gray-500">Chưa có hồ sơ ứng tuyển</p>
                ) : (
                  <div className="space-y-3">
                    {getCandidateApplications(selectedCandidate.id).map((app) => (
                      <div key={app.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900">{app.job_title}</h5>
                            <p className="text-sm text-gray-600">{app.company_name}</p>
                            {app.ai_score && (
                              <div className="flex items-center gap-1 mt-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-blue-600">Điểm AI: {app.ai_score.toFixed(0)}</span>
                              </div>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                            app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCandidates;

