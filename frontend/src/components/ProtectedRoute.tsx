import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 如果用户未认证，重定向到登录页面，并记住用户想要访问的页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果用户已认证，渲染子组件或 Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute; 