import React, { useState, useEffect } from 'react';
import { getInterviewPanels, createInterviewPanel, updateInterviewPanel, deleteInterviewPanel, getInterviews, getUsers } from '../services/api';
import {
  Users, Plus, Edit, Trash2, Star, User, MessageSquare, Save
} from 'lucide-react';

const InterviewPanels = () => {
  const [panels, setPanels] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    interview: '',
    interviewer: '',
    role: 'MEMBER',
  });
  const [editingId, setEditingId] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState(null);

  const fetchData = async () => {
    try {
      const [panelsRes, interviewsRes, usersRes] = await Promise.all([
        getInterviewPanels(),
        getInterviews({ status: 'SCHEDULED' }),
        getUsers({ role: 'INTERVIEWER' }),
      ]);
      setPanels(Array.isArray(panelsRes.data) ? panelsRes.data : panelsRes.data.results || []);
      setInterviews(Array.isArray(interviewsRes.data) ? interviewsRes.data : interviewsRes.data.results || []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.results || []);
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
        await updateInterviewPanel(editingId, formData);
      } else {
        await createInterviewPanel(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ interview: '', interviewer: '', role: 'MEMBER' });
      fetchData();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await deleteInterviewPanel(id);
        fetchData();
      } catch (error) {
        alert('Không thể xóa');
      }
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateInterviewPanel(feedbackForm.id, {
        feedback: feedbackForm.feedback,
        score: feedbackForm.score,
      });
      setFeedbackForm(null);
      fetchData();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const roleLabels = {
    LEAD: 'Trưởng hội đồng',
    MEMBER: 'Thành viên',
    OBSERVER: 'Quan sát viên',
  };

  const roleColors = {
    LEAD: 'badge-warning',
    MEMBER: 'badge-info',
    OBSERVER: 'badge-gray',
  };

  // Group panels by interview
  const groupedPanels = panels.reduce((acc, panel) => {
    const key = panel.interview;
    if (!acc[key]) {
      acc[key] = {
        interview: interviews.find(i => i.id === key) || { id: key },
        members: [],
      };
    }
    acc[key].members.push(panel);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">
          <Users className="w-8 h-8 text-blue-400" />
          Hội đồng tuyển dụng
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ interview: '', interviewer: '', role: 'MEMBER' });
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm thành viên
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg animate-fade-in">
            <h2 className="section-title">
              {editingId ? 'Chỉnh sửa thành viên' : 'Thêm thành viên hội đồng'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Buổi phỏng vấn *</label>
                <select
                  value={formData.interview}
                  onChange={(e) => setFormData({ ...formData, interview: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">-- Chọn buổi phỏng vấn --</option>
                  {interviews.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.candidate_name} - {i.job_title} ({new Date(i.scheduled_at).toLocaleDateString('vi-VN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Người phỏng vấn *</label>
                <select
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">-- Chọn người phỏng vấn --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Vai trò *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input"
                  required
                >
                  <option value="LEAD">Trưởng hội đồng</option>
                  <option value="MEMBER">Thành viên</option>
                  <option value="OBSERVER">Quan sát viên</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg animate-fade-in">
            <h2 className="section-title">Đánh giá ứng viên</h2>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="label">Điểm đánh giá (0-100)</label>
                <input
                  type="number"
                  value={feedbackForm.score || ''}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, score: parseFloat(e.target.value) })}
                  className="input"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="label">Nhận xét</label>
                <textarea
                  value={feedbackForm.feedback || ''}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                  className="input min-h-[100px]"
                  placeholder="Nhận xét chi tiết về ứng viên..."
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" onClick={() => setFeedbackForm(null)} className="btn-ghost">
                  Hủy
                </button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" /> Lưu đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Panels List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : Object.keys(groupedPanels).length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Chưa có hội đồng nào</h3>
          <p className="text-gray-400">Thêm thành viên vào hội đồng phỏng vấn</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(groupedPanels).map(({ interview, members }) => (
            <div key={interview.id} className="card">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                <div>
                  <h3 className="font-semibold text-white">{interview.candidate_name || 'Ứng viên'}</h3>
                  <p className="text-sm text-gray-400">
                    {interview.job_title} • {interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleString('vi-VN') : ''}
                  </p>
                </div>
                <span className="badge badge-info">{members.length} thành viên</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((panel) => (
                  <div key={panel.id} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{panel.interviewer_name}</p>
                          <span className={`badge text-xs ${roleColors[panel.role]}`}>
                            {roleLabels[panel.role]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setFeedbackForm({
                            id: panel.id,
                            feedback: panel.feedback || '',
                            score: panel.score || '',
                          })}
                          className="p-1.5 rounded hover:bg-slate-600/50 text-gray-400 hover:text-white"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(panel.id)}
                          className="p-1.5 rounded hover:bg-slate-600/50 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {panel.score && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium">{panel.score}/100</span>
                      </div>
                    )}
                    {panel.feedback && (
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">{panel.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewPanels;

