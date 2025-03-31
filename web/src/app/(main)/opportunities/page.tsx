'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Opportunity {
  id: number;
  companyName: string;
  website: string;
  contactPerson: string;
  contactPhone: string;
  contactWechat: string;
  contactDepartment: string;
  contactPosition: string;
  companySize: string;
  region: string;
  industry: string;
  progress: string;
  status: string;
  description: string;
  ownerId: number;
  teamId: number;
  expectedAmount: string;
  priority: string;
  source: string;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface OpportunitiesResponse {
  items: Opportunity[];
  pagination: PaginationData;
}

const fetchOpportunities = async (page: number, pageSize: number): Promise<OpportunitiesResponse> => {
  const response = await fetch(`/api/opportunities?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) {
    throw new Error('获取商机列表失败');
  }
  return response.json();
};

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['opportunities', currentPage, pageSize],
    queryFn: () => fetchOpportunities(currentPage, pageSize),
  });

  const opportunities = data?.items || [];
  const pagination = data?.pagination;

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: '新建', color: 'bg-blue-500' },
      following: { label: '跟进中', color: 'bg-yellow-500' },
      negotiating: { label: '谈判中', color: 'bg-orange-500' },
      closed: { label: '已成交', color: 'bg-green-500' },
      failed: { label: '已失败', color: 'bg-red-500' },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: '未知', color: 'bg-gray-500' };
    return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      high: { label: '高', color: 'bg-red-500' },
      medium: { label: '中', color: 'bg-yellow-500' },
      low: { label: '低', color: 'bg-green-500' },
    };
    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || { label: '未知', color: 'bg-gray-500' };
    return <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>;
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = (opp.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (opp.contactPerson?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || opp.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (date: string) => {
    return dayjs(date).locale('zh-cn').format('YYYY-MM-DD');
  };

  const formatDateTime = (date: string) => {
    return dayjs(date).locale('zh-cn').format('YYYY-MM-DD HH:mm');
  };

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>商机管理</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建商机
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="搜索客户名称或联系人..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="new">新建</SelectItem>
                <SelectItem value="following">跟进中</SelectItem>
                <SelectItem value="negotiating">谈判中</SelectItem>
                <SelectItem value="closed">已成交</SelectItem>
                <SelectItem value="failed">已失败</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              导出
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>公司名称</TableHead>
                <TableHead>网站</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>联系电话</TableHead>
                <TableHead>微信</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>职位</TableHead>
                <TableHead>公司规模</TableHead>
                <TableHead>地区</TableHead>
                <TableHead>行业</TableHead>
                <TableHead>进度</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>预期金额</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>预计成交日期</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell>{opp.companyName}</TableCell>
                  <TableCell>{opp.website}</TableCell>
                  <TableCell>{opp.contactPerson}</TableCell>
                  <TableCell>{opp.contactPhone}</TableCell>
                  <TableCell>{opp.contactWechat}</TableCell>
                  <TableCell>{opp.contactDepartment}</TableCell>
                  <TableCell>{opp.contactPosition}</TableCell>
                  <TableCell>{opp.companySize}</TableCell>
                  <TableCell>{opp.region}</TableCell>
                  <TableCell>{opp.industry}</TableCell>
                  <TableCell>{getStatusBadge(opp.progress)}</TableCell>
                  <TableCell>{getStatusBadge(opp.status)}</TableCell>
                  <TableCell>¥{parseFloat(opp.expectedAmount).toLocaleString()}</TableCell>
                  <TableCell>{getPriorityBadge(opp.priority)}</TableCell>
                  <TableCell>{opp.source}</TableCell>
                  <TableCell>{opp.expectedCloseDate ? formatDate(opp.expectedCloseDate) : '-'}</TableCell>
                  <TableCell>{formatDateTime(opp.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(opp.updatedAt)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/opportunities/${opp.id}`}>查看</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                共 {pagination.total} 条记录，第 {pagination.page} / {pagination.totalPages} 页
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(page => Math.min(pagination.totalPages, page + 1))}
                  disabled={currentPage === pagination.totalPages}
                >
                  下一页
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}