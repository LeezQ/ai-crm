const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...restOptions } = options;

  // 构建URL
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // 获取token
  const token = localStorage.getItem("token");

  // 设置请求头
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...restOptions.headers,
  };

  // 发送请求
  const response = await fetch(url.toString(), {
    ...restOptions,
    headers,
  });

  // 处理响应
  if (!response.ok) {
    if (response.status === 401) {
      // token过期或无效，重定向到登录页
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("未授权");
    }
    throw new Error(`请求失败: ${response.statusText}`);
  }

  return response.json();
}

// API方法
export const api = {
  // 认证相关
  auth: {
    login: (data: { username: string; password: string }) =>
      request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () =>
      request("/api/auth/logout", {
        method: "POST",
      }),
    resetPassword: (data: { email: string }) =>
      request("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // 商机相关
  opportunities: {
    list: (params?: Record<string, string>) =>
      request("/api/opportunities", { params }),
    get: (id: string) => request(`/api/opportunities/${id}`),
    create: (data: any) =>
      request("/api/opportunities", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`/api/opportunities/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/api/opportunities/${id}`, {
        method: "DELETE",
      }),
    followUps: {
      list: (id: string) => request(`/api/opportunities/${id}/follow-ups`),
      create: (id: string, data: any) =>
        request(`/api/opportunities/${id}/follow-ups`, {
          method: "POST",
          body: JSON.stringify(data),
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
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`/api/teams/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
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
          body: JSON.stringify(data),
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
        body: formData,
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
