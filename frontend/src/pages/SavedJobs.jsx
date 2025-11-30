import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart, MapPin, Briefcase, Calendar, DollarSign, Building2,
  Trash2, Eye, Clock, TrendingUp, Search
} from 'lucide-react';

const SavedJobs = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API call to get saved jobs
    // For now, using localStorage as placeholder
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
    setLoading(false);
  }, []);

  const handleRemoveSaved = (jobId) => {
    const updated = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updated);
    localStorage.setItem('savedJobs', JSON.stringify(updated));
  };

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
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Việc làm đã lưu</h1>
            <p className="text-blue-100">Quản lý các công việc bạn đã lưu để xem lại sau</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
              <p className="text-sm text-gray-600">Tổng số việc đã lưu</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {savedJobs.filter(job => new Date(job.deadline) > new Date()).length}
              </p>
              <p className="text-sm text-gray-600">Còn hạn nộp hồ sơ</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {savedJobs.filter(job => job.is_featured).length}
              </p>
              <p className="text-sm text-gray-600">Việc làm nổi bật</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Jobs List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Danh sách việc làm đã lưu</h2>
        </div>

        <div className="p-6">
          {savedJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có việc làm đã lưu</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Bắt đầu lưu các công việc bạn quan tâm để xem lại sau. Hãy tìm kiếm và lưu công việc đầu tiên!
              </p>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                Tìm việc làm ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <Link
                                to={`/jobs/${job.id}`}
                                className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors block"
                              >
                                {job.title}
                              </Link>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  <span className="font-medium">{job.company_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{job.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
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
                                <Briefcase className="w-4 h-4" />
                                <span>{job.experience_years} năm kinh nghiệm</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                          {job.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {job.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </Link>
                      <button
                        onClick={() => handleRemoveSaved(job.id)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Bỏ lưu
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;

