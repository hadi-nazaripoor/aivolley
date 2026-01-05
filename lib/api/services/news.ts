/**
 * News API Service
 * Handles all news-related API calls
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PaginatedNewsResponse, SummarizedNewsResponse, CreateNewsRequest, BaseResponse } from "@/lib/api/types";

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
 * Fetch user's news with pagination
 */
export async function getMyNewsPaginated(
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<{ items: SummarizedNewsResponse[]; totalCount: number; pageNumber: number; pageSize: number }> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });
  
  const response = await apiClient.get<PaginatedNewsResponse>(
    `${API_ENDPOINTS.NEWS.MINE}?${queryParams.toString()}`,
    { headers }
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch news");
  }
  
  return {
    items: response.data.items || [],
    totalCount: response.data.totalCount || 0,
    pageNumber: response.data.pageNumber || pageNumber,
    pageSize: response.data.pageSize || pageSize,
  };
}

/**
 * Fetch public news with pagination (for homepage)
 * Uses the same endpoint but without requiring authentication
 */
export async function getPublicNewsPaginated(
  pageNumber: number = 1,
  pageSize: number = 50
): Promise<{ items: SummarizedNewsResponse[]; totalCount: number; pageNumber: number; pageSize: number }> {
  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });
  
  // Try to use /news endpoint first, fallback to /news/mine if needed
  const endpoint = API_ENDPOINTS.NEWS.LIST; // Using mine endpoint as it may work without auth
  const response = await apiClient.get<PaginatedNewsResponse>(
    `${endpoint}?${queryParams.toString()}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to fetch news");
  }
  
  return {
    items: response.data.items || [],
    totalCount: response.data.totalCount || 0,
    pageNumber: response.data.pageNumber || pageNumber,
    pageSize: response.data.pageSize || pageSize,
  };
}

/**
 * Create a new news item
 * Uses FormData for file upload support
 */
export async function createNews(data: CreateNewsRequest): Promise<void> {
  const token = getJwtToken();
  
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Build FormData for multipart/form-data request
  const formData = new FormData();

  // --- Main news fields ---
  formData.append("Title", data.Title);
  formData.append("Slug", data.Slug);
  formData.append("ShortDescription", data.ShortDescription);
  formData.append("DateTime", data.DateTime);
  formData.append("ThumbImage", data.ThumbImage);
  formData.append("Type", data.Type);
  formData.append("Locality", data.Locality);

  if (data.RelatedCityId) {
    formData.append("RelatedCityId", data.RelatedCityId);
  }

  formData.append("IsPinned", data.IsPinned.toString());

  // --- Content blocks (CreateNewsContentBlockRequest[]) ---
  // Use indexed keys so backend receives a proper list of blocks in the same request
  data.Blocks.forEach((block, index) => {
    // Preserve the UI-defined order explicitly
    formData.append(`Blocks[${index}].Order`, block.Order.toString());

    // Core block fields
    formData.append(`Blocks[${index}].Type`, block.Type);
    formData.append(`Blocks[${index}].Id`, block.Id);

    // Only append the relevant payload per block type
    if (block.Type === "Text" && block.Text) {
      formData.append(`Blocks[${index}].Text`, block.Text);
    } else if (block.Type === "Image" && block.ImageFile instanceof File) {
      formData.append(`Blocks[${index}].ImageFile`, block.ImageFile);
    } else if (block.Type === "Video" && block.VideoFile instanceof File) {
      formData.append(`Blocks[${index}].VideoFile`, block.VideoFile);
    }
  });

  // --- Temporary debug log: log all FormData entries before sending ---
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[DEBUG] createNews FormData entries:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // eslint-disable-next-line no-console
        console.log(key, {
          type: "File",
          name: value.name,
          size: value.size,
          fileType: value.type,
        });
      } else {
        // eslint-disable-next-line no-console
        console.log(key, value);
      }
    }
  }

  const response = await apiClient.post<BaseResponse>(
    API_ENDPOINTS.NEWS.CREATE,
    formData,
    { headers }
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to create news");
  }
}

