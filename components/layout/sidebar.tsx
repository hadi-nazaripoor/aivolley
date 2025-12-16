"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Home,
  Star,
  Play,
  Radio,
  Clock,
  TrendingUp,
  Shirt,
  ClipboardList,
  Trophy,
  Grid3x3,
  BarChart3,
  Calendar,
  ArrowUpDown,
  Sun,
  Moon,
  X,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/lib/contexts/theme-context";
import { RoleSwitcher } from "@/components/shared/role-switcher";

const navigation = [
  { name: "خانه", href: "#", icon: Home, current: true },
  { name: "برای شما", href: "#", icon: Star, current: false },
  { name: "ویدیوها", href: "#", icon: Play, current: false },
  { name: "پخش زنده", href: "#", icon: Radio, current: false },
  { name: "نتایج زنده", href: "#", icon: Clock, current: false },
  { name: "پیش بینی", href: "#", icon: TrendingUp, current: false },
  { name: "فوتبال فانتزی", href: "#", icon: Shirt, current: false },
  { name: "نظرسنجی", href: "#", icon: ClipboardList, current: false },
  { name: "رقابت ها", href: "#", icon: Trophy, current: false },
  { name: "جدول لیگها", href: "#", icon: Grid3x3, current: false },
  { name: "آمار و ارقام", href: "#", icon: BarChart3, current: false },
  { name: "برنامه بازی ها", href: "#", icon: Calendar, current: false },
  { name: "نقل و انتقالات", href: "#", icon: ArrowUpDown, current: false },
];

const otherPages = [
  { name: "جدیدترین ها", href: "#" },
  { name: "سرضرب", href: "#" },
  { name: "پادکست", href: "#" },
  { name: "دسته بندی ها", href: "#" },
  { name: "دانلود اپلیکیشن", href: "#" },
  { name: "قوانین و کپی رایت", href: "#" },
  { name: "درباره ما", href: "#" },
  { name: "حریم خصوصی", href: "#" },
  { name: "تماس با ما", href: "#" },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

function SidebarContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-e border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 pb-4 lg:border-e scrollbar-hide">
      <div className="flex h-16 shrink-0 items-center -mx-4">
        <RoleSwitcher />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={cn(
                      item.current
                        ? "bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400",
                      "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={cn(
                        item.current
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
                        "size-6 shrink-0"
                      )}
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>

          {/* Dark Mode Toggle */}
          <li>
            <div className="flex items-center justify-between -mx-2 rounded-md p-2">
              <div className="flex items-center gap-x-3">
                {theme === "light" ? (
                  <Sun
                    aria-hidden="true"
                    className="size-6 shrink-0 text-gray-400 dark:text-gray-500"
                  />
                ) : (
                  <Moon
                    aria-hidden="true"
                    className="size-6 shrink-0 text-gray-400 dark:text-gray-500"
                  />
                )}
                <span className="text-sm/6 font-semibold text-gray-700 dark:text-gray-300">
                  حالت تاریک
                </span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={cn(
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                  theme === "dark" ? "bg-indigo-600" : "bg-gray-200"
                )}
                role="switch"
                aria-checked={theme === "dark"}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    theme === "dark" ? "translate-x-0" : "!-translate-x-5"
                  )}
                />
              </button>
            </div>
          </li>

          {/* Other Football 360 Pages */}
          <li>
            <div className="text-sm/8 font-semibold text-gray-400 dark:text-gray-500 mb-2">
              دیگر صفحات فوتبال ۳۶۰
            </div>
            <div className="grid grid-cols-2 gap-2">
              {otherPages.map((page) => (
                <a
                  key={page.name}
                  href={page.href}
                  className="text-xs/6 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {page.name}
                </a>
              ))}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0" />

        <div className="fixed inset-0 flex">
          <DialogPanel className="relative flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full rtl:data-[closed]:translate-x-full">
            <TransitionChild>
              <div className="absolute top-0 start-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">بستن منو</span>
                  <X aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            <SidebarContent />
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-5 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
}
