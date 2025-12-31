/**
 * Clubs API Service
 * Handles all API calls related to clubs
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type {
  ClubResponse,
  ClubApiResponse,
  PaginatedClubsResponse,
  CreateOrUpdateClubRequest,
} from "../types";
import type { BaseResponse } from "@/lib/types/common";

/**
 * Get JWT token from localStorage
 */
function getJwtToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user?.token || null;
    }
  } catch (error) {
    console.error("Error reading token from storage:", error);
  }

  return null;
}

/**
 * Fetch clubs with pagination
 */
export async function getClubsPaginated(
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<{ items: ClubResponse[]; totalCount: number; pageNumber: number; pageSize: number }> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });
  
  const response = await apiClient.get<PaginatedClubsResponse>(
    `${API_ENDPOINTS.CLUBS.LIST}?${queryParams.toString()}`,
    { headers }
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch clubs");
  }
  
  return {
    items: response.data.items || [],
    totalCount: response.data.totalCount || 0,
    pageNumber: response.data.pageNumber || pageNumber,
    pageSize: response.data.pageSize || pageSize,
  };
}

/**
 * Get a single club by ID
 */
export async function getClubById(id: string): Promise<ClubResponse> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.get<ClubApiResponse>(
    API_ENDPOINTS.CLUBS.GET_BY_ID(id),
    { headers }
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch club");
  }
  
  return response.data;
}

/**
 * Create a new club
 * Uses FormData for file upload support
 */
export async function createClub(data: CreateOrUpdateClubRequest): Promise<ClubResponse> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Build FormData for multipart/form-data request
  const formData = new FormData();
  formData.append("Name", data.name);
  formData.append("CityId", data.cityId);
  formData.append("Type", data.type);
  
  if (data.websiteUrl) {
    formData.append("WebsiteUrl", data.websiteUrl);
  }
  if (data.phoneNumber) {
    formData.append("PhoneNumber", data.phoneNumber);
  }
  if (data.address) {
    formData.append("Address", data.address);
  }
  
  // Only append logo if provided
  if (data.logo) {
    formData.append("Logo", data.logo);
  }

  const response = await apiClient.post<ClubApiResponse>(
    API_ENDPOINTS.CLUBS.CREATE,
    formData,
    { headers }
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to create club");
  }
  
  return response.data;
}

/**
 * Update an existing club
 * Uses FormData for file upload support
 */
export async function updateClub(data: CreateOrUpdateClubRequest): Promise<ClubResponse> {
  if (!data.id) {
    throw new Error("Club ID is required for update");
  }

  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Build FormData for multipart/form-data request
  const formData = new FormData();
  formData.append("Id", data.id);
  formData.append("Name", data.name);
  formData.append("CityId", data.cityId);
  formData.append("Type", data.type);
  
  if (data.websiteUrl) {
    formData.append("WebsiteUrl", data.websiteUrl);
  }
  if (data.phoneNumber) {
    formData.append("PhoneNumber", data.phoneNumber);
  }
  if (data.address) {
    formData.append("Address", data.address);
  }
  
  // Only append logo if user uploaded a new one
  if (data.logo) {
    formData.append("Logo", data.logo);
  }

  const response = await apiClient.post<ClubApiResponse>(
    API_ENDPOINTS.CLUBS.UPDATE,
    formData,
    { headers }
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to update club");
  }
  
  return response.data;
}

