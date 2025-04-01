"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function NewOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    contactPerson: "",
    contactPhone: "",
    contactWechat: "",
    contactDepartment: "",
    contactPosition: "",
    companySize: "",
    region: "",
    industry: "",
    status: "new",
    priority: "medium",
    expectedAmount: "",
    source: "",
    expectedCloseDate: "",
    description: "",
    nextFollowUpDate: "",
    nextFollowUpContent: "",
    salesPerson: "",
    salesTeam: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.opportunities.create(formData);
      router.push("/opportunities");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>新建商机</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">公司名称 <span className="text-red-500">*</span></label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">网站</label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">联系人 <span className="text-red-500">*</span></label>
                <Input
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">联系电话 <span className="text-red-500">*</span></label>
                <Input
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">微信</label>
                <Input
                  name="contactWechat"
                  value={formData.contactWechat}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">部门</label>
                <Input
                  name="contactDepartment"
                  value={formData.contactDepartment}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">职位</label>
                <Input
                  name="contactPosition"
                  value={formData.contactPosition}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">公司规模</label>
                <Select
                  value={formData.companySize}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, companySize: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择公司规模" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1-50人</SelectItem>
                    <SelectItem value="51-200">51-200人</SelectItem>
                    <SelectItem value="201-500">201-500人</SelectItem>
                    <SelectItem value="501-1000">501-1000人</SelectItem>
                    <SelectItem value="1000+">1000人以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">地区</label>
                <Input
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">行业</label>
                <Input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">状态 <span className="text-red-500">*</span></label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">新建</SelectItem>
                    <SelectItem value="following">跟进中</SelectItem>
                    <SelectItem value="negotiating">谈判中</SelectItem>
                    <SelectItem value="closed">已成交</SelectItem>
                    <SelectItem value="failed">已失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">优先级 <span className="text-red-500">*</span></label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">预期金额 <span className="text-red-500">*</span></label>
                <Input
                  name="expectedAmount"
                  type="number"
                  value={formData.expectedAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">来源</label>
                <Input
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">预计成交日期</label>
                <Input
                  name="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">销售负责人 <span className="text-red-500">*</span></label>
                <Input
                  name="salesPerson"
                  value={formData.salesPerson}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">销售团队</label>
                <Input
                  name="salesTeam"
                  value={formData.salesTeam}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">下次跟进日期</label>
                <Input
                  name="nextFollowUpDate"
                  type="date"
                  value={formData.nextFollowUpDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">下次跟进内容</label>
                <Input
                  name="nextFollowUpContent"
                  value={formData.nextFollowUpContent}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">商机描述</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="请输入商机描述..."
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                保存
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}