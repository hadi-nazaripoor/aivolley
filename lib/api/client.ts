/**
 * API Client
 * Centralized API client for all API calls
 */

import { APP_CONFIG } from "@/lib/constants/config";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = APP_CONFIG.API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Don't set Content-Type header for FormData - browser will set it with boundary
    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

    const config: RequestInit = {
      headers: {
        ...headers,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Create error with status code for proper handling
        const error: any = new Error(`API Error: ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    // If data is FormData, use it directly; otherwise stringify JSON
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
    
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

