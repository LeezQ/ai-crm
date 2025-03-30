'use client';

import { useState, useEffect } from 'react';
import { useAuth, User, Team } from '@/contexts/AuthContext';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function TeamsManagePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [successMessage, setSuccessMessage] = useState('');

  // 初始化数据
  useEffect(() => {
    if (user) {
      // 实际中应该从API获取数据
      setTeams(user.teams || []);
      if (user.teams && user.teams.length > 0) {
        const defaultTeam = user.currentTeam || user.teams[0].id;
        setActiveTeam(defaultTeam);
        fetchTeamMembers(defaultTeam);
      }
      setLoading(false);
    }
  }, [user]);

  // 模拟获取团队成员
  const fetchTeamMembers = (teamId: string) => {
    setLoading(true);

    // 这里应该调用实际的API
    // 模拟延迟和数据
    setTimeout(() => {
      const mockMembers: TeamMember[] = [
        { id: '1', name: user?.name || '测试用户', email: user?.email || 'test@example.com', role: 'admin' },
        { id: '2', name: '李经理', email: 'li@example.com', role: 'member' },
        { id: '3', name: '王经理', email: 'wang@example.com', role: 'member' },
      ];

      setTeamMembers(mockMembers);
      setLoading(false);
    }, 500);
  };

  // 切换团队
  const handleTeamChange = (teamId: string) => {
    setActiveTeam(teamId);
    fetchTeamMembers(teamId);
  };

  // 创建新团队
  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      return;
    }

    setLoading(true);

    // 模拟API调用
    setTimeout(() => {
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: newTeamName,
        role: 'admin'
      };

      const updatedTeams = [...teams, newTeam];
      setTeams(updatedTeams);
      setActiveTeam(newTeam.id);
      fetchTeamMembers(newTeam.id);
      setShowCreateTeamModal(false);
      setNewTeamName('');
      setSuccessMessage('团队创建成功！');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  // 邀请成员
  const handleInviteMember = () => {
    if (!inviteEmail.trim() || !activeTeam) {
      return;
    }

    setLoading(true);

    // 模拟API调用
    setTimeout(() => {
      // 实际中应该调用API
      const newMember: TeamMember = {
        id: `user-${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole
      };

      setTeamMembers([...teamMembers, newMember]);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('member');
      setLoading(false);
      setSuccessMessage('邀请已发送！');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  // 更改成员角色
  const handleRoleChange = (memberId: string, newRole: string) => {
    setTeamMembers(
      teamMembers.map(member =>
        member.id === memberId
          ? { ...member, role: newRole }
          : member
      )
    );
  };

  // 移除成员
  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  if (!user) {
    return <div className="text-center py-10">请先登录</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">团队管理</h1>
          <p className="mt-1 text-sm text-gray-500">管理团队成员和权限</p>
        </div>
        <button
          onClick={() => setShowCreateTeamModal(true)}
          className="btn btn-primary inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          创建团队
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm fade-in">
          <div className="flex">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 团队列表 */}
          <div className="card">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-medium text-gray-900">我的团队</h2>
            </div>
            <div className="p-4">
              {teams.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">您还没有加入任何团队</h3>
                  <p className="mt-1 text-sm text-gray-500">开始创建一个新团队来管理您的成员</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateTeamModal(true)}
                      className="btn btn-primary"
                    >
                      创建您的第一个团队
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {teams.map(team => (
                    <li key={team.id}>
                      <button
                        onClick={() => handleTeamChange(team.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTeam === team.id
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'hover:bg-gray-50 border border-transparent'
                          }`}
                      >
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${activeTeam === team.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {team.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className={`font-medium ${activeTeam === team.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                              {team.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {team.role === 'admin' ? '管理员' : '成员'}
                            </div>
                          </div>
                          {activeTeam === team.id && (
                            <svg className="ml-auto w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                            </svg>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 团队成员 */}
          <div className="lg:col-span-3">
            {activeTeam ? (
              <div className="card">
                <div className="px-6 py-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h2 className="text-lg font-medium text-gray-900">
                    {teams.find(t => t.id === activeTeam)?.name} - 团队成员
                  </h2>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="btn btn-primary"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    邀请成员
                  </button>
                </div>

                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">成员</th>
                        <th scope="col">角色</th>
                        <th scope="col" className="relative">
                          <span className="sr-only">操作</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teamMembers.map(member => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br ${member.id === '1'
                                  ? 'from-indigo-500 to-purple-600'
                                  : 'from-gray-400 to-gray-500'
                                } text-white flex items-center justify-center`}>
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {member.id === '1' ? (
                              <span className="badge badge-blue">
                                管理员
                              </span>
                            ) : (
                              <select
                                value={member.role}
                                onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                className="form-select w-auto text-sm"
                              >
                                <option value="member">成员</option>
                                <option value="admin">管理员</option>
                              </select>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {member.id !== '1' && (
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="text-red-600 hover:text-red-900 focus:outline-none"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {teamMembers.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">此团队目前没有成员</p>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="mt-3 btn btn-outline"
                    >
                      邀请成员
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center p-12 h-full">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">请选择或创建一个团队</h3>
                <p className="mt-1 text-gray-500">从左侧选择一个团队或创建新团队</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 创建团队模态框 */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="modal bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">创建新团队</h3>
              <p className="mt-1 text-sm text-gray-500">创建一个新团队来管理成员和项目</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  团队名称
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="form-input"
                  placeholder="输入团队名称"
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateTeamModal(false)}
                className="btn btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!newTeamName.trim()}
                className="btn btn-primary disabled:opacity-50"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 邀请成员模态框 */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="modal bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">邀请团队成员</h3>
              <p className="mt-1 text-sm text-gray-500">邀请新成员加入 {teams.find(t => t.id === activeTeam)?.name} 团队</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="form-input"
                  placeholder="输入邮箱地址"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="form-select"
                >
                  <option value="member">成员</option>
                  <option value="admin">管理员</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  管理员可以添加/删除成员及管理团队设置
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="btn btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleInviteMember}
                disabled={!inviteEmail.trim()}
                className="btn btn-primary disabled:opacity-50"
              >
                发送邀请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}