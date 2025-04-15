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
    expectedAmount?: string;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">商机总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalOpportunities || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
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
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">快速入口</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => router.push('/opportunities/new')}>新建商机</Button>
            <Button className="w-full" variant="outline" onClick={() => router.push('/opportunities')}>查看全部商机</Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">近期商机</h2>
        <div className="overflow-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  公司名称
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                  联系人
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  金额
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  状态
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                  创建时间
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.recentOpportunities && data.recentOpportunities.length > 0 ? (
                data.recentOpportunities.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                      {item.companyName}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm hidden sm:table-cell">
                      {item.contactPerson || '-'}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm hidden md:table-cell">
                      ¥{Number(item.expectedAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {dayjs(item.createdAt).format('YYYY/MM/DD')}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary font-medium"
                        onClick={() => router.push(`/opportunities/${item.id}`)}
                      >
                        查看详情
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-sm text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}