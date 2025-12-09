/**
 * Common TypeScript types and interfaces
 */

export type Status = "idle" | "loading" | "success" | "error";

export interface BaseResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

