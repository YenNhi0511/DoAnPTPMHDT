import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getInterviewPanels, createInterviewPanel, updateInterviewPanel, deleteInterviewPanel,
  getInterviews, createInterview, getJobs, getApplications, getUsers
} from '../services/api';
import {
  Users, Plus, Edit, Trash2, Star, User, MessageSquare, Save, X, Search, Filter,
  Calendar, Briefcase, Mail, CheckCircle, XCircle, Clock, Eye, Download,
  BarChart3, TrendingUp, Award, FileText
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const InterviewPanels = () => {
  const [panels, setPanels] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showPanelDetail, setShowPanelDetail] = useState(null);
  const [showScoringForm, setShowScoringForm] = useState(null);
  
  // Form data
  const [panelFormData, setPanelFormData] = useState({
    name: '',
    job: '',
    application: '', // Cho phép chọn application cụ thể
    interview: '', // Hoặc chọn interview có sẵn
    createNewInterview: true, // Tạo interview mới hay dùng interview có sẵn
    scheduled_at: '',
    duration: 60,
    location: '',
    interview_type: 'VIDEO',
    objective: '',
    stage: 'ROUND_1',
    members: []
  });
  
  const [memberFormData, setMemberFormData] = useState({
    email: '',
    interviewer_id: null,
    role: 'MEMBER',
    permissions: {
      can_view: true,
      can_score: true,
      can_decide: false
    }
  });
  
  const [scoringData, setScoringData] = useState({
    technical_knowledge: 0,
    communication: 0,
    attitude: 0,
    culture_fit: 0,
    feedback: '',
    recommendation: 'PENDING'
  });

  // Group panels by interview (each interview represents a panel)
  const groupedPanels = panels.reduce((acc, panel) => {
    const interviewId = panel.interview;
    if (!acc[interviewId]) {
      const interview = interviews.find(i => i.id === interviewId);
      if (interview) {
        acc[interviewId] = {
          interview,
          members: [],
          totalScore: 0,
          averageScore: panel.average_score || 0, // Sử dụng average_score từ API
          totalPanelMembers: panel.total_panel_members || 0,
          scoredMembers: panel.scored_members || 0
        };
      }
    }
    if (acc[interviewId]) {
      acc[interviewId].members.push(panel);
      // Cập nhật averageScore từ panel đầu tiên (tất cả panels cùng interview có cùng average_score)
      if (panel.average_score !== null && panel.average_score !== undefined) {
        acc[interviewId].averageScore = panel.average_score;
      }
      if (panel.total_panel_members) {
        acc[interviewId].totalPanelMembers = panel.total_panel_members;
      }
      if (panel.scored_members !== null && panel.scored_members !== undefined) {
        acc[interviewId].scoredMembers = panel.scored_members;
      }
    }
    return acc;
  }, {});

  // Filter panels
  const filteredPanels = Object.values(groupedPanels).filter(panel => {
    const interview = panel.interview;
    const job = jobs.find(j => j.id === interview?.job_id);
    
    if (jobFilter && job?.id !== jobFilter) return false;
    if (statusFilter && interview?.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const candidateName = interview?.candidate_name?.toLowerCase() || '';
      const jobTitle = interview?.job_title?.toLowerCase() || '';
      if (!candidateName.includes(query) && !jobTitle.includes(query)) return false;
    }
    return true;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Chỉ lấy users với role INTERVIEWER (thành viên hội đồng chuyên nghiệp)
      // Không lấy RECRUITER của các công ty khác
      const interviewersRes = await getUsers({ role: 'INTERVIEWER' });
      
      const [panelsRes, interviewsRes, jobsRes, appsRes] = await Promise.all([
        getInterviewPanels(),
        getInterviews(),
        getJobs(),
        getApplications()
      ]);
      
      setPanels(Array.isArray(panelsRes.data) ? panelsRes.data : panelsRes.data.results || []);
      setInterviews(Array.isArray(interviewsRes.data) ? interviewsRes.data : interviewsRes.data.results || []);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || []);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : appsRes.data.results || []);
      
      // Chỉ lấy users với role INTERVIEWER
      const interviewers = Array.isArray(interviewersRes.data) ? interviewersRes.data : interviewersRes.data.results || [];
      setUsers(interviewers);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePanel = async (e) => {
    e.preventDefault();
    try {
      if (!panelFormData.job) {
        alert('Vui lòng chọn vị trí tuyển dụng');
        return;
      }
      
      let targetInterview = null;
      
      // Nếu chọn dùng interview có sẵn
      if (!panelFormData.createNewInterview && panelFormData.interview) {
        targetInterview = panelFormData.interview;
      } else {
        // Tạo interview mới
        if (!panelFormData.application) {
          alert('Vui lòng chọn ứng viên để tạo interview');
          return;
        }
        
        if (!panelFormData.scheduled_at) {
          alert('Vui lòng chọn thời gian phỏng vấn');
          return;
        }
        
        // Tạo interview cho application đã chọn
        const interviewData = {
          application: panelFormData.application,
          scheduled_at: new Date(panelFormData.scheduled_at).toISOString(),
          duration: panelFormData.duration || 60,
          location: panelFormData.location || '',
          interview_type: panelFormData.interview_type || 'VIDEO',
        };
        
        const interviewRes = await createInterview(interviewData);
        targetInterview = interviewRes.data.id;
      }
      
      // Thêm các panel members vào interview
      if (panelFormData.members && panelFormData.members.length > 0) {
        await Promise.all(
          panelFormData.members.map(member =>
            createInterviewPanel({
              interview: targetInterview,
              interviewer: member.interviewer_id,
              role: member.role || 'MEMBER'
            })
          )
        );
      } else {
        alert('Vui lòng thêm ít nhất một thành viên vào hội đồng');
        return;
      }
      
      setShowCreatePanel(false);
      setPanelFormData({
        name: '',
        job: '',
        application: '',
        interview: '',
        createNewInterview: true,
        scheduled_at: '',
        duration: 60,
        location: '',
        interview_type: 'VIDEO',
        objective: '',
        stage: 'ROUND_1',
        members: []
      });
      setMemberFormData({ email: '', interviewer_id: null, role: 'MEMBER' });
      fetchData();
      alert('✅ Đã tạo hội đồng tuyển dụng thành công!');
    } catch (error) {
      console.error('Error creating panel:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error ||
                          error.message || 
                          'Có lỗi xảy ra';
      alert(errorMessage);
    }
  };

  const handleAddMember = async (interviewId) => {
    try {
      // Find user by email
      const user = users.find(u => u.email === memberFormData.email);
      if (!user) {
        alert('Không tìm thấy người dùng với email này');
        return;
      }

      await createInterviewPanel({
        interview: interviewId,
        interviewer: user.id,
        role: memberFormData.role
      });
      
      setMemberFormData({
        email: '',
        role: 'MEMBER',
        permissions: {
          can_view: true,
          can_score: true,
          can_decide: false
        }
      });
      fetchData();
    } catch (error) {
      alert('Không thể thêm thành viên');
    }
  };

  const handleSubmitScore = async (panelId) => {
    try {
      const totalScore = (
        scoringData.technical_knowledge +
        scoringData.communication +
        scoringData.attitude +
        scoringData.culture_fit
      ) * 2.5; // Convert to 0-100 scale

      await updateInterviewPanel(panelId, {
        score: totalScore,
        feedback: scoringData.feedback
      });
      
      setShowScoringForm(null);
      setScoringData({
        technical_knowledge: 0,
        communication: 0,
        attitude: 0,
        culture_fit: 0,
        feedback: '',
        recommendation: 'PENDING'
      });
      
      // Hiển thị thông báo về kết quả tự động
      alert('✅ Đã lưu điểm thành công!\n\nHệ thống sẽ tự động:\n- Tính điểm trung bình (có trọng số)\n- Cập nhật kết quả phỏng vấn (PASS nếu >= 70, FAIL nếu < 70)\n- Tạo OFFER và gửi email nếu điểm >= 70');
      
      fetchData();
    } catch (error) {
      console.error('Error submitting score:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error ||
                          error.message || 
                          'Không thể lưu điểm';
      alert(errorMessage);
    }
  };

  const roleLabels = {
    LEAD: 'Chủ tịch',
    MEMBER: 'Thành viên',
    OBSERVER: 'Quan sát viên'
  };

  const roleColors = {
    LEAD: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    MEMBER: 'bg-blue-100 text-blue-700 border-blue-200',
    OBSERVER: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const stageLabels = {
    ROUND_1: 'Vòng 1',
    ROUND_2: 'Vòng 2',
    FINAL: 'Vòng cuối'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hội đồng tuyển dụng</h1>
          <p className="text-gray-600">Quản lý hội đồng phỏng vấn và đánh giá ứng viên</p>
        </div>
        <button
          onClick={() => setShowCreatePanel(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo hội đồng mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên ứng viên, vị trí..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
          <div>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
            >
              <option value="">Tất cả vị trí</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="SCHEDULED">Đang hoạt động</option>
              <option value="COMPLETED">Đã kết thúc</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Panels List */}
      {filteredPanels.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có hội đồng nào</h3>
          <p className="text-gray-600 mb-4">Tạo hội đồng mới để bắt đầu quy trình tuyển dụng</p>
          <button
            onClick={() => setShowCreatePanel(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Tạo hội đồng mới
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPanels.map(({ interview, members, averageScore }) => (
            <div key={interview.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              {/* Panel Header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{interview.candidate_name}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        {members.length} thành viên
                      </span>
                      {averageScore > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                          Điểm TB: {averageScore.toFixed(1)}/100
                        </span>
                      )}
                      {groupedPanels[interview.id]?.scoredMembers !== undefined && groupedPanels[interview.id]?.totalPanelMembers > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                          {groupedPanels[interview.id].scoredMembers}/{groupedPanels[interview.id].totalPanelMembers} đã chấm
                        </span>
                      )}
                      {interview.result && interview.result !== 'PENDING' && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          interview.result === 'PASS' ? 'bg-green-100 text-green-700 border border-green-200' :
                          'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {interview.result === 'PASS' ? '✅ ĐẠT' : '❌ KHÔNG ĐẠT'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{interview.job_title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(interview.scheduled_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPanelDetail(interview.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>

              {/* Members Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((panel) => (
                    <div key={panel.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{panel.interviewer_name}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border mt-1 ${roleColors[panel.role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                              {roleLabels[panel.role]}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!panel.score && (
                            <button
                              onClick={() => setShowScoringForm(panel.id)}
                              className="p-1.5 rounded hover:bg-gray-200 text-green-600 transition-colors"
                              title="Chấm điểm"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
                                try {
                                  await deleteInterviewPanel(panel.id);
                                  fetchData();
                                } catch (error) {
                                  alert('Không thể xóa');
                                }
                              }
                            }}
                            className="p-1.5 rounded hover:bg-gray-200 text-red-600 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {panel.score && (
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-900 font-medium">{panel.score.toFixed(1)}/100</span>
                        </div>
                      )}
                      {panel.feedback && (
                        <p className="text-sm text-gray-600 line-clamp-2">{panel.feedback}</p>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Member Button */}
                  <button
                    onClick={() => {
                      const email = prompt('Nhập email của thành viên:');
                      if (email) {
                        setMemberFormData({ ...memberFormData, email });
                        handleAddMember(interview.id);
                      }
                    }}
                    className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-green-600"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-sm font-medium">Thêm thành viên</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Panel Modal */}
      {showCreatePanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowCreatePanel(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tạo hội đồng tuyển dụng mới</h2>
              <button onClick={() => setShowCreatePanel(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePanel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên hội đồng *</label>
                <input
                  type="text"
                  value={panelFormData.name}
                  onChange={(e) => setPanelFormData({ ...panelFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí tuyển dụng *</label>
                <select
                  value={panelFormData.job}
                  onChange={(e) => {
                    setPanelFormData({ 
                      ...panelFormData, 
                      job: e.target.value,
                      application: '',
                      interview: ''
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  required
                >
                  <option value="">-- Chọn vị trí --</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>

              {/* Chọn cách tạo hội đồng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cách tạo hội đồng *</label>
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="createMethod"
                      checked={panelFormData.createNewInterview}
                      onChange={() => setPanelFormData({ ...panelFormData, createNewInterview: true, interview: '' })}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 mt-1"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Tạo interview mới</span>
                      <p className="text-xs text-gray-600 mt-1">Tạo interview mới cho ứng viên và gán hội đồng vào đó. Dùng khi chưa có interview nào.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="createMethod"
                      checked={!panelFormData.createNewInterview}
                      onChange={() => setPanelFormData({ ...panelFormData, createNewInterview: false, application: '', scheduled_at: '' })}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 mt-1"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">Thêm hội đồng vào interview có sẵn</span>
                      <p className="text-xs text-gray-600 mt-1">Nếu đã lên lịch phỏng vấn ở trang "Lên lịch phỏng vấn" rồi, chọn option này để thêm hội đồng vào interview đó.</p>
                    </div>
                  </label>
                </div>
              </div>

              {panelFormData.createNewInterview ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ứng viên *</label>
                    <select
                      value={panelFormData.application}
                      onChange={(e) => setPanelFormData({ ...panelFormData, application: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                      required={panelFormData.createNewInterview}
                    >
                      <option value="">-- Chọn ứng viên --</option>
                      {applications
                        .filter(app => app.job === panelFormData.job && ['PENDING', 'SCREENING', 'INTERVIEW'].includes(app.status))
                        .map(app => (
                          <option key={app.id} value={app.id}>
                            {app.candidate_name} - {app.job_title} ({app.status})
                          </option>
                        ))}
                    </select>
                    {panelFormData.job && applications.filter(app => app.job === panelFormData.job && ['PENDING', 'SCREENING', 'INTERVIEW'].includes(app.status)).length === 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Chưa có ứng viên nào cho vị trí này. Vui lòng chờ ứng viên nộp hồ sơ hoặc chọn vị trí khác.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian phỏng vấn *</label>
                      <input
                        type="datetime-local"
                        value={panelFormData.scheduled_at}
                        onChange={(e) => setPanelFormData({ ...panelFormData, scheduled_at: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                        required={panelFormData.createNewInterview}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng (phút)</label>
                      <input
                        type="number"
                        value={panelFormData.duration}
                        onChange={(e) => setPanelFormData({ ...panelFormData, duration: parseInt(e.target.value) || 60 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                        min="15"
                        step="15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức *</label>
                      <select
                        value={panelFormData.interview_type}
                        onChange={(e) => setPanelFormData({ ...panelFormData, interview_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                        required={panelFormData.createNewInterview}
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
                        value={panelFormData.location}
                        onChange={(e) => setPanelFormData({ ...panelFormData, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                        placeholder="VD: https://meet.google.com/xxx"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn interview có sẵn *
                    <span className="ml-2 text-xs font-normal text-gray-500">(Nếu đã lên lịch phỏng vấn rồi)</span>
                  </label>
                  <select
                    value={panelFormData.interview}
                    onChange={(e) => setPanelFormData({ ...panelFormData, interview: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    required={!panelFormData.createNewInterview}
                  >
                    <option value="">-- Chọn interview --</option>
                    {interviews
                      .filter(interview => {
                        if (!panelFormData.job) return true;
                        // Ưu tiên dùng job_id từ interview (nếu có) - đây là cách tốt nhất
                        if (interview.job_id) {
                          return String(interview.job_id) === String(panelFormData.job);
                        }
                        // Fallback: Tìm application của interview này và so sánh job
                        const app = applications.find(a => {
                          // So sánh cả ID dạng string và UUID
                          return String(a.id) === String(interview.application) || 
                                 a.id === interview.application;
                        });
                        if (app) {
                          // So sánh job ID (có thể là string hoặc UUID)
                          return String(app.job) === String(panelFormData.job) || 
                                 String(app.job_id) === String(panelFormData.job) ||
                                 app.job === panelFormData.job;
                        }
                        // Nếu không tìm thấy application, vẫn hiển thị interview nếu job_title khớp
                        if (interview.job_title) {
                          const selectedJob = jobs.find(j => String(j.id) === String(panelFormData.job));
                          return selectedJob && selectedJob.title === interview.job_title;
                        }
                        return false;
                      })
                      .map(interview => (
                        <option key={interview.id} value={interview.id}>
                          {interview.candidate_name} - {interview.job_title} - {new Date(interview.scheduled_at).toLocaleString('vi-VN', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </option>
                      ))}
                  </select>
                  {panelFormData.job && interviews.filter(interview => {
                    // Ưu tiên dùng job_id từ interview (nếu có)
                    if (interview.job_id) {
                      return String(interview.job_id) === String(panelFormData.job);
                    }
                    // Fallback: Tìm application
                    const app = applications.find(a => {
                      return String(a.id) === String(interview.application) || 
                             a.id === interview.application;
                    });
                    if (app) {
                      return String(app.job) === String(panelFormData.job) || 
                             String(app.job_id) === String(panelFormData.job) ||
                             app.job === panelFormData.job;
                    }
                    // Nếu không tìm thấy application, kiểm tra job_title
                    if (interview.job_title) {
                      const selectedJob = jobs.find(j => String(j.id) === String(panelFormData.job));
                      return selectedJob && selectedJob.title === interview.job_title;
                    }
                    return false;
                  }).length === 0 && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>💡 Gợi ý:</strong> Chưa có interview nào cho vị trí này. 
                        <br />
                        • Nếu chưa lên lịch phỏng vấn: Chọn <strong>"Tạo interview mới"</strong> ở trên
                        <br />
                        • Nếu đã lên lịch ở trang "Lên lịch phỏng vấn": Chọn <strong>"Thêm hội đồng vào interview có sẵn"</strong> và chọn interview từ danh sách
                      </p>
                    </div>
                  )}
                  {panelFormData.interview && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>ℹ️ Lưu ý:</strong> Bạn đang thêm hội đồng vào interview đã có. 
                        Các thành viên hội đồng sẽ được thêm vào interview này để chấm điểm.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu tuyển dụng</label>
                <textarea
                  value={panelFormData.objective}
                  onChange={(e) => setPanelFormData({ ...panelFormData, objective: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 min-h-[80px]"
                  placeholder="Mô tả mục tiêu và yêu cầu của hội đồng..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giai đoạn tuyển dụng</label>
                <select
                  value={panelFormData.stage}
                  onChange={(e) => setPanelFormData({ ...panelFormData, stage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                >
                  <option value="ROUND_1">Vòng 1</option>
                  <option value="ROUND_2">Vòng 2</option>
                  <option value="FINAL">Vòng cuối</option>
                </select>
              </div>

              {/* Thêm thành viên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thành viên hội đồng *</label>
                <div className="space-y-2 mb-3">
                  {panelFormData.members.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="flex-1 text-sm text-gray-700">{member.email || member.name}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{member.role}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPanelFormData({
                            ...panelFormData,
                            members: panelFormData.members.filter((_, i) => i !== index)
                          });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <select
                    value={memberFormData.email}
                    onChange={(e) => {
                      const selectedUser = users.find(u => u.email === e.target.value);
                      setMemberFormData({
                        ...memberFormData,
                        email: e.target.value,
                        interviewer_id: selectedUser?.id || null
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  >
                    <option value="">-- Chọn thành viên --</option>
                    {users
                      .filter(u => !panelFormData.members.some(m => m.email === u.email))
                      .map(user => {
                        // Hiển thị tên theo format: "Họ tên - Chức vụ" hoặc "first_name last_name"
                        // Ưu tiên full_name_with_position, sau đó name, sau đó first_name
                        const displayName = user.full_name_with_position || 
                                          user.name || 
                                          (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name || user.email);
                        return (
                          <option key={user.id} value={user.email}>
                            {displayName} ({user.email})
                          </option>
                        );
                      })}
                  </select>
                  <div className="flex gap-2">
                    <select
                      value={memberFormData.role}
                      onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    >
                      <option value="MEMBER">Thành viên</option>
                      <option value="LEAD">Trưởng hội đồng</option>
                      <option value="OBSERVER">Quan sát viên</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (memberFormData.email && memberFormData.interviewer_id) {
                          const selectedUser = users.find(u => u.email === memberFormData.email);
                          setPanelFormData({
                            ...panelFormData,
                            members: [...panelFormData.members, {
                              email: memberFormData.email,
                              interviewer_id: memberFormData.interviewer_id,
                              name: selectedUser?.full_name_with_position || selectedUser?.name,
                              role: memberFormData.role
                            }]
                          });
                          setMemberFormData({ email: '', interviewer_id: null, role: 'MEMBER' });
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {panelFormData.members.length === 0 && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Vui lòng thêm ít nhất một thành viên vào hội đồng</p>
                )}
              </div>
              <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowCreatePanel(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Hủy
                </button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
                  Tạo hội đồng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scoring Form Modal */}
      {showScoringForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowScoringForm(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chấm điểm ứng viên</h2>
              <button onClick={() => setShowScoringForm(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitScore(showScoringForm); }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kiến thức chuyên môn (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={scoringData.technical_knowledge}
                    onChange={(e) => setScoringData({ ...scoringData, technical_knowledge: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng giao tiếp (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={scoringData.communication}
                    onChange={(e) => setScoringData({ ...scoringData, communication: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thái độ & tác phong (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={scoringData.attitude}
                    onChange={(e) => setScoringData({ ...scoringData, attitude: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phù hợp văn hóa (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={scoringData.culture_fit}
                    onChange={(e) => setScoringData({ ...scoringData, culture_fit: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét chi tiết</label>
                <textarea
                  value={scoringData.feedback}
                  onChange={(e) => setScoringData({ ...scoringData, feedback: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 min-h-[100px]"
                  placeholder="Nhận xét về ứng viên..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đề xuất *</label>
                <select
                  value={scoringData.recommendation}
                  onChange={(e) => setScoringData({ ...scoringData, recommendation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  required
                >
                  <option value="PENDING">Chờ xem xét</option>
                  <option value="PASS">✅ ĐẬU</option>
                  <option value="FAIL">❌ KHÔNG ĐẬU</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowScoringForm(null)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Hủy
                </button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Lưu đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Panel Detail Modal - Will be implemented in next step */}
      {showPanelDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowPanelDetail(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết Hội đồng tuyển dụng</h2>
              <button onClick={() => setShowPanelDetail(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Chi tiết hội đồng sẽ được hiển thị ở đây với biểu đồ và thống kê</p>
            {/* Detail content will be added in next step */}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPanels;
