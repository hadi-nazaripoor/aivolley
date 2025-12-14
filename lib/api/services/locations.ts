/**
 * Locations API Service
 * Handles all API calls related to provinces and cities
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type {
  Province,
  City,
  ProvincesListResponse,
  CitiesListResponse,
} from "../types";

/**
 * Fetch all provinces
 */
export async function getProvinces(): Promise<Province[]> {
  const response = await apiClient.get<ProvincesListResponse | Province[]>(
    API_ENDPOINTS.LOCATIONS.PROVINCES
  );

  // Handle both BaseResponse format and direct array format
  if (Array.isArray(response)) {
    return response;
  }

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch provinces");
  }

  return response.data;
}

/**
 * Fetch cities by province ID
 */
export async function getCitiesByProvinceId(
  provinceId: string
): Promise<City[]> {
  const response = await apiClient.get<CitiesListResponse | City[]>(
    API_ENDPOINTS.LOCATIONS.CITIES(provinceId)
  );

  // Handle both BaseResponse format and direct array format
  if (Array.isArray(response)) {
    return response;
  }

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch cities");
  }

  return response.data;
}

