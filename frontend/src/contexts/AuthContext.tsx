import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  authenticate: async () => false,
  logout: () => {},
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // 检查本地存储中是否有认证标记
    return localStorage.getItem('auth_token') === 'authenticated';
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // 从环境变量获取密码的备用值
  const fallbackPassword = import.meta.env.VITE_AUTH_PASSWORD || '123456';
  
  // 获取最新的密码配置
  const getServerPassword = async (): Promise<string> => {
    try {
      // 尝试从服务器获取密码配置
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.config && data.config.authPassword) {
          return data.config.authPassword;
        }
      }
    } catch (error) {
      console.error('获取密码配置失败:', error);
    }
    
    // 如果获取失败，使用备用密码
    return fallbackPassword;
  };

  // 认证函数
  const authenticate = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 获取最新的密码配置
      const correctPassword = await getServerPassword();
      
      if (password === correctPassword) {
        setIsAuthenticated(true);
        localStorage.setItem('auth_token', 'authenticated');
        return true;
      }
      return false;
    } catch (error) {
      console.error('认证失败:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
  };

  // 提供上下文值
  const value = {
    isAuthenticated,
    authenticate,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 