"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { cn } from "@/lib/utils/cn";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import { getImageUrl } from "@/lib/utils/image-url";

interface NewsItem {
  id: number;
  title: string;
  excerpt?: string;
  image: string;
  imageAlt: string;
  category?: string;
  timeAgo?: string;
  slug?: string;
}

interface NewsSliderProps {
  items: NewsItem[];
  className?: string;
  autoPlayInterval?: number; // in milliseconds
}

export function NewsSlider({ items, className, autoPlayInterval = 5000 }: NewsSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (items.length === 0 || !mainSwiperRef.current) return;

    const swiper = mainSwiperRef.current;
    
    // Reset progress when slide changes
    const handleSlideChange = () => {
      setActiveIndex(swiper.activeIndex);
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Start progress animation
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / autoPlayInterval) * 100, 100);
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }
      }, 16); // ~60fps for smooth animation
    };

    const handleAutoplayStart = () => {
      handleSlideChange();
    };

    swiper.on("slideChange", handleSlideChange);
    swiper.on("autoplayStart", handleAutoplayStart);
    
    // Initialize progress for first slide
    handleSlideChange();

    return () => {
      swiper.off("slideChange", handleSlideChange);
      swiper.off("autoplayStart", handleAutoplayStart);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [items.length, autoPlayInterval]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={cn("w-full relative", className)}>
      <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm w-full">
        {/* Progress Bar at Top */}
        <div style={{ width: "100%", position: "relative", height: "4px", marginBottom: "16px" }}>
          <div
            className="h-full bg-green-500"
            style={{
              width: `${progress}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>

        {/* Main Featured Article Swiper - 50/50 Split */}
        <div className="w-full relative h-auto lg:h-[226px]">
          <Swiper
            onSwiper={(swiper) => {
              mainSwiperRef.current = swiper;
            }}
            modules={[Autoplay, Thumbs]}
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{
              delay: autoPlayInterval,
              disableOnInteraction: false,
            }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            dir="rtl"
            className="w-full h-full"
            style={{ height: "100%" }}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className="!h-auto lg:!h-[226px]">
                <Link href={item.slug ? `/news/${item.slug}` : "#"} className="block">
                  <article className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full h-full rounded-lg overflow-hidden">
                    {/* Image - Top on mobile/tablet, Left on desktop */}
                    <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-full overflow-hidden">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.imageAlt}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    {/* Text Content - Bottom on mobile/tablet, Right on desktop */}
                    <div className="flex flex-col justify-center p-4 sm:p-5 md:p-6 bg-white">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mb-2 sm:mb-3 leading-tight line-clamp-2" style={{ margin: 0, padding: 0 }}>
                        {item.title}
                      </h2>
                      {/* Excerpt - Hidden on mobile/tablet, visible on desktop */}
                      {item.excerpt ? (
                        <h4 className="hidden lg:block text-xs sm:text-sm text-gray-900 line-clamp-3 sm:line-clamp-4 leading-relaxed" style={{ margin: 0, padding: 0 }}>
                          {item.excerpt}
                        </h4>
                      ) : item.timeAgo ? (
                        <h4 className="hidden lg:block text-xs sm:text-sm text-gray-500" style={{ margin: 0, padding: 0 }}>
                          {item.timeAgo}
                        </h4>
                      ) : null}
                    </div>
                  </article>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Thumbnail Gallery Swiper */}
        <div className="w-full mt-4">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Thumbs]}
            spaceBetween={8}
            slidesPerView="auto"
            watchSlidesProgress={true}
            dir="rtl"
            className="swiper-thumbs"
          >
            {items.map((item, index) => (
              <SwiperSlide
                key={item.id}
                className="cursor-pointer"
                style={{ width: "auto" }}
              >
                <div className="relative">
                  {/* Thumbnail Image */}
                  <div className="relative w-20 h-14 sm:w-24 sm:h-16 md:w-28 md:h-20 rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-80"
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                    />
                  </div>

                  {/* Active Indicator - Green Bottom Border */}
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-green-500 rounded-b-lg transition-opacity duration-200",
                      activeIndex === index ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

