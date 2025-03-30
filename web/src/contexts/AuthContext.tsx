'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// 用户类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  teams?: Team[];
  currentTeam?: string;
}

// 团队类型定义
export interface Team {
  id: string;
  name: string;
  role: string;
}

// 认证上下文类型定义
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  switchTeam: (teamId: string) => void;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 初始化验证状态
  useEffect(() => {
    const initAuth = () => {
      try {
        // 从localStorage获取用户信息
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 检查是否需要认证
  useEffect(() => {
    // 跳过认证页面
    if (pathname?.startsWith('/auth/') || loading) {
      return;
    }

    // 如果用户未登录且不在认证页面，重定向到登录页
    if (!user && !pathname?.startsWith('/auth/')) {
      router.push('/auth/login');
    }
  }, [user, pathname, loading, router]);

  // 登录函数
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // 这里应该调用实际的登录API
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟登录成功
      const userData: User = {
        id: '1',
        name: '测试用户',
        email,
        role: 'sales',
        teams: [
          { id: '1', name: '销售一组', role: 'member' },
          { id: '2', name: '销售二组', role: 'admin' },
        ],
        currentTeam: '1'
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('登录失败，请检查您的账号和密码');
    } finally {
      setLoading(false);
    }
  };

  // 注册函数
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // 这里应该调用实际的注册API
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟注册成功
      const userData: User = {
        id: '1',
        name,
        email,
        role: 'sales',
        teams: [
          { id: '1', name: '销售一组', role: 'member' }
        ],
        currentTeam: '1'
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('注册失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  };

  // 切换团队
  const switchTeam = (teamId: string) => {
    if (user && user.teams?.find(team => team.id === teamId)) {
      const updatedUser = { ...user, currentTeam: teamId };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchTeam }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义Hook，方便组件使用认证上下文
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}