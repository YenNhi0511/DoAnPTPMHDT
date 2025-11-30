import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApplications, getInterviews, createInterview, updateInterview, deleteInterview, submitInterviewFeedback, getApplication, getInterviewPanels, createInterviewPanel, deleteInterviewPanel, getUsers, sendInterviewResultEmail } from '../services/api';
import {
  Calendar, Clock, Video, Phone, Building, MapPin, Edit, Trash2, MessageSquare, Ban,
  Search, X, Download, Plus, User, CheckCircle, XCircle, Eye, Users, Mail
} from 'lucide-react';

const Interviews = () => {
  const { isRecruiterOrAdmin } = useAuth();
  
  const [allInterviews, setAllInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null);
  const [interviewFormData, setInterviewFormData] = useState({
    application: '',
    scheduled_at: '',
    duration: 60,
    location: '',
    interview_type: 'VIDEO',
    panel_members: [], // Danh sách interviewer IDs
  });
  const [feedbackData, setFeedbackData] = useState({ feedback: '', result: '' });
  const [editingInterviewId, setEditingInterviewId] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);
  const [selectedInterviewCV, setSelectedInterviewCV] = useState(null);
  const [loadingCv, setLoadingCv] = useState(false);
  const [interviewFilters, setInterviewFilters] = useState({
    status: '',
    interview_type: '',
    search: '',
  });
  const [showAddPanelMember, setShowAddPanelMember] = useState(null);
  const [panelMembers, setPanelMembers] = useState({});
  const [availableInterviewers, setAvailableInterviewers] = useState([]);
  const [newPanelMember, setNewPanelMember] = useState({ interviewer: '', role: 'MEMBER' });

  useEffect(() => {
    fetchData();
  }, [isRecruiterOrAdmin, interviewFilters]);

  const interviewStatusLabels = {
    SCHEDULED: 'Đã lên lịch',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    RESCHEDULED: 'Đã dời lịch',
  };

  const handleViewCV = async (interview) => {
    try {
      setLoadingCv(true);
      const appRes = await getApplication(interview.application);
      const application = appRes.data;
      
      if (!application.cv_file && !application.cv_file_url) {
        alert('CV không tồn tại');
        setLoadingCv(false);
        return;
      }
      
      const cvFileUrl = application.cv_file_url || application.cv_file;
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      let cvFullUrl;
      if (cvFileUrl.startsWith('http://') || cvFileUrl.startsWith('https://')) {
        cvFullUrl = cvFileUrl;
      } else if (cvFileUrl.startsWith('/')) {
        cvFullUrl = `${apiUrl}${cvFileUrl}`;
      } else {
        cvFullUrl = `${apiUrl}/media/${cvFileUrl}`;
      }
      
      setCvUrl(cvFullUrl);
      setSelectedInterviewCV({
        candidate_name: interview.candidate_name || application.candidate_name,
        job_title: interview.job_title || application.job_title
      });
    } catch (error) {
      console.error('Error loading CV:', error);
      alert('Không thể tải CV: ' + (error.response?.data?.detail || error.message || 'Lỗi không xác định'));
    } finally {
      setLoadingCv(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      if (isRecruiterOrAdmin) {
        const params = {};
        if (interviewFilters.status) params.status = interviewFilters.status;
        if (interviewFilters.interview_type) params.interview_type = interviewFilters.interview_type;
        
        const [appsRes, allInterviewsRes, interviewersRes] = await Promise.all([
          getApplications({ ordering: '-applied_at' }),
          getInterviews({ ...params, ordering: '-scheduled_at' }),
          getUsers({ role: 'INTERVIEWER' }),
        ]);
        const appsList = Array.isArray(appsRes.data) ? appsRes.data : appsRes.data.results || [];
        // Chỉ hiển thị applications có thể tạo interview (PENDING, SCREENING, INTERVIEW)
        const availableApps = appsList.filter(app => 
          ['PENDING', 'SCREENING', 'INTERVIEW'].includes(app.status)
        );
        setApplications(availableApps);
        const interviewsList = Array.isArray(allInterviewsRes.data) ? allInterviewsRes.data : allInterviewsRes.data.results || [];
        setAllInterviews(interviewsList);
        
        // Lấy danh sách interviewers
        const interviewersList = Array.isArray(interviewersRes.data) ? interviewersRes.data : interviewersRes.data.results || [];
        setAvailableInterviewers(interviewersList);
        
        // Fetch panels cho mỗi interview
        const panelsMap = {};
        for (const interview of interviewsList) {
          try {
            const panelsRes = await getInterviewPanels({ interview: interview.id });
            const panels = Array.isArray(panelsRes.data) ? panelsRes.data : panelsRes.data.results || [];
            panelsMap[interview.id] = panels;
          } catch (error) {
            panelsMap[interview.id] = [];
          }
        }
        setPanelMembers(panelsMap);
      }
    } catch (error) {
      console.error('Error fetching interview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInterview = async (interviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch phỏng vấn này?')) return;
    try {
      await updateInterview(interviewId, { status: 'CANCELLED' });
      fetchData();
    } catch (error) {
      alert('Không thể hủy lịch phỏng vấn');
    }
  };

  const handleSubmitInterviewForm = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!interviewFormData.application) {
        alert('Vui lòng chọn ứng viên');
        return;
      }
      if (!interviewFormData.scheduled_at) {
        alert('Vui lòng chọn thời gian phỏng vấn');
        return;
      }
      if (!interviewFormData.interview_type) {
        alert('Vui lòng chọn hình thức phỏng vấn');
        return;
      }
      
      // Format scheduled_at để gửi đúng format ISO 8601
      const formData = {
        ...interviewFormData,
        application: interviewFormData.application,
        scheduled_at: interviewFormData.scheduled_at ? new Date(interviewFormData.scheduled_at).toISOString() : null,
        duration: interviewFormData.duration || 60,
      };
      
      // Tách panel_members ra khỏi formData vì interview API không nhận field này
      const panelMembers = interviewFormData.panel_members || [];
      delete formData.panel_members;
      
      let createdInterview;
      if (editingInterviewId) {
        await updateInterview(editingInterviewId, formData);
        // Khi edit, cập nhật panel members
        if (panelMembers.length > 0) {
          try {
            // Xóa tất cả panel members cũ
            const currentPanelsRes = await getInterviewPanels({ interview: editingInterviewId });
            const currentPanels = Array.isArray(currentPanelsRes.data) ? currentPanelsRes.data : currentPanelsRes.data.results || [];
            await Promise.all(currentPanels.map(panel => deleteInterviewPanel(panel.id)));
            
            // Tạo lại panel members mới
            await Promise.all(
              panelMembers.map((member) =>
                createInterviewPanel({
                  interview: editingInterviewId,
                  interviewer: member.interviewer_id,
                  role: member.role || 'MEMBER'
                })
              )
            );
          } catch (error) {
            console.error('Error updating panel members:', error);
          }
        }
      } else {
        const response = await createInterview(formData);
        createdInterview = response.data;
        
        // Sau khi tạo interview, tạo các panel members
        if (panelMembers.length > 0 && createdInterview?.id) {
          try {
            await Promise.all(
              panelMembers.map((member) =>
                createInterviewPanel({
                  interview: createdInterview.id,
                  interviewer: member.interviewer_id,
                  role: member.role || 'MEMBER'
                })
              )
            );
          } catch (error) {
            console.error('Error creating panel members:', error);
            alert('Đã tạo lịch phỏng vấn nhưng có lỗi khi thêm thành viên hội đồng. Vui lòng thêm lại sau.');
          }
        }
      }
      
      setShowInterviewForm(false);
      setEditingInterviewId(null);
      setInterviewFormData({
        application: '',
        scheduled_at: '',
        duration: 60,
        location: '',
        interview_type: 'VIDEO',
        panel_members: [],
      });
      setNewPanelMember({ interviewer: '', role: 'MEMBER' });
      fetchData();
    } catch (error) {
      console.error('Interview creation error:', error);
      const errorMessage = error.response?.data?.application?.[0] || 
                          error.response?.data?.scheduled_at?.[0] ||
                          error.response?.data?.detail || 
                          error.response?.data?.error ||
                          error.message || 
                          'Lỗi không xác định';
      alert('Có lỗi xảy ra: ' + errorMessage);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await submitInterviewFeedback(showFeedback, feedbackData);
      setShowFeedback(null);
      setFeedbackData({ feedback: '', result: '' });
      
      // Nếu result = PASS, hiển thị thông báo về OFFER đã được tạo tự động
      if (feedbackData.result === 'PASS') {
        alert('✅ Kết quả phỏng vấn: ĐẠT\n\nHệ thống đã tự động:\n- Tạo kết quả OFFER\n- Gửi email thông báo đến ứng viên\n- Tạo notification trong hệ thống');
      }
      
      fetchData();
    } catch (error) {
      alert('Có lỗi xảy ra: ' + (error.response?.data?.detail || error.message || 'Lỗi không xác định'));
    }
  };
  
  const handleAddPanelMember = async (interviewId) => {
    if (!newPanelMember.interviewer) {
      alert('Vui lòng chọn interviewer');
      return;
    }
    try {
      await createInterviewPanel({
        interview: interviewId,
        interviewer: newPanelMember.interviewer,
        role: newPanelMember.role
      });
      setShowAddPanelMember(null);
      setNewPanelMember({ interviewer: '', role: 'MEMBER' });
      fetchData();
    } catch (error) {
      alert('Có lỗi xảy ra: ' + (error.response?.data?.detail || error.message || 'Lỗi không xác định'));
    }
  };
  
  const handleRemovePanelMember = async (panelId, interviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi hội đồng?')) return;
    try {
      await deleteInterviewPanel(panelId);
      fetchData();
    } catch (error) {
      alert('Không thể xóa thành viên');
    }
  };

  const filteredInterviews = allInterviews.filter(interview => {
    if (interviewFilters.search) {
      const searchLower = interviewFilters.search.toLowerCase();
      return (
        interview.candidate_name?.toLowerCase().includes(searchLower) ||
        interview.job_title?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Lịch phỏng vấn
                </h1>
                <p className="text-green-100 text-lg">
                  Quản lý và theo dõi lịch phỏng vấn ứng viên
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch phỏng vấn - Đầy đủ chức năng CRUD */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Danh sách lịch phỏng vấn</h3>
              <p className="text-sm text-gray-600 mt-1">Quản lý và theo dõi lịch phỏng vấn ứng viên</p>
            </div>
            <button
              onClick={() => {
                setShowInterviewForm(true);
                setEditingInterviewId(null);
                setInterviewFormData({
                  application: '',
                  scheduled_at: '',
                  duration: 60,
                  location: '',
                  interview_type: 'VIDEO',
                  panel_members: [],
                });
                setNewPanelMember({ interviewer: '', role: 'MEMBER' });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Đặt lịch mới
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Tìm kiếm ứng viên, vị trí..."
                value={interviewFilters.search}
                onChange={(e) => setInterviewFilters({ ...interviewFilters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 text-sm"
              />
            </div>
            <select
              value={interviewFilters.status}
              onChange={(e) => setInterviewFilters({ ...interviewFilters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="SCHEDULED">Đã lên lịch</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="RESCHEDULED">Đã dời lịch</option>
            </select>
            <select
              value={interviewFilters.interview_type}
              onChange={(e) => setInterviewFilters({ ...interviewFilters, interview_type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 text-sm"
            >
              <option value="">Tất cả hình thức</option>
              <option value="VIDEO">Video call</option>
              <option value="PHONE">Điện thoại</option>
              <option value="ONSITE">Tại văn phòng</option>
            </select>
            <button
              onClick={() => setInterviewFilters({ status: '', interview_type: '', search: '' })}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm bg-white"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        <div className="p-6">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Chưa có lịch phỏng vấn</p>
              <button
                onClick={() => {
                  setShowInterviewForm(true);
                  setEditingInterviewId(null);
                  setInterviewFormData({
                    application: '',
                    scheduled_at: '',
                    duration: 60,
                    location: '',
                    interview_type: 'VIDEO',
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Đặt lịch phỏng vấn
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInterviews.map((interview) => {
                const TypeIcon = interview.interview_type === 'VIDEO' ? Video : interview.interview_type === 'PHONE' ? Phone : Building;
                const typeLabel = interview.interview_type === 'VIDEO' ? 'Video call' : interview.interview_type === 'PHONE' ? 'Điện thoại' : 'Tại văn phòng';
                return (
                  <div key={interview.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 truncate">{interview.candidate_name}</h4>
                          <p className="text-sm text-gray-600 truncate">{interview.job_title}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${
                        interview.status === 'SCHEDULED' ? 'bg-green-100 text-green-700' :
                        interview.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                        interview.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {interviewStatusLabels[interview.status] || interview.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(interview.scheduled_at).toLocaleString('vi-VN', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })} ({interview.duration} phút)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <span>{typeLabel}</span>
                      </div>
                      {interview.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="truncate">{interview.location}</span>
                        </div>
                      )}
                    </div>
                    {interview.result && interview.result !== 'PENDING' && (
                      <div className={`mb-3 p-2 rounded-lg ${
                        interview.result === 'PASS' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        <div className="flex items-center gap-2">
                          {interview.result === 'PASS' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          <span className="font-medium text-sm">
                            {interview.result === 'PASS' ? 'Đạt' : 'Không đạt'}
                          </span>
                        </div>
                      </div>
                    )}
                    {interview.result && interview.result !== 'PENDING' && (
                      <div className="mb-3 pt-2 border-t border-gray-200">
                        <button
                          onClick={async () => {
                            if (window.confirm(`Bạn có chắc chắn muốn gửi email và thông báo kết quả phỏng vấn đến ứng viên ${interview.candidate_name}?`)) {
                              try {
                                await sendInterviewResultEmail(interview.id);
                                alert('✅ Đã gửi email và thông báo kết quả phỏng vấn đến ứng viên!');
                              } catch (error) {
                                console.error('Error sending result email:', error);
                                const errorMessage = error.response?.data?.error || 
                                                    error.response?.data?.detail ||
                                                    'Không thể gửi email';
                                alert(`❌ ${errorMessage}`);
                              }
                            }
                          }}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Mail className="w-4 h-4" />
                          Gửi email & thông báo kết quả
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200 flex-wrap">
                      {(interview.application_cv_file_url || interview.application_cv_file) && (
                        <button
                          onClick={() => handleViewCV(interview)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5 text-xs font-medium"
                          title="Xem CV"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          CV
                        </button>
                      )}
                      {interview.status === 'SCHEDULED' && (
                        <>
                          <button
                            onClick={() => {
                              setShowAddPanelMember(interview.id);
                              setNewPanelMember({ interviewer: '', role: 'MEMBER' });
                            }}
                            className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                            title="Thêm thành viên hội đồng"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              // Lấy danh sách panel members hiện tại
                              let currentPanels = [];
                              try {
                                const panelsRes = await getInterviewPanels({ interview: interview.id });
                                currentPanels = Array.isArray(panelsRes.data) ? panelsRes.data : panelsRes.data.results || [];
                              } catch (error) {
                                console.error('Error fetching panels:', error);
                              }
                              
                              setInterviewFormData({
                                application: interview.application,
                                scheduled_at: interview.scheduled_at.slice(0, 16),
                                duration: interview.duration,
                                location: interview.location || '',
                                interview_type: interview.interview_type,
                                panel_members: currentPanels.map(p => ({
                                  interviewer_id: p.interviewer,
                                  role: p.role
                                })),
                              });
                              setEditingInterviewId(interview.id);
                              setShowInterviewForm(true);
                            }}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setShowFeedback(interview.id);
                              setFeedbackData({ feedback: interview.feedback || '', result: interview.result || 'PENDING' });
                            }}
                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Nhập kết quả"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCancelInterview(interview.id)}
                            className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                            title="Hủy lịch"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {/* Hiển thị danh sách thành viên hội đồng */}
                      {panelMembers[interview.id] && panelMembers[interview.id].length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">Hội đồng phỏng vấn:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {panelMembers[interview.id].map((panel) => (
                              <div key={panel.id} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                <span>{panel.interviewer_name}</span>
                                <span className="text-blue-500">({panel.role})</span>
                                {isRecruiterOrAdmin && (
                                  <button
                                    onClick={() => handleRemovePanelMember(panel.id, interview.id)}
                                    className="ml-1 text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={async () => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa lịch phỏng vấn này?')) {
                            try {
                              await deleteInterview(interview.id);
                              fetchData();
                            } catch (error) {
                              alert('Không thể xóa');
                            }
                          }
                        }}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Interview Form Modal */}
      {showInterviewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowInterviewForm(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingInterviewId ? 'Chỉnh sửa lịch' : 'Đặt lịch phỏng vấn'}</h2>
            <form onSubmit={handleSubmitInterviewForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ứng viên *</label>
                <select
                  value={interviewFormData.application}
                  onChange={(e) => setInterviewFormData({ ...interviewFormData, application: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
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
                    value={interviewFormData.scheduled_at}
                    onChange={(e) => setInterviewFormData({ ...interviewFormData, scheduled_at: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng (phút)</label>
                  <input
                    type="number"
                    value={interviewFormData.duration}
                    onChange={(e) => setInterviewFormData({ ...interviewFormData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức *</label>
                <select
                  value={interviewFormData.interview_type}
                  onChange={(e) => setInterviewFormData({ ...interviewFormData, interview_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
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
                  value={interviewFormData.location}
                  onChange={(e) => setInterviewFormData({ ...interviewFormData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  placeholder="VD: https://meet.google.com/xxx hoặc Phòng họp A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hội đồng phỏng vấn</label>
                <div className="space-y-2">
                  {interviewFormData.panel_members && interviewFormData.panel_members.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {interviewFormData.panel_members.map((member, index) => {
                        const interviewer = availableInterviewers.find(i => i.id === member.interviewer_id);
                        return (
                          <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-900">
                                {interviewer ? `${interviewer.name} (${interviewer.email})` : 'Đang tải...'}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">({member.role || 'MEMBER'})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newMembers = interviewFormData.panel_members.filter((_, i) => i !== index);
                                setInterviewFormData({ ...interviewFormData, panel_members: newMembers });
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <select
                      value={newPanelMember.interviewer || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setNewPanelMember({ ...newPanelMember, interviewer: e.target.value });
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    >
                      <option value="">-- Chọn interviewer --</option>
                      {availableInterviewers
                        .filter(i => !interviewFormData.panel_members?.some(m => m.interviewer_id === i.id))
                        .map((interviewer) => (
                          <option key={interviewer.id} value={interviewer.id}>
                            {interviewer.name} ({interviewer.email})
                          </option>
                        ))}
                    </select>
                    <select
                      value={newPanelMember.role || 'MEMBER'}
                      onChange={(e) => setNewPanelMember({ ...newPanelMember, role: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    >
                      <option value="MEMBER">Thành viên</option>
                      <option value="LEAD">Trưởng hội đồng</option>
                      <option value="OBSERVER">Quan sát viên</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (newPanelMember.interviewer) {
                          setInterviewFormData({
                            ...interviewFormData,
                            panel_members: [
                              ...(interviewFormData.panel_members || []),
                              {
                                interviewer_id: newPanelMember.interviewer,
                                role: newPanelMember.role || 'MEMBER'
                              }
                            ]
                          });
                          setNewPanelMember({ interviewer: '', role: 'MEMBER' });
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Chọn các thành viên sẽ tham gia phỏng vấn. Có thể thêm nhiều người.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowInterviewForm(false)} 
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  {editingInterviewId ? 'Cập nhật' : 'Đặt lịch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowFeedback(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nhập kết quả phỏng vấn</h2>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kết quả *</label>
                <select
                  value={feedbackData.result}
                  onChange={(e) => setFeedbackData({ ...feedbackData, result: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px] bg-white text-gray-900"
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

      {/* Add Panel Member Modal */}
      {showAddPanelMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowAddPanelMember(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thêm thành viên hội đồng</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddPanelMember(showAddPanelMember);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer *</label>
                <select
                  value={newPanelMember.interviewer}
                  onChange={(e) => setNewPanelMember({ ...newPanelMember, interviewer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  required
                >
                  <option value="">-- Chọn interviewer --</option>
                  {availableInterviewers.map((interviewer) => (
                    <option key={interviewer.id} value={interviewer.id}>
                      {interviewer.name} ({interviewer.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò *</label>
                <select
                  value={newPanelMember.role}
                  onChange={(e) => setNewPanelMember({ ...newPanelMember, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  required
                >
                  <option value="MEMBER">Thành viên</option>
                  <option value="LEAD">Trưởng hội đồng</option>
                  <option value="OBSERVER">Quan sát viên</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddPanelMember(null)} 
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CV Viewer Modal */}
      {cvUrl && selectedInterviewCV && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => { setCvUrl(null); setSelectedInterviewCV(null); }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">CV của {selectedInterviewCV.candidate_name}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedInterviewCV.job_title}</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-4 h-4" />
                  Tải xuống
                </a>
                <button
                  onClick={() => { setCvUrl(null); setSelectedInterviewCV(null); }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {loadingCv ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <iframe
                  src={cvUrl}
                  className="w-full h-full min-h-[600px] border border-gray-200 rounded-lg"
                  title="CV Viewer"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;

