import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJobs, deleteJob, publishJob, closeJob } from '../services/api';
import {
  Plus, Search, Filter, MapPin, Clock, Users, Briefcase,
  MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle
} from 'lucide-react';

const Jobs = () => {
  const { isRecruiter } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchJobs = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.employment_type = typeFilter;

      const res = await getJobs(params);
      setJobs(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa việc làm này?')) {
      try {
        await deleteJob(id);
        setJobs(jobs.filter(j => j.id !== id));
      } catch (error) {
        alert('Không thể xóa việc làm');
      }
    }
    setActiveMenu(null);
  };

  const handlePublish = async (id) => {
    try {
      await publishJob(id);
      fetchJobs();
    } catch (error) {
      alert('Không thể đăng việc làm');
    }
    setActiveMenu(null);
  };

  const handleClose = async (id) => {
    try {
      await closeJob(id);
      fetchJobs();
    } catch (error) {
      alert('Không thể đóng việc làm');
    }
    setActiveMenu(null);
  };

  const statusColors = {
    DRAFT: 'badge-gray',
    OPEN: 'badge-success',
    CLOSED: 'badge-danger',
    CANCELLED: 'badge-warning',
  };

  const employmentTypeLabels = {
    FULLTIME: 'Toàn thời gian',
    PARTTIME: 'Bán thời gian',
    CONTRACT: 'Hợp đồng',
    INTERN: 'Thực tập',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="page-header mb-0">
          <Briefcase className="w-8 h-8 text-blue-400" />
          Quản lý việc làm
        </h1>
        {isRecruiter && (
          <Link to="/jobs/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Đăng tin tuyển dụng
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm việc làm..."
              className="input pl-11"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full sm:w-40"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="DRAFT">Nháp</option>
            <option value="OPEN">Đang tuyển</option>
            <option value="CLOSED">Đã đóng</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input w-full sm:w-40"
          >
            <option value="">Tất cả loại</option>
            <option value="FULLTIME">Toàn thời gian</option>
            <option value="PARTTIME">Bán thời gian</option>
            <option value="CONTRACT">Hợp đồng</option>
            <option value="INTERN">Thực tập</option>
          </select>
          <button type="submit" className="btn-primary">
            <Filter className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Chưa có việc làm nào</h3>
          <p className="text-gray-400 mb-4">Bắt đầu bằng cách tạo tin tuyển dụng đầu tiên</p>
          {isRecruiter && (
            <Link to="/jobs/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Đăng tin tuyển dụng
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="card card-hover relative">
              {/* Menu */}
              {isRecruiter && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setActiveMenu(activeMenu === job.id ? null : job.id)}
                    className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {activeMenu === job.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-10">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50"
                      >
                        <Eye className="w-4 h-4" /> Xem chi tiết
                      </Link>
                      <Link
                        to={`/jobs/${job.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50"
                      >
                        <Edit className="w-4 h-4" /> Chỉnh sửa
                      </Link>
                      {job.status === 'DRAFT' && (
                        <button
                          onClick={() => handlePublish(job.id)}
                          className="flex items-center gap-2 px-4 py-2 text-green-400 hover:text-green-300 hover:bg-slate-700/50 w-full text-left"
                        >
                          <CheckCircle className="w-4 h-4" /> Đăng tuyển
                        </button>
                      )}
                      {job.status === 'OPEN' && (
                        <button
                          onClick={() => handleClose(job.id)}
                          className="flex items-center gap-2 px-4 py-2 text-orange-400 hover:text-orange-300 hover:bg-slate-700/50 w-full text-left"
                        >
                          <XCircle className="w-4 h-4" /> Đóng tuyển
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 w-full text-left"
                      >
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <Link to={`/jobs/${job.id}`}>
                <div className="mb-4">
                  <span className={`badge ${statusColors[job.status]}`}>
                    {job.status === 'OPEN' ? 'Đang tuyển' : job.status === 'DRAFT' ? 'Nháp' : job.status === 'CLOSED' ? 'Đã đóng' : job.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 pr-8">{job.title}</h3>
                {job.department && (
                  <p className="text-sm text-blue-400 mb-2">{job.department}</p>
                )}
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{employmentTypeLabels[job.employment_type] || job.employment_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {job.applications_count !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{job.applications_count} ứng viên</span>
                    </div>
                  )}
                </div>
                {(job.salary_min || job.salary_max || job.salary) && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-green-400 font-semibold">
                      {job.salary_min && job.salary_max
                        ? `${Number(job.salary_min).toLocaleString('vi-VN')} - ${Number(job.salary_max).toLocaleString('vi-VN')} VNĐ`
                        : job.salary || 'Thỏa thuận'}
                    </p>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;

