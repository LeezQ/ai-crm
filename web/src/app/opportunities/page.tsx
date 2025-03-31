'use client';

import { useState, useEffect } from 'react';
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
import { Plus, Search, Download } from 'lucide-react';

interface Opportunity {
  id: string;
  customerName: string;
  contactPerson: string;
  expectedAmount: number;
  status: 'new' | 'following' | 'proposal' | 'negotiation' | 'closed' | 'failed';
  priority: 'high' | 'medium' | 'low';
  owner: string;
  createTime: string;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/opportunities');
      const data = await response.json();
      setOpportunities(data);
    } catch (error) {
      console.error('获取商机列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: '新建', color: 'bg-blue-500' },
      following: { label: '跟进中', color: 'bg-yellow-500' },
      proposal: { label: '方案阶段', color: 'bg-purple-500' },
      negotiation: { label: '谈判阶段', color: 'bg-orange-500' },
      closed: { label: '已成交', color: 'bg-green-500' },
      failed: { label: '已失败', color: 'bg-red-500' },
    };
    const { label, color } = statusMap[status as keyof typeof statusMap];
    return <Badge className={color}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      high: { label: '高', color: 'bg-red-500' },
      medium: { label: '中', color: 'bg-yellow-500' },
      low: { label: '低', color: 'bg-green-500' },
    };
    const { label, color } = priorityMap[priority as keyof typeof priorityMap];
    return <Badge className={color}>{label}</Badge>;
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || opp.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
                <SelectItem value="proposal">方案阶段</SelectItem>
                <SelectItem value="negotiation">谈判阶段</SelectItem>
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
                <TableHead>客户名称</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>预期金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead>负责人</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell>{opp.customerName}</TableCell>
                  <TableCell>{opp.contactPerson}</TableCell>
                  <TableCell>¥{opp.expectedAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(opp.status)}</TableCell>
                  <TableCell>{getPriorityBadge(opp.priority)}</TableCell>
                  <TableCell>{opp.owner}</TableCell>
                  <TableCell>{new Date(opp.createTime).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}