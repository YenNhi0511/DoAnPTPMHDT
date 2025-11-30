import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Option để enable/disable sync giữa các tab
  // Set false để mỗi tab hoạt động độc lập (phù hợp cho demo)
  const SYNC_BETWEEN_TABS = false; // true = sync, false = independent

  // Load user từ token khi component mount
  const loadUser = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const res = await getMe();
        setUser(res.data);
      } catch (error) {
        // Token invalid, clear storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();

    if (SYNC_BETWEEN_TABS) {
      // Listen for storage changes (khi login/logout ở tab khác)
      // Chỉ enable nếu muốn sync giữa các tab
      const handleStorageChange = (e) => {
        if (e.key === 'access_token' || e.key === 'refresh_token') {
          loadUser();
        }
      };

      // Listen for custom storage event (same-tab updates)
      const handleCustomStorage = (e) => {
        if (e.detail?.key === 'access_token' || e.detail?.key === 'refresh_token') {
          loadUser();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('auth-storage-change', handleCustomStorage);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('auth-storage-change', handleCustomStorage);
      };
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      
      // Kiểm tra response có đầy đủ không
      if (!response.data || !response.data.access) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setUser(response.data.user);
      
      // Notify other tabs about auth change (chỉ nếu sync enabled)
      if (SYNC_BETWEEN_TABS) {
        window.dispatchEvent(new CustomEvent('auth-storage-change', {
          detail: { key: 'access_token' }
        }));
      }
      
      return response.data;
    } catch (error) {
      // Re-throw để component có thể xử lý
      throw error;
    }
  };

  const register = async (data) => {
    const response = await apiRegister(data);
    // KHÔNG tự động đăng nhập nếu cần verify email
    // User phải verify email trước khi có thể login
    if (response.data && response.data.requires_verification) {
      // Không tự động login, user cần verify email trước
      return response.data;
    }
    
    // Nếu không cần verify (trường hợp đặc biệt), mới tự động login
    if (response.data && response.data.user && !response.data.requires_verification) {
      try {
        // Login để lấy token
        const loginResponse = await apiLogin(data.email, data.password);
        if (loginResponse.data) {
          localStorage.setItem('access_token', loginResponse.data.access);
          localStorage.setItem('refresh_token', loginResponse.data.refresh);
          setUser(loginResponse.data.user || response.data.user);
          
          // Notify other tabs about auth change (chỉ nếu sync enabled)
          if (SYNC_BETWEEN_TABS) {
            window.dispatchEvent(new CustomEvent('auth-storage-change', {
              detail: { key: 'access_token' }
            }));
          }
        }
      } catch (err) {
        console.error('Auto-login after registration failed:', err);
        // Vẫn return success, user có thể login thủ công
      }
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    
    // Notify other tabs about logout (chỉ nếu sync enabled)
    if (SYNC_BETWEEN_TABS) {
      window.dispatchEvent(new CustomEvent('auth-storage-change', {
        detail: { key: 'access_token' }
      }));
    }
  };

  // 3 Roles chính:
  // 1. ADMIN - Quản lý hệ thống
  // 2. CANDIDATE - Ứng viên tìm việc
  // 3. RECRUITER - Nhà tuyển dụng (doanh nghiệp/cá nhân)
  
  const isAdmin = user?.role === 'ADMIN';
  const isCandidate = user?.role === 'CANDIDATE';
  const isRecruiter = user?.role === 'RECRUITER';
  // ADMIN cũng có thể làm recruiter (quản lý việc làm)
  const isRecruiterOrAdmin = isRecruiter || isAdmin;

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      login, 
      register, 
      logout, 
      isAdmin,
      isCandidate,
      isRecruiter,
      isRecruiterOrAdmin, // Helper để check quyền recruiter (bao gồm cả ADMIN)
      // Backward compatibility
      isRecruiter: isRecruiterOrAdmin,
      isInterviewer: isRecruiterOrAdmin, // INTERVIEWER được xử lý như RECRUITER
    }}>
      {children}
    </AuthContext.Provider>
  );
};

