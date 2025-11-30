import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUsers, getJobs } from '../services/api';
import {
  Building2, MapPin, Globe, Users, Calendar, Briefcase,
  Mail, Phone, ArrowLeft, ExternalLink, Star, TrendingUp,
  Info, FileText, DollarSign
} from 'lucide-react';

const CompanyPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch company info (assuming it's a user with RECRUITER role)
        const companyRes = await getUsers({ id, role: 'RECRUITER' });
        const companyData = Array.isArray(companyRes.data) 
          ? companyRes.data[0] 
          : companyRes.data.results?.[0] || companyRes.data;
        
        setCompany(companyData);

        // Fetch jobs from this company
        const jobsRes = await getJobs({ company: id });
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || []);
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy công ty</h2>
          <p className="text-gray-600 mb-8">Công ty bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại tìm việc
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <Link
        to="/careers"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Quay lại tìm việc</span>
      </Link>

      {/* Company Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 md:p-12 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Building2 className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3">{company.company_name || company.first_name + ' ' + company.last_name}</h1>
            {company.field_of_activity && (
              <p className="text-blue-100 text-lg mb-4">{company.field_of_activity}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              {company.work_location_province && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{company.work_location_province}{company.work_location_district ? `, ${company.work_location_district}` : ''}</span>
                </div>
              )}
              {company.scale && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{company.scale}</span>
                </div>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Company Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Description */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Giới thiệu công ty
          </h2>
          {company.company_description ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {company.company_description}
            </p>
          ) : (
            <p className="text-gray-500 italic">Chưa có thông tin giới thiệu</p>
          )}
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            Thông tin liên hệ
          </h2>
          <div className="space-y-3">
            {company.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Địa chỉ</p>
                  <p className="text-gray-600">{company.address}</p>
                </div>
              </div>
            )}
            {company.company_email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Email</p>
                  <a href={`mailto:${company.company_email}`} className="text-blue-600 hover:text-blue-700">
                    {company.company_email}
                  </a>
                </div>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Điện thoại</p>
                  <a href={`tel:${company.phone}`} className="text-blue-600 hover:text-blue-700">
                    {company.phone}
                  </a>
                </div>
              </div>
            )}
            {company.tax_id && (
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Mã số thuế</p>
                  <p className="text-gray-600">{company.tax_id}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Jobs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Việc làm đang tuyển ({jobs.length})
            </h2>
          </div>
        </div>

        <div className="p-6">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Hiện tại công ty chưa có tin tuyển dụng nào.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="block p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.salary_min && job.salary_max && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              {job.salary_min.toLocaleString('vi-VN')} - {job.salary_max.toLocaleString('vi-VN')} VNĐ
                            </span>
                          </div>
                        )}
                        {job.experience_years && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{job.experience_years} năm kinh nghiệm</span>
                          </div>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {job.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                        Xem chi tiết
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;

