'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timeline, TimelineItem } from '@/components/ui/timeline';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { api } from "@/lib/api";
import { Opportunity, FollowUpRecord } from "@/types/opportunity";

export default function OpportunityDetailPage() {
  const params = useParams();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFollowUp, setNewFollowUp] = useState({
    type: 'call',
    content: '',
    result: '',
    nextPlan: '',
  });

  useEffect(() => {
    fetchOpportunityDetail();
    fetchFollowUpRecords();
  }, [params.id]);

  const fetchOpportunityDetail = async () => {
    try {
      const response = await api.opportunities.get(params.id as string);
      setOpportunity(response);
    } catch (error) {
      console.error('获取商机详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowUpRecords = async () => {
    try {
      const response = await api.opportunities.followUps.list(params.id as string);
      setFollowUpRecords(response);
    } catch (error) {
      console.error('获取跟进记录失败:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!opportunity) return;
    try {
      await api.opportunities.updateStatus(params.id as string, { status: newStatus as Opportunity['status'] });
      setOpportunity({ ...opportunity, status: newStatus as Opportunity['status'] });
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const handleCreateFollowUp = async () => {
    try {
      const response = await api.opportunities.followUps.create(
        params.id as string,
        newFollowUp
      );
      setFollowUpRecords([...followUpRecords, response]);
      setNewFollowUp({
        type: 'call',
        content: '',
        result: '',
        nextPlan: '',
      });
    } catch (error) {
      console.error('创建跟进记录失败:', error);
    }
  };

  if (loading || !opportunity) {
    return <div>加载中...</div>;
  }

  return (
    <div className="">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{opportunity.customerName}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge className={opportunity.status === 'closed' ? 'bg-green-500' : 'bg-blue-500'}>
                {opportunity.status === 'closed' ? '已成交' : '进行中'}
              </Badge>
              <Badge className={opportunity.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}>
                {opportunity.priority === 'high' ? '高优先级' : '中优先级'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">编辑</Button>
            <Button>添加跟进</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="follow-up">跟进记录</TabsTrigger>
              <TabsTrigger value="team">团队协作</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>联系人</Label>
                  <Input value={opportunity.contactPerson} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>联系电话</Label>
                  <Input value={opportunity.contactPhone} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>联系邮箱</Label>
                  <Input value={opportunity.contactEmail} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>预期金额</Label>
                  <Input value={`¥${opportunity.expectedAmount.toLocaleString()}`} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>来源渠道</Label>
                  <Input value={opportunity.source} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>预计成交时间</Label>
                  <Input value={format(new Date(opportunity.expectedCloseDate), 'yyyy-MM-dd', { locale: zhCN })} readOnly />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>详细描述</Label>
                  <Textarea value={opportunity.description} readOnly rows={4} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="follow-up">
              <div className="space-y-6">
                <form onSubmit={handleCreateFollowUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>跟进类型</Label>
                      <Select
                        value={newFollowUp.type}
                        onValueChange={(value) => setNewFollowUp({ ...newFollowUp, type: value as FollowUpRecord['type'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">电话</SelectItem>
                          <SelectItem value="meeting">会议</SelectItem>
                          <SelectItem value="email">邮件</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>跟进内容</Label>
                      <Input
                        value={newFollowUp.content}
                        onChange={(e) => setNewFollowUp({ ...newFollowUp, content: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>跟进结果</Label>
                    <Textarea
                      value={newFollowUp.result}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, result: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>下一步计划</Label>
                    <Textarea
                      value={newFollowUp.nextPlan}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, nextPlan: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Button type="submit">提交跟进记录</Button>
                </form>

                <Timeline>
                  {followUpRecords.map((record) => (
                    <TimelineItem key={record.id}>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{record.creator}</h4>
                          <p className="text-sm text-gray-500">
                            {format(new Date(record.createTime), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                          </p>
                        </div>
                        <Badge>{record.type}</Badge>
                      </div>
                      <p className="mt-2">{record.content}</p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">跟进结果：</p>
                        <p className="text-sm">{record.result}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">下一步计划：</p>
                        <p className="text-sm">{record.nextPlan}</p>
                      </div>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            </TabsContent>
            <TabsContent value="team">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">所属团队</h3>
                    <p className="text-sm text-gray-500">{opportunity.team}</p>
                  </div>
                  <Button variant="outline">转移团队</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2">团队成员</h3>
                  <div className="flex gap-2">
                    <Badge>{opportunity.owner}</Badge>
                    {/* 这里可以添加更多团队成员 */}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}