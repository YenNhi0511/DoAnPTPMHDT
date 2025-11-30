import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import CandidateLayout from './components/CandidateLayout';
import AdminLayout from './components/AdminLayout';
import RecruiterLayout from './components/RecruiterLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import Jobs from './pages/Jobs';
import JobForm from './pages/JobForm';
import JobDetail from './pages/JobDetail';
import Applications from './pages/Applications';
import InterviewPanels from './pages/InterviewPanels';
import Results from './pages/Results';
import Processes from './pages/Processes';
import Reports from './pages/Reports';
import Careers from './pages/Careers';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';
import Settings from './pages/Settings';
import SavedJobs from './pages/SavedJobs';
import CandidateInterviews from './pages/CandidateInterviews';
import Notifications from './pages/Notifications';
import CompanyPage from './pages/CompanyPage';
import RecruitmentPipeline from './pages/RecruitmentPipeline';
import AdminCompanies from './pages/AdminCompanies';
import AdminJobs from './pages/AdminJobs';
import AdminCandidates from './pages/AdminCandidates';

// Lấy role từ environment variable
const APP_ROLE = process.env.REACT_APP_ROLE || 'ALL';

// Protected Route Component - Sử dụng Layout phù hợp với role
const ProtectedRoute = ({ children, roles, useCandidateLayout = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect về dashboard phù hợp với role (3 roles chính)
    if (user.role === 'CANDIDATE') {
      return <Navigate to="/candidate/dashboard" replace />;
    } else if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'RECRUITER') {
      return <Navigate to="/dashboard" replace />;
    } else {
      // Role không hợp lệ, redirect về home
      return <Navigate to="/" replace />;
    }
  }

  // CANDIDATE sử dụng CandidateLayout (chỉ header/footer)
  // ADMIN sử dụng AdminLayout (header riêng, không footer)
  // RECRUITER sử dụng RecruiterLayout (header riêng, có footer)
  if (useCandidateLayout || user.role === 'CANDIDATE') {
    return <CandidateLayout>{children}</CandidateLayout>;
  }

  if (user.role === 'ADMIN') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (user.role === 'RECRUITER') {
    return <RecruiterLayout>{children}</RecruiterLayout>;
  }

  // Fallback
  return <Layout>{children}</Layout>;
};

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    // Redirect về dashboard phù hợp với role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'CANDIDATE') {
      return <Navigate to="/candidate/dashboard" replace />;
    } else if (user.role === 'RECRUITER') {
      return <Navigate to="/dashboard" replace />;
    } else {
      // ADMIN hoặc role khác
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

function AppRoutes() {
  // Hiển thị TẤT CẢ routes - Phân quyền dựa trên user đã đăng nhập
  // Cho phép chạy 3 roles trên cùng 1 port, test bằng cách đăng nhập với tài khoản khác nhau

  return (
    <Routes>
      {/* ============================================
          PUBLIC ROUTES (Không cần đăng nhập)
          ============================================ */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/companies/:id" element={<CompanyPage />} />

      {/* ============================================
          CANDIDATE ROUTES (Ứng viên)
          Phân quyền: ProtectedRoute sẽ check role của user
          ============================================ */}
      <Route 
        path="/candidate/dashboard" 
        element={<ProtectedRoute useCandidateLayout><CandidateDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/profile" 
        element={<ProtectedRoute useCandidateLayout><Profile /></ProtectedRoute>} 
      />
      <Route 
        path="/saved-jobs" 
        element={<ProtectedRoute useCandidateLayout><SavedJobs /></ProtectedRoute>} 
      />
      <Route 
        path="/interviews" 
        element={<ProtectedRoute useCandidateLayout><CandidateInterviews /></ProtectedRoute>} 
      />
      <Route 
        path="/notifications" 
        element={<ProtectedRoute useCandidateLayout><Notifications /></ProtectedRoute>} 
      />

      {/* ============================================
          RECRUITER ROUTES (Nhà tuyển dụng)
          Phân quyền: ProtectedRoute sẽ check role của user
          ============================================ */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute roles={['RECRUITER']}><Dashboard /></ProtectedRoute>} 
      />
      
      {/* Jobs Management */}
      <Route 
        path="/jobs" 
        element={<ProtectedRoute roles={['RECRUITER']}><Jobs /></ProtectedRoute>} 
      />
      <Route 
        path="/jobs/new" 
        element={<ProtectedRoute roles={['RECRUITER']}><JobForm /></ProtectedRoute>} 
      />
      <Route 
        path="/jobs/:id/edit" 
        element={<ProtectedRoute roles={['RECRUITER']}><JobForm /></ProtectedRoute>} 
      />

      {/* Applications */}
      <Route 
        path="/applications" 
        element={<ProtectedRoute roles={['RECRUITER']}><Applications /></ProtectedRoute>} 
      />

      {/* Recruitment Pipeline */}
      <Route 
        path="/pipeline" 
        element={<ProtectedRoute roles={['RECRUITER']}><RecruitmentPipeline /></ProtectedRoute>} 
      />


      {/* Interview Panels */}
      <Route 
        path="/panels" 
        element={<ProtectedRoute roles={['RECRUITER']}><InterviewPanels /></ProtectedRoute>} 
      />

      {/* Results */}
      <Route 
        path="/results" 
        element={<ProtectedRoute roles={['RECRUITER']}><Results /></ProtectedRoute>} 
      />

      {/* Processes */}
      <Route 
        path="/processes" 
        element={<ProtectedRoute roles={['RECRUITER']}><Processes /></ProtectedRoute>} 
      />

      {/* Reports */}
      <Route 
        path="/reports" 
        element={<ProtectedRoute roles={['RECRUITER']}><Reports /></ProtectedRoute>} 
      />

      {/* Settings */}
      <Route 
        path="/settings" 
        element={<ProtectedRoute roles={['RECRUITER']}><Settings /></ProtectedRoute>} 
      />

      {/* ============================================
          ADMIN ROUTES (Quản trị hệ thống)
          Phân quyền: ProtectedRoute sẽ check role của user
          ============================================ */}
      <Route 
        path="/admin/dashboard" 
        element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/users" 
        element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/settings" 
        element={<ProtectedRoute roles={['ADMIN']}><AdminSettings /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/companies" 
        element={<ProtectedRoute roles={['ADMIN']}><AdminCompanies /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/jobs" 
        element={<ProtectedRoute roles={['ADMIN']}><AdminJobs /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/candidates" 
        element={<ProtectedRoute roles={['ADMIN']}><AdminCandidates /></ProtectedRoute>} 
      />

      {/* ============================================
          DEFAULT REDIRECT
          ============================================ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
