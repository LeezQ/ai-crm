'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout, switchTeam } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // 监听滚动事件，为Header添加阴影效果
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isTeamMenuOpen) setIsTeamMenuOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleTeamMenu = () => {
    setIsTeamMenuOpen(!isTeamMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
    if (isTeamMenuOpen) setIsTeamMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // 实际应用中这里会处理搜索逻辑
    setIsSearchOpen(false);
  };

  const handleSwitchTeam = (teamId: string) => {
    switchTeam(teamId);
    setIsTeamMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const currentTeamName = user?.teams?.find(team => team.id === user.currentTeam)?.name || '无团队';

  return (
    <header className={`bg-white transition-all duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'} z-10`}>
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center py-3 px-4 md:px-6">
          {/* 左侧 Logo/标题 在移动端不显示（由Sidebar负责） */}
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-indigo-800">AI CRM</h1>
          </div>

          {/* 中间部分：搜索栏 */}
          {isSearchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="absolute left-0 top-0 w-full bg-white p-3 shadow-md md:static md:shadow-none md:p-0 md:w-1/2 z-20"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索客户、联系人或任务..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus
                />
                <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="md:hidden absolute right-3 top-2.5 text-gray-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </form>
          ) : (
            <div className="hidden md:block md:w-1/2">
              <div className="relative">
                <button
                  onClick={toggleSearch}
                  className="w-full flex items-center pl-10 pr-4 py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition duration-150"
                >
                  <svg className="absolute left-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>搜索客户、联系人或任务...</span>
                </button>
              </div>
            </div>
          )}

          {/* 右侧功能区 */}
          {user && (
            <div className="flex items-center space-x-3">
              {/* 移动端搜索按钮 */}
              <button
                onClick={toggleSearch}
                className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* 团队选择下拉菜单 */}
              <div className="relative">
                <button
                  onClick={toggleTeamMenu}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none transition duration-150"
                >
                  <span className="hidden sm:inline mr-2">团队:</span>
                  <span className="font-semibold text-indigo-600">{currentTeamName}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isTeamMenuOpen && user.teams && user.teams.length > 0 && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 fade-in">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                        切换团队
                      </div>
                      {user.teams.map(team => (
                        <button
                          key={team.id}
                          onClick={() => handleSwitchTeam(team.id)}
                          className={`block w-full text-left px-4 py-2 text-sm ${team.id === user.currentTeam ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center">
                            <span className="flex-grow">{team.name}</span>
                            {team.id === user.currentTeam && (
                              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {team.role === 'admin' ? '管理员' : '成员'}
                          </div>
                        </button>
                      ))}
                      <hr className="my-1" />
                      <a
                        href="/teams/manage"
                        className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50"
                      >
                        管理团队
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* 通知图标 */}
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition duration-150 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
              </button>

              {/* 用户头像和下拉菜单 */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : '用'}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 fade-in">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 truncate">{user.email}</div>
                      </div>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          个人资料
                        </div>
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          设置
                        </div>
                      </a>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          退出登录
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}