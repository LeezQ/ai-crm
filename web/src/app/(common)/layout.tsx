'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  LogOut,
  User,
  ChevronDown,
  MessageSquare,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronRight,
  Menu,
  X,
  FileText,
  ChevronUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { request } from '@/lib/api';
import { useIsMobile } from '@/hooks/use-mobile';

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: '仪表盘', color: 'text-blue-500' },
  { href: '/opportunities', icon: Briefcase, label: '商机管理', color: 'text-emerald-500' },
  { href: '/teams', icon: Users, label: '团队管理', color: 'text-purple-500' },
  { href: '/chat', icon: MessageSquare, label: 'AI 助手', color: 'text-amber-500' },
  {
    icon: FileText,
    label: '资源中心',
    color: 'text-orange-500',
    subMenus: [
      { href: '/resources/technical', label: '技术支持材料' },
      { href: '/resources/sales', label: '销售支持材料' },
      { href: '/resources/internal', label: '内部材料' },
    ]
  },
  { href: '/settings', icon: Settings, label: '个人设置', color: 'text-sky-500' },
];

interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await request('/api/user/profile');
        setUserProfile(response as UserProfile);
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    // 如果是移动设备，默认不打开侧边栏
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // 当路由变化时，如果是移动设备且侧边栏打开，则关闭侧边栏
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  // 判断当前路径是否属于资源中心子菜单，如果是则默认展开资源中心
  useEffect(() => {
    if (pathname.startsWith('/resources')) {
      setExpandedMenu('资源中心');
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // 实际的主题切换逻辑可以在这里实现
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // 切换子菜单的展开/折叠状态
  const toggleSubMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* 侧边栏 */}
      <div className={cn(
        "md:relative",
        "transition-all duration-300 ease-in-out"
      )}>
        <aside
          className={cn(
            "h-full w-[220px] border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col",
            "fixed md:relative z-30",
            isMobile && !isSidebarOpen ? "-left-[220px]" : "left-0"
          )}
        >
          <div className="px-4 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-lg">AI CRM</span>
            </div>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <nav className="flex-1 overflow-y-auto py-6">
            {menuItems.map((item) => {
              const hasSubMenus = item.subMenus && item.subMenus.length > 0;
              const isActive = hasSubMenus
                ? pathname.startsWith('/resources')
                : pathname.startsWith(item.href || '');
              const isExpanded = expandedMenu === item.label;

              return (
                <div key={item.label} className="mb-1">
                  {hasSubMenus ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(item.label)}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors mx-2 rounded-md',
                          isActive
                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-500 dark:text-gray-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-9 mt-1 space-y-1">
                          {item.subMenus.map((subMenu) => {
                            const isSubActive = pathname === subMenu.href;
                            return (
                              <Link
                                key={subMenu.href}
                                href={subMenu.href}
                                className={cn(
                                  'block px-4 py-2 text-sm rounded-md transition-colors',
                                  isSubActive
                                    ? 'bg-gray-100 text-gray-900 font-medium dark:bg-gray-700 dark:text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                )}
                              >
                                {subMenu.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href || ''}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors mx-2 rounded-md',
                        isActive
                          ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      )}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-500 dark:text-gray-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span>退出登录</span>
            </Button>
          </div>
        </aside>
      </div>

      {/* 侧边栏遮罩层 - 仅在移动端侧边栏打开时显示 */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航 */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center px-4 gap-4">
          {/* 移动端显示菜单按钮 */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="搜索..."
              className="pl-10 pr-4 py-2 h-9 bg-gray-100 dark:bg-gray-700 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs text-gray-400">⌘K</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={toggleDarkMode}
            >
              {isDarkMode ?
                <Sun className="h-5 w-5 text-amber-400" /> :
                <Moon className="h-5 w-5 text-indigo-400" />
              }
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
            >
              <Bell className="h-5 w-5 text-rose-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-600">
                    <AvatarImage src={userProfile?.avatar || ''} alt="用户头像" />
                    <AvatarFallback>
                      {userProfile?.name?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start text-sm">
                    <span className="font-medium">{userProfile?.name || '加载中...'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{userProfile?.role || '用户'}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4 text-blue-500" />
                  <span>个人信息</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4 text-sky-500" />
                  <span>账号设置</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}