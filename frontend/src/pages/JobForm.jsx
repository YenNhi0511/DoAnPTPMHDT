import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createJob, updateJob, getJob, getProcesses } from '../services/api';
import { Briefcase, Save, ArrowLeft, AlertCircle } from 'lucide-react';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    salary: '',
    salary_min: '',
    salary_max: '',
    location: '',
    employment_type: 'FULLTIME',
    positions_count: 1,
    experience_years: '',
    status: 'DRAFT',
    deadline: '',
    recruitment_process: '',
  });
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const processRes = await getProcesses();
        setProcesses(Array.isArray(processRes.data) ? processRes.data : processRes.data.results || []);

        if (isEdit) {
          const jobRes = await getJob(id);
          const job = jobRes.data;
          setFormData({
            title: job.title || '',
            department: job.department || '',
            description: job.description || '',
            requirements: job.requirements || '',
            salary: job.salary || '',
            salary_min: job.salary_min || '',
            salary_max: job.salary_max || '',
            location: job.location || '',
            employment_type: job.employment_type || 'FULLTIME',
            positions_count: job.positions_count || 1,
            experience_years: job.experience_years || '',
            status: job.status || 'DRAFT',
            deadline: job.deadline ? job.deadline.slice(0, 16) : '',
            recruitment_process: job.recruitment_process || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = { ...formData };
      // Convert empty strings to null for optional fields
      if (!data.salary_min) data.salary_min = null;
      if (!data.salary_max) data.salary_max = null;
      if (!data.experience_years) data.experience_years = null;
      if (!data.recruitment_process) data.recruitment_process = null;

      if (isEdit) {
        await updateJob(id, data);
      } else {
        await createJob(data);
      }
      navigate('/jobs');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const firstError = Object.entries(errors)[0];
        setError(`${firstError[0]}: ${Array.isArray(firstError[1]) ? firstError[1][0] : firstError[1]}`);
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="page-header mb-0">
          <Briefcase className="w-8 h-8 text-blue-400" />
          {isEdit ? 'Chỉnh sửa việc làm' : 'Đăng tin tuyển dụng'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card">
          <h2 className="section-title">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Tiêu đề vị trí *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="VD: Senior Frontend Developer"
                required
              />
            </div>

            <div>
              <label className="label">Phòng ban</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input"
                placeholder="VD: Engineering"
              />
            </div>

            <div>
              <label className="label">Địa điểm *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="VD: Hồ Chí Minh"
                required
              />
            </div>

            <div>
              <label className="label">Loại hình công việc *</label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="FULLTIME">Toàn thời gian</option>
                <option value="PARTTIME">Bán thời gian</option>
                <option value="CONTRACT">Hợp đồng</option>
                <option value="INTERN">Thực tập</option>
              </select>
            </div>

            <div>
              <label className="label">Số lượng tuyển</label>
              <input
                type="number"
                name="positions_count"
                value={formData.positions_count}
                onChange={handleChange}
                className="input"
                min="1"
              />
            </div>

            <div>
              <label className="label">Kinh nghiệm (năm)</label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                className="input"
                placeholder="VD: 3"
                min="0"
              />
            </div>

            <div>
              <label className="label">Hạn nộp hồ sơ *</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="card">
          <h2 className="section-title">Mức lương</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Lương tối thiểu (VNĐ)</label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                className="input"
                placeholder="VD: 15000000"
              />
            </div>

            <div>
              <label className="label">Lương tối đa (VNĐ)</label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                className="input"
                placeholder="VD: 25000000"
              />
            </div>

            <div>
              <label className="label">Hoặc mô tả lương</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="input"
                placeholder="VD: Thỏa thuận, Cạnh tranh"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card">
          <h2 className="section-title">Mô tả công việc</h2>
          <div className="space-y-6">
            <div>
              <label className="label">Mô tả *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[150px]"
                placeholder="Mô tả chi tiết về vị trí công việc..."
                required
              />
            </div>

            <div>
              <label className="label">Yêu cầu công việc (JD) *</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="input min-h-[150px]"
                placeholder="- Tốt nghiệp đại học chuyên ngành CNTT&#10;- Có ít nhất 3 năm kinh nghiệm..."
                required
              />
            </div>
          </div>
        </div>

        {/* Process & Status */}
        <div className="card">
          <h2 className="section-title">Quy trình & Trạng thái</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Quy trình tuyển dụng</label>
              <select
                name="recruitment_process"
                value={formData.recruitment_process}
                onChange={handleChange}
                className="input"
              >
                <option value="">-- Chọn quy trình --</option>
                {processes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.is_default && '(Mặc định)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="DRAFT">Nháp</option>
                <option value="OPEN">Đang tuyển</option>
                <option value="CLOSED">Đã đóng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-ghost"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Đăng tin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;

