"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { NewsSlider } from "@/components/features/news-slider";
import { LatestNews } from "@/components/features/latest-news";

// Sample news data - replace with actual API data
const featuredNews = [
  {
    id: 1,
    title: "استقلال و سازمان لیگ به دنبال توافق بزرگ؛ تعویق بازی حذفی در گروی غیبت «۳۱» آبی پوش؟",
    excerpt: "جزئیات بیشتر در مورد توافق بین استقلال و سازمان لیگ و تأثیر آن بر بازی‌های حذفی",
    image: "https://static.football360.ir/nesta2/media/posts_media/4_Jxp49I3.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
    imageAlt: "Football match action",
    category: "فوتبال داخلی",
    timeAgo: "۱۲ دقیقه پیش",
  },
  {
    id: 2,
    title: "خبرهای امیدوار کننده از زنان فوتسالیست؛ نبرد با قهرمان جهان در راه است؟",
    excerpt: "آخرین اخبار از تیم ملی فوتسال زنان و آماده‌سازی برای مسابقات پیش رو",
    image: "https://static.football360.ir/nesta2/media/posts_media/8_jeOlZrS.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
    imageAlt: "Futsal players",
    category: "فوتسال",
    timeAgo: "۲۳ دقیقه پیش",
  },
  {
    id: 3,
    title: "کیوو: پنالتی لیورپول خیالی بود؛ تعویض های اجباری به ما آسیب زد",
    excerpt: "نظرات سرمربی تیم در مورد بازی اخیر و تصمیمات داوری",
    image: "https://static.football360.ir/nesta2/media/posts_media/covers/IMG_20251209_023927_831.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
    imageAlt: "Coach interview",
    category: "فوتبال خارجی",
    timeAgo: "۴۵ دقیقه پیش",
  },
  {
    id: 4,
    title: "پپ گواردیولا: منچستر یونایتد باید صبر کند",
    excerpt: "سرمربی منچستر سیتی در مورد رقابت با منچستر یونایتد صحبت می‌کند",
    image: "https://static.football360.ir/nesta2/media/posts_media/photo_2025-12-09_16-49-05.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
    imageAlt: "Pep Guardiola",
    category: "فوتبال خارجی",
    timeAgo: "۱ ساعت پیش",
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                  <NewsSlider items={featuredNews} className="mb-8" />
                </div>
                {/* Right Column - 4 units (1/3 width) */}
                <div className="col-span-12 lg:col-span-4">
                  {/* Latest News Section */}
                  <LatestNews
                    articles={[
                      {
                        id: 1,
                        title: "فن دایک: من نباید بگویم که صلاح عذرخواهی کند؛ بازی می‌توانست مساوی شود",
                        image: "https://static.football360.ir/nesta2/media/posts_media/covers/IMG_20251209_023927_831.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
                        imageAlt: "Van Dijk and Salah",
                        timeAgo: "۲۲ دقیقه پیش",
                      },
                      {
                        id: 2,
                        title: "بایرن و گنبری نزدیک به تمدید؛ دستمزد کمتر برای ستاره آلمانی",
                        image: "https://static.football360.ir/nesta2/media/posts_media/8_jeOlZrS.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
                        imageAlt: "Gnabry Bayern",
                        timeAgo: "۱ ساعت پیش",
                      },
                      {
                        id: 3,
                        title: "هالند: به خاطر گواردیولا به سیتی رفتم؛ انگلیس بهترین جا برای فوتبال بازی کردن است",
                        image: "https://static.football360.ir/nesta2/media/posts_media/photo_2025-12-09_16-49-05.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
                        imageAlt: "Haaland and Guardiola",
                        timeAgo: "۱ ساعت پیش",
                      },
                      {
                        id: 4,
                        title: "دوپینگ بیرانوند با رویای جام جهانی؛ «چه گلری، چه کارنامه‌ای!»",
                        image: "https://static.football360.ir/nesta2/media/posts_media/4_Jxp49I3.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
                        imageAlt: "Beiranvand",
                        timeAgo: "۱ ساعت پیش",
                      },
                      {
                        id: 5,
                        title: "جبران اشتباهات به سبک رونالدو؛ شب تاریک، روشن شد!",
                        image: "https://static.football360.ir/nesta2/media/posts_media/covers/IMG_20251209_023927_831.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
                        imageAlt: "Ronaldo",
                        timeAgo: "۱ ساعت پیش",
                        isVideo: true,
                        videoDuration: "۰۷:۴۱",
                      },
                      {
                        id: 6,
                        title: "تحلیل بازی اینتر و لیورپول؛ «دعوا رو بذار برای رختکن»",
                        image: "https://static.football360.ir/nesta2/media/posts_media/8_jeOlZrS.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
                        imageAlt: "Inter Liverpool analysis",
                        timeAgo: "۲ ساعت پیش",
                        isVideo: true,
                        videoDuration: "۱۰:۲۲",
                      },
                      {
                        id: 7,
                        title: "خبرهای امیدوار کننده از زنان فوتسالیست؛ نبرد با قهرمان جهان در راه است؟",
                        image: "https://static.football360.ir/nesta2/media/posts_media/8_jeOlZrS.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
                        imageAlt: "Women futsal",
                        timeAgo: "۲ ساعت پیش",
                      },
                      {
                        id: 8,
                        title: "کیوو: پنالتی لیورپول خیالی بود؛ تعویض های اجباری به ما آسیب زد",
                        image: "https://static.football360.ir/nesta2/media/posts_media/covers/IMG_20251209_023927_831.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
                        imageAlt: "Kioo interview",
                        timeAgo: "۲ ساعت پیش",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
