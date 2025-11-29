import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getJobs } from '../services/api';
import AdvancedFilters from '../components/AdvancedFilters';
import LocationSelector from '../components/LocationSelector';
import JobCategoryModal from '../components/JobCategoryModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Briefcase, MapPin, Clock, Search, Building, Users, ChevronRight,
  Heart, SortAsc, Check, Calendar
} from 'lucide-react';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchType, setSearchType] = useState('job_title');
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
  const [sortBy, setSortBy] = useState('relevance');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { 
        status: 'OPEN', 
        active: true 
      };
      
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
      
      if (location.province) {
        params.location = location.district 
          ? `${location.province} - ${location.district}`
          : location.province;
      }
      
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
          params.salary_min = filters.salary_min * 1000000;
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
      
      if (sortBy === 'date') {
        params.ordering = '-created_at';
      } else if (sortBy === 'salary') {
        params.ordering = '-salary_max';
      }

      const res = await getJobs(params);
      const jobsData = Array.isArray(res.data) ? res.data : res.data.results || [];
      setJobs(jobsData);
      setTotalJobs(res.data.count || jobsData.length);
      
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

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
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
    setSearch('');
    setLocation({ province: '', district: '' });
  };

  const sortOptions = [
    { value: 'relevance', label: 'Phù hợp nhất' },
    { value: 'date', label: 'Mới nhất' },
    { value: 'salary', label: 'Lương cao nhất' }
  ];

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    if (min && max) {
      return `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(0)} triệu`;
    }
    if (min) return `Từ ${(min / 1000000).toFixed(0)} triệu`;
    if (max) return `Đến ${(max / 1000000).toFixed(0)} triệu`;
    return 'Thỏa thuận';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Search */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              Tìm việc làm mơ ước của bạn
            </h1>
            <p className="text-blue-100 text-center mb-8">
              Hàng nghìn cơ hội việc làm đang chờ đợi bạn
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3 bg-white rounded-lg p-2 shadow-lg">
                {/* Job Category */}
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="px-4 py-3 bg-gray-50 rounded-lg text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      {filters.job_categories?.length > 0
                        ? `${filters.job_categories.length} danh mục đã chọn`
                        : 'Danh mục Nghề'}
                    </span>
                  </div>
                </button>

                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Vị trí tuyển dụng"
                    className="w-full pl-12 pr-4 py-3 border-0 focus:ring-0 text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Location Selector */}
                <div className="w-full md:w-64">
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
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>

            <p className="text-center text-blue-100 mt-4 text-sm">
              Tuyển dụng {totalJobs.toLocaleString('vi-VN')} việc làm mới nhất
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-6">
            {/* Left Column - Jobs List */}
            <div className="flex-1">
              {/* Search Type and Sort */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Tìm kiếm theo:</span>
                  <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
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
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {searchType === type.value && <Check className="w-3 h-3 inline mr-1" />}
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Jobs Count */}
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-900">
                  {totalJobs.toLocaleString('vi-VN')} việc làm
                </p>
              </div>

              {/* Jobs List */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Không tìm thấy vị trí nào
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 mb-2">{job.company_name || 'Admin User'}</p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {job.experience_years ? `${job.experience_years} năm kinh nghiệm` : 'Không yêu cầu'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {job.employment_type === 'FULLTIME' ? 'Toàn thời gian' : 
                                   job.employment_type === 'PARTTIME' ? 'Bán thời gian' :
                                   job.employment_type === 'CONTRACT' ? 'Hợp đồng' :
                                   job.employment_type === 'INTERN' ? 'Thực tập' : job.employment_type}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Đăng {formatDate(job.created_at)}
                                </span>
                              </div>
                              {job.department && (
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-2">
                                  {job.department}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Heart className="w-5 h-5" />
                              </button>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-blue-600">
                                  {formatSalary(job.salary_min, job.salary_max)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Advanced Filters */}
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <div className="sticky top-4">
                <AdvancedFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Job Category Modal */}
      {showCategoryModal && (
        <JobCategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSelect={(categories) => {
            handleFilterChange({ ...filters, job_categories: categories });
            setShowCategoryModal(false);
          }}
          selectedCategories={filters.job_categories || []}
        />
      )}
    </div>
  );
};

export default Home;

