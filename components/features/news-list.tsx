"use client";

import { Pagination } from "@/components/shared/pagination";
import { getImageUrl } from "@/lib/utils/image-url";
import { NewsTypes, NewsLocalityTypes } from "@/lib/api/types";
import { Calendar, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NewsItem {
  id: string;
  title: string;
  shortDescription: string;
  dateTime: string;
  thumbImage: string;
  type: NewsTypes;
  locality: NewsLocalityTypes;
  relatedCityId?: string | null;
}

interface NewsListProps {
  news: NewsItem[];
  onAddClick?: () => void;
  pagination?: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
  };
}

// Map NewsTypes to Persian labels
const newsTypeLabels: Record<NewsTypes, string> = {
  [NewsTypes.News]: "خبر",
  [NewsTypes.Announcement]: "اطلاعیه",
  [NewsTypes.Video]: "ویدیو",
  [NewsTypes.Podcast]: "پادکست",
  [NewsTypes.Summary]: "خلاصه",
};

// Map NewsLocalityTypes to Persian labels
const localityLabels: Record<NewsLocalityTypes, string> = {
  [NewsLocalityTypes.National]: "ملی",
  [NewsLocalityTypes.Provincial]: "استانی",
  [NewsLocalityTypes.City]: "شهری",
};

/**
 * Format date for Persian locale
 */
function formatPersianDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function NewsList({ news, onAddClick, pagination }: NewsListProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">اخبار من</h1>
          <p className="mt-2 text-sm text-gray-700">
            فهرست تمام خبرهای شما شامل عنوان، توضیحات کوتاه، تاریخ انتشار و نوع خبر.
          </p>
        </div>
        {onAddClick && (
          <div className="mt-4 sm:mt-0 sm:mr-16 sm:flex-none">
            <button
              type="button"
              onClick={onAddClick}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              افزودن خبر
            </button>
          </div>
        )}
      </div>

      {news.length === 0 ? (
        <div className="mt-8 text-center py-12">
          <p className="text-sm text-gray-500">شما هنوز خبری ثبت نکرده‌اید</p>
        </div>
      ) : (
        <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="space-y-4">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Thumbnail Image */}
                  <div className="relative flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(item.thumbImage)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2">
                        {item.shortDescription}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatPersianDate(item.dateTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{newsTypeLabels[item.type] || item.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{localityLabels[item.locality] || item.locality}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}

      {news.length > 0 && pagination && (
        <Pagination
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          totalCount={pagination.totalCount}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}

