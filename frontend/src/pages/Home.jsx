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
  Heart, SortAsc, Check, Calendar, TrendingUp, Award, Zap, Shield, Star
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
        active: true,
        limit: 20
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

  const popularCategories = [
    { name: 'Công nghệ thông tin', count: 1200, icon: '💻' },
    { name: 'Kinh doanh / Bán hàng', count: 850, icon: '📊' },
    { name: 'Marketing / Truyền thông', count: 650, icon: '📱' },
    { name: 'Kế toán / Tài chính', count: 520, icon: '💰' },
    { name: 'Nhân sự', count: 480, icon: '👥' },
    { name: 'Kỹ thuật', count: 750, icon: '🔧' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 md:py-20 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          ></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Tìm việc làm mơ ước của bạn
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-2">
                Hàng nghìn cơ hội việc làm đang chờ đợi bạn tại GoodCV
              </p>
              <p className="text-blue-200 text-lg">
                Kết nối với nhà tuyển dụng hàng đầu Việt Nam
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-2">
                  {/* Job Category */}
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="px-4 py-3 bg-gray-50 rounded-xl text-left flex items-center justify-between hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 font-medium text-sm">
                        {filters.job_categories?.length > 0
                          ? `${filters.job_categories.length} danh mục`
                          : 'Danh mục Nghề'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Nhập tên công việc, vị trí bạn muốn ứng tuyển..."
                      className="w-full pl-12 pr-4 py-3 border-0 focus:ring-0 text-gray-900 placeholder-gray-400 text-sm"
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
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    <Search className="w-5 h-5 inline mr-2" />
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-blue-100 text-sm">
                <span className="font-bold text-white text-lg">{totalJobs.toLocaleString('vi-VN')}</span> việc làm đang tuyển dụng
              </p>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="bg-white py-12 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ngành nghề phổ biến</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCategories.map((category, index) => (
                <Link
                  key={index}
                  to={`/careers?category=${encodeURIComponent(category.name)}`}
                  className="group p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all text-center"
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">{category.count} việc làm</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose GoodCV */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Tại sao chọn GoodCV?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tìm việc nhanh chóng</h3>
                <p className="text-gray-600">
                  Hàng nghìn việc làm được cập nhật mỗi ngày, tìm việc phù hợp chỉ trong vài phút
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">An toàn & Tin cậy</h3>
                <p className="text-gray-600">
                  Kết nối với các công ty uy tín, thông tin việc làm được xác thực
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cơ hội tốt nhất</h3>
                <p className="text-gray-600">
                  Tìm kiếm việc làm với mức lương hấp dẫn và môi trường làm việc chuyên nghiệp
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Jobs Listings */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-6">
            {/* Left Column - Jobs List */}
            <div className="flex-1">
              {/* Header with Sort */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Việc làm mới nhất
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Tìm thấy <span className="font-semibold text-blue-600">{totalJobs.toLocaleString('vi-VN')}</span> việc làm phù hợp
                  </p>
                </div>

                <div className="flex items-center gap-3">
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
                          className={`px-3 py-1.5 rounded text-xs transition-colors ${
                            searchType === type.value
                              ? 'bg-blue-600 text-white'
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
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
                  <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Không tìm thấy vị trí nào
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thêm việc làm phù hợp
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
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
                      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 hover:border-blue-300 group"
                    >
                      <div className="flex gap-4">
                        {/* Company Logo */}
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          {job.company_name ? (
                            <span className="text-white font-bold text-xl">
                              {job.company_name[0].toUpperCase()}
                            </span>
                          ) : (
                            <Building className="w-8 h-8 text-white" />
                          )}
                        </div>

                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 font-medium mb-2">{job.company_name || 'Công ty'}</p>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                                {job.experience_years && (
                                  <span className="flex items-center gap-1">
                                    <Award className="w-4 h-4" />
                                    {job.experience_years} năm KN
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {job.employment_type === 'FULLTIME' ? 'Toàn thời gian' : 
                                   job.employment_type === 'PARTTIME' ? 'Bán thời gian' :
                                   job.employment_type === 'CONTRACT' ? 'Hợp đồng' :
                                   job.employment_type === 'INTERN' ? 'Thực tập' : job.employment_type}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(job.created_at)}
                                </span>
                              </div>

                              {job.department && (
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-2">
                                  {job.department}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-3 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Handle save job
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                              >
                                <Heart className="w-5 h-5" />
                              </button>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
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

              {/* Load More */}
              {jobs.length > 0 && jobs.length < totalJobs && (
                <div className="text-center mt-8">
                  <Link
                    to="/careers"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Xem thêm việc làm
                    <ChevronRight className="w-5 h-5" />
                  </Link>
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

        {/* CTA Section for Recruiters */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bạn là nhà tuyển dụng?
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Đăng tin tuyển dụng miễn phí và tìm kiếm ứng viên tài năng ngay hôm nay
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Building className="w-6 h-6" />
              Đăng ký tài khoản nhà tuyển dụng
            </Link>
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
