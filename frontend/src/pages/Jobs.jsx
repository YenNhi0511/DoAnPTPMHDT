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
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
    OPEN: 'bg-green-100 text-green-700 border-green-200',
    CLOSED: 'bg-red-100 text-red-700 border-red-200',
    CANCELLED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý việc làm</h1>
          <p className="text-gray-600">Quản lý và theo dõi các tin tuyển dụng của bạn</p>
        </div>
        {isRecruiter && (
          <Link 
            to="/jobs/new" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Đăng tin tuyển dụng
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm việc làm..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="DRAFT">Nháp</option>
            <option value="OPEN">Đang tuyển</option>
            <option value="CLOSED">Đã đóng</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
          >
            <option value="">Tất cả loại</option>
            <option value="FULLTIME">Toàn thời gian</option>
            <option value="PARTTIME">Bán thời gian</option>
            <option value="CONTRACT">Hợp đồng</option>
            <option value="INTERN">Thực tập</option>
          </select>
          <button 
            type="submit" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Lọc
          </button>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có việc làm nào</h3>
          <p className="text-gray-600 mb-6">Bắt đầu bằng cách tạo tin tuyển dụng đầu tiên</p>
          {isRecruiter && (
            <Link 
              to="/jobs/new" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Đăng tin tuyển dụng
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all relative">
              {/* Menu */}
              {isRecruiter && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setActiveMenu(activeMenu === job.id ? null : job.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {activeMenu === job.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setActiveMenu(null)}
                        >
                          <Eye className="w-4 h-4" /> Xem chi tiết
                        </Link>
                        <Link
                          to={`/jobs/${job.id}/edit`}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setActiveMenu(null)}
                        >
                          <Edit className="w-4 h-4" /> Chỉnh sửa
                        </Link>
                        {job.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(job.id)}
                            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 w-full text-left"
                          >
                            <CheckCircle className="w-4 h-4" /> Đăng tuyển
                          </button>
                        )}
                        {job.status === 'OPEN' && (
                          <button
                            onClick={() => handleClose(job.id)}
                            className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 w-full text-left"
                          >
                            <XCircle className="w-4 h-4" /> Đóng tuyển
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="w-4 h-4" /> Xóa
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Content */}
              <Link to={`/jobs/${job.id}`}>
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[job.status] || statusColors.DRAFT}`}>
                    {job.status === 'OPEN' ? 'Đang tuyển' : job.status === 'DRAFT' ? 'Nháp' : job.status === 'CLOSED' ? 'Đã đóng' : job.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 pr-8 hover:text-green-600 transition-colors">{job.title}</h3>
                {job.department && (
                  <p className="text-sm text-green-600 font-medium mb-2">{job.department}</p>
                )}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>{employmentTypeLabels[job.employment_type] || job.employment_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {job.applications_count !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{job.applications_count} ứng viên</span>
                    </div>
                  )}
                </div>
                {(job.salary_min || job.salary_max || job.salary) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-green-600 font-bold text-lg">
                      {job.salary_min && job.salary_max
                        ? `${(Number(job.salary_min) / 1000000).toFixed(0)} - ${(Number(job.salary_max) / 1000000).toFixed(0)} triệu`
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
