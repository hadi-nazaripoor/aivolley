import { useState, useCallback } from "react";

export interface PaginationState {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface UsePaginationReturn {
  pagination: PaginationState;
  setPageNumber: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalCount: (total: number) => void;
  reset: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 10;

export function usePagination(initialPageSize: number = DEFAULT_PAGE_SIZE): UsePaginationReturn {
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 1,
    pageSize: initialPageSize,
    totalCount: 0,
  });

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  const setPageNumber = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, pageNumber: 1 }));
  }, []);

  const setTotalCount = useCallback((total: number) => {
    setPagination((prev) => ({ ...prev, totalCount: total }));
  }, []);

  const reset = useCallback(() => {
    setPagination({
      pageNumber: 1,
      pageSize: initialPageSize,
      totalCount: 0,
    });
  }, [initialPageSize]);

  const goToNextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: Math.min(prev.pageNumber + 1, totalPages),
    }));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: Math.max(prev.pageNumber - 1, 1),
    }));
  }, []);

  const canGoNext = pagination.pageNumber < totalPages;
  const canGoPrevious = pagination.pageNumber > 1;

  return {
    pagination,
    setPageNumber,
    setPageSize,
    setTotalCount,
    reset,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
    totalPages,
  };
}

