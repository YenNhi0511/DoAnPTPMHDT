import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobForm from './pages/JobForm';
import JobDetail from './pages/JobDetail';
import Applications from './pages/Applications';
import Interviews from './pages/Interviews';
import InterviewPanels from './pages/InterviewPanels';
import Results from './pages/Results';
import Processes from './pages/Processes';
import Reports from './pages/Reports';
import Careers from './pages/Careers';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
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
    return <Navigate to="/dashboard" replace />;
  }

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
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/careers" element={<Careers />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Jobs */}
      <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/jobs/new" element={<ProtectedRoute roles={['ADMIN', 'RECRUITER']}><JobForm /></ProtectedRoute>} />
      <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
      <Route path="/jobs/:id/edit" element={<ProtectedRoute roles={['ADMIN', 'RECRUITER']}><JobForm /></ProtectedRoute>} />

      {/* Applications */}
      <Route path="/applications" element={<ProtectedRoute roles={['ADMIN', 'RECRUITER', 'INTERVIEWER']}><Applications /></ProtectedRoute>} />

      {/* Interviews */}
      <Route path="/interviews" element={<ProtectedRoute roles={['ADMIN', 'RECRUITER', 'INTERVIEWER']}><Interviews /></ProtectedRoute>} />

      {/* Interview Panels */}
      <Route path="/panels" element={<ProtectedRoute roles={['ADMIN', 'RECRUITER']}><InterviewPanels /></ProtectedRoute>} />

      {/* Results */}
      <Route path="/results" element={<ProtectedRoute roles={['ADMIN', 'RECRUITER']}><Results /></ProtectedRoute>} />

      {/* Processes */}
      <Route path="/processes" element={<ProtectedRoute roles={['ADMIN', 'RECRUITER']}><Processes /></ProtectedRoute>} />

      {/* Reports */}
      <Route path="/reports" element={<ProtectedRoute roles={['ADMIN', 'RECRUITER']}><Reports /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute roles={['ADMIN']}><AdminSettings /></ProtectedRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/careers" replace />} />
      <Route path="*" element={<Navigate to="/careers" replace />} />
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
