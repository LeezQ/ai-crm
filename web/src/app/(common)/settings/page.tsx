"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";

// 用户资料类型定义
interface UserProfile {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  status: string;
  settings?: {
    language?: string;
    theme?: string;
    notifications?: boolean;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [systemSettings, setSystemSettings] = useState({
    language: "zh-CN",
    theme: "light",
    notifications: true,
  });

  useEffect(() => {
    // 加载用户资料
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await api.user.profile() as UserProfile;

        setProfile({
          name: userProfile.name || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          avatar: userProfile.avatar || "",
        });

        // 如果有用户设置，加载设置
        if (userProfile.settings) {
          setSystemSettings({
            language: userProfile.settings.language || "zh-CN",
            theme: userProfile.settings.theme || "light",
            notifications: userProfile.settings.notifications !== undefined ? userProfile.settings.notifications : true,
          });
        }
      } catch (error) {
        console.error("加载用户资料失败:", error);
        toast.error("加载用户资料失败", {
          description: "无法获取您的个人信息，请稍后重试。",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSystemSettingChange = (name: string, value: string | boolean) => {
    setSystemSettings((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      // 准备要更新的数据
      const updateData = {
        name: profile.name,
        phone: profile.phone,
        avatar: profile.avatar,
      };

      await api.user.updateProfile(updateData);
      toast.success("个人资料已更新", {
        description: "您的个人资料已成功更新。",
      });
    } catch (error) {
      toast.error("更新失败", {
        description: "更新个人资料时出错，请稍后重试。",
      });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      toast.error("密码不匹配", {
        description: "新密码和确认密码不匹配。",
      });
      return;
    }

    try {
      setSaving(true);
      await api.user.changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });

      toast.success("密码已更新", {
        description: "您的密码已成功更新。",
      });

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("更新失败", {
        description: "更新密码时出错，请稍后重试。",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveSystemSettings = async () => {
    try {
      setSaving(true);
      await api.user.updateSettings(systemSettings);

      toast.success("系统设置已更新", {
        description: "您的系统设置已成功更新。",
      });
    } catch (error) {
      toast.error("更新失败", {
        description: "更新系统设置时出错，请稍后重试。",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">设置</h2>
        <p className="text-muted-foreground">管理您的账户设置和偏好。</p>
      </div>

      <Card className="bg-white border-slate-200">
        <CardContent className="">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">个人资料</TabsTrigger>
              <TabsTrigger value="password">修改密码</TabsTrigger>
              <TabsTrigger value="system">系统设置</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="请输入您的姓名"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="请输入您的邮箱"
                    disabled  // 邮箱不允许修改
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">电话</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="请输入您的电话号码"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">头像URL</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    value={profile.avatar}
                    onChange={handleProfileChange}
                    placeholder="请输入头像图片URL"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={saveProfile} disabled={saving}>
                    {saving ? "保存中..." : "保存更改"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="password" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">当前密码</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={password.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="请输入当前密码"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">新密码</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={password.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="请输入新密码"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认新密码</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={password.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="请再次输入新密码"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={changePassword} disabled={saving}>
                    {saving ? "更新中..." : "更新密码"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">语言</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={systemSettings.language}
                    onChange={(e) => handleSystemSettingChange("language", e.target.value)}
                  >
                    <option value="zh-CN">中文 (简体)</option>
                    <option value="en-US">English (US)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">主题</Label>
                  <select
                    id="theme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={systemSettings.theme}
                    onChange={(e) => handleSystemSettingChange("theme", e.target.value)}
                  >
                    <option value="light">浅色</option>
                    <option value="dark">深色</option>
                    <option value="system">跟随系统</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notifications"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={systemSettings.notifications}
                      onChange={(e) => handleSystemSettingChange("notifications", e.target.checked)}
                    />
                    <Label htmlFor="notifications">启用通知</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">接收重要更新和活动通知。</p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={saveSystemSettings} disabled={saving}>
                    {saving ? "保存中..." : "保存设置"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}