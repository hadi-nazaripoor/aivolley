"use client";

import { cn } from "@/lib/utils/cn";
import { Calendar, User, Tag } from "lucide-react";

interface NewsDetailsProps {
  title: string;
  excerpt?: string;
  image: string;
  imageAlt: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  content?: string;
  className?: string;
}

export function NewsDetails({
  title,
  excerpt,
  image,
  imageAlt,
  category,
  author,
  publishedAt,
  content,
  className,
}: NewsDetailsProps) {
  return (
    <article className={cn("w-full", className)}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Featured Image */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
          />
          {category && (
            <div className="absolute top-4 start-4">
              <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium">
                <Tag className="w-3.5 h-3.5" />
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {title}
          </h1>

          {/* Metadata */}
          {(author || publishedAt) && (
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 sm:mb-6 text-sm text-gray-500 border-b border-gray-200 pb-4">
              {author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{author}</span>
                </div>
              )}
              {publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{publishedAt}</span>
                </div>
              )}
            </div>
          )}

          {/* Excerpt */}
          {excerpt && (
            <p className="text-base sm:text-md text-gray-700 font-medium mb-6 leading-relaxed">
              {excerpt}
            </p>
          )}

          {/* Content Body */}
          {content && (
            <div
              className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-4 [&_p]:mb-4 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* Fallback content if no HTML content provided */}
          {!content && (
            <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                این یک متن نمونه برای نمایش محتوای خبر است. در نسخه نهایی، این بخش از API یا دیتابیس دریافت می‌شود.
              </p>
              <p>
                محتوای خبر می‌تواند شامل چندین پاراگراف باشد و می‌تواند شامل تصاویر، ویدیوها و سایر المان‌های رسانه‌ای نیز باشد.
              </p>
              <p>
                این کامپوننت از سیستم طراحی موجود در پروژه استفاده می‌کند و با سایر صفحات هماهنگ است.
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

