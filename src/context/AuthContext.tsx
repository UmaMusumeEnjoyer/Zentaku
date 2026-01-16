// src/context/AuthContext.tsx
import  { createContext, useContext, useEffect, useRef, type ReactNode, useMemo, useState } from 'react';
import { useAuth as useSharedAuth, type UseAuthReturn } from '@umamusumeenjoyer/shared-logic';
import { authService } from '@umamusumeenjoyer/shared-logic';

interface AuthContextType extends UseAuthReturn {
  isInitializing: boolean;
}
const AuthContext = createContext< AuthContextType | null>(null);




export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authLogic = useSharedAuth();
  const refreshTimerRef = useRef<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Hàm refresh token thủ công
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;

      const response = await authService.refreshToken(refreshToken);
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;

      localStorage.setItem('authToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh token:', error);
      authLogic.logout();
    }
  };

  // Setup timer để refresh token định kỳ (mỗi 25 phút nếu token hết hạn sau 30 phút)
  const setupRefreshTimer = () => {
    // Clear timer cũ nếu có
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    // Refresh mỗi 25 phút (trước khi token hết hạn)
    refreshTimerRef.current = window.setInterval(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        refreshAccessToken();
      }
    }, 10 * 60 * 1000); // 25 phút
  };

  // Khôi phục phiên đăng nhập khi F5
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('username');

      try{
        if (token && username && !authLogic.user) {
          await authLogic.fetchUserInfo(username);
          setupRefreshTimer();
        }
      } catch(error){
        console.error("Lỗi khôi phục phiên đăng nhập:", error);
      } finally{
        setIsInitializing(false);
      }
    };

    // Lắng nghe event logout từ apiClient
    const handleLogout = () => {
      authLogic.logout();
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };

    window.addEventListener('auth:logout', handleLogout);
    initAuth();

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Setup timer khi user login
  useEffect(() => {
    if (authLogic.user) {
      setupRefreshTimer();
    } else {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLogic.user]);

  const contextValue = useMemo(() => ({
    ...authLogic,
    // Explicitly include user to ensure it's in dependencies
    user: authLogic.user,
    isInitializing
  }), [authLogic, authLogic.user, isInitializing]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};