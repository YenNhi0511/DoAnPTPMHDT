import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import { UserPlus, Edit, Trash2, Search, X, Users, Mail, Phone, Building } from 'lucide-react';

const AdminInterviewers = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    position: '', // Chức vụ
    phone: '',
    password: '',
    role: 'INTERVIEWER'
  });

  useEffect(() => {
    fetchInterviewers();
  }, []);

  const fetchInterviewers = async () => {
    try {
      setLoading(true);
      const res = await getUsers({ role: 'INTERVIEWER' });
      setInterviewers(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error('Error fetching interviewers:', error);
      alert('Không thể tải danh sách thành viên hội đồng');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing user
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't send empty password
        }
        await updateUser(editingId, updateData);
        alert('✅ Đã cập nhật thành viên hội đồng thành công!');
      } else {
        // Create new user
        if (!formData.password) {
          alert('Vui lòng nhập mật khẩu');
          return;
        }
        await createUser(formData);
        alert('✅ Đã tạo thành viên hội đồng thành công!');
      }
      
      setShowCreateForm(false);
      setEditingId(null);
      setFormData({
        email: '',
        name: '',
        position: '',
        phone: '',
        password: '',
        role: 'INTERVIEWER'
      });
      fetchInterviewers();
    } catch (error) {
      console.error('Error saving interviewer:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error ||
                          error.response?.data?.email?.[0] ||
                          error.message || 
                          'Có lỗi xảy ra';
      alert(errorMessage);
    }
  };

  const handleEdit = (interviewer) => {
    setEditingId(interviewer.id);
    // Tách tên và chức vụ từ first_name (format: "Họ tên - Chức vụ")
    let name = '';
    let position = '';
    if (interviewer.first_name && ' - ' in interviewer.first_name) {
      const parts = interviewer.first_name.split(' - ');
      name = parts[0] || '';
      position = parts[1] || '';
    } else {
      name = interviewer.name || interviewer.first_name + ' ' + interviewer.last_name || '';
    }
    
    setFormData({
      email: interviewer.email,
      name: name,
      position: position,
      phone: interviewer.phone || '',
      password: '',
      role: interviewer.role || 'INTERVIEWER'
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên hội đồng này?')) return;
    
    try {
      await deleteUser(id);
      alert('✅ Đã xóa thành viên hội đồng thành công!');
      fetchInterviewers();
    } catch (error) {
      console.error('Error deleting interviewer:', error);
      alert('Không thể xóa thành viên hội đồng');
    }
  };

  const filteredInterviewers = interviewers.filter(interviewer => {
    const query = searchQuery.toLowerCase();
    const name = (interviewer.name || interviewer.first_name + ' ' + interviewer.last_name || '').toLowerCase();
    const email = (interviewer.email || '').toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý thành viên hội đồng</h1>
          <p className="text-gray-600 mt-1">Quản lý các thành viên có thể tham gia hội đồng tuyển dụng</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingId(null);
            setFormData({
              email: '',
              name: '',
              phone: '',
              password: '',
              role: 'INTERVIEWER'
            });
          }}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Thêm thành viên mới
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
          />
        </div>
      </div>

      {/* Interviewers List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Thành viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInterviewers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Chưa có thành viên hội đồng nào</p>
                    <p className="text-sm text-gray-500">Nhấn "Thêm thành viên mới" để tạo thành viên đầu tiên</p>
                  </td>
                </tr>
              ) : (
                filteredInterviewers.map((interviewer) => (
                  <tr key={interviewer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {interviewer.full_name_with_position || 
                             interviewer.name || 
                             (interviewer.first_name && interviewer.last_name ? `${interviewer.first_name} ${interviewer.last_name}` : interviewer.first_name || 'Chưa có tên')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {interviewer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {interviewer.phone || 'Chưa có'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                        {interviewer.role === 'INTERVIEWER' ? 'Thành viên hội đồng' : interviewer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(interviewer)}
                          className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(interviewer.id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
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

      {/* Create/Edit Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setShowCreateForm(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
              </h2>
              <button onClick={() => setShowCreateForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  required
                  disabled={!!editingId}
                />
                {editingId && <p className="text-xs text-gray-500 mt-1">Không thể thay đổi email</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu {!editingId && '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  required={!editingId}
                  placeholder={editingId ? 'Để trống nếu không đổi mật khẩu' : ''}
                />
              </div>
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  {editingId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInterviewers;

