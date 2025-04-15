"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Opportunity } from "@/types/opportunity";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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
import {
  SlidersHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";

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
    // Delay clearing the selected opportunity to allow the drawer to animate closed
    setTimeout(() => {
      setSelectedOpportunity(null);
    }, 300);
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
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
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

        <div className="overflow-hidden rounded-md border bg-white">
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                    公司名称
                  </th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground hidden sm:table-cell">
                    联系人
                  </th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                    状态
                  </th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">
                    优先级
                  </th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground hidden lg:table-cell">
                    创建时间
                  </th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <div className="flex justify-center">
                        <Loader2 className="animate-spin h-6 w-6 text-primary" />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-destructive">
                      加载失败: {error}
                    </td>
                  </tr>
                ) : filteredOpportunities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  filteredOpportunities.map((opportunity) => (
                    <tr key={opportunity.id} className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleViewDetails(opportunity)}>
                      <td className="p-2 align-middle">{opportunity.companyName}</td>
                      <td className="p-2 align-middle hidden sm:table-cell">{opportunity.contactPerson || '-'}</td>
                      <td className="p-2 align-middle">{getStatusBadge(opportunity.status)}</td>
                      <td className="p-2 align-middle hidden md:table-cell">{getPriorityBadge(opportunity.priority)}</td>
                      <td className="p-2 align-middle hidden lg:table-cell">{dayjs(opportunity.createdAt).format('YYYY/MM/DD HH:mm')}</td>
                      <td className="p-2 align-middle">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(opportunity);
                          }}
                        >
                          查看详情
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
            // 更新表格中的数据
            setOpportunities(opportunities.map(opp =>
              opp.id === updatedOpportunity.id ? updatedOpportunity : opp
            ));
            // 更新选中的商机
            setSelectedOpportunity(updatedOpportunity);
          }}
        />
      </div>
    </>
  );
}