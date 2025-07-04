import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/Container';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { authenticate, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 合并本地和认证上下文的加载状态
  const isLoading = localLoading || authLoading;
  
  // 获取用户想要访问的原始路径，如果没有则默认为/home
  const from = location.state?.from?.pathname || '/home';
  
  // 如果用户已登录，直接重定向到主页
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  // 添加键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && password.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [password, isLoading]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError(t('auth.passwordRequired'));
      return;
    }
    
    setLocalLoading(true);
    setError('');
    
    try {
      // 添加一个小延迟，模拟验证过程，增强用户体验
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const success = await authenticate(password);
      
      if (success) {
        // 认证成功，重定向到用户原本想访问的页面
        navigate(from, { replace: true });
      } else {
        // 认证失败
        setError(t('auth.passwordIncorrect'));
      }
    } catch (error) {
      console.error('认证过程出错:', error);
      setError('认证过程出错，请重试');
    } finally {
      setLocalLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <i className="fas fa-lock text-primary text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">
            {t('app.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            请输入访问密码继续
          </p>
        </div>
        
        <div className="bg-card dark:bg-gray-800/90 rounded-xl shadow-lg border border-border dark:border-gray-700 backdrop-blur-sm overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground dark:text-gray-200 block">
                  {t('auth.enterPassword')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="fas fa-key text-muted-foreground/70"></i>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary bg-background/80 dark:bg-gray-900/50 text-foreground dark:text-white dark:border-gray-700 transition-all"
                    placeholder={t('auth.passwordPlaceholder')}
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="bg-destructive/10 dark:bg-red-900/20 border border-destructive/20 dark:border-red-800/30 rounded-md p-2 mt-2">
                    <p className="text-destructive text-sm dark:text-red-400 flex items-center">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      {error}
                    </p>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className={`w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all transform active:scale-98 flex items-center justify-center ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    验证中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    {t('auth.login')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>安全加密连接 <i className="fas fa-lock text-xs ml-1"></i></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 