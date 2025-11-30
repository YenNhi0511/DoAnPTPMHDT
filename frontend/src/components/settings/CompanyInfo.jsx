import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Building, Search, Plus, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import LocationSelector from '../LocationSelector';

const CompanyInfo = () => {
  const { user } = useAuth();
  const [searchMode, setSearchMode] = useState('create'); // search, create
  const [companyType, setCompanyType] = useState('enterprise'); // enterprise, household
  const [formData, setFormData] = useState({
    tax_id: '',
    company_name: '',
    website: '',
    field_of_activity: '',
    scale: '',
    address: '',
    email: '',
    phone: '',
    description: '',
    province: '',
    district: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        tax_id: user.tax_id || '',
        company_name: user.company_name || '',
        website: user.website || '',
        field_of_activity: user.field_of_activity || '',
        scale: user.scale || '',
        address: user.address || '',
        email: user.company_email || user.email || '',
        phone: user.phone || '',
        description: user.company_description || '',
        province: user.work_location_province || '',
        district: user.work_location_district || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage({ type: '', text: '' });
  };

  const handleLocationChange = (location) => {
    setFormData({
      ...formData,
      province: location.province,
      district: location.district
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: Implement API call to update company info
      // await updateCompanyInfo(formData);
      
      setMessage({ type: 'success', text: 'Cập nhật thông tin công ty thành công!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Cập nhật thất bại. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fieldsOfActivity = [
    'Công nghệ thông tin',
    'Tài chính - Ngân hàng',
    'Bất động sản',
    'Giáo dục - Đào tạo',
    'Y tế - Chăm sóc sức khỏe',
    'Thương mại điện tử',
    'Sản xuất',
    'Dịch vụ',
    'Marketing - Quảng cáo',
    'Logistics - Vận tải'
  ];

  const companyScales = [
    'Dưới 10 nhân viên',
    '10 - 50 nhân viên',
    '50 - 200 nhân viên',
    '200 - 500 nhân viên',
    'Trên 500 nhân viên'
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin công ty</h2>

      {/* Search or Create */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => setSearchMode('search')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            searchMode === 'search'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <Search className={`w-6 h-6 ${searchMode === 'search' ? 'text-green-600' : 'text-gray-600'}`} />
            <div className="text-left">
              <p className={`font-medium ${searchMode === 'search' ? 'text-green-700' : 'text-gray-700'}`}>
                Tìm kiếm thông tin công ty
              </p>
              <p className="text-xs text-gray-700">Dành cho Doanh nghiệp đã có trên TopCV</p>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setSearchMode('create')}
          className={`p-4 rounded-lg border-2 transition-colors relative ${
            searchMode === 'create'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <Plus className={`w-6 h-6 ${searchMode === 'create' ? 'text-green-600' : 'text-gray-600'}`} />
            <div className="text-left">
              <p className={`font-medium ${searchMode === 'create' ? 'text-green-700' : 'text-gray-700'}`}>
                Tạo công ty mới
              </p>
              <p className="text-xs text-gray-700">Dành cho Doanh nghiệp lần đầu sử dụng TopCV</p>
            </div>
          </div>
          {searchMode === 'create' && (
            <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-600" />
          )}
        </button>
      </div>

      {/* Company Logo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Logo công ty</label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
            <Building className="w-12 h-12 text-gray-600" />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Đổi logo
          </button>
        </div>
      </div>

      {/* Company Type */}
      <div className="mb-6">
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1 inline-flex">
          <button
            type="button"
            onClick={() => setCompanyType('enterprise')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              companyType === 'enterprise'
                ? 'bg-green-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Doanh nghiệp
          </button>
          <button
            type="button"
            onClick={() => setCompanyType('household')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              companyType === 'household'
                ? 'bg-green-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hộ kinh doanh
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <span className="text-yellow-600">⚠️</span>
          <p className="text-sm text-yellow-800">
            Để tài khoản được xác thực nhanh chóng, vui lòng nhập <strong>Mã số thuế</strong> và <strong>Tên công ty</strong> trùng khớp với dữ liệu doanh nghiệp theo Trang thông tin điện tử của Cục Thuế. Bạn có thể tra cứu thông tin doanh nghiệp{' '}
            <a href="#" className="text-blue-600 hover:underline">Tại đây</a>.
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Tax ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã số thuế <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleChange}
                placeholder="Nhập mã số thuế"
                className="input w-full"
                required
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-700 text-sm">
                  https://
                </span>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="example.com"
                  className="input flex-1 rounded-l-none"
                />
              </div>
            </div>

            {/* Scale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quy mô <span className="text-red-500">*</span>
              </label>
              <select
                name="scale"
                value={formData.scale}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Chọn quy mô công ty</option>
                {companyScales.map((scale) => (
                  <option key={scale} value={scale}>{scale}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email công ty"
                className="input w-full"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả công ty
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Nhập mô tả về công ty..."
                className="input w-full"
              />
              <p className="text-xs text-gray-700 mt-1">
                TopCV khuyến khích độ dài tối thiểu 100 từ
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên công ty <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Nhập tên công ty"
                className="input w-full"
                required
              />
            </div>

            {/* Field of Activity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lĩnh vực hoạt động <span className="text-red-500">*</span>
              </label>
              <select
                name="field_of_activity"
                value={formData.field_of_activity}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Chọn lĩnh vực hoạt động</option>
                {fieldsOfActivity.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ công ty"
                className="input w-full"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm làm việc
              </label>
              <LocationSelector
                selectedProvince={formData.province}
                selectedDistrict={formData.district}
                onChange={handleLocationChange}
                placeholder="Chọn tỉnh/thành phố"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="input w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyInfo;

