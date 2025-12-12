"use client";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Reply } from "lucide-react";

interface Comment {
  id: number;
  username: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes?: number;
  dislikes?: number;
}

interface CommentsSectionProps {
  className?: string;
}

// Sample comments data
const sampleComments: Comment[] = [
  {
    id: 1,
    username: "آبی",
    avatar: "https://static.football360.ir/nesta2/media/uploads/users/thumbnails/2022/09/01/IMG_%DB%B2%DB%B0%DB%B2%DB%B2%DB%B0%DB%B9%DB%B0%DB%B1_%DB%B1%DB%B2%DB%B4%DB%B6%DB%B2%DB%B9%DB%B9%DB%B0%DB%B7_thumb.jpg?x-img=v1/optimize,q_75,lossless_false,/",
    timeAgo: "۱ ساعت پیش",
    content: "ازمسئولین محترم باشگاه بزرگ استقلال میخوام هرچه زودتر آلترناتیو ساپینتو رو مشخص کنند",
    likes: 14,
    dislikes: 13,
  },
  {
    id: 2,
    username: "💙⚜ESTEGHLAL KABIR ⚜💙",
    avatar: "https://static.football360.ir/nesta2/media/uploads/avatars/2025/03/11/x.png?x-img=v1/optimize,q_75,lossless_false,/",
    timeAgo: "۱ ساعت پیش",
    content: "تنها اسمی که هیچوقت به یک آدم نیومد تو بودی فردوسی پور، عادل هیچگاه مناسب تو نبود، هیچوقت عدالت رو تو برنامت رعایت نکردی ، چرا راجع به صحنه پنالتی دهنتو بستی؟؟؟ مطمئنم نظرم رو ثبت نمیکنی",
    likes: 14,
    dislikes: 19,
  },
  {
    id: 3,
    username: "Dariush eidivandi",
    avatar: "https://static.football360.ir/nesta2/media/uploads/avatars/2025/04/07/Ronaldo.jpg?x-img=v1/optimize,q_75,lossless_false,/",
    timeAgo: "۱ ساعت پیش",
    content: "امروز آسانی سرحال نبود اگه رامین میومد تو یه کاری میکرد",
    likes: 8,
    dislikes: 5,
  },
  {
    id: 4,
    username: "+98938***3828",
    avatar: "https://static.football360.ir/nesta2/media/uploads/avatars/2025/03/15/Lamina_Yamal_1.jpg?x-img=v1/optimize,q_75,lossless_false,/",
    timeAgo: "۱ ساعت پیش",
    content: "بابا توو بازی آزادی چی میبینی که هیچ کس نمیبینه?پدر تیمو درآورد. از اونور وقتی منیر آماده نیست چه اسراری داری بذاریش توو تیم?از چی میترسی آخه,آسانی,کوشکی یا هر اسم دیگه ای اصلا رونالدو,مسی...وقتی جواب نمیدن و مهار میشن بکش بیرون دیگه.اینهمه بازیکن روو نیمکت داری",
    likes: 11,
    dislikes: 3,
  },
  {
    id: 5,
    username: "عادل",
    avatar: "https://static.football360.ir/nesta2/media/uploads/avatars/2025/03/15/Kylian_Mbapp%C3%A9.jpg?x-img=v1/optimize,q_75,lossless_false,/",
    timeAgo: "۲ ساعت پیش",
    content: "جباری حیف شد نکونام رو  حیف کردیم واقعا چرا طرفدارا الکی فقط میگن مربی خارجی حالا هرچی باشه.ساپینتو با استقلال به جایی نمیرسه بعد از باخت ۷تایی باید شوتش میکردن بیرون دقیقا مثل سری قبل بازی میکنه وینگرهای تکنیکی کاری کردن میبریم وگرنه هیچ تاکتیکی وجود نداره",
    likes: 9,
    dislikes: 5,
  },
];

export function CommentsSection({ className }: CommentsSectionProps) {
  return (
    <section className={cn("w-full", className)}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            نظرات کاربران
          </h2>
        </div>

        {/* Login Box (Static - for non-authenticated users) */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              برای ثبت نظر خود وارد شوید.
            </p>
            <Button size="sm" className="w-full sm:w-auto">
              ورود
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="p-2 sm:p-4">
          <ul>
            {sampleComments.map((comment) => (
              <li key={comment.id}>
                <article className="flex flex-col w-full border-b border-gray-200 py-4">
                  {/* Comment Header */}
                  <header className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <a
                        href={`/user/${comment.id}`}
                        className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
                      >
                        <img
                          src={comment.avatar}
                          alt={comment.username}
                          className="w-full h-full object-cover"
                        />
                      </a>

                      {/* Username and Time */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <a
                          href={`/user/${comment.id}`}
                          className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate"
                        >
                          {comment.username}
                        </a>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {comment.timeAgo}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        {comment.likes || 0}
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        {comment.dislikes || 0}
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        پاسخ
                        <Reply className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </header>

                  {/* Comment Content */}
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        {/* Comment Form */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <form className="space-y-4">
            <div>
              <label htmlFor="comment" className="sr-only">
                نظر شما
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                placeholder="نظر خود را بنویسید..."
                className={cn(
                  "block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100",
                  "outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700",
                  "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                  "focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500",
                  "border border-gray-300 dark:border-gray-700",
                  "sm:text-xs/6 resize-none"
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="default">
                ارسال نظر
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

