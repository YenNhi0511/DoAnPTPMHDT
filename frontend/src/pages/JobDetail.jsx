import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJob, getJobApplications, publishJob, closeJob, applyToJob } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Briefcase, MapPin, Clock, Users, DollarSign, Calendar,
  Edit, CheckCircle, XCircle, ArrowLeft, FileText, Upload,
  Building, Award
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isRecruiterOrAdmin } = useAuth();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyData, setApplyData] = useState({
    cv_file: null,
    cover_letter: '',
    candidate_email: '',
    candidate_name: '',
  });
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await getJob(id);
        setJob(jobRes.data);

        if (isRecruiterOrAdmin) {
          const appsRes = await getJobApplications(id);
          setApplications(Array.isArray(appsRes.data) ? appsRes.data : appsRes.data.results || []);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isRecruiterOrAdmin]);

  const handlePublish = async () => {
    try {
      await publishJob(id);
      setJob({ ...job, status: 'OPEN' });
    } catch (error) {
      alert('Không thể đăng việc làm');
    }
  };

  const handleClose = async () => {
    try {
      await closeJob(id);
      setJob({ ...job, status: 'CLOSED' });
    } catch (error) {
      alert('Không thể đóng việc làm');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await applyToJob(id, applyData);
      setApplySuccess(true);
      setShowApplyForm(false);
    } catch (error) {
      alert(error.response?.data?.detail || 'Không thể nộp hồ sơ');
    } finally {
      setApplying(false);
    }
  };

  const statusColors = {
    DRAFT: 'badge-gray',
    OPEN: 'badge-success',
    CLOSED: 'badge-danger',
  };

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

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-900">Không tìm thấy việc làm</h2>
            <Link to="/careers" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Quay lại</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Link to="/careers" className="text-sm text-gray-600 hover:text-blue-600">
          ← Quay lại danh sách việc làm
        </Link>
      </div>

      {/* Job Info */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`badge ${statusColors[job.status]}`}>
                {job.status === 'OPEN' ? 'Đang tuyển' : job.status === 'DRAFT' ? 'Nháp' : 'Đã đóng'}
              </span>
              {job.employment_type && (
                <span className="badge badge-info">{job.employment_type}</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
            {job.department && (
              <p className="text-blue-600 flex items-center gap-2">
                <Building className="w-4 h-4" /> {job.department}
              </p>
            )}
          </div>

          {isRecruiterOrAdmin && (
            <div className="flex items-center gap-2">
              <Link to={`/jobs/${id}/edit`} className="btn-ghost flex items-center gap-2">
                <Edit className="w-4 h-4" /> Chỉnh sửa
              </Link>
              {job.status === 'DRAFT' && (
                <button onClick={handlePublish} className="btn-success flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Đăng tuyển
                </button>
              )}
              {job.status === 'OPEN' && (
                <button onClick={handleClose} className="btn-danger flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Đóng tuyển
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-5 h-5 text-gray-500" />
            <span>Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Users className="w-5 h-5 text-gray-500" />
            <span>{job.positions_count || 1} vị trí</span>
          </div>
          {job.experience_years && (
            <div className="flex items-center gap-3 text-gray-600">
              <Award className="w-5 h-5 text-gray-500" />
              <span>{job.experience_years} năm KN</span>
            </div>
          )}
        </div>

        {(job.salary_min || job.salary_max || job.salary) && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
            <div className="flex items-center gap-3 text-green-700">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold text-lg">
                {job.salary_min && job.salary_max
                  ? `${(Number(job.salary_min) / 1000000).toFixed(0)} - ${(Number(job.salary_max) / 1000000).toFixed(0)} triệu`
                  : job.salary || 'Thỏa thuận'}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả công việc</h3>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Yêu cầu</h3>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.requirements}</div>
          </div>
        </div>

        {/* Apply Button */}
        {!isRecruiterOrAdmin && job.status === 'OPEN' && !applySuccess && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            {!showApplyForm ? (
              <button
                onClick={() => setShowApplyForm(true)}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <FileText className="w-5 h-5" /> Ứng tuyển ngay
              </button>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nộp hồ sơ ứng tuyển</h3>

                {!user && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Họ tên *</label>
                        <input
                          type="text"
                          value={applyData.candidate_name}
                          onChange={(e) => setApplyData({ ...applyData, candidate_name: e.target.value })}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Email *</label>
                        <input
                          type="email"
                          value={applyData.candidate_email}
                          onChange={(e) => setApplyData({ ...applyData, candidate_email: e.target.value })}
                          className="input"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="label">CV (PDF/DOCX) *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setApplyData({ ...applyData, cv_file: e.target.files[0] })}
                      className="input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Thư xin việc</label>
                  <textarea
                    value={applyData.cover_letter}
                    onChange={(e) => setApplyData({ ...applyData, cover_letter: e.target.value })}
                    className="input min-h-[100px]"
                    placeholder="Giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="btn-ghost"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    {applying ? 'Đang gửi...' : 'Gửi hồ sơ'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {applySuccess && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span>Hồ sơ của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ sớm.</span>
          </div>
        )}
      </div>

      {/* Applications (for recruiters) */}
      {isRecruiterOrAdmin && applications.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hồ sơ ứng tuyển ({applications.length})</h3>
            <Link to={`/applications?job=${id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Xem tất cả →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ứng viên</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm AI</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{app.candidate_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{new Date(app.applied_at).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {app.ai_score ? (
                        <span className={`font-medium ${app.ai_score >= 70 ? 'text-green-600' : app.ai_score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {app.ai_score.toFixed(0)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        app.status === 'INTERVIEW' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        to={`/applications/${app.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;

