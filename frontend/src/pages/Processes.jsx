import React, { useState, useEffect } from 'react';
import { getProcesses, createProcess, updateProcess, deleteProcess, setDefaultProcess } from '../services/api';
import {
  ClipboardList, Plus, Edit, Trash2, Star, Check, GripVertical
} from 'lucide-react';

const Processes = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    steps: [],
  });

  const stepTypes = [
    { value: 'SCREENING', label: 'Sàng lọc hồ sơ' },
    { value: 'PHONE_INTERVIEW', label: 'Phỏng vấn điện thoại' },
    { value: 'TECHNICAL_TEST', label: 'Bài test kỹ thuật' },
    { value: 'INTERVIEW', label: 'Phỏng vấn' },
    { value: 'FINAL_INTERVIEW', label: 'Phỏng vấn cuối' },
    { value: 'OFFER', label: 'Gửi offer' },
    { value: 'ONBOARDING', label: 'Onboarding' },
  ];

  const fetchData = async () => {
    try {
      const res = await getProcesses();
      setProcesses(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error('Error fetching processes:', error);
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
        await updateProcess(editingId, formData);
      } else {
        await createProcess(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', steps: [] });
      fetchData();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const handleEdit = (process) => {
    setFormData({
      name: process.name,
      description: process.description || '',
      steps: process.steps || [],
    });
    setEditingId(process.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quy trình này?')) {
      try {
        await deleteProcess(id);
        fetchData();
      } catch (error) {
        alert('Không thể xóa');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultProcess(id);
      fetchData();
    } catch (error) {
      alert('Không thể đặt làm mặc định');
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        { name: '', step_type: 'SCREENING', description: '', duration_days: 7, is_required: true },
      ],
    });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quy trình tuyển dụng</h1>
          <p className="text-gray-600">Quản lý các quy trình tuyển dụng</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', description: '', steps: [] });
          }}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo quy trình mới
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Chỉnh sửa quy trình' : 'Tạo quy trình mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên quy trình *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white"
                  placeholder="VD: Quy trình tuyển Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white min-h-[80px]"
                  placeholder="Mô tả quy trình..."
                />
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Các bước trong quy trình</label>
                  <button
                    type="button"
                    onClick={addStep}
                    className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-4 h-4" /> Thêm bước
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">Bước {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="ml-auto text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Tên bước</label>
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => updateStep(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white text-sm"
                            placeholder="VD: Phỏng vấn kỹ thuật"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Loại bước</label>
                          <select
                            value={step.step_type}
                            onChange={(e) => updateStep(index, 'step_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white text-sm"
                          >
                            {stepTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Thời gian (ngày)</label>
                          <input
                            type="number"
                            value={step.duration_days}
                            onChange={(e) => updateStep(index, 'duration_days', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white text-sm"
                            min="1"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={step.is_required}
                              onChange={(e) => updateStep(index, 'is_required', e.target.checked)}
                              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">Bắt buộc</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.steps.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                      Chưa có bước nào. Nhấn "Thêm bước" để bắt đầu.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  {editingId ? 'Cập nhật' : 'Tạo quy trình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Processes List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : processes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 text-center py-12">
          <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có quy trình nào</h3>
          <p className="text-gray-600">Tạo quy trình tuyển dụng đầu tiên của bạn</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {processes.map((process) => (
            <div key={process.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{process.name}</h3>
                    {process.is_default && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                        <Star className="w-3 h-3" /> Mặc định
                      </span>
                    )}
                  </div>
                  {process.description && (
                    <p className="text-sm text-gray-600">{process.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {!process.is_default && (
                    <button
                      onClick={() => handleSetDefault(process.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-yellow-600 hover:text-yellow-700 transition-colors"
                      title="Đặt làm mặc định"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(process)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(process.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Steps */}
              {process.steps && process.steps.length > 0 && (
                <div className="space-y-2">
                  {process.steps.map((step, index) => (
                    <div
                      key={step.id || index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">{step.name}</p>
                        <p className="text-xs text-gray-600">
                          {stepTypes.find(t => t.value === step.step_type)?.label} • {step.duration_days} ngày
                        </p>
                      </div>
                      {step.is_required && (
                        <span className="text-xs text-orange-600 font-medium">Bắt buộc</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                Tạo bởi: {process.created_by_name} • {new Date(process.created_at).toLocaleDateString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Processes;
