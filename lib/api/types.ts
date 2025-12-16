/**
 * API request and response types
 * Define all API-related types here
 */

import type { BaseResponse, PaginatedResponse } from "@/lib/types/common";

/**
 * Auth API Types
 */
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse extends BaseResponse {
  data?: {
    token?: string;
    user: {
      id: string | number;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
}

export interface RegisterRequest {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterResponse extends BaseResponse {
  data?: {
    token?: string;
    user: {
      id: string | number;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
}

/**
 * Member/Player API Types
 * These types represent the structure of data returned from the API
 */

export interface ApiMember {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string | null;
  teamName: string;
  position: string;
  insuranceExpiryDate: string;
  isInsuranceValid: boolean;
}

export interface MembersListResponse extends BaseResponse {
  data?: ApiMember[];
}

export interface PaginatedMembersResponse extends BaseResponse {
  data?: {
    items: ApiMember[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface MemberDetailResponse extends BaseResponse {
  data?: ApiMember;
}

/**
 * Province and City Types
 */
export interface Province {
  id: string; // Guid
  name: string;
}

export interface City {
  id: string; // Guid
  name: string;
  provinceId: string; // Guid
}

export interface ProvincesListResponse extends BaseResponse {
  data?: Province[];
}

export interface CitiesListResponse extends BaseResponse {
  data?: City[];
}

/**
 * Create Member Types
 */
export interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
  dateOfBirth: string; // ISO date string
  gender: string;
  avatar: string | null;
  bornCityId: string; // Guid
}

export interface CreateMemberResponse extends BaseResponse {
  data?: ApiMember;
}

