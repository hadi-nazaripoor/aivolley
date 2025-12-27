/**
 * Profile API Service
 * Handles all API calls related to user profile
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type { ProfileResponse, ProfileApiResponse } from "../types";
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
 * Get the logged-in user's profile
 * Note: userId is NOT sent from frontend - backend determines it from auth token
 * 
 * If a JWT token is available, it will be included in the Authorization header as "Bearer <JWT>".
 * If no JWT token is present, the request will be made without any Authorization header.
 */
export async function getProfile(): Promise<ProfileResponse> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.get<ProfileApiResponse>(
    API_ENDPOINTS.PROFILE.GET,
    { headers }
  );
  console.log(response);
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch profile");
  }
  
  return response.data;
}

/**
 * Update profile data interface
 */
export interface UpdateProfileData {
  FirstName: string;
  LastName: string;
  FatherName: string;
  NationalCode: string;
  DateOfBirth: string; // ISO date string
  Gender: string;
  BornProvinceId: string;
  BornCityId: string;
  Avatar?: File; // Optional - only included if user selected a new file
}

/**
 * Update the logged-in user's profile
 * Uses multipart/form-data to send form data and optional avatar file
 */
export async function updateProfile(data: UpdateProfileData): Promise<void> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Build FormData
  const formData = new FormData();
  formData.append("FirstName", data.FirstName);
  formData.append("LastName", data.LastName);
  formData.append("FatherName", data.FatherName);
  formData.append("NationalCode", data.NationalCode);
  formData.append("DateOfBirth", data.DateOfBirth);
  formData.append("Gender", data.Gender);
  formData.append("BornProvinceId", data.BornProvinceId);
  formData.append("BornCityId", data.BornCityId);
  
  // Only append Avatar if a file was selected
  if (data.Avatar) {
    formData.append("Avatar", data.Avatar);
  }

  const response = await apiClient.put<BaseResponse>(
    API_ENDPOINTS.PROFILE.UPDATE,
    formData,
    { headers }
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to update profile");
  }
}

