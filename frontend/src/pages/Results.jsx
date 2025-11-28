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
        getApplications({ status: 'INTERVIEW' }),
      ]);
      setResults(Array.isArray(resultsRes.data) ? resultsRes.data : resultsRes.data.results || []);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : appsRes.data.results || []);
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
      alert('Có lỗi xảy ra');
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
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">
          <Award className="w-8 h-8 text-blue-400" />
          Kết quả tuyển dụng
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm kết quả
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg animate-fade-in">
            <h2 className="section-title">Thêm kết quả tuyển dụng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Ứng viên *</label>
                <select
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  className="input"
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
                <label className="label">Quyết định *</label>
                <select
                  value={formData.final_decision}
                  onChange={(e) => setFormData({ ...formData, final_decision: e.target.value })}
                  className="input"
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
                    <label className="label">Mức lương đề xuất</label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="input"
                      placeholder="VD: 25,000,000 VNĐ"
                    />
                  </div>

                  <div>
                    <label className="label">Ngày bắt đầu</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="input"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="label">Ghi chú</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input min-h-[80px]"
                  placeholder="Ghi chú thêm..."
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="card text-center py-12">
          <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Chưa có kết quả nào</h3>
          <p className="text-gray-400">Thêm kết quả tuyển dụng sau khi hoàn thành phỏng vấn</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div key={result.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <span className={`badge ${result.final_decision === 'OFFER' ? 'badge-success' : 'badge-danger'}`}>
                  {result.final_decision === 'OFFER' ? 'Đã gửi Offer' : 'Từ chối'}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(result.decided_at).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <h3 className="font-semibold text-white mb-1">{result.candidate_name}</h3>
              <p className="text-sm text-gray-400 mb-4">{result.job_title}</p>

              {result.final_decision === 'OFFER' && (
                <div className="space-y-2 text-sm mb-4">
                  {result.salary && (
                    <div className="flex items-center gap-2 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      <span>{result.salary}</span>
                    </div>
                  )}
                  {result.start_date && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>Bắt đầu: {new Date(result.start_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              )}

              {result.notes && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{result.notes}</p>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                <button
                  onClick={() => handleSendEmail(result.id)}
                  className="btn-ghost flex-1 flex items-center justify-center gap-2 py-2"
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
                        className="btn-success flex-1 flex items-center justify-center gap-2 py-2"
                      >
                        <Download className="w-4 h-4" />
                        Tải Offer
                      </a>
                    ) : (
                      <button
                        onClick={() => handleGenerateOffer(result.id)}
                        className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2"
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

