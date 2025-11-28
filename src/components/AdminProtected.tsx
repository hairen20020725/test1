import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminProtectedProps {
  children: React.ReactNode;
}

// 会话超时时间（2小时）
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

export function AdminProtected({ children }: AdminProtectedProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = sessionStorage.getItem('admin_logged_in');
      const loginTime = sessionStorage.getItem('admin_login_time');

      if (!isLoggedIn || !loginTime) {
        toast.error('请先登录');
        navigate('/admin/login');
        return;
      }

      // 检查会话是否过期
      const elapsed = Date.now() - parseInt(loginTime);
      if (elapsed > SESSION_TIMEOUT) {
        sessionStorage.removeItem('admin_logged_in');
        sessionStorage.removeItem('admin_login_time');
        toast.error('会话已过期，请重新登录');
        navigate('/admin/login');
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  return <>{children}</>;
}
