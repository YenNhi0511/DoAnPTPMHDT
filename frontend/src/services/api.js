import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để refresh token khi hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (email, password) => api.post('/users/login/', { email, password });
export const register = (data) => api.post('/users/register/', data);
export const getMe = () => api.get('/users/me/');
export const changePassword = (data) => api.post('/users/change_password/', data);

// Jobs APIs
export const getJobs = (params) => api.get('/jobs/', { params });
export const getJob = (id) => api.get(`/jobs/${id}/`);
export const createJob = (data) => api.post('/jobs/', data);
export const updateJob = (id, data) => api.patch(`/jobs/${id}/`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}/`);
export const publishJob = (id) => api.post(`/jobs/${id}/publish/`);
export const closeJob = (id) => api.post(`/jobs/${id}/close/`);
export const getJobStats = () => api.get('/jobs/stats/');
export const getJobApplications = (id) => api.get(`/jobs/${id}/applications/`);

// Applications APIs
export const getApplications = (params) => api.get('/applications/', { params });
export const getApplication = (id) => api.get(`/applications/${id}/`);
export const createApplication = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return api.post('/applications/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const applyToJob = (jobId, data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return api.post(`/jobs/${jobId}/apply/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateApplicationStatus = (id, data) => api.patch(`/applications/${id}/update_status/`, data);
export const screenApplication = (id) => api.post(`/applications/${id}/screen/`);

// Interviews APIs
export const getInterviews = (params) => api.get('/interviews/', { params });
export const getInterview = (id) => api.get(`/interviews/${id}/`);
export const createInterview = (data) => api.post('/interviews/', data);
export const updateInterview = (id, data) => api.patch(`/interviews/${id}/`, data);
export const deleteInterview = (id) => api.delete(`/interviews/${id}/`);
export const submitInterviewFeedback = (id, data) => api.post(`/interviews/${id}/submit_feedback/`, data);

// Interview Panels APIs
export const getInterviewPanels = (params) => api.get('/interview-panels/', { params });
export const createInterviewPanel = (data) => api.post('/interview-panels/', data);
export const updateInterviewPanel = (id, data) => api.patch(`/interview-panels/${id}/`, data);
export const deleteInterviewPanel = (id) => api.delete(`/interview-panels/${id}/`);

// Results APIs
export const getResults = (params) => api.get('/results/', { params });
export const getResult = (id) => api.get(`/results/${id}/`);
export const createResult = (data) => api.post('/results/', data);
export const updateResult = (id, data) => api.patch(`/results/${id}/`, data);
export const sendResultEmail = (id) => api.post(`/results/${id}/send_email/`);
export const generateOffer = (id) => api.post(`/results/${id}/generate_offer/`);

// Recruitment Process APIs
export const getProcesses = (params) => api.get('/processes/', { params });
export const getProcess = (id) => api.get(`/processes/${id}/`);
export const createProcess = (data) => api.post('/processes/', data);
export const updateProcess = (id, data) => api.patch(`/processes/${id}/`, data);
export const deleteProcess = (id) => api.delete(`/processes/${id}/`);
export const setDefaultProcess = (id) => api.post(`/processes/${id}/set_default/`);
export const getDefaultProcess = () => api.get('/processes/default/');
export const addProcessStep = (id, data) => api.post(`/processes/${id}/add_step/`, data);

// Notifications APIs
export const getNotifications = (params) => api.get('/notifications/', { params });
export const markNotificationRead = (id) => api.post(`/notifications/${id}/mark_read/`);
export const markAllNotificationsRead = () => api.post('/notifications/mark_all_read/');

// Users APIs
export const getUsers = (params) => api.get('/users/', { params });
export const getUser = (id) => api.get(`/users/${id}/`);

export default api;
