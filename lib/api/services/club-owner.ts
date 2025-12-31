/**
 * Club Owner API Service
 * Handles all API calls related to club owner role
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type { ClubOwnerResponse, ClubOwnerApiResponse, CreateClubOwnerRequest } from "../types";
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
 * Get the logged-in user's club owner data
 * Returns null if club owner role doesn't exist (404 is normal, not an error)
 * Throws for other errors (400, 422, 500, etc.)
 */
export async function getClubOwnerMe(): Promise<ClubOwnerResponse | null> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await apiClient.get<ClubOwnerApiResponse>(
      API_ENDPOINTS.CLUB_OWNER.GET_ME,
      { headers }
    );

    if (!response.success || !response.data) {
      // If club owner doesn't exist, return null (this is normal, not an error)
      return null;
    }
    
    return response.data;
  } catch (error: any) {
    // Check if it's a 404 - this means club owner doesn't exist yet (normal flow)
    const status = error?.status || error?.response?.status;
    const errorMessage = error?.message?.toLowerCase() || "";
    
    if (status === 404 || errorMessage.includes("404") || errorMessage.includes("not found")) {
      // 404 is expected when club owner role doesn't exist - return null
      return null;
    }
    
    // For other errors (400, 422, 500, etc.), re-throw
    throw error;
  }
}

/**
 * Create a new club owner role
 * Sends empty body (no form data required)
 */
export async function createClubOwner(data: CreateClubOwnerRequest = {}): Promise<void> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Send empty body - ClubOwner has no fields
  const response = await apiClient.post<BaseResponse>(
    API_ENDPOINTS.CLUB_OWNER.CREATE,
    {},
    { headers }
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to create club owner");
  }
}

