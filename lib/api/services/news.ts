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

  // Add blocks
  data.Blocks.forEach((block, index) => {
    formData.append(`Blocks[${index}].Id`, block.Id);
    formData.append(`Blocks[${index}].Type`, block.Type);
    formData.append(`Blocks[${index}].Order`, block.Order.toString());
    
    // Only append the relevant field per block type
    if (block.Type === "Text" && block.Text) {
      formData.append(`Blocks[${index}].Text`, block.Text);
    } else if (block.Type === "Image" && block.ImageFile) {
      formData.append(`Blocks[${index}].ImageFile`, block.ImageFile);
    } else if (block.Type === "Video" && block.VideoFile) {
      formData.append(`Blocks[${index}].VideoFile`, block.VideoFile);
    }
  });

  const response = await apiClient.post<BaseResponse>(
    API_ENDPOINTS.NEWS.CREATE,
    formData,
    { headers }
  );

  if (!response.success) {
    throw new Error(response.error || "Failed to create news");
  }
}

