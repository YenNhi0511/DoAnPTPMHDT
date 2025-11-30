import React, { useState, useEffect } from 'react';
import { getJobStats } from '../services/api';
import {
  BarChart3, TrendingUp, Users, Briefcase, Award, Clock,
  Download, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getJobStats();
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [dateRange]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const statusLabels = {
    PENDING: 'Chờ xử lý',
    SCREENING: 'Đang sàng lọc',
    INTERVIEW: 'Phỏng vấn',
    OFFER: 'Đã gửi offer',
    REJECTED: 'Từ chối',
    ACCEPTED: 'Đã nhận việc',
  };

  const exportReport = () => {
    if (!stats) return;
    
    const reportData = {
      generated_at: new Date().toISOString(),
      summary: {
        total_jobs: stats.total_jobs,
        open_jobs: stats.open_jobs,
        closed_jobs: stats.closed_jobs,
        total_applications: stats.total_applications,
        total_interviews: stats.total_interviews,
        total_offers: stats.total_offers,
        conversion_rate: stats.conversion_rate,
      },
      status_distribution: stats.status_stats,
      monthly_applications: stats.monthly_stats,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recruitment-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo thống kê</h1>
          <p className="text-gray-600">Thống kê và phân tích hiệu quả tuyển dụng</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white"
          >
            <option value="all">Tất cả</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <button 
            onClick={exportReport} 
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Cards - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.total_jobs || 0}</p>
          <p className="text-gray-600 text-sm font-medium">Tổng việc làm</p>
          <div className="mt-2 text-sm">
            <span className="text-green-600 font-medium">{stats?.open_jobs || 0} đang tuyển</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-600">{stats?.closed_jobs || 0} đã đóng</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.total_applications || 0}</p>
          <p className="text-gray-600 text-sm font-medium">Tổng hồ sơ ứng tuyển</p>
          {stats?.avg_ai_score && (
            <div className="mt-2 text-sm text-blue-600 font-medium">
              Điểm AI trung bình: {stats.avg_ai_score.toFixed(1)}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.total_interviews || 0}</p>
          <p className="text-gray-600 text-sm font-medium">Tổng buổi phỏng vấn</p>
          <div className="mt-2 text-sm text-green-600 font-medium">
            {stats?.completed_interviews || 0} đã hoàn thành
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.conversion_rate || 0}%</p>
          <p className="text-gray-600 text-sm font-medium">Tỷ lệ tuyển dụng thành công</p>
          <div className="mt-2 text-sm">
            <span className="text-green-600 font-medium">{stats?.total_offers || 0} offers</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-red-600 font-medium">{stats?.total_rejects || 0} từ chối</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Phân bố trạng thái hồ sơ</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.status_stats?.map(s => ({
                    name: statusLabels[s.status] || s.status,
                    value: s.count
                  })) || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {stats?.status_stats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#111827', fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {stats?.status_stats?.map((s, idx) => (
              <div key={s.status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-sm text-gray-600 font-medium">{statusLabels[s.status] || s.status}: {s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Xu hướng ứng tuyển theo tháng</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthly_stats?.map(m => ({
                month: new Date(m.month).toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' }),
                count: m.count
              })) || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#111827', fontWeight: '600' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  name="Số hồ sơ"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Jobs Performance */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Hiệu suất theo vị trí tuyển dụng</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats?.jobs_stats?.map(j => ({
                name: j.title?.length > 20 ? j.title.substring(0, 20) + '...' : j.title,
                applications: j.app_count,
                positions: j.positions_count,
              })) || []}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={150} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ color: '#111827', fontWeight: '600' }}
              />
              <Legend />
              <Bar dataKey="applications" fill="#3b82f6" name="Số ứng viên" radius={[0, 4, 4, 0]} />
              <Bar dataKey="positions" fill="#10b981" name="Số vị trí cần tuyển" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Tổng hợp số liệu</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 bg-gray-50 text-gray-700 font-semibold text-sm uppercase tracking-wider">Chỉ số</th>
                <th className="px-6 py-4 bg-gray-50 text-gray-700 font-semibold text-sm uppercase tracking-wider">Giá trị</th>
                <th className="px-6 py-4 bg-gray-50 text-gray-700 font-semibold text-sm uppercase tracking-wider">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">Tổng số việc làm</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{stats?.total_jobs || 0}</td>
                <td className="px-6 py-4 text-gray-600">Bao gồm tất cả trạng thái</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">Việc làm đang tuyển</td>
                <td className="px-6 py-4 font-semibold text-green-600">{stats?.open_jobs || 0}</td>
                <td className="px-6 py-4 text-gray-600">Đang nhận hồ sơ</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">Tổng hồ sơ ứng tuyển</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{stats?.total_applications || 0}</td>
                <td className="px-6 py-4 text-gray-600">Tất cả hồ sơ đã nhận</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">Điểm AI trung bình</td>
                <td className="px-6 py-4 font-semibold text-blue-600">{stats?.avg_ai_score?.toFixed(1) || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600">Điểm đánh giá tự động</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">Tổng buổi phỏng vấn</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{stats?.total_interviews || 0}</td>
                <td className="px-6 py-4 text-gray-600">{stats?.completed_interviews || 0} đã hoàn thành</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">Số offer đã gửi</td>
                <td className="px-6 py-4 font-semibold text-green-600">{stats?.total_offers || 0}</td>
                <td className="px-6 py-4 text-gray-600">Ứng viên được chọn</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">Tỷ lệ tuyển dụng</td>
                <td className="px-6 py-4 font-semibold text-purple-600">{stats?.conversion_rate || 0}%</td>
                <td className="px-6 py-4 text-gray-600">Offer / Tổng hồ sơ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
