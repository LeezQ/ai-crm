"use client";

import { Opportunity } from "@/types/opportunity";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Loader2, Save, X } from 'lucide-react';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FollowUpRecord } from "@/types/opportunity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Phone, Mail, MessageSquare, Plus } from "lucide-react";
import { getPriorityBadge, getStatusBadge, priorities, statuses } from "@/components/ui/status-badges";

interface OpportunityDetailDrawerProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onUpdate?: (updatedOpportunity: Opportunity) => void;
}

export default function OpportunityDetailDrawer({
  opportunity,
  isOpen,
  onOpenChange,
  onClose,
  onUpdate
}: OpportunityDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Opportunity>>({});
  // 跟进记录相关状态
  const [activeTab, setActiveTab] = useState("info");
  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    type: 'call',
    content: '',
    result: '',
    nextPlan: '',
  });
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);

  // 获取跟进记录
  useEffect(() => {
    if (isOpen && opportunity && activeTab === "follow-up") {
      fetchFollowUpRecords();
    }
  }, [isOpen, opportunity, activeTab]);

  // 获取跟进记录
  const fetchFollowUpRecords = async () => {
    if (!opportunity) return;
    try {
      setLoadingRecords(true);
      const records = await api.opportunities.followUps.list(opportunity.id.toString());
      setFollowUpRecords(records);
    } catch (error) {
      console.error("获取跟进记录失败:", error);
      toast.error("获取跟进记录失败");
    } finally {
      setLoadingRecords(false);
    }
  };

  // 创建跟进记录
  const handleCreateFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity) return;

    try {
      setSubmittingFollowUp(true);
      const newRecord = await api.opportunities.followUps.create(
        opportunity.id.toString(),
        newFollowUp
      );
      setFollowUpRecords([newRecord, ...followUpRecords]);
      setNewFollowUp({
        type: 'call',
        content: '',
        result: '',
        nextPlan: '',
      });
      toast.success("跟进记录已添加");
    } catch (error) {
      console.error("创建跟进记录失败:", error);
      toast.error("创建跟进记录失败");
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  // 渲染跟进类型图标
  const getFollowUpTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 text-blue-500" />;
      case 'meeting':
        return <CalendarDays className="h-4 w-4 text-green-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-orange-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  // 获取跟进类型文本
  const getFollowUpTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      call: '电话',
      meeting: '会议',
      email: '邮件',
      other: '其他',
    };
    return typeMap[type] || '其他';
  };

  // 开始编辑，初始化表单数据
  const handleEdit = () => {
    if (opportunity) {
      // 复制对象并处理日期字段
      const formInit = {
        ...opportunity,
        // 如果有预计成交日期，转换为YYYY-MM-DD格式，用于日期输入框
        expectedCloseDate: opportunity.expectedCloseDate
          ? dayjs(opportunity.expectedCloseDate).format('YYYY-MM-DD')
          : '',
      };
      setFormData(formInit as Partial<Opportunity>);
      setIsEditing(true);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({});
  };

  // 保存编辑
  const handleSave = async () => {
    if (!opportunity || !formData) return;

    try {
      setSaving(true);

      // 准备提交的数据，确保格式正确
      const dataToSubmit = {
        // 只包含必要的字段，避免发送多余数据
        companyName: formData.companyName || '',
        website: formData.website || '',
        contactPerson: formData.contactPerson || '',
        contactPhone: formData.contactPhone || '',
        contactWechat: formData.contactWechat || '',
        contactDepartment: formData.contactDepartment || '',
        contactPosition: formData.contactPosition || '',
        companySize: formData.companySize || '',
        region: formData.region || '',
        industry: formData.industry || '',
        progress: formData.progress || 'initial',
        status: formData.status || 'new',
        priority: formData.priority || 'normal',
        description: formData.description || '',
        source: formData.source || '',
        // 数字字段确保是字符串
        expectedAmount: formData.expectedAmount ? String(formData.expectedAmount) : '0',
        // 日期字段确保是字符串或null
        expectedCloseDate: formData.expectedCloseDate || null,
      };

      console.log('提交的数据:', dataToSubmit);

      const response = await api.opportunities.update(
        opportunity.id.toString(),
        dataToSubmit
      );

      setIsEditing(false);
      if (onUpdate) {
        onUpdate(response as Opportunity);
      }
      toast.success("商机信息更新成功");
    } catch (error) {
      console.error("更新商机失败:", error);
      toast.error("更新商机失败，请检查输入格式是否正确");
    } finally {
      setSaving(false);
    }
  };

  // 表单字段更新
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 日期字段特殊处理
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 如果日期为空，则设置为 null
    if (!value) {
      setFormData(prev => ({ ...prev, [name]: null }));
      return;
    }

    try {
      // 使用标准的日期格式，避免浏览器兼容性问题
      const [year, month, day] = value.split('-').map(Number);

      // 避免创建无效日期，检查年月日是否有效
      if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
        console.error("无效的日期输入:", value);
        setFormData(prev => ({ ...prev, [name]: null }));
        return;
      }

      // 使用本地日期，因为后端会处理时区问题
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, [name]: dateStr }));

      console.log(`设置${name}为:`, dateStr);
    } catch (error) {
      console.error("日期格式转换错误:", error);
      setFormData(prev => ({ ...prev, [name]: null }));
    }
  };

  // 下拉选择更新
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full h-full">
        {opportunity && (
          <>
            <DrawerHeader className="text-left border-b">
              <DrawerTitle>{isEditing ? '编辑商机' : '商机详情'}: {opportunity.companyName}</DrawerTitle>
              <DrawerDescription>
                {isEditing ? '编辑商机信息，保存以更新变更' : '查看和编辑商机详细信息。'}
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-4 pb-0 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">基本信息</TabsTrigger>
                  <TabsTrigger value="follow-up">跟进记录</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  {!isEditing ? (
                    // 查看模式
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="font-semibold">公司名称:</div><div>{opportunity.companyName}</div>
                        <div className="font-semibold">网站:</div><div>{opportunity.website || '-'}</div>
                        <div className="font-semibold">联系人:</div><div>{opportunity.contactPerson || '-'}</div>
                        <div className="font-semibold">联系电话:</div><div>{opportunity.contactPhone || '-'}</div>
                        <div className="font-semibold">微信:</div><div>{opportunity.contactWechat || '-'}</div>
                        <div className="font-semibold">部门:</div><div>{opportunity.contactDepartment || '-'}</div>
                        <div className="font-semibold">职位:</div><div>{opportunity.contactPosition || '-'}</div>
                        <div className="font-semibold">公司规模:</div><div>{opportunity.companySize || '-'}</div>
                        <div className="font-semibold">地区:</div><div>{opportunity.region || '-'}</div>
                        <div className="font-semibold">行业:</div><div>{opportunity.industry || '-'}</div>
                        <div className="font-semibold">进度:</div><div>{getStatusBadge(opportunity.progress)}</div>
                        <div className="font-semibold">状态:</div><div>{getStatusBadge(opportunity.status)}</div>
                        <div className="font-semibold">优先级:</div><div>{getPriorityBadge(opportunity.priority)}</div>
                        <div className="font-semibold">预期金额:</div><div>¥{parseFloat(opportunity.expectedAmount || '0').toLocaleString()}</div>
                        <div className="font-semibold">来源:</div><div>{opportunity.source || '-'}</div>
                        <div className="font-semibold">预计成交日期:</div><div>{opportunity.expectedCloseDate ? dayjs(opportunity.expectedCloseDate).format('YYYY/MM/DD') : '-'}</div>
                        <div className="font-semibold">创建时间:</div><div>{dayjs(opportunity.createdAt).format('YYYY/MM/DD HH:mm')}</div>
                        <div className="font-semibold">更新时间:</div><div>{dayjs(opportunity.updatedAt).format('YYYY/MM/DD HH:mm')}</div>
                      </div>
                      <div className="pt-4">
                        <h4 className="font-semibold mb-2">描述:</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{opportunity.description || '无描述'}</p>
                      </div>
                    </>
                  ) : (
                    // 编辑模式
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">公司名称</label>
                          <Input
                            name="companyName"
                            value={formData.companyName || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">网站</label>
                          <Input
                            name="website"
                            value={formData.website || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">联系人</label>
                          <Input
                            name="contactPerson"
                            value={formData.contactPerson || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">联系电话</label>
                          <Input
                            name="contactPhone"
                            value={formData.contactPhone || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">微信</label>
                          <Input
                            name="contactWechat"
                            value={formData.contactWechat || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">部门</label>
                          <Input
                            name="contactDepartment"
                            value={formData.contactDepartment || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">职位</label>
                          <Input
                            name="contactPosition"
                            value={formData.contactPosition || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">公司规模</label>
                          <Input
                            name="companySize"
                            value={formData.companySize || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">地区</label>
                          <Input
                            name="region"
                            value={formData.region || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">行业</label>
                          <Input
                            name="industry"
                            value={formData.industry || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">状态</label>
                          <Select
                            value={formData.status || 'new'}
                            onValueChange={(value) => handleSelectChange('status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择状态" />
                            </SelectTrigger>
                            <SelectContent>
                              {statuses.map(status => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">优先级</label>
                          <Select
                            value={formData.priority || 'normal'}
                            onValueChange={(value) => handleSelectChange('priority', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择优先级" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorities.map(priority => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">预期金额 (¥)</label>
                          <Input
                            name="expectedAmount"
                            type="number"
                            value={formData.expectedAmount || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">来源</label>
                          <Input
                            name="source"
                            value={formData.source || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">预计成交日期</label>
                          <Input
                            name="expectedCloseDate"
                            type="date"
                            value={formData.expectedCloseDate || ''}
                            onChange={handleDateChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">描述</label>
                        <Textarea
                          name="description"
                          rows={4}
                          value={formData.description || ''}
                          onChange={handleInputChange}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="follow-up" className="space-y-4">
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <form onSubmit={handleCreateFollowUp} className="space-y-4">
                          <h3 className="text-lg font-medium mb-4">添加跟进记录</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>跟进类型</Label>
                              <Select
                                value={newFollowUp.type}
                                onValueChange={(value) => setNewFollowUp({ ...newFollowUp, type: value })}
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
                                placeholder="例如：电话沟通产品需求"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>跟进结果</Label>
                            <Textarea
                              value={newFollowUp.result}
                              onChange={(e) => setNewFollowUp({ ...newFollowUp, result: e.target.value })}
                              placeholder="沟通结果..."
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>下一步计划</Label>
                            <Textarea
                              value={newFollowUp.nextPlan}
                              onChange={(e) => setNewFollowUp({ ...newFollowUp, nextPlan: e.target.value })}
                              placeholder="下一步计划..."
                              rows={2}
                            />
                          </div>
                          <Button type="submit" disabled={submittingFollowUp}>
                            {submittingFollowUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Plus className={`${submittingFollowUp ? 'hidden' : ''} mr-2 h-4 w-4`} />
                            添加跟进记录
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">跟进历史记录</h3>
                      {loadingRecords ? (
                        <div className="flex justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : followUpRecords.length === 0 ? (
                        <div className="text-center p-4 text-gray-500">暂无跟进记录</div>
                      ) : (
                        <div className="space-y-3">
                          {followUpRecords.map((record) => (
                            <Card key={record.id} className="overflow-hidden">
                              <CardContent className="p-0">
                                <div className="border-b p-3 bg-gray-50 flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    {getFollowUpTypeIcon(record.type)}
                                    <span className="font-medium">
                                      {getFollowUpTypeText(record.type)}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {dayjs(record.createTime).format('YYYY/MM/DD HH:mm')}
                                  </div>
                                </div>
                                <div className="p-4">
                                  <div className="mb-3">
                                    <div className="font-medium text-sm text-gray-500 mb-1">跟进内容</div>
                                    <div>{record.content}</div>
                                  </div>
                                  {record.result && (
                                    <div className="mb-3">
                                      <div className="font-medium text-sm text-gray-500 mb-1">跟进结果</div>
                                      <div>{record.result}</div>
                                    </div>
                                  )}
                                  {record.nextPlan && (
                                    <div className="mb-1">
                                      <div className="font-medium text-sm text-gray-500 mb-1">下一步计划</div>
                                      <div>{record.nextPlan}</div>
                                    </div>
                                  )}
                                </div>
                                <div className="px-4 pb-3 text-sm text-gray-500">
                                  由 {record.creator} 创建
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DrawerFooter className="pt-2 border-t">
              {activeTab === "info" ? (
                !isEditing ? (
                  <>
                    <Button onClick={handleEdit}>编辑</Button>
                    <DrawerClose asChild>
                      <Button variant="outline" onClick={onClose}>关闭</Button>
                    </DrawerClose>
                  </>
                ) : (
                  <>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      保存
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                      <X className="mr-2 h-4 w-4" />
                      取消
                    </Button>
                  </>
                )
              ) : (
                <DrawerClose asChild>
                  <Button variant="outline" onClick={onClose}>关闭</Button>
                </DrawerClose>
              )}
            </DrawerFooter>
          </>
        )}
        {!opportunity && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}