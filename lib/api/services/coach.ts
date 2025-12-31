/**
 * Coach API Service
 * Handles all API calls related to coach role
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type { CoachResponse, CoachApiResponse, CreateCoachRequest, UpdateCoachRequest } from "../types";
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
 * Get the logged-in user's coach data
 * Returns null if coach role doesn't exist (404 is normal, not an error)
 * Throws for other errors (400, 422, 500, etc.)
 */
export async function getCoachMe(): Promise<CoachResponse | null> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await apiClient.get<CoachApiResponse>(
      API_ENDPOINTS.COACH.GET_ME,
      { headers }
    );

    if (!response.success || !response.data) {
      // If coach doesn't exist, return null (this is normal, not an error)
      return null;
    }
    
    return response.data;
  } catch (error: any) {
    // Check if it's a 404 - this means coach doesn't exist yet (normal flow)
    const status = error?.status || error?.response?.status;
    const errorMessage = error?.message?.toLowerCase() || "";
    
    if (status === 404 || errorMessage.includes("404") || errorMessage.includes("not found")) {
      // 404 is expected when coach role doesn't exist - return null
      return null;
    }
    
    // For other errors (400, 422, 500, etc.), re-throw
    throw error;
  }
}

/**
 * Create a new coach role
 * Uses FormData for file upload support
 */
export async function createCoach(data: CreateCoachRequest): Promise<void> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Build FormData for multipart/form-data request
  const formData = new FormData();
  formData.append("CoachingLevel", data.coachingLevel);
  formData.append("CoachingCertificateIssuedAt", data.coachingCertificateIssuedAt);
  
  // Only append image if provided
  if (data.coachingCertificateImage) {
    formData.append("CoachingCertificateImage", data.coachingCertificateImage);
  }

  const response = await apiClient.post<BaseResponse>(
    API_ENDPOINTS.COACH.CREATE,
    formData,
    { headers }
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to create coach");
  }
}

/**
 * Update existing coach role
 * Uses FormData for file upload support
 */
export async function updateCoach(data: UpdateCoachRequest): Promise<void> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Build FormData for multipart/form-data request
  const formData = new FormData();
  formData.append("CoachingLevel", data.coachingLevel);
  formData.append("CoachingCertificateIssuedAt", data.coachingCertificateIssuedAt);
  
  // Only append image if user uploaded a new one
  if (data.coachingCertificateImage) {
    formData.append("CoachingCertificateImage", data.coachingCertificateImage);
  }

  const response = await apiClient.post<BaseResponse>(
    API_ENDPOINTS.COACH.UPDATE,
    formData,
    { headers }
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to update coach");
  }
}

