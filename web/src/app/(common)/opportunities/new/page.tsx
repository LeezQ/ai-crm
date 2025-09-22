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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const statusOptions = [
  { value: "new", label: "新建" },
  { value: "qualified", label: "已筛选" },
  { value: "proposition", label: "方案阶段" },
  { value: "negotiation", label: "谈判中" },
  { value: "closed_won", label: "赢单" },
  { value: "closed_lost", label: "丢单" },
];

const priorityOptions = [
  { value: "high", label: "高" },
  { value: "medium", label: "中" },
  { value: "low", label: "低" },
];

const sourceOptions = [
  { value: "website", label: "官网" },
  { value: "referral", label: "转介绍" },
  { value: "event", label: "展会/活动" },
  { value: "social", label: "社交媒体" },
  { value: "search", label: "搜索引擎" },
  { value: "other", label: "其他" },
];

const companySizeOptions = [
  { value: "1-50", label: "1-50人" },
  { value: "51-200", label: "51-200人" },
  { value: "201-500", label: "201-500人" },
  { value: "501-1000", label: "501-1000人" },
  { value: "1000+", label: "1000人以上" },
];

interface OpportunityFormState {
  companyName: string;
  website: string;
  contactPerson: string;
  contactPhone: string;
  contactWechat: string;
  contactDepartment: string;
  contactPosition: string;
  companySize: string;
  region: string;
  industry: string;
  status: string;
  priority: string;
  expectedAmount: string;
  source: string;
  expectedCloseDate: string;
  description: string;
  nextFollowUpAt: string;
  nextFollowUpNote: string;
}

export default function NewOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiFollowUp, setAiFollowUp] = useState<string | null>(null);
  const [formData, setFormData] = useState<OpportunityFormState>({
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
    expectedAmount: "0",
    source: "",
    expectedCloseDate: "",
    description: "",
    nextFollowUpAt: "",
    nextFollowUpNote: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    name: keyof OpportunityFormState,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAiAssist = async () => {
    if (!aiPrompt.trim()) {
      toast.warning("请先输入客户或商机描述");
      return;
    }

    try {
      setAiLoading(true);
      const response = await api.ai.opportunities.assist(aiPrompt.trim(), false);
      const opportunity = response.structured?.opportunity || {};
      const followUp = response.structured?.followUp;

      setFormData((prev) => ({
        ...prev,
        ...opportunity,
        expectedAmount: opportunity.expectedAmount || prev.expectedAmount,
        expectedCloseDate: opportunity.expectedCloseDate
          ? opportunity.expectedCloseDate.slice(0, 10)
          : prev.expectedCloseDate,
        nextFollowUpAt: opportunity.nextFollowUpAt
          ? opportunity.nextFollowUpAt.slice(0, 10)
          : prev.nextFollowUpAt,
        nextFollowUpNote: opportunity.nextFollowUpNote || prev.nextFollowUpNote,
      }));

      setAiSummary(response.structured?.summary || null);
      setAiFollowUp(
        followUp?.nextPlan || followUp?.content || response.structured?.summary || null
      );

      toast.success("已根据描述智能补全表单，可继续人工调整");
    } catch (error) {
      console.error("AI 辅助填表失败", error);
      toast.error("AI 辅助暂时不可用，请稍后重试");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        expectedAmount: formData.expectedAmount || "0",
        nextFollowUpAt: formData.nextFollowUpAt || undefined,
        nextFollowUpNote: formData.nextFollowUpNote || undefined,
      };
      await api.opportunities.create(payload);
      toast.success("商机创建成功");
      router.push("/opportunities");
    } catch (error) {
      console.error("创建商机失败", error);
      toast.error("创建失败，请检查输入");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI 智能录入
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={aiPrompt}
            onChange={(event) => setAiPrompt(event.target.value)}
            placeholder="粘贴客户对话、会议纪要或商机描述，让 AI 帮你自动填表..."
            rows={4}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleAiAssist} disabled={aiLoading}>
              {aiLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              生成建议
            </Button>
            {aiSummary && (
              <span className="text-sm text-muted-foreground">
                AI 摘要：{aiSummary}
              </span>
            )}
          </div>
          {aiFollowUp && (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <div className="font-medium mb-1">建议跟进</div>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {aiFollowUp}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>新建商机</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-lg font-medium">客户信息</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">公司名称 *</label>
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">公司规模 *</label>
                  <Select
                    value={formData.companySize}
                    onValueChange={(value) => handleSelectChange("companySize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择公司规模" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">公司网站</label>
                  <Input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">联系人 *</label>
                  <Input
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">部门 *</label>
                  <Input
                    name="contactDepartment"
                    value={formData.contactDepartment}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">职位 *</label>
                  <Input
                    name="contactPosition"
                    value={formData.contactPosition}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">联系电话 *</label>
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
                  <label className="text-sm font-medium">所在地区 *</label>
                  <Input
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">行业 *</label>
                  <Input
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium">销售信息</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">状态 *</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">优先级 *</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">来源</label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleSelectChange("source", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择来源" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">预期金额 (元) *</label>
                  <Input
                    name="expectedAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.expectedAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">预计成交日期 *</label>
                  <Input
                    name="expectedCloseDate"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">下一次跟进日期</label>
                  <Input
                    name="nextFollowUpAt"
                    type="date"
                    value={formData.nextFollowUpAt}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">下一步计划</label>
                <Textarea
                  name="nextFollowUpNote"
                  value={formData.nextFollowUpNote}
                  onChange={handleChange}
                  rows={3}
                  placeholder="记录下一次沟通的重点或约定内容"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">商机描述 *</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="请输入商机背景、客户需求或当前进展"
                  required
                />
              </div>
            </section>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
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
