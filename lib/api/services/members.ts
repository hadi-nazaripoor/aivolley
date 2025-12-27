/**
 * Members API Service
 * Handles all API calls related to members (players, coaches, referees)
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type {
  ApiMember,
  MembersListResponse,
  PaginatedMembersResponse,
  MemberDetailResponse,
  CreateMemberRequest,
  CreateMemberResponse,
} from "../types";

/**
 * Fetch all members (players, coaches, referees)
 */
export async function getMembers(): Promise<ApiMember[]> {
  const response = await apiClient.get<MembersListResponse | ApiMember[]>(
    API_ENDPOINTS.MEMBERS.LIST
  );
  
  // Handle both BaseResponse format and direct array format
  if (Array.isArray(response)) {
    return response;
  }
  
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch members");
  }
  return response.data;
}

/**
 * Fetch all players
 */
export async function getPlayers(): Promise<ApiMember[]> {
  const response = await apiClient.get<MembersListResponse | ApiMember[]>(
    API_ENDPOINTS.MEMBERS.LIST
  );
  
  // Handle both BaseResponse format and direct array format
  if (Array.isArray(response)) {
    return response;
  }
  
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch players");
  }
  return response.data;
}

/**
 * Filter parameters for members list
 */
export interface MembersFilterParams {
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  gender?: string;
  bornCityId?: string;
}

/**
 * Fetch players with pagination and filters
 */
export async function getPlayersPaginated(
  pageNumber: number = 1,
  pageSize: number = 10,
  filters?: MembersFilterParams
): Promise<{ items: ApiMember[]; totalCount: number; pageNumber: number; pageSize: number }> {
  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  // Add filter parameters if provided
  if (filters) {
    if (filters.firstName) {
      queryParams.append("firstName", filters.firstName);
    }
    if (filters.lastName) {
      queryParams.append("lastName", filters.lastName);
    }
    if (filters.nationalCode) {
      queryParams.append("nationalCode", filters.nationalCode);
    }
    if (filters.gender) {
      queryParams.append("gender", filters.gender);
    }
    if (filters.bornCityId) {
      queryParams.append("bornCityId", filters.bornCityId);
    }
  }
  
  const response = await apiClient.get<PaginatedMembersResponse>(
    `${API_ENDPOINTS.MEMBERS.LIST}?${queryParams.toString()}`
  );
  console.log(response);
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch players");
  }
  
  return {
    items: response.data.items || [],
    totalCount: response.data.totalCount || 0,
    pageNumber: response.data.pageNumber || pageNumber,
    pageSize: response.data.pageSize || pageSize,
  };
}

/**
 * Fetch all coaches
 */
export async function getCoaches(): Promise<ApiMember[]> {
  const response = await apiClient.get<MembersListResponse | ApiMember[]>(
    API_ENDPOINTS.MEMBERS.COACHES
  );
  
  // Handle both BaseResponse format and direct array format
  if (Array.isArray(response)) {
    return response;
  }
  
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch coaches");
  }
  return response.data;
}

/**
 * Fetch all referees
 */
export async function getReferees(): Promise<ApiMember[]> {
  const response = await apiClient.get<MembersListResponse | ApiMember[]>(
    API_ENDPOINTS.MEMBERS.REFEREES
  );
  
  // Handle both BaseResponse format and direct array format
  if (Array.isArray(response)) {
    return response;
  }
  
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch referees");
  }
  return response.data;
}

/**
 * Fetch a single member by ID
 */
export async function getMemberById(
  id: string | number
): Promise<ApiMember> {
  const response = await apiClient.get<MemberDetailResponse>(
    API_ENDPOINTS.MEMBERS.DETAIL(id)
  );
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch member");
  }
  return response.data;
}

/**
 * Create a new member
 */
export async function createMember(
  request: CreateMemberRequest
): Promise<ApiMember> {
  const response = await apiClient.post<CreateMemberResponse>(
    API_ENDPOINTS.MEMBERS.CREATE,
    request
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to create member");
  }

  return response.data;
}

