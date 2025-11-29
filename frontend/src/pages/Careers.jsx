import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getJobs } from '../services/api';
import AdvancedFilters from '../components/AdvancedFilters';
import LocationSelector from '../components/LocationSelector';
import JobCategoryModal from '../components/JobCategoryModal';
import {
  Briefcase, MapPin, Clock, Search, Building, Users, ChevronRight,
  Heart, SortAsc, Check
} from 'lucide-react';

const Careers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchType, setSearchType] = useState('job_title'); // job_title, company_name, both
  const [location, setLocation] = useState({
    province: searchParams.get('province') || '',
    district: searchParams.get('district') || ''
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Advanced filters
  const [filters, setFilters] = useState({
    job_categories: [],
    experience_years: '',
    job_level: '',
    salary_range: '',
    salary_min: '',
    salary_max: '',
    employment_type: ''
  });
  
  // Results
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [sortBy, setSortBy] = useState('relevance'); // relevance, date, salary

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { 
        status: 'OPEN', 
        active: true 
      };
      
      // Search params
      if (search) {
        if (searchType === 'job_title') {
          params.search = search;
        } else if (searchType === 'company_name') {
          params.company_search = search;
        } else {
          params.search = search;
          params.company_search = search;
        }
      }
      
      // Location params
      if (location.province) {
        params.location = location.district 
          ? `${location.province} - ${location.district}`
          : location.province;
      }
      
      // Advanced filters
      if (filters.job_categories?.length > 0) {
        params.categories = filters.job_categories.join(',');
      }
      if (filters.experience_years) {
        params.experience_years = filters.experience_years;
      }
      if (filters.job_level) {
        params.job_level = filters.job_level;
      }
      if (filters.salary_range) {
        if (filters.salary_range === 'custom' && filters.salary_min && filters.salary_max) {
          params.salary_min = filters.salary_min * 1000000; // Convert to VND
          params.salary_max = filters.salary_max * 1000000;
        } else if (filters.salary_range && filters.salary_range !== 'negotiable') {
          const [min, max] = filters.salary_range.split('-');
          if (min) params.salary_min = parseInt(min) * 1000000;
          if (max) params.salary_max = parseInt(max) * 1000000;
        }
      }
      if (filters.employment_type) {
        params.employment_type = filters.employment_type;
      }
      
      // Sort
      if (sortBy === 'date') {
        params.ordering = '-created_at';
      } else if (sortBy === 'salary') {
        params.ordering = '-salary_max';
      }

      const res = await getJobs(params);
      const jobsData = Array.isArray(res.data) ? res.data : res.data.results || [];
      setJobs(jobsData);
      setTotalJobs(res.data.count || jobsData.length);
      
      // Update URL params
      const newParams = new URLSearchParams();
      if (search) newParams.set('search', search);
      if (location.province) newParams.set('province', location.province);
      if (location.district) newParams.set('district', location.district);
      setSearchParams(newParams);
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      job_categories: [],
      experience_years: '',
      job_level: '',
      salary_range: '',
      salary_min: '',
      salary_max: '',
      employment_type: ''
    });
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const employmentTypeLabels = {
    FULLTIME: 'Toàn thời gian',
    PARTTIME: 'Bán thời gian',
    CONTRACT: 'Hợp đồng',
    INTERN: 'Thực tập',
    FREELANCE: 'Freelance'
  };

  const sortOptions = [
    { value: 'relevance', label: 'Phù hợp nhất' },
    { value: 'date', label: 'Mới nhất' },
    { value: 'salary', label: 'Lương cao nhất' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-slate-700/50">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              {/* Job Category Button */}
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <span className="text-lg">☰</span>
                <span>Danh mục Nghề</span>
                {filters.job_categories?.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {filters.job_categories.length}
                  </span>
                )}
              </button>

              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Vị trí tuyển dụng"
                  className="input pl-12 w-full"
                />
              </div>

              {/* Location Selector */}
              <div className="w-full md:w-64 relative z-[9999]">
                <LocationSelector
                  selectedProvince={location.province}
                  selectedDistrict={location.district}
                  onChange={handleLocationChange}
                  placeholder="Chọn tỉnh/thành phố"
                />
              </div>

              {/* Search Button */}
              <button 
                type="submit" 
                className="btn-primary px-8 whitespace-nowrap"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Job Count */}
          <div className="mt-4 text-center text-gray-300">
            <span className="text-white font-semibold">{totalJobs.toLocaleString('vi-VN')}</span> việc làm
            {location.province && ` tại ${location.province}${location.district ? ` - ${location.district}` : ''}`}
          </div>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Column - Jobs List */}
          <div className="flex-1">
            {/* Search Type and Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              {/* Search Type */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Tìm kiếm theo:</span>
                <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                  {[
                    { value: 'job_title', label: 'Tên việc làm' },
                    { value: 'company_name', label: 'Tên công ty' },
                    { value: 'both', label: 'Cả hai' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSearchType(type.value)}
                      className={`px-4 py-1.5 rounded text-sm transition-colors ${
                        searchType === type.value
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {searchType === type.value && <Check className="w-3 h-3 inline mr-1" />}
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Sắp xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input text-sm py-1.5"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                    setLocation({ province: '', district: '' });
                    handleClearFilters();
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
                    className="card block hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Company Logo/Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                        {job.company_name ? (
                          <span className="text-white font-bold text-xl">
                            {job.company_name[0]}
                          </span>
                        ) : (
                          <Briefcase className="w-8 h-8 text-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">
                              {job.company_name || job.created_by_name || 'Công ty'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              // Handle save job
                            }}
                            className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {job.location}
                          </span>
                          {job.experience_years && (
                            <span>{job.experience_years} năm kinh nghiệm</span>
                          )}
                          <span className="badge badge-info">
                            {employmentTypeLabels[job.employment_type] || job.employment_type}
                          </span>
                        </div>

                        {/* Tags */}
                        {job.department && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                              {job.department}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                          <span className="text-xs text-gray-500">
                            Đăng {new Date(job.created_at).toLocaleDateString('vi-VN')}
                          </span>
                          {(job.salary_min || job.salary_max || job.salary) && (
                            <div className="text-right">
                              <p className="text-green-400 font-semibold text-sm">
                                {job.salary_min && job.salary_max
                                  ? `${(Number(job.salary_min) / 1000000).toFixed(0)} - ${(Number(job.salary_max) / 1000000).toFixed(0)} triệu`
                                  : job.salary || 'Thỏa thuận'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination (if needed) */}
            {jobs.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                  Trước
                </button>
                <span className="text-gray-400">Trang 1</span>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                  Sau
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Advanced Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-4 relative z-[1]">
              <AdvancedFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Job Category Modal */}
      <JobCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSelect={(categories) => {
          setFilters({ ...filters, job_categories: categories });
          setShowCategoryModal(false);
        }}
        selectedCategories={filters.job_categories || []}
      />
    </div>
  );
};

export default Careers;
