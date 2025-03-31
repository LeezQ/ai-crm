"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Opportunity } from "@/types/opportunity";
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
import { Plus, Search, Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface OpportunitiesResponse {
  items: Opportunity[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchOpportunities();
  }, [page, pageSize]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await api.opportunities.list({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      setOpportunities(response.items);
      setTotal(response.pagination.total);
    } catch (error) {
      setError("获取商机列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="">
        <Card>
          <CardContent className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="">
      <div className="bg-white">
        <div className="flex flex-row items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">商机管理</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建商机
          </Button>
        </div>
        <div>
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
                  <TableCell>{opp.expectedCloseDate ? opp.expectedCloseDate : '-'}</TableCell>
                  <TableCell>{opp.createdAt}</TableCell>
                  <TableCell>{opp.updatedAt}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/opportunities/${opp.id}`}>查看</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              共 {total} 条记录，第 {page} / {Math.ceil(total / pageSize)} 页
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))}
                disabled={page >= Math.ceil(total / pageSize)}
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}