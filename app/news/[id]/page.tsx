"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LatestNews } from "@/components/features/latest-news";
import { NewsDetails } from "@/components/features/news-details";
import { CommentsSection } from "@/components/features/comments-section";

// Sample news details data - replace with actual API data
const newsDetailsData = {
  id: 1,
  title: "استقلال و سازمان لیگ به دنبال توافق بزرگ؛ تعویق بازی حذفی در گروی غیبت «۳۱» آبی پوش؟",
  excerpt: "جزئیات بیشتر در مورد توافق بین استقلال و سازمان لیگ و تأثیر آن بر بازی‌های حذفی. این خبر شامل اطلاعات مهمی در مورد تصمیمات اخیر سازمان لیگ است.",
  image: "https://static.football360.ir/nesta2/media/posts_media/4_Jxp49I3.jpg?x-img=v1/optimize,q_100,lossless_false,/resize,w_400,h_225,",
  imageAlt: "Football match action",
  category: "فوتبال داخلی",
  author: "گزارشگر ورزشی",
  publishedAt: "چهارشنبه, ۱۷ آذر ۱۴۰۴ - ساعت ۱۴:۳۰",
  content: `
    <p>در جلسه‌ای که امروز بین مسئولان استقلال و سازمان لیگ برگزار شد، موضوع تعویق بازی حذفی مورد بحث قرار گرفت. به نظر می‌رسد که این تصمیم در گروی غیبت بازیکن شماره ۳۱ تیم آبی پوش است.</p>
    
    <p>منابع نزدیک به این مذاکرات اعلام کرده‌اند که طرفین در حال بررسی شرایط مختلف برای رسیدن به یک توافق نهایی هستند. این موضوع می‌تواند تأثیر قابل توجهی بر برنامه‌ریزی‌های آینده تیم داشته باشد.</p>
    
    <p>سازمان لیگ در بیانیه‌ای رسمی اعلام کرد که تمام تلاش خود را برای رسیدن به یک راه‌حل مناسب انجام خواهد داد. این در حالی است که هواداران استقلال منتظر تصمیم نهایی هستند.</p>
    
    <p>بازیکن شماره ۳۱ که در این ماجرا نقش کلیدی دارد، در بازی‌های اخیر عملکرد قابل قبولی داشته است. غیبت او می‌تواند تأثیر قابل توجهی بر ترکیب تیم داشته باشد.</p>
    
    <p>در ادامه این خبر، منتظر اطلاع‌رسانی رسمی از سوی سازمان لیگ و باشگاه استقلال هستیم. این موضوع احتمالاً در روزهای آینده روشن خواهد شد.</p>
  `,
};

// Sample articles for Latest News sidebar
const latestNewsArticles = [
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
];

export default function NewsDetailsPage() {
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
                  <NewsDetails
                    title={newsDetailsData.title}
                    excerpt={newsDetailsData.excerpt}
                    image={newsDetailsData.image}
                    imageAlt={newsDetailsData.imageAlt}
                    category={newsDetailsData.category}
                    author={newsDetailsData.author}
                    publishedAt={newsDetailsData.publishedAt}
                    content={newsDetailsData.content}
                    className="mb-8"
                  />
                  <CommentsSection className="mb-8" />
                </div>
                {/* Right Column - 4 units (1/3 width) */}
                <div className="col-span-12 lg:col-span-4">
                  {/* Latest News Section */}
                  <LatestNews articles={latestNewsArticles} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

