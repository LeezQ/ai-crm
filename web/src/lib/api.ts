"use client";
import axios, { AxiosRequestConfig } from "axios";
import { AuthenticationError, ServerError } from "./error";
import { Opportunity, FollowUpRecord } from "@/types/opportunity";

interface RequestOptions extends AxiosRequestConfig {
  params?: Record<string, string>;
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
    config.headers["teamId"] = localStorage.getItem("teamId") || "";
  }

  return config;
});

// 401 错误处理函数
const handleAuthError = () => {
  // 清除登录凭证
  localStorage.removeItem("token");
  localStorage.removeItem("teamId");

  // 如果在客户端环境，则重定向到登录页
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }

  throw new AuthenticationError("登录已过期，请重新登录");
};

// 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        return handleAuthError();
      }
      throw new ServerError(error.response.data?.message || "请求失败");
    }
    throw new ServerError("网络请求失败");
  }
);

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  return instance(endpoint, options);
}

// API方法
export const api = {
  // 认证相关
  auth: {
    login: (data: { email: string; password: string }) =>
      request<{
        success: boolean;
        data: {
          token: string;
          user: {
            id: number;
            email: string;
            name: string;
            role: string;
          };
        };
      }>("/api/auth/login", {
        method: "POST",
        data,
      }),
    register: (data: { name: string; email: string; password: string }) =>
      request<{
        success: boolean;
        message: string;
        data?: {
          user: {
            id: number;
            email: string;
            name: string;
          };
        };
      }>("/api/auth/register", {
        method: "POST",
        data,
      }),
    getProfile: () =>
      request<{
        id: number;
        username: string;
        name: string;
        email: string;
        phone: string;
        avatar: string;
        role: string;
        status: string;
        lastLoginAt: string;
        createdAt: string;
      }>("/api/auth/profile", {
        method: "GET",
      }),
  },

  // 商机相关
  opportunities: {
    list: (params?: Record<string, string>) =>
      request<{
        items: Opportunity[];
        pagination: {
          total: number;
          page: number;
          pageSize: number;
          totalPages: number;
        };
      }>("/api/opportunities", { params }),
    get: (id: string) => request<Opportunity>(`/api/opportunities/${id}`),
    create: (data: any) =>
      request("/api/opportunities", {
        method: "POST",
        data,
      }),
    update: (id: string, data: any) =>
      request(`/api/opportunities/${id}`, {
        method: "PUT",
        data,
      }),
    updateStatus: (id: string, data: { status: Opportunity["status"] }) =>
      request(`/api/opportunities/${id}/status`, {
        method: "PUT",
        data,
      }),
    delete: (id: string) =>
      request(`/api/opportunities/${id}`, {
        method: "DELETE",
      }),
    followUps: {
      list: (id: string) =>
        request<FollowUpRecord[]>(`/api/opportunities/${id}/follow-ups`),
      create: (
        id: string,
        data: Omit<FollowUpRecord, "id" | "creator" | "createTime">
      ) =>
        request<FollowUpRecord>(`/api/opportunities/${id}/follow-ups`, {
          method: "POST",
          data,
        }),
    },
  },

  // 团队相关
  teams: {
    list: () => request<Team[]>("/api/teams"),
    get: (id: string) => request<Team>(`/api/teams/${id}`),
    create: (data: Omit<Team, "id" | "memberCount" | "createTime">) =>
      request<Team>("/api/teams", {
        method: "POST",
        data,
      }),
    update: (
      id: string,
      data: Partial<Omit<Team, "id" | "memberCount" | "createTime">>
    ) =>
      request<Team>(`/api/teams/${id}`, {
        method: "PUT",
        data,
      }),
    delete: (id: string) =>
      request(`/api/teams/${id}`, {
        method: "DELETE",
      }),
    members: {
      list: (id: string) => request<TeamMember[]>(`/api/teams/${id}/members`),
      add: (id: string, data: { email: string; role: "admin" | "member" }) =>
        request<any>(`/api/teams/${id}/members`, {
          method: "POST",
          data,
        }),
      remove: (id: string, memberId: number) =>
        request(`/api/teams/${id}/members/${memberId}`, {
          method: "DELETE",
        }),
    },
    import: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return request(`/api/teams/import`, {
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  },

  // 统计分析
  analytics: {
    dashboard: () =>
      request<{
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
      }>("/api/dashboard"),
    opportunities: (params?: Record<string, string>) =>
      request("/api/analytics/opportunities", { params }),
    teams: (params?: Record<string, string>) =>
      request("/api/analytics/teams", { params }),
  },

  user: {
    profile: async () => {
      return request("/api/user/profile");
    },
    updateProfile: async (data: {
      name?: string;
      phone?: string;
      avatar?: string;
    }) => {
      return request("/api/user/profile", {
        method: "PATCH",
        data,
      });
    },
    changePassword: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return request("/api/user/change-password", {
        method: "POST",
        data,
      });
    },
    updateSettings: async (data: {
      language?: string;
      theme?: string;
      notifications?: boolean;
    }) => {
      return request("/api/user/settings", {
        method: "PATCH",
        data,
      });
    },
  },
};

// Exported interfaces matching backend structure (assuming numeric IDs)
export interface TeamMember {
  memberId: number; // Matches backend parseInt and select alias
  userId: number; // Matches backend parseInt and select alias
  name: string;
  email: string;
  role: "admin" | "member";
  // Status and joinedAt are not in list response
}

export interface Team {
  id: string; // Keep string for now, adjust if needed
  name: string;
  description: string;
  memberCount: number;
  createTime: string;
  admin: string;
}
