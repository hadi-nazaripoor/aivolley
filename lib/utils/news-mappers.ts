/**
 * News data mapping utilities
 * Converts API response data to UI component interfaces
 */

import type { SummarizedNewsResponse } from "@/lib/api/types";
import { NewsTypes } from "@/lib/api/types";

/**
 * Convert API news item to NewsSlider NewsItem interface
 */
export function mapToNewsSliderItem(
  item: SummarizedNewsResponse,
  index: number
): {
  id: number;
  title: string;
  excerpt?: string;
  image: string;
  imageAlt: string;
  category?: string;
  timeAgo?: string;
  slug?: string;
} {
  return {
    id: index + 1, // Use index for id since NewsSlider expects number
    title: item.title,
    excerpt: item.shortDescription,
    image: item.thumbImage,
    imageAlt: item.title,
    category: mapNewsTypeToCategory(item.type),
    timeAgo: formatTimeAgo(item.dateTime),
    slug: item.slug,
  };
}

/**
 * Convert API news item to LatestNews NewsArticle interface
 */
export function mapToLatestNewsArticle(
  item: SummarizedNewsResponse,
  index: number
): {
  id: number;
  title: string;
  image: string;
  imageAlt: string;
  timeAgo: string;
  isVideo?: boolean;
  videoDuration?: string;
  slug?: string;
} {
  const isVideo = item.type === NewsTypes.Video;
  
  return {
    id: index + 1, // Use index for id since LatestNews expects number
    title: item.title,
    image: item.thumbImage,
    imageAlt: item.title,
    timeAgo: formatTimeAgo(item.dateTime),
    isVideo,
    slug: item.slug,
  };
}

/**
 * Map NewsTypes enum to Persian category label
 */
function mapNewsTypeToCategory(type: string): string {
  const categoryMap: Record<string, string> = {
    [NewsTypes.News]: "خبر",
    [NewsTypes.Announcement]: "اطلاعیه",
    [NewsTypes.Video]: "ویدیو",
    [NewsTypes.Podcast]: "پادکست",
    [NewsTypes.Summary]: "خلاصه",
  };
  return categoryMap[type] || "خبر";
}

/**
 * Format ISO date string to Persian "time ago" format
 * Examples: "۱۲ دقیقه پیش", "۲ ساعت پیش", "۳ روز پیش"
 */
function formatTimeAgo(dateTime: string): string {
  try {
    const date = new Date(dateTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return "همین الان";
    } else if (diffMins < 60) {
      return `${diffMins} دقیقه پیش`;
    } else if (diffHours < 24) {
      return `${diffHours} ساعت پیش`;
    } else if (diffDays < 7) {
      return `${diffDays} روز پیش`;
    } else {
      // Format as Persian date for older items
      const persianMonths = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
      ];
      const day = date.getDate();
      const month = persianMonths[date.getMonth()];
      return `${day} ${month}`;
    }
  } catch (error) {
    return "اخیراً";
  }
}

