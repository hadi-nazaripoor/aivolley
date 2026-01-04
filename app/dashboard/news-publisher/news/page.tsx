"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NewsList } from "@/components/features/news-list";
import { getMyNewsPaginated } from "@/lib/api/services/news";
import { usePagination } from "@/lib/hooks/use-pagination";
import type { SummarizedNewsResponse } from "@/lib/api/types";
import { useAuth } from "@/lib/contexts/auth-context";

interface NewsItem {
  id: string;
  title: string;
  shortDescription: string;
  dateTime: string;
  thumbImage: string;
  type: string;
  locality: string;
  relatedCityId?: string | null;
}

export default function MyNewsPage() {
  const router = useRouter();
  const { hasRole, isLoading: authLoading } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pagination = usePagination(10);
  const { pagination: paginationState, setPageNumber, setTotalCount } = pagination;

  // Check if user has NewsPublisher role
  useEffect(() => {
    if (!authLoading) {
      if (!hasRole("NewsPublisher")) {
        router.push("/dashboard");
      }
    }
  }, [hasRole, authLoading, router]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMyNewsPaginated(
        paginationState.pageNumber,
        paginationState.pageSize
      );
      
      // Map API data to component NewsItem interface
      const mappedNews: NewsItem[] = result.items.map((item: SummarizedNewsResponse) => ({
        id: item.id,
        title: item.title,
        shortDescription: item.shortDescription,
        dateTime: item.dateTime,
        thumbImage: item.thumbImage,
        type: item.type,
        locality: item.locality,
        relatedCityId: item.relatedCityId,
      }));
      
      setNews(mappedNews);
      setTotalCount(result.totalCount);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load news";
      setError(errorMessage);
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }, [paginationState.pageNumber, paginationState.pageSize, setTotalCount]);

  useEffect(() => {
    if (hasRole("NewsPublisher")) {
      fetchNews();
    }
  }, [fetchNews, hasRole]);

  const handleAddClick = () => {
    router.push("/dashboard/news-publisher/news/create");
  };

  // Don't render if user doesn't have NewsPublisher role
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasRole("NewsPublisher")) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {loading ? (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">در حال بارگذاری...</p>
          </div>
        </div>
      ) : error ? (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-sm text-red-600">
              خطا در بارگذاری داده‌ها: {error}
            </p>
          </div>
        </div>
      ) : (
        <NewsList
          news={news}
          onAddClick={handleAddClick}
          pagination={{
            pageNumber: paginationState.pageNumber,
            pageSize: paginationState.pageSize,
            totalCount: paginationState.totalCount,
            onPageChange: setPageNumber,
          }}
        />
      )}
    </div>
  );
}

