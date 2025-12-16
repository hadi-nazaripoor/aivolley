"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { cn } from "@/lib/utils/cn";
import { Play } from "lucide-react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

interface NewsArticle {
  id: number;
  title: string;
  image: string;
  imageAlt: string;
  timeAgo: string;
  isVideo?: boolean;
  videoDuration?: string;
}

interface LatestNewsProps {
  articles: NewsArticle[];
  className?: string;
}

const filterTabs = [
  { id: "all", label: "همه" },
  { id: "domestic-football", label: "فوتبال داخلی" },
  { id: "foreign-football", label: "فوتبال خارجی" },
  { id: "video", label: "ویدیو" },
  { id: "news", label: "خبر" },
  { id: "podcast", label: "پادکست" },
  { id: "domestic-summary", label: "خلاصه‌ بازی‌ داخلی" },
  { id: "foreign-summary", label: "خلاصه بازی‌ خارجی" },
  { id: "fun-abutaleb", label: "فان با ابوطالب" },
  { id: "live360", label: "لایو 360" },
  { id: "challenge360", label: "چالش فوتبال ۳۶۰" },
  { id: "360degrees", label: "۳۶۰ درجه" },
  { id: "exclusive-report", label: "گزارش اختصاصی" },
  { id: "q360", label: "کیو ۳۶۰" },
  { id: "adel-interviews", label: "مصاحبه‌های عادل فردوسی‌پور" },
];

export function LatestNews({ articles, className }: LatestNewsProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className={cn("w-full", className)}>
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">جدیدترین ها</h2>

        {/* Filter Tabs - Swiper */}
        <div className="w-full relative">
          <Swiper
            onSwiper={setSwiper}
            modules={[FreeMode, Navigation]}
            spaceBetween={8}
            slidesPerView="auto"
            freeMode={true}
            dir="rtl"
            // navigation={{
            //   nextEl: ".swiper-button-next",
            //   prevEl: ".swiper-button-prev",
            // }}
            className="matchesTab"
          >
            {filterTabs.map((tab, index) => (
              <SwiperSlide key={tab.id} style={{ width: "auto", height: "28px", marginLeft: "8px" }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTab(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedTab(index);
                    }
                  }}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors duration-200 rounded h-full flex items-center",
                    "hover:text-gray-900 focus:outline-none",
                    selectedTab === index
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600"
                  )}
                >
                  {tab.label}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* <div className="swiper-button-next"></div>
          <div className="swiper-button-prev swiper-button-disabled"></div> */}
        </div>
      </div>

      {/* News Articles List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <article
            key={article.id}
            className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            {/* Thumbnail Image */}
            <div className="relative flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={article.image}
                alt={article.imageAlt}
                className="w-full h-full object-cover"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
              />
              {/* Video Play Button Overlay */}
              {article.isVideo && article.videoDuration && (
                <div className="absolute bottom-1 start-1 flex items-center gap-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                  <Play className="w-3 h-3" fill="currentColor" />
                  <span>{article.videoDuration}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">
                {article.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">{article.timeAgo}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

