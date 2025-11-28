import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../services/api';
import {
  Briefcase, MapPin, Clock, Search, Filter, DollarSign,
  Building, Users, ChevronRight
} from 'lucide-react';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchJobs = async () => {
    try {
      const params = { status: 'OPEN', active: true };
      if (search) params.search = search;
      if (locationFilter) params.location = locationFilter;
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
  }, [locationFilter, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const employmentTypeLabels = {
    FULLTIME: 'Toàn thời gian',
    PARTTIME: 'Bán thời gian',
    CONTRACT: 'Hợp đồng',
    INTERN: 'Thực tập',
  };

  // Get unique locations for filter
  const locations = [...new Set(jobs.map(j => j.location))].filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tìm kiếm cơ hội nghề nghiệp
            </h1>
            <p className="text-xl text-gray-300">
              Khám phá các vị trí tuyển dụng hấp dẫn và phát triển sự nghiệp cùng chúng tôi
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm vị trí, từ khóa..."
                  className="input pl-12 py-4 text-lg"
                />
              </div>
              <button type="submit" className="btn-primary py-4 px-8 text-lg">
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="input w-full sm:w-48"
          >
            <option value="">Tất cả địa điểm</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input w-full sm:w-48"
          >
            <option value="">Tất cả loại hình</option>
            <option value="FULLTIME">Toàn thời gian</option>
            <option value="PARTTIME">Bán thời gian</option>
            <option value="CONTRACT">Hợp đồng</option>
            <option value="INTERN">Thực tập</option>
          </select>
          <div className="flex-1 text-right text-gray-400">
            Tìm thấy <span className="text-white font-semibold">{jobs.length}</span> vị trí
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-16">
            <Briefcase className="w-20 h-20 text-gray-500 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-3">Không tìm thấy vị trí nào</h3>
            <p className="text-gray-400 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button
              onClick={() => {
                setSearch('');
                setLocationFilter('');
                setTypeFilter('');
                fetchJobs();
              }}
              className="btn-ghost"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="card block hover:border-blue-500/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                      <span className="badge badge-info">
                        {employmentTypeLabels[job.employment_type] || job.employment_type}
                      </span>
                    </div>

                    {job.department && (
                      <p className="text-blue-400 text-sm mb-2 flex items-center gap-1">
                        <Building className="w-4 h-4" /> {job.department}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                      </span>
                      {job.positions_count > 1 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {job.positions_count} vị trí
                        </span>
                      )}
                    </div>

                    {job.description && (
                      <p className="text-gray-400 mt-3 line-clamp-2">{job.description}</p>
                    )}
                  </div>

                  {/* Salary & Arrow */}
                  <div className="flex items-center gap-4">
                    {(job.salary_min || job.salary_max || job.salary) && (
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">
                          {job.salary_min && job.salary_max
                            ? `${(Number(job.salary_min) / 1000000).toFixed(0)} - ${(Number(job.salary_max) / 1000000).toFixed(0)} triệu`
                            : job.salary || 'Thỏa thuận'}
                        </p>
                        <p className="text-xs text-gray-500">VNĐ/tháng</p>
                      </div>
                    )}
                    <ChevronRight className="w-6 h-6 text-gray-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="card bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-3">Không tìm thấy vị trí phù hợp?</h3>
            <p className="text-gray-300 mb-6">
              Đăng ký tài khoản để nhận thông báo khi có vị trí mới phù hợp với bạn
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary">
                Đăng ký ngay
              </Link>
              <Link to="/login" className="btn-ghost">
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;

