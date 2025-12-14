/**
 * Members API Service
 * Handles all API calls related to members (players, coaches, referees)
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type {
  ApiMember,
  MembersListResponse,
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

