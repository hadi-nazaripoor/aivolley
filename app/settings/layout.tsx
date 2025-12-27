"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { UserCircle, Fingerprint, Shield, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { name: "پروفایل", href: "/settings/profile", icon: UserCircle },
  { name: "نقش‌های من", href: "/settings/roles", icon: Shield },
  { name: "امنیت", href: "/settings/security", icon: Fingerprint },
  { name: "حذف حساب کاربری", href: "/settings/delete-account", icon: Trash2 },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ps-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main>
          <h1 className="sr-only">تنظیمات حساب کاربری</h1>

          <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
            <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
              <nav className="flex-none px-4 sm:px-6 lg:px-0">
                <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            isActive
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                            "group flex gap-x-3 rounded-md py-2 pr-3 pl-2 text-sm/6 font-semibold",
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={cn(
                              isActive
                                ? "text-indigo-600"
                                : "text-gray-400 group-hover:text-indigo-600",
                              "size-6 shrink-0",
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

