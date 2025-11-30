import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplications, updateApplicationStatus } from '../services/api';
import {
  User, FileText, Calendar, MapPin, Briefcase, Building2,
  CheckCircle, XCircle, Clock, Eye, ArrowRight, ArrowLeft,
  GripVertical, TrendingUp, Mail
} from 'lucide-react';

const RecruitmentPipeline = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('all');
  const [draggedItem, setDraggedItem] = useState(null);

  const stages = [
    { id: 'PENDING', label: 'Ứng viên mới', color: 'bg-yellow-50 border-yellow-200', icon: Clock },
    { id: 'SCREENING', label: 'Đang sàng lọc', color: 'bg-blue-50 border-blue-200', icon: Eye },
    { id: 'INTERVIEW', label: 'Phỏng vấn', color: 'bg-purple-50 border-purple-200', icon: Calendar },
    { id: 'OFFER', label: 'Đã gửi offer', color: 'bg-green-50 border-green-200', icon: Mail },
    { id: 'ACCEPTED', label: 'Nhận việc', color: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
    { id: 'REJECTED', label: 'Loại', color: 'bg-red-50 border-red-200', icon: XCircle },
  ];

  useEffect(() => {
    fetchApplications();
  }, [selectedJob]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedJob !== 'all') {
        params.job = selectedJob;
      }
      const res = await getApplications(params);
      setApplications(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, application) => {
    setDraggedItem(application);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.status === targetStage) {
      setDraggedItem(null);
      return;
    }

    try {
      await updateApplicationStatus(draggedItem.id, { status: targetStage });
      setApplications(applications.map(app =>
        app.id === draggedItem.id ? { ...app, status: targetStage } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Không thể cập nhật trạng thái');
    } finally {
      setDraggedItem(null);
    }
  };

  const getApplicationsByStage = (stageId) => {
    return applications.filter(app => app.status === stageId);
  };

  const getStatusIcon = (status) => {
    const stage = stages.find(s => s.id === status);
    return stage ? stage.icon : FileText;
  };

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
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Pipeline tuyển dụng</h1>
            <p className="text-green-100">Quản lý ứng viên theo từng giai đoạn - Kéo thả để chuyển giai đoạn</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const count = getApplicationsByStage(stage.id).length;
          const StageIcon = stage.icon;
          return (
            <div key={stage.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 ${stage.color} rounded-lg flex items-center justify-center border-2`}>
                  <StageIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-600">{stage.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const StageIcon = stage.icon;
          const stageApplications = getApplicationsByStage(stage.id);

          return (
            <div
              key={stage.id}
              className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div className={`px-4 py-3 ${stage.color} border-b-2 border-gray-200`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <StageIcon className="w-5 h-5" />
                    <h3 className="font-bold text-gray-900">{stage.label}</h3>
                  </div>
                  <span className="px-2 py-1 bg-white/50 rounded-full text-xs font-semibold text-gray-700">
                    {stageApplications.length}
                  </span>
                </div>
              </div>

              {/* Applications List */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[400px] max-h-[600px]">
                {stageApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Không có ứng viên</p>
                  </div>
                ) : (
                  stageApplications.map((application) => {
                    const StatusIcon = getStatusIcon(application.status);
                    return (
                      <div
                        key={application.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, application)}
                        className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all cursor-move group"
                      >
                        <div className="flex items-start gap-2 mb-3">
                          <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {application.candidate_name?.[0] || application.candidate_email?.[0] || 'U'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                              {application.candidate_name || application.candidate_email}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {application.job_title}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          {application.ai_score && (
                            <div className="flex items-center gap-1 text-xs">
                              <TrendingUp className="w-3 h-3 text-green-600" />
                              <span className="font-semibold text-green-600">
                                Điểm AI: {application.ai_score.toFixed(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(application.applied_at).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/applications?application=${application.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            Xem
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          <strong>Hướng dẫn:</strong> Kéo thả ứng viên giữa các cột để thay đổi trạng thái. 
          Click "Xem" để xem chi tiết ứng viên.
        </p>
      </div>
    </div>
  );
};

export default RecruitmentPipeline;

