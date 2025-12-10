"use client";

import { useState, useEffect } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface NewsItem {
  id: number;
  title: string;
  excerpt?: string;
  image: string;
  imageAlt: string;
  category?: string;
  timeAgo?: string;
}

interface NewsSliderProps {
  items: NewsItem[];
  className?: string;
  autoPlayInterval?: number; // in milliseconds
}

export function NewsSlider({ items, className, autoPlayInterval = 5000 }: NewsSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;

    setProgress(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / autoPlayInterval) * 100, 100);

      if (newProgress >= 100) {
        setSelectedIndex((current) => (current + 1) % items.length);
        setProgress(0);
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [selectedIndex, items.length, autoPlayInterval]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={cn("w-full relative", className)}>
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm w-full">
        {/* Main Featured Article - 50/50 Split */}
        <TabPanels>
          {items.map((item) => (
            <TabPanel key={item.id} className="focus:outline-none">
              <article className="grid grid-cols-2 gap-0 w-full h-[226px] rounded-lg overflow-hidden">
                {/* Left Half - Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Progress Bar at Bottom of Image */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
                    <div
                      className="h-full bg-green-500 transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Right Half - Text Content */}
                <div className="flex flex-col justify-center p-4 sm:p-5 md:p-6 bg-white">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mb-2 sm:mb-3 leading-tight line-clamp-2">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="text-xs sm:text-sm text-gray-900 line-clamp-3 sm:line-clamp-4 leading-relaxed">
                      {item.excerpt}
                    </p>
                  )}
                </div>
              </article>
            </TabPanel>
          ))}
        </TabPanels>

        {/* Thumbnail Gallery - Horizontal Scrollable (Images Only) */}
        <div className="w-full mt-4 overflow-x-auto scrollbar-hide">
          <TabList className="flex gap-2 sm:gap-2.5 min-w-max">
            {items.map((item, index) => (
              <Tab
                key={item.id}
                className="group relative flex-shrink-0 cursor-pointer focus:outline-none transition-all duration-200"
              >
                <div className="relative">
                  {/* Thumbnail Image Only */}
                  <div className="relative w-20 h-14 sm:w-24 sm:h-16 md:w-28 md:h-20 rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                    />
                  </div>

                  {/* Active Indicator - Green Bottom Border */}
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-green-500 rounded-b-lg transition-opacity duration-200",
                      "opacity-0 group-data-[selected]:opacity-100"
                    )}
                  />
                </div>
              </Tab>
            ))}
          </TabList>
        </div>
      </TabGroup>
    </section>
  );
}

