/**
 * Player API Service
 * Handles all API calls related to player role
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type { PlayerResponse, PlayerApiResponse, CreatePlayerRequest, UpdatePlayerRequest } from "../types";
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
 * Get the logged-in user's player data
 * Returns null if player role doesn't exist (404 is normal, not an error)
 * Throws for other errors (400, 422, 500, etc.)
 */
export async function getPlayerMe(): Promise<PlayerResponse | null> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await apiClient.get<PlayerApiResponse>(
      API_ENDPOINTS.PLAYER.GET_ME,
      { headers }
    );

    if (!response.success || !response.data) {
      // If player doesn't exist, return null (this is normal, not an error)
      return null;
    }
    
    return response.data;
  } catch (error: any) {
    // Check if it's a 404 - this means player doesn't exist yet (normal flow)
    const status = error?.status || error?.response?.status;
    const errorMessage = error?.message?.toLowerCase() || "";
    
    if (status === 404 || errorMessage.includes("404") || errorMessage.includes("not found")) {
      // 404 is expected when player role doesn't exist - return null
      return null;
    }
    
    // For other errors (400, 422, 500, etc.), re-throw
    throw error;
  }
}

/**
 * Create a new player role
 */
export async function createPlayer(data: CreatePlayerRequest): Promise<void> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.post<BaseResponse>(
    API_ENDPOINTS.PLAYER.CREATE,
    data,
    { headers }
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to create player");
  }
}

/**
 * Update existing player role
 */
export async function updatePlayer(data: UpdatePlayerRequest): Promise<void> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.put<BaseResponse>(
    API_ENDPOINTS.PLAYER.UPDATE,
    data,
    { headers }
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to update player");
  }
}

