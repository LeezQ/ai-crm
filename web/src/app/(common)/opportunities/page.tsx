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
import { Loader2, SlidersHorizontal } from 'lucide-react';
import dayjs from 'dayjs';
import OpportunityDetailDrawer from './components/opportunity-detail-drawer';
import { getStatusBadge, getPriorityBadge } from "@/components/ui/status-badges";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

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
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

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
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "获取商机列表失败";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedOpportunity(null);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div>加载失败: {error}</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">商机管理</h1>
            <p className="text-muted-foreground">管理和跟踪您的所有销售商机</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/opportunities/new')}>新建商机</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  筛选
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>按状态筛选</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['new', 'qualified', 'proposition', 'negotiation', 'closed_won', 'closed_lost'].map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onCheckedChange={(checked) => {
                      setStatusFilter(checked ? status : 'all');
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>公司名称</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>进度</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead>预期金额</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id} className="cursor-pointer"
                    onClick={() => handleViewDetails(opportunity)}>
                    <TableCell>{opportunity.companyName}</TableCell>
                    <TableCell>{opportunity.contactPerson || '-'}</TableCell>
                    <TableCell>{getStatusBadge(opportunity.status)}</TableCell>
                    <TableCell>{getStatusBadge(opportunity.progress)}</TableCell>
                    <TableCell>{getPriorityBadge(opportunity.priority)}</TableCell>
                    <TableCell>¥{Number(opportunity.expectedAmount || 0).toLocaleString()}</TableCell>
                    <TableCell>{opportunity.source || '-'}</TableCell>
                    <TableCell>{dayjs(opportunity.createdAt).format('YYYY/MM/DD HH:mm')}</TableCell>
                    <TableCell>{dayjs(opportunity.updatedAt).format('YYYY/MM/DD HH:mm')}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary font-medium h-auto p-0 hover:bg-transparent hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(opportunity);
                        }}
                      >
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              共 {total} 条记录
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page <= 1}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= Math.ceil(total / pageSize)}
              >
                下一页
              </Button>
            </div>
          </div>
        )}

        <OpportunityDetailDrawer
          opportunity={selectedOpportunity}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onClose={handleDrawerClose}
          onUpdate={(updatedOpportunity) => {
            setOpportunities(opportunities.map(opp =>
              opp.id === updatedOpportunity.id ? updatedOpportunity : opp
            ));
            setSelectedOpportunity(updatedOpportunity);
          }}
        />
      </div>
    </>
  );
}