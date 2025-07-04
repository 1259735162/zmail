import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { MailboxProvider } from './contexts/MailboxContext';
import { AuthProvider } from './contexts/AuthContext';

// 主应用路由组件
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 登录路由 */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 受保护的路由 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
      
      {/* 默认路由 - ProtectedRoute组件会根据登录状态自动处理重定向 */}
      <Route path="/" element={<ProtectedRoute><Navigate to="/home" replace /></ProtectedRoute>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MailboxProvider>
        <div className="min-h-screen bg-background">
          <AppRoutes />
        </div>
      </MailboxProvider>
    </AuthProvider>
  );
};

export default App;
