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
import { useState } from "react";
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: '新建', color: 'bg-blue-500' },
      following: { label: '跟进中', color: 'bg-yellow-500' },
      negotiating: { label: '谈判中', color: 'bg-orange-500' },
      closed: { label: '已成交', color: 'bg-green-500' },
      failed: { label: '已失败', color: 'bg-red-500' },
      active: { label: '活跃', color: 'bg-teal-500' },
      initial: { label: '初始', color: 'bg-gray-400' },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: '未知', color: 'bg-gray-500' };
    return <Badge className={`${statusInfo.color} text-white`}>{statusInfo.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      high: { label: '高', color: 'bg-red-500' },
      medium: { label: '中', color: 'bg-yellow-500' },
      low: { label: '低', color: 'bg-green-500' },
      normal: { label: '普通', color: 'bg-blue-500' },
    };
    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || { label: '未知', color: 'bg-gray-500' };
    return <Badge className={`${priorityInfo.color} text-white`}>{priorityInfo.label}</Badge>;
  };

  const statuses = [
    { value: 'new', label: '新建' },
    { value: 'following', label: '跟进中' },
    { value: 'negotiating', label: '谈判中' },
    { value: 'closed', label: '已成交' },
    { value: 'failed', label: '已失败' },
    { value: 'active', label: '活跃' },
    { value: 'initial', label: '初始' },
  ];

  const priorities = [
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' },
    { value: 'normal', label: '普通' },
  ];

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

            <div className="p-4 pb-0 space-y-4 overflow-y-auto">
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
            </div>

            <DrawerFooter className="pt-2 border-t">
              {!isEditing ? (
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