import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInterviews, createInterview, updateInterview, deleteInterview, submitInterviewFeedback, getApplications } from '../services/api';
import {
  Calendar, Plus, Clock, MapPin, Video, Phone, Building,
  Edit, Trash2, CheckCircle, XCircle, User, MessageSquare
} from 'lucide-react';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null);
  const [formData, setFormData] = useState({
    application: '',
    scheduled_at: '',
    duration: 60,
    location: '',
    interview_type: 'VIDEO',
  });
  const [feedbackData, setFeedbackData] = useState({ feedback: '', result: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [interviewsRes, appsRes] = await Promise.all([
        getInterviews(),
        getApplications({ status: 'INTERVIEW' }),
      ]);
      setInterviews(Array.isArray(interviewsRes.data) ? interviewsRes.data : interviewsRes.data.results || []);
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
      if (editingId) {
        await updateInterview(editingId, formData);
      } else {
        await createInterview(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        application: '',
        scheduled_at: '',
        duration: 60,
        location: '',
        interview_type: 'VIDEO',
      });
      fetchData();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const handleEdit = (interview) => {
    setFormData({
      application: interview.application,
      scheduled_at: interview.scheduled_at.slice(0, 16),
      duration: interview.duration,
      location: interview.location || '',
      interview_type: interview.interview_type,
    });
    setEditingId(interview.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch phỏng vấn này?')) {
      try {
        await deleteInterview(id);
        fetchData();
      } catch (error) {
        alert('Không thể xóa');
      }
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitInterviewFeedback(showFeedback, feedbackData);
      setShowFeedback(null);
      setFeedbackData({ feedback: '', result: '' });
      fetchData();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const typeIcons = {
    VIDEO: Video,
    PHONE: Phone,
    ONSITE: Building,
  };

  const typeLabels = {
    VIDEO: 'Video call',
    PHONE: 'Điện thoại',
    ONSITE: 'Tại văn phòng',
  };

  const statusColors = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    RESCHEDULED: 'bg-yellow-100 text-yellow-700',
  };

  const interviewStatusLabels = {
    SCHEDULED: 'Đã lên lịch',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    RESCHEDULED: 'Đổi lịch',
  };

  const resultColors = {
    PASS: 'text-green-600',
    FAIL: 'text-red-600',
    PENDING: 'text-gray-500',
  };

  return (
    <div className="w-full max-w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch phỏng vấn</h1>
          <p className="text-gray-600">Quản lý lịch phỏng vấn ứng viên</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              application: '',
              scheduled_at: '',
              duration: 60,
              location: '',
              interview_type: 'VIDEO',
            });
          }}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Đặt lịch phỏng vấn
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Chỉnh sửa lịch' : 'Đặt lịch phỏng vấn'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ứng viên *</label>
                <select
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian *</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng (phút)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức *</label>
                <select
                  value={formData.interview_type}
                  onChange={(e) => setFormData({ ...formData, interview_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="VIDEO">Video call</option>
                  <option value="PHONE">Điện thoại</option>
                  <option value="ONSITE">Tại văn phòng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm / Link</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="VD: https://meet.google.com/xxx hoặc Phòng họp A"
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
                  {editingId ? 'Cập nhật' : 'Đặt lịch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nhập kết quả phỏng vấn</h2>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kết quả *</label>
                <select
                  value={feedbackData.result}
                  onChange={(e) => setFeedbackData({ ...feedbackData, result: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">-- Chọn kết quả --</option>
                  <option value="PASS">Đạt</option>
                  <option value="FAIL">Không đạt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét</label>
                <textarea
                  value={feedbackData.feedback}
                  onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px]"
                  placeholder="Nhận xét về ứng viên..."
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowFeedback(null)} 
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

      {/* Interviews List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch phỏng vấn</h3>
          <p className="text-gray-600">Đặt lịch phỏng vấn cho các ứng viên phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {interviews.map((interview) => {
            const TypeIcon = typeIcons[interview.interview_type] || Video;
            return (
              <div key={interview.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[interview.status] || 'bg-gray-100 text-gray-700'}`}>
                    {interviewStatusLabels[interview.status] || interview.status}
                  </span>
                  <div className="flex items-center gap-1">
                    {interview.status === 'SCHEDULED' && (
                      <>
                        <button
                          onClick={() => handleEdit(interview)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowFeedback(interview.id);
                            setFeedbackData({ feedback: '', result: '' });
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 text-green-600 hover:text-green-700 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(interview.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{interview.candidate_name}</h3>
                    <p className="text-sm text-gray-600">{interview.job_title}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(interview.scheduled_at).toLocaleString('vi-VN', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })} ({interview.duration} phút)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TypeIcon className="w-4 h-4 text-gray-400" />
                    <span>{typeLabels[interview.interview_type]}</span>
                  </div>
                  {interview.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{interview.location}</span>
                    </div>
                  )}
                </div>

                {interview.result && interview.result !== 'PENDING' && (
                  <div className={`mt-4 pt-4 border-t border-gray-200 ${resultColors[interview.result]}`}>
                    <div className="flex items-center gap-2">
                      {interview.result === 'PASS' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span className="font-medium">
                        {interview.result === 'PASS' ? 'Đạt' : 'Không đạt'}
                      </span>
                    </div>
                    {interview.feedback && (
                      <p className="text-gray-600 text-sm mt-2">{interview.feedback}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Interviews;
