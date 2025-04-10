import { Badge } from '@/components/ui/badge';

export const statuses = [
  { value: 'new', label: '新建' },
  { value: 'following', label: '跟进中' },
  { value: 'negotiating', label: '谈判中' },
  { value: 'closed', label: '已成交' },
  { value: 'failed', label: '已失败' },
  { value: 'active', label: '活跃' },
  { value: 'initial', label: '初始' },
];

export const priorities = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
  { value: 'normal', label: '普通' },
];

export const getStatusBadge = (status: string) => {
  const statusMap = {
    new: { label: '新建', color: 'bg-blue-100 text-blue-800' },
    following: { label: '跟进中', color: 'bg-yellow-100 text-yellow-800' },
    negotiating: { label: '谈判中', color: 'bg-orange-100 text-orange-800' },
    closed: { label: '已成交', color: 'bg-green-100 text-green-800' },
    failed: { label: '已失败', color: 'bg-red-100 text-red-800' },
    active: { label: '活跃', color: 'bg-teal-100 text-teal-800' },
    initial: { label: '初始', color: 'bg-gray-100 text-gray-800' },
  };
  const statusInfo = statusMap[status as keyof typeof statusMap] || { label: '未知', color: 'bg-gray-100 text-gray-800' };
  return <Badge className={`${statusInfo.color} rounded-full font-medium border-0`}>{statusInfo.label}</Badge>;
};

export const getPriorityBadge = (priority: string) => {
  const priorityMap = {
    high: { label: '高', color: 'bg-red-100 text-red-800' },
    medium: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
    low: { label: '低', color: 'bg-green-100 text-green-800' },
    normal: { label: '普通', color: 'bg-blue-100 text-blue-800' },
  };
  const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || { label: '未知', color: 'bg-gray-100 text-gray-800' };
  return <Badge className={`${priorityInfo.color} rounded-full font-medium border-0`}>{priorityInfo.label}</Badge>;
};

// 为了兼容旧代码，保留获取颜色类名的函数
export const getStatusColor = (status: string) => {
  const statusColorMap = {
    new: 'bg-blue-500',
    following: 'bg-purple-500',
    negotiating: 'bg-yellow-500',
    closed: 'bg-green-500',
    failed: 'bg-red-500',
    active: 'bg-teal-500',
    initial: 'bg-gray-500',
  };
  return statusColorMap[status as keyof typeof statusColorMap] || 'bg-gray-500';
};

export const getPriorityColor = (priority: string) => {
  const priorityColorMap = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
    normal: 'bg-gray-500',
  };
  return priorityColorMap[priority as keyof typeof priorityColorMap] || 'bg-gray-500';
};