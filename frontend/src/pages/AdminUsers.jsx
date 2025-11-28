import React, { useState, useEffect } from 'react';
import { getUsers, getUser } from '../services/api';
import {
  Users, Search, Filter, UserPlus, Edit, Trash2, Shield, UserCheck,
  Mail, Phone, Calendar, CheckCircle, XCircle, MoreVertical
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const roleLabels = {
    ADMIN: 'Quản trị viên',
    RECRUITER: 'Tuyển dụng',
    INTERVIEWER: 'Phỏng vấn',
    CANDIDATE: 'Ứng viên',
  };

  const roleColors = {
    ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
    RECRUITER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    INTERVIEWER: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    CANDIDATE: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const res = await getUser(userId);
      setSelectedUser(res.data);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const userStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'ADMIN').length,
    recruiter: users.filter(u => u.role === 'RECRUITER').length,
    interviewer: users.filter(u => u.role === 'INTERVIEWER').length,
    candidate: users.filter(u => u.role === 'CANDIDATE').length,
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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý người dùng</h1>
          <p className="text-gray-400">Quản lý tất cả người dùng trong hệ thống</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Thêm người dùng
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userStats.total}</p>
              <p className="text-sm text-gray-400">Tổng người dùng</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userStats.admin}</p>
              <p className="text-sm text-gray-400">Admin</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userStats.recruiter}</p>
              <p className="text-sm text-gray-400">Recruiter</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userStats.interviewer}</p>
              <p className="text-sm text-gray-400">Interviewer</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userStats.candidate}</p>
              <p className="text-sm text-gray-400">Candidate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo email, tên, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-11 w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="ADMIN">Admin</option>
              <option value="RECRUITER">Recruiter</option>
              <option value="INTERVIEWER">Interviewer</option>
              <option value="CANDIDATE">Candidate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Người dùng</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Vai trò</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Ngày tham gia</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Trạng thái</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.first_name?.[0] || user.email?.[0] || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-400">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`badge ${roleColors[user.role] || 'badge-gray'}`}>
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {user.date_joined
                          ? new Date(user.date_joined).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {user.is_active !== false ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-4 h-4" />
                          Vô hiệu hóa
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-red-400 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Chi tiết người dùng</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-700/50">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {selectedUser.first_name?.[0] || selectedUser.email?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <p className="text-gray-400">@{selectedUser.username}</p>
                  <span className={`badge mt-2 ${roleColors[selectedUser.role] || 'badge-gray'}`}>
                    {roleLabels[selectedUser.role] || selectedUser.role}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email</label>
                  <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{selectedUser.email}</span>
                  </div>
                </div>

                {selectedUser.phone && (
                  <div>
                    <label className="label">Số điện thoại</label>
                    <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{selectedUser.phone}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="label">Ngày tham gia</label>
                  <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-white">
                      {selectedUser.date_joined
                        ? new Date(selectedUser.date_joined).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="label">Đăng nhập lần cuối</label>
                  <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-white">
                      {selectedUser.last_login
                        ? new Date(selectedUser.last_login).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Chưa đăng nhập'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                <button className="btn-primary flex-1">Chỉnh sửa</button>
                <button className="btn-secondary flex-1">Đặt lại mật khẩu</button>
                <button className="btn-danger flex-1">Vô hiệu hóa</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

