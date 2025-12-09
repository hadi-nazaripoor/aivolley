/**
 * API request and response types
 * Define all API-related types here
 */

import type { BaseResponse, PaginatedResponse } from "@/lib/types/common";

// Example API types - customize based on your needs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends BaseResponse {
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse extends BaseResponse {
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

