import React, { useState } from 'react';
import { FileText, Upload, AlertCircle, CheckCircle, X } from 'lucide-react';

const BusinessRegistration = () => {
  const [uploadMethod, setUploadMethod] = useState('business_registration'); // business_registration, authorization
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File không được vượt quá 5MB' });
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
        setMessage({ type: 'error', text: 'Chỉ chấp nhận file: jpeg, jpg, png, pdf' });
        return;
      }
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setMessage({ type: '', text: '' });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Vui lòng chọn file để upload' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: Implement API call to upload business registration
      // const formData = new FormData();
      // formData.append('document', file);
      // formData.append('upload_method', uploadMethod);
      // await uploadBusinessRegistration(formData);
      
      setMessage({ type: 'success', text: 'Upload thành công! Đang chờ xác thực...' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Upload thất bại. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Thông tin Giấy đăng ký doanh nghiệp
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Vui lòng lựa chọn phương thức đăng tải,{' '}
        <a href="#" className="text-green-600 hover:underline">xem hướng dẫn đăng tải</a>
      </p>

      {message.text && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Phương thức đăng tải
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg hover:border-green-300 transition-colors">
              <input
                type="radio"
                name="upload_method"
                value="business_registration"
                checked={uploadMethod === 'business_registration'}
                onChange={(e) => setUploadMethod(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Giấy đăng ký doanh nghiệp hoặc Giấy tờ tương đương khác
                </span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg hover:border-green-300 transition-colors">
              <input
                type="radio"
                name="upload_method"
                value="authorization"
                checked={uploadMethod === 'authorization'}
                onChange={(e) => setUploadMethod(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Giấy ủy quyền và Giấy tờ định danh
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giấy tờ <span className="text-red-500">*</span>
          </label>
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                accept=".jpeg,.jpg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Chọn hoặc kéo file vào đây
                </p>
                <p className="text-xs text-gray-500">
                  Dung lượng tối đa 5MB, định dạng: jpeg, jpg, png, pdf
                </p>
                <button
                  type="button"
                  className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Chọn file
                </button>
              </label>
            </div>
          ) : (
            <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Warnings */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <p className="text-sm text-orange-700">
              Các văn bản đăng tải cần đầy đủ các mặt và không có dấu hiệu chỉnh sửa/ che/ cắt thông tin
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <p className="text-sm text-orange-700">
              Vui lòng đăng tải Giấy đăng ký doanh nghiệp có thông tin trùng khớp với dữ liệu của doanh nghiệp theo Trang thông tin điện tử của Cục Thuế
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex justify-center">
          <div className="w-64 h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-500">Minh họa</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setFilePreview(null);
              setMessage({ type: '', text: '' });
            }}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !file}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessRegistration;

