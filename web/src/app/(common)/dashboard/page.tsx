"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "@/lib/api";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getStatusBadge, getPriorityBadge, getStatusColor } from "@/components/ui/status-badges";

interface DashboardData {
  totalOpportunities: number;
  statusCounts: Array<{
    status: string;
    count: number;
  }>;
  recentOpportunities: Array<{
    id: number;
    companyName: string;
    contactPerson: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await api.analytics.dashboard();
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error instanceof Error ? error.message : "获取仪表盘数据失败");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statusChartColors = ["#4299e1", "#805ad5", "#ecc94b", "#48bb78", "#f56565"];

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">商机总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalOpportunities || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">商机状态</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            {data?.statusCounts && data.statusCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusCounts}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ status }) => status}
                  >
                    {data.statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusChartColors[index % statusChartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}个`, name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">快速入口</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => router.push('/opportunities/new')}>新建商机</Button>
            <Button className="w-full" variant="outline" onClick={() => router.push('/opportunities')}>查看全部商机</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近商机</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>公司名称</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.recentOpportunities && data.recentOpportunities.length > 0 ? (
                data.recentOpportunities.map((opp) => (
                  <TableRow key={opp.id}>
                    <TableCell className="font-medium">{opp.companyName}</TableCell>
                    <TableCell>{opp.contactPerson}</TableCell>
                    <TableCell>
                      {getStatusBadge(opp.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(opp.priority)}
                    </TableCell>
                    <TableCell>{dayjs(opp.createdAt).format("YYYY-MM-DD")}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="text-primary font-medium p-0 hover:underline underline-offset-4"
                        onClick={() => router.push(`/opportunities/${opp.id}`)}
                      >
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}