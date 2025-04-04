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
import { Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

interface OpportunityDetailDrawerProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export default function OpportunityDetailDrawer({
  opportunity,
  isOpen,
  onOpenChange,
  onClose
}: OpportunityDetailDrawerProps) {
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

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full h-full">
        {opportunity && (
          <>
            <DrawerHeader className="text-left">
              <DrawerTitle>商机详情: {opportunity.companyName}</DrawerTitle>
              <DrawerDescription>
                查看和编辑商机详细信息。
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 space-y-4 overflow-y-auto">
              {/* Display Opportunity Details Here */}
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
            </div>
            <DrawerFooter className="pt-2">
              <Button>编辑</Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={onClose}>关闭</Button>
              </DrawerClose>
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