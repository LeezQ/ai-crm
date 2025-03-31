import { AuthenticationError, ServerError } from "./error";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  data?: any;
  headers?: Record<string, string>;
}

export interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    method: string,
    url: string,
    options: RequestOptions = {}
  ): Promise<Response<T>> {
    const { params, data, headers = {}, ...restOptions } = options;

    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    const token = localStorage.getItem("token");
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${url}${queryString}`, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
        ...restOptions,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new AuthenticationError("认证失败");
        }
        throw new ServerError(`请求失败: ${response.statusText}`);
      }

      const responseData = await response.json();
      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new ServerError("网络请求失败");
    }
  }

  async get<T>(url: string, options?: RequestOptions): Promise<Response<T>> {
    return this.request<T>("GET", url, options);
  }

  async post<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<Response<T>> {
    return this.request<T>("POST", url, { ...options, data });
  }

  async put<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<Response<T>> {
    return this.request<T>("PUT", url, { ...options, data });
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<Response<T>> {
    return this.request<T>("DELETE", url, options);
  }
}

export const http = new HttpClient(process.env.NEXT_PUBLIC_API_URL || "");

export async function get<T>(
  url: string,
  options?: RequestOptions
): Promise<Response<T>> {
  return http.get<T>(url, options);
}

export async function post<T>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<Response<T>> {
  return http.post<T>(url, data, options);
}

export async function put<T>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<Response<T>> {
  return http.put<T>(url, data, options);
}

export async function del<T>(
  url: string,
  options?: RequestOptions
): Promise<Response<T>> {
  return http.delete<T>(url, options);
}
