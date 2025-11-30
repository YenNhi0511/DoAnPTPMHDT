import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import JobCategoryModal from './JobCategoryModal';
import { jobCategories } from '../data/job-categories';

const AdvancedFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    level: true,
    salary: true,
    employment: true
  });

  const handleCategorySelect = (categories) => {
    onFilterChange({ ...filters, job_categories: categories });
  };

  const handleExperienceChange = (value) => {
    onFilterChange({ ...filters, experience_years: value });
  };

  const handleLevelChange = (value) => {
    onFilterChange({ ...filters, job_level: value });
  };

  const handleSalaryChange = (type, value) => {
    if (type === 'range') {
      onFilterChange({ ...filters, salary_range: value });
    } else if (type === 'min') {
      onFilterChange({ 
        ...filters, 
        salary_min: value,
        salary_range: 'custom'
      });
    } else if (type === 'max') {
      onFilterChange({ 
        ...filters, 
        salary_max: value,
        salary_range: 'custom'
      });
    }
  };

  const handleEmploymentTypeChange = (value) => {
    onFilterChange({ ...filters, employment_type: value });
  };

  const experienceOptions = [
    { value: '', label: 'Tất cả' },
    { value: '0', label: 'Không yêu cầu' },
    { value: '1', label: 'Dưới 1 năm' },
    { value: '1', label: '1 năm' },
    { value: '2', label: '2 năm' },
    { value: '3', label: '3 năm' },
    { value: '4', label: '4 năm' },
    { value: '5', label: '5 năm' },
    { value: '6', label: 'Trên 5 năm' }
  ];

  const levelOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'INTERN', label: 'Thực tập sinh' },
    { value: 'STAFF', label: 'Nhân viên' },
    { value: 'TEAM_LEAD', label: 'Trưởng nhóm' },
    { value: 'MANAGER', label: 'Quản lý' },
    { value: 'DIRECTOR', label: 'Giám đốc' },
    { value: 'DEPUTY_DIRECTOR', label: 'Phó giám đốc' }
  ];

  const salaryRanges = [
    { value: '', label: 'Tất cả' },
    { value: '0-10', label: 'Dưới 10 triệu' },
    { value: '10-15', label: '10 - 15 triệu' },
    { value: '15-20', label: '15 - 20 triệu' },
    { value: '20-25', label: '20 - 25 triệu' },
    { value: '25-30', label: '25 - 30 triệu' },
    { value: '30-50', label: '30 - 50 triệu' },
    { value: '50+', label: 'Trên 50 triệu' },
    { value: 'negotiable', label: 'Thỏa thuận' }
  ];

  const employmentTypes = [
    { value: '', label: 'Tất cả' },
    { value: 'FULLTIME', label: 'Toàn thời gian' },
    { value: 'PARTTIME', label: 'Bán thời gian' },
    { value: 'CONTRACT', label: 'Hợp đồng' },
    { value: 'INTERN', label: 'Thực tập' },
    { value: 'FREELANCE', label: 'Freelance' }
  ];

  // Get selected categories count
  const selectedCategoriesCount = filters.job_categories?.length || 0;

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 relative z-[1]">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Lọc nâng cao</h3>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6 border-t border-blue-200">
          {/* Theo danh mục nghề */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Theo danh mục nghề
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-500 transition-colors text-gray-900"
            >
              <span className={selectedCategoriesCount > 0 ? 'text-gray-900' : 'text-gray-700'}>
                {selectedCategoriesCount > 0 
                  ? `Đã chọn ${selectedCategoriesCount} danh mục`
                  : 'Chọn danh mục nghề'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            {selectedCategoriesCount > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {filters.job_categories?.slice(0, 3).map((cat, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded"
                  >
                    {cat}
                  </span>
                ))}
                {selectedCategoriesCount > 3 && (
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                    +{selectedCategoriesCount - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Kinh nghiệm */}
          <div className="border-b border-blue-200 pb-4">
            <button
              type="button"
              onClick={() => setExpandedSections({...expandedSections, experience: !expandedSections.experience})}
              className="flex items-center justify-between w-full p-2 hover:bg-blue-100 rounded-lg transition-colors mb-3"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Kinh nghiệm</span>
              </div>
              {expandedSections.experience ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
            {expandedSections.experience && (
              <div className="space-y-2">
                {experienceOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name="experience"
                      value={option.value}
                      checked={filters.experience_years === option.value}
                      onChange={(e) => handleExperienceChange(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${filters.experience_years === option.value ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Cấp bậc */}
          <div className="border-b border-blue-200 pb-4">
            <button
              type="button"
              onClick={() => setExpandedSections({...expandedSections, level: !expandedSections.level})}
              className="flex items-center justify-between w-full p-2 hover:bg-blue-100 rounded-lg transition-colors mb-3"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Cấp bậc</span>
              </div>
              {expandedSections.level ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
            {expandedSections.level && (
              <div className="space-y-2">
                {levelOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name="level"
                      value={option.value}
                      checked={filters.job_level === option.value}
                      onChange={(e) => handleLevelChange(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${filters.job_level === option.value ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Mức lương */}
          <div className="border-b border-blue-200 pb-4">
            <button
              type="button"
              onClick={() => setExpandedSections({...expandedSections, salary: !expandedSections.salary})}
              className="flex items-center justify-between w-full p-2 hover:bg-blue-100 rounded-lg transition-colors mb-3"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Mức lương</span>
              </div>
              {expandedSections.salary ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
            {expandedSections.salary && (
              <>
                <div className="space-y-2 mb-3">
                  {salaryRanges.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <input
                        type="radio"
                        name="salary"
                        value={range.value}
                        checked={filters.salary_range === range.value}
                        onChange={(e) => handleSalaryChange('range', e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${filters.salary_range === range.value ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
                {/* Custom salary range */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={filters.salary_min || ''}
                    onChange={(e) => handleSalaryChange('min', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-600">-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={filters.salary_max || ''}
                    onChange={(e) => handleSalaryChange('max', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-600 text-sm whitespace-nowrap">triệu</span>
                </div>
              </>
            )}
          </div>

          {/* Hình thức làm việc */}
          <div className="border-b border-blue-200 pb-4">
            <button
              type="button"
              onClick={() => setExpandedSections({...expandedSections, employment: !expandedSections.employment})}
              className="flex items-center justify-between w-full p-2 hover:bg-blue-100 rounded-lg transition-colors mb-3"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Hình thức làm việc</span>
              </div>
              {expandedSections.employment ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
            {expandedSections.employment && (
              <div className="space-y-2">
                {employmentTypes.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name="employment_type"
                      value={type.value}
                      checked={filters.employment_type === type.value}
                      onChange={(e) => handleEmploymentTypeChange(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${filters.employment_type === type.value ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Clear filters button */}
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Xóa lọc
          </button>
        </div>
      )}

      {/* Job Category Modal */}
      <JobCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSelect={handleCategorySelect}
        selectedCategories={filters.job_categories || []}
      />
    </div>
  );
};

export default AdvancedFilters;

