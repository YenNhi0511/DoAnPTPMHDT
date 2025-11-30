import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInterviews } from '../services/api';
import {
  Calendar, Clock, MapPin, Video, Phone, Building2, User,
  CheckCircle, XCircle, AlertCircle, FileText, Briefcase
} from 'lucide-react';

const CandidateInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await getInterviews({ candidate: user?.id });
        const allInterviews = Array.isArray(res.data) ? res.data : res.data.results || [];
        setInterviews(allInterviews);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'VIDEO':
        return Video;
      case 'PHONE':
        return Phone;
      default:
        return MapPin;
    }
  };

  const getInterviewTypeLabel = (type) => {
    switch (type) {
      case 'VIDEO':
        return 'Phỏng vấn video';
      case 'PHONE':
        return 'Phỏng vấn điện thoại';
      default:
        return 'Phỏng vấn trực tiếp';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Đã lên lịch';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'RESCHEDULED':
        return 'Đã dời lịch';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'RESCHEDULED':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const now = new Date();
  const upcomingInterviews = interviews.filter(
    interview => new Date(interview.scheduled_at) > now && interview.status === 'SCHEDULED'
  );
  const pastInterviews = interviews.filter(
    interview => new Date(interview.scheduled_at) <= now || interview.status !== 'SCHEDULED'
  );

  const filteredInterviews = filter === 'upcoming' ? upcomingInterviews : filter === 'past' ? pastInterviews : interviews;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Lịch phỏng vấn</h1>
            <p className="text-blue-100">Theo dõi và quản lý các buổi phỏng vấn của bạn</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
              <p className="text-sm text-gray-600">Tổng số phỏng vấn</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{upcomingInterviews.length}</p>
              <p className="text-sm text-gray-600">Sắp tới</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => i.status === 'COMPLETED').length}
              </p>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sắp tới
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Đã qua
          </button>
        </div>
      </div>

      {/* Interviews List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Danh sách phỏng vấn</h2>
        </div>

        <div className="p-6">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có lịch phỏng vấn</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Các buổi phỏng vấn sẽ xuất hiện ở đây sau khi bạn được mời phỏng vấn.
              </p>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Briefcase className="w-5 h-5" />
                Tìm việc làm
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInterviews.map((interview) => {
                const TypeIcon = getInterviewTypeIcon(interview.interview_type);
                const interviewDate = new Date(interview.scheduled_at);
                const isUpcoming = interviewDate > now && interview.status === 'SCHEDULED';

                return (
                  <div
                    key={interview.id}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      isUpcoming
                        ? 'border-blue-300 bg-blue-50/30 hover:shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-3">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                            isUpcoming ? 'bg-blue-600' : 'bg-gray-400'
                          }`}>
                            <TypeIcon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {interview.job_title || 'Phỏng vấn'}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    <span className="font-medium">{interview.company_name}</span>
                                  </div>
                                </div>
                              </div>
                              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(interview.status)}`}>
                                {getStatusLabel(interview.status)}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">
                                  {interviewDate.toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {interviewDate.toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TypeIcon className="w-4 h-4" />
                                <span>{getInterviewTypeLabel(interview.interview_type)}</span>
                              </div>
                              {interview.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Khoảng {interview.duration} phút</span>
                                </div>
                              )}
                            </div>
                            {interview.location && (
                              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                <MapPin className="w-4 h-4" />
                                <span>{interview.location}</span>
                              </div>
                            )}
                            {interview.notes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-700">
                                  <strong>Ghi chú:</strong> {interview.notes}
                                </p>
                              </div>
                            )}
                            {interview.feedback && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700">
                                  <strong>Phản hồi:</strong> {interview.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {interview.job && (
                        <Link
                          to={`/jobs/${interview.job}`}
                          className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex-shrink-0"
                        >
                          <FileText className="w-4 h-4" />
                          Xem công việc
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateInterviews;

