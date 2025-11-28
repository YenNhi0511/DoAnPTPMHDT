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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">
          <BarChart3 className="w-8 h-8 text-blue-400" />
          Báo cáo thống kê
        </h1>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input w-40"
          >
            <option value="all">Tất cả</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <button onClick={exportReport} className="btn-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats?.total_jobs || 0}</p>
          <p className="text-gray-400 text-sm">Tổng việc làm</p>
          <div className="mt-2 text-sm">
            <span className="text-green-400">{stats?.open_jobs || 0} đang tuyển</span>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-gray-400">{stats?.closed_jobs || 0} đã đóng</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats?.total_applications || 0}</p>
          <p className="text-gray-400 text-sm">Tổng hồ sơ ứng tuyển</p>
          {stats?.avg_ai_score && (
            <div className="mt-2 text-sm text-blue-400">
              Điểm AI trung bình: {stats.avg_ai_score.toFixed(1)}
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats?.total_interviews || 0}</p>
          <p className="text-gray-400 text-sm">Tổng buổi phỏng vấn</p>
          <div className="mt-2 text-sm text-green-400">
            {stats?.completed_interviews || 0} đã hoàn thành
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats?.conversion_rate || 0}%</p>
          <p className="text-gray-400 text-sm">Tỷ lệ tuyển dụng thành công</p>
          <div className="mt-2 text-sm">
            <span className="text-green-400">{stats?.total_offers || 0} offers</span>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-red-400">{stats?.total_rejects || 0} từ chối</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="card">
          <h3 className="section-title">Phân bố trạng thái hồ sơ</h3>
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
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {stats?.status_stats?.map((s, idx) => (
              <div key={s.status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-sm text-gray-400">{statusLabels[s.status] || s.status}: {s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card">
          <h3 className="section-title">Xu hướng ứng tuyển theo tháng</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthly_stats?.map(m => ({
                month: new Date(m.month).toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' }),
                count: m.count
              })) || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
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
      <div className="card">
        <h3 className="section-title">Hiệu suất theo vị trí tuyển dụng</h3>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={150} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="applications" fill="#3b82f6" name="Số ứng viên" radius={[0, 4, 4, 0]} />
              <Bar dataKey="positions" fill="#10b981" name="Số vị trí cần tuyển" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="card">
        <h3 className="section-title">Tổng hợp số liệu</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Chỉ số</th>
                <th>Giá trị</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tổng số việc làm</td>
                <td className="font-semibold text-white">{stats?.total_jobs || 0}</td>
                <td className="text-gray-400">Bao gồm tất cả trạng thái</td>
              </tr>
              <tr>
                <td>Việc làm đang tuyển</td>
                <td className="font-semibold text-green-400">{stats?.open_jobs || 0}</td>
                <td className="text-gray-400">Đang nhận hồ sơ</td>
              </tr>
              <tr>
                <td>Tổng hồ sơ ứng tuyển</td>
                <td className="font-semibold text-white">{stats?.total_applications || 0}</td>
                <td className="text-gray-400">Tất cả hồ sơ đã nhận</td>
              </tr>
              <tr>
                <td>Điểm AI trung bình</td>
                <td className="font-semibold text-blue-400">{stats?.avg_ai_score?.toFixed(1) || 'N/A'}</td>
                <td className="text-gray-400">Điểm đánh giá tự động</td>
              </tr>
              <tr>
                <td>Tổng buổi phỏng vấn</td>
                <td className="font-semibold text-white">{stats?.total_interviews || 0}</td>
                <td className="text-gray-400">{stats?.completed_interviews || 0} đã hoàn thành</td>
              </tr>
              <tr>
                <td>Số offer đã gửi</td>
                <td className="font-semibold text-green-400">{stats?.total_offers || 0}</td>
                <td className="text-gray-400">Ứng viên được chọn</td>
              </tr>
              <tr>
                <td>Tỷ lệ tuyển dụng</td>
                <td className="font-semibold text-purple-400">{stats?.conversion_rate || 0}%</td>
                <td className="text-gray-400">Offer / Tổng hồ sơ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

