import React, { useState, useEffect } from 'react';
import { getResults, createResult, sendResultEmail, generateOffer, getApplications } from '../services/api';
import {
  Award, Plus, Mail, FileText, CheckCircle, XCircle,
  Download, Calendar, DollarSign
} from 'lucide-react';

const Results = () => {
  const [results, setResults] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    application: '',
    final_decision: '',
    salary: '',
    start_date: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [resultsRes, appsRes] = await Promise.all([
        getResults(),
        getApplications(), // Lấy tất cả applications, không chỉ INTERVIEW
      ]);
      setResults(Array.isArray(resultsRes.data) ? resultsRes.data : resultsRes.data.results || []);
      // Chỉ hiển thị applications có thể tạo result (INTERVIEW, OFFER, hoặc các status khác trừ ACCEPTED)
      const availableApps = Array.isArray(appsRes.data) ? appsRes.data : appsRes.data.results || [];
      setApplications(availableApps.filter(app => app.status !== 'ACCEPTED'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createResult(formData);
      setShowForm(false);
      setFormData({
        application: '',
        final_decision: '',
        salary: '',
        start_date: '',
        notes: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error creating result:', error);
      const errorMessage = error.response?.data?.application?.[0] || 
                          error.response?.data?.final_decision?.[0] ||
                          error.response?.data?.detail || 
                          error.response?.data?.error ||
                          error.message || 
                          'Có lỗi xảy ra';
      alert(errorMessage);
    }
  };

  const handleSendEmail = async (id) => {
    try {
      await sendResultEmail(id);
      alert('Đã gửi email thông báo kết quả');
    } catch (error) {
      alert('Không thể gửi email');
    }
  };

  const handleGenerateOffer = async (id) => {
    try {
      await generateOffer(id);
      alert('Đang tạo thư mời nhận việc...');
      setTimeout(fetchData, 2000);
    } catch (error) {
      alert('Không thể tạo thư mời');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kết quả tuyển dụng</h1>
          <p className="text-gray-600">Quản lý kết quả và thư mời nhận việc</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm kết quả
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thêm kết quả tuyển dụng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ứng viên *</label>
                <select
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white"
                  required
                >
                  <option value="">-- Chọn ứng viên --</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.candidate_name} - {app.job_title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quyết định *</label>
                <select
                  value={formData.final_decision}
                  onChange={(e) => setFormData({ ...formData, final_decision: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white"
                  required
                >
                  <option value="">-- Chọn quyết định --</option>
                  <option value="OFFER">Gửi Offer</option>
                  <option value="REJECT">Từ chối</option>
                </select>
              </div>

              {formData.final_decision === 'OFFER' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương đề xuất</label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white"
                      placeholder="VD: 25,000,000 VNĐ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white min-h-[80px]"
                  placeholder="Ghi chú thêm..."
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Lưu kết quả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 text-center py-12">
          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có kết quả nào</h3>
          <p className="text-gray-600">Thêm kết quả tuyển dụng sau khi hoàn thành phỏng vấn</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div key={result.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  result.final_decision === 'OFFER' 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-red-100 text-red-700 border-red-200'
                }`}>
                  {result.final_decision === 'OFFER' ? 'Đã gửi Offer' : 'Từ chối'}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(result.decided_at).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{result.candidate_name}</h3>
              <p className="text-sm text-gray-600 mb-4">{result.job_title}</p>

              {result.final_decision === 'OFFER' && (
                <div className="space-y-2 text-sm mb-4">
                  {result.salary && (
                    <div className="flex items-center gap-2 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{result.salary}</span>
                    </div>
                  )}
                  {result.start_date && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Bắt đầu: {new Date(result.start_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              )}

              {result.notes && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{result.notes}</p>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSendEmail(result.id)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Gửi email
                </button>
                {result.final_decision === 'OFFER' && (
                  <>
                    {result.offer_letter_file ? (
                      <a
                        href={result.offer_letter_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Tải Offer
                      </a>
                    ) : (
                      <button
                        onClick={() => handleGenerateOffer(result.id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        Tạo Offer
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
