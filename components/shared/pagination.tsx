"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface PaginationProps {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalCount);

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Show up to 7 page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (pageNumber <= 3) {
        // Show first few pages
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (pageNumber >= totalPages - 2) {
        // Show last few pages
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current
        pages.push("...");
        for (let i = pageNumber - 1; i <= pageNumber + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (pageNumber > 1) {
      onPageChange(pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages) {
      onPageChange(pageNumber + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6",
        className
      )}
    >
      {/* Mobile Pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={pageNumber === 1}
          className={cn(
            "relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700",
            pageNumber === 1
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-50"
          )}
        >
          قبلی
        </button>
        <button
          onClick={handleNext}
          disabled={pageNumber >= totalPages}
          className={cn(
            "relative ms-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700",
            pageNumber >= totalPages
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-50"
          )}
        >
          بعدی
        </button>
      </div>

      {/* Desktop Pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            نمایش <span className="font-medium">{startItem}</span> تا{" "}
            <span className="font-medium">{endItem}</span> از{" "}
            <span className="font-medium">{totalCount}</span> نتیجه
          </p>
        </div>
        <div>
          <nav aria-label="صفحه‌بندی" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
            <button
              onClick={handlePrevious}
              disabled={pageNumber === 1}
              className={cn(
                "relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0",
                pageNumber === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-50"
              )}
            >
              <span className="sr-only">قبلی</span>
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>

            {pageNumbers.map((page) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${page}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
                  >
                    ...
                  </span>
                );
              }

              const isCurrentPage = page === pageNumber;
              return (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  aria-current={isCurrentPage ? "page" : undefined}
                  className={cn(
                    "relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0",
                    isCurrentPage
                      ? "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "text-gray-900 hover:bg-gray-50 focus:outline-offset-0"
                  )}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={handleNext}
              disabled={pageNumber >= totalPages}
              className={cn(
                "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0",
                pageNumber >= totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-50"
              )}
            >
              <span className="sr-only">بعدی</span>
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

