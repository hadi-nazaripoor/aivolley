"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { NewsSlider } from "@/components/features/news-slider";
import { LatestNews } from "@/components/features/latest-news";
import { getPublicNewsPaginated } from "@/lib/api/services/news";
import { mapToNewsSliderItem, mapToLatestNewsArticle } from "@/lib/utils/news-mappers";
import type { SummarizedNewsResponse } from "@/lib/api/types";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pinnedNews, setPinnedNews] = useState<ReturnType<typeof mapToNewsSliderItem>[]>([]);
  const [latestNews, setLatestNews] = useState<ReturnType<typeof mapToLatestNewsArticle>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const result = await getPublicNewsPaginated(1, 50);
        
        // Split into pinned and all news
        const pinned = result.items
          .filter((item) => item.isPinned === true)
          .map((item, index) => mapToNewsSliderItem(item, index));
        
        // All news for latest section (including pinned)
        const allNews = result.items.map((item, index) => mapToLatestNewsArticle(item, index));
        
        setPinnedNews(pinned);
        setLatestNews(allNews);
      } catch (error) {
        console.error("Error fetching news:", error);
        // On error, set empty arrays (components handle empty state)
        setPinnedNews([]);
        setLatestNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ps-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-12 gap-4 lg:gap-6">
                {/* Left Column - 8 units (2/3 width) */}
                <div className="col-span-12 lg:col-span-8">
                  {!loading && <NewsSlider items={pinnedNews} className="mb-8" />}
                </div>
                {/* Right Column - 4 units (1/3 width) */}
                <div className="col-span-12 lg:col-span-4">
                  {/* Latest News Section */}
                  {!loading && <LatestNews articles={latestNews} />}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
