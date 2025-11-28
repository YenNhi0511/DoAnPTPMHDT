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
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">
          <ClipboardList className="w-8 h-8 text-blue-400" />
          Quy trình tuyển dụng
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', description: '', steps: [] });
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo quy trình mới
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="card w-full max-w-2xl my-8 animate-fade-in">
            <h2 className="section-title">{editingId ? 'Chỉnh sửa quy trình' : 'Tạo quy trình mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label">Tên quy trình *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="VD: Quy trình tuyển Developer"
                  required
                />
              </div>

              <div>
                <label className="label">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[80px]"
                  placeholder="Mô tả quy trình..."
                />
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="label mb-0">Các bước trong quy trình</label>
                  <button
                    type="button"
                    onClick={addStep}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Thêm bước
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <GripVertical className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">Bước {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="ml-auto text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="label text-xs">Tên bước</label>
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => updateStep(index, 'name', e.target.value)}
                            className="input py-2"
                            placeholder="VD: Phỏng vấn kỹ thuật"
                          />
                        </div>
                        <div>
                          <label className="label text-xs">Loại bước</label>
                          <select
                            value={step.step_type}
                            onChange={(e) => updateStep(index, 'step_type', e.target.value)}
                            className="input py-2"
                          >
                            {stepTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label text-xs">Thời gian (ngày)</label>
                          <input
                            type="number"
                            value={step.duration_days}
                            onChange={(e) => updateStep(index, 'duration_days', parseInt(e.target.value))}
                            className="input py-2"
                            min="1"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={step.is_required}
                              onChange={(e) => updateStep(index, 'is_required', e.target.checked)}
                              className="w-4 h-4 rounded border-gray-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-300">Bắt buộc</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.steps.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      Chưa có bước nào. Nhấn "Thêm bước" để bắt đầu.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : processes.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Chưa có quy trình nào</h3>
          <p className="text-gray-400">Tạo quy trình tuyển dụng đầu tiên của bạn</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {processes.map((process) => (
            <div key={process.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{process.name}</h3>
                    {process.is_default && (
                      <span className="badge badge-warning flex items-center gap-1">
                        <Star className="w-3 h-3" /> Mặc định
                      </span>
                    )}
                  </div>
                  {process.description && (
                    <p className="text-sm text-gray-400">{process.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {!process.is_default && (
                    <button
                      onClick={() => handleSetDefault(process.id)}
                      className="p-2 rounded-lg hover:bg-slate-700/50 text-yellow-400 hover:text-yellow-300"
                      title="Đặt làm mặc định"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(process)}
                    className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(process.id)}
                    className="p-2 rounded-lg hover:bg-slate-700/50 text-red-400 hover:text-red-300"
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
                      className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs font-medium text-blue-400">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{step.name}</p>
                        <p className="text-xs text-gray-400">
                          {stepTypes.find(t => t.value === step.step_type)?.label} • {step.duration_days} ngày
                        </p>
                      </div>
                      {step.is_required && (
                        <span className="text-xs text-orange-400">Bắt buộc</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-gray-400">
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

