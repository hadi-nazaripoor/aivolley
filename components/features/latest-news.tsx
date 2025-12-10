"use client";

import { useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Play } from "lucide-react";

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
  { id: "taleji", label: "تالژی" },
  { id: "q360", label: "کیو ۳۶۰" },
  { id: "interviews", label: "مصاحبه های عادل فردوسی پور" },
];

export function LatestNews({ articles, className }: LatestNewsProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className={cn("w-full", className)}>
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">جدیدترین ها</h2>

        {/* Filter Tabs */}
        <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
          <TabList className="flex gap-2 sm:gap-3 border-b border-gray-200">
            {filterTabs.map((tab) => (
              <Tab
                key={tab.id}
                className="px-3 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 focus:outline-none data-[selected]:text-blue-600 data-[selected]:border-blue-600 transition-colors duration-200"
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </TabGroup>
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

