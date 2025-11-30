import React, { useState, useEffect } from 'react';
import { getUsers } from '../services/api';
import {
  Building2, Search, Filter, Shield, CheckCircle, XCircle,
  Mail, Phone, Globe, MapPin, Users, Calendar, Edit, Trash2,
  Eye, AlertCircle, Lock, Unlock
} from 'lucide-react';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await getUsers({ role: 'RECRUITER' });
      setCompanies(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setShowCompanyModal(true);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.field_of_activity?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && company.is_active !== false) ||
      (statusFilter === 'inactive' && company.is_active === false);
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: companies.length,
    active: companies.filter(c => c.is_active !== false).length,
    inactive: companies.filter(c => c.is_active === false).length,
    verified: companies.filter(c => c.is_email_verified).length,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý công ty</h1>
          <p className="text-gray-600">Kiểm duyệt và quản lý các công ty trên hệ thống</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600 font-medium">Tổng số công ty</p>
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
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              <p className="text-sm text-gray-600 font-medium">Đã khóa</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
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
              placeholder="Tìm kiếm theo tên công ty, email, lĩnh vực..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Công ty</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Lĩnh vực</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Địa điểm</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Trạng thái</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Ngày đăng ký</th>
                <th className="text-right py-4 px-6 text-gray-700 font-semibold text-sm uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    Không tìm thấy công ty nào
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-medium text-sm">
                            {company.company_name?.[0] || company.email?.[0] || 'C'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {company.company_name || `${company.first_name} ${company.last_name}`}
                          </p>
                          <p className="text-sm text-gray-500">{company.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {company.field_of_activity || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {company.work_location_province || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        {company.is_active !== false ? (
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
                        {company.is_email_verified ? (
                          <span className="flex items-center gap-1 text-blue-600 font-medium text-xs">
                            <Shield className="w-3 h-3" />
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
                      {company.date_joined
                        ? new Date(company.date_joined).toLocaleDateString('vi-VN')
                        : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewCompany(company)}
                          className="p-2 rounded-lg hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Detail Modal */}
      {showCompanyModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết công ty</h2>
                <button
                  onClick={() => {
                    setShowCompanyModal(false);
                    setSelectedCompany(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white font-bold">
                    {selectedCompany.company_name?.[0] || selectedCompany.email?.[0] || 'C'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedCompany.company_name || `${selectedCompany.first_name} ${selectedCompany.last_name}`}
                  </h3>
                  <p className="text-gray-600">{selectedCompany.email}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCompany.field_of_activity && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lĩnh vực</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-gray-900">{selectedCompany.field_of_activity}</span>
                    </div>
                  </div>
                )}
                {selectedCompany.scale && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quy mô</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-gray-900">{selectedCompany.scale}</span>
                    </div>
                  </div>
                )}
                {selectedCompany.address && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedCompany.address}</span>
                    </div>
                  </div>
                )}
                {selectedCompany.website && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        {selectedCompany.website}
                      </a>
                    </div>
                  </div>
                )}
                {selectedCompany.tax_id && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mã số thuế</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-gray-900">{selectedCompany.tax_id}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedCompany.company_description && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả công ty</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">{selectedCompany.company_description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;

