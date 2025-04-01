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

// 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        throw new AuthenticationError();
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
    list: () => request("/api/teams"),
    get: (id: string) => request(`/api/teams/${id}`),
    create: (data: any) =>
      request("/api/teams", {
        method: "POST",
        data,
      }),
    update: (id: string, data: any) =>
      request(`/api/teams/${id}`, {
        method: "PUT",
        data,
      }),
    delete: (id: string) =>
      request(`/api/teams/${id}`, {
        method: "DELETE",
      }),
    members: {
      list: (id: string) => request(`/api/teams/${id}/members`),
      add: (id: string, data: any) =>
        request(`/api/teams/${id}/members`, {
          method: "POST",
          data,
        }),
      remove: (id: string, memberId: string) =>
        request(`/api/teams/${id}/members/${memberId}`, {
          method: "DELETE",
        }),
    },
    import: (id: string, file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return request(`/api/teams/${id}/import`, {
        method: "POST",
        data: formData,
      });
    },
  },

  // 统计分析
  analytics: {
    dashboard: () => request("/api/analytics/dashboard"),
    opportunities: (params?: Record<string, string>) =>
      request("/api/analytics/opportunities", { params }),
    teams: (params?: Record<string, string>) =>
      request("/api/analytics/teams", { params }),
  },
};
