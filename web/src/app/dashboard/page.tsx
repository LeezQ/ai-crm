'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Bell, CheckSquare, Clock } from 'lucide-react';

interface DashboardData {
  myOpportunities: {
    id: string;
    customerName: string;
    status: string;
    priority: string;
    expectedAmount: number;
    nextFollowUp: string;
  }[];
  upcomingTasks: {
    id: string;
    title: string;
    dueDate: string;
    priority: string;
    relatedOpportunity: string;
  }[];
  recentActivities: {
    id: string;
    type: string;
    content: string;
    time: string;
    relatedOpportunity: string;
  }[];
  statistics: {
    totalOpportunities: number;
    totalAmount: number;
    followUpCount: number;
    taskCount: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('获取工作台数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div>加载中...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">我的商机</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.statistics.totalOpportunities}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预期总金额</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{data.statistics.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待跟进</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.statistics.followUpCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待办任务</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.statistics.taskCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>我的商机</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>客户名称</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>预期金额</TableHead>
                  <TableHead>下次跟进</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.myOpportunities.map((opp) => (
                  <TableRow key={opp.id}>
                    <TableCell>{opp.customerName}</TableCell>
                    <TableCell>
                      <Badge>{opp.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={opp.priority === 'high' ? 'destructive' : 'default'}>
                        {opp.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>¥{opp.expectedAmount.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(opp.nextFollowUp), 'yyyy-MM-dd', { locale: zhCN })}</TableCell>
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

        <Card>
          <CardHeader>
            <CardTitle>日历</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>待办任务</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>任务名称</TableHead>
                  <TableHead>截止日期</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>关联商机</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.upcomingTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{format(new Date(task.dueDate), 'yyyy-MM-dd', { locale: zhCN })}</TableCell>
                    <TableCell>
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.relatedOpportunity}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        完成
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="flex-1">
                    <p className="text-sm">{activity.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.time), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}