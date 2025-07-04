import React, { useEffect, useState } from 'react';

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // 检查本地存储
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      
      // 如果没有保存的主题，检查系统偏好
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    return 'light'; // 默认为亮色主题
  });

  useEffect(() => {
    // 更新文档类名和本地存储
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-primary/20 hover:text-primary hover:scale-110"
      aria-label="切换主题"
      title="切换主题"
    >
      {theme === 'light' ? (
        <i className="fas fa-moon text-base"></i>
      ) : (
        <i className="fas fa-sun text-base"></i>
      )}
    </button>
  );
};

export default ThemeSwitcher; 