'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Bell, CheckSquare, Clock, Users, ShoppingCart } from 'lucide-react';

interface DashboardData {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  recentCustomers: any[];
}

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error('获取工作台数据失败');
  }
  return response.json();
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    initialData: {
      totalCustomers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
      recentCustomers: [],
    },
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>加载失败</div>;
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-background p-4 rounded-lg">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">客户总数</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.totalCustomers}</div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">订单总数</div>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.totalOrders}</div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">总收入</div>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">¥{data.totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background p-4 rounded-lg">
          <div className="mb-4 font-medium">最近订单</div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>¥{order.amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge>{order.status}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-background p-4 rounded-lg">
          <div className="mb-4 font-medium">最近客户</div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>客户名称</TableHead>
                  <TableHead>联系方式</TableHead>
                  <TableHead>注册时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.contact}</TableCell>
                    <TableCell>{format(new Date(customer.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}