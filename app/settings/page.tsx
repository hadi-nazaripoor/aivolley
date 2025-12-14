"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TimezoneSelect } from "@/components/shared/timezone-select";

const secondaryNavigation = [
  { name: "حساب کاربری", href: "#", current: true },
  { name: "اعلان‌ها", href: "#", current: false },
  { name: "صورتحساب", href: "#", current: false },
  { name: "تیم‌ها", href: "#", current: false },
  { name: "ادغام‌ها", href: "#", current: false },
];

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    console.log("Form submitted");
  };

  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ps-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main>
          <h1 className="sr-only">تنظیمات حساب کاربری</h1>

          <header className="border-b border-gray-200">
            {/* Secondary navigation */}
            <nav className="flex overflow-x-auto py-4">
              <ul
                role="list"
                className="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-400 sm:px-6 lg:px-8"
              >
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={item.current ? "text-indigo-600" : "hover:text-gray-900"}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          {/* Settings forms */}
          <div className="divide-y divide-gray-200">
            {/* Personal Information Section */}
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900">اطلاعات شخصی</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  از آدرس دائمی استفاده کنید که بتوانید در آن پست دریافت کنید.
                </p>
              </div>

              <form className="md:col-span-2" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full flex items-center gap-x-8">
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-24 flex-none rounded-lg bg-gray-100 object-cover"
                    />
                    <div>
                      <Button type="button" variant="outline">
                        تغییر تصویر پروفایل
                      </Button>
                      <p className="mt-2 text-xs/5 text-gray-500">JPG، GIF یا PNG. حداکثر 1MB.</p>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Label htmlFor="first-name">نام</Label>
                    <div className="mt-2">
                      <Input
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="given-name"
                        placeholder="نام"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Label htmlFor="last-name">نام خانوادگی</Label>
                    <div className="mt-2">
                      <Input
                        id="last-name"
                        name="last-name"
                        type="text"
                        autoComplete="family-name"
                        placeholder="نام خانوادگی"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <Label htmlFor="phone-number">شماره تلفن</Label>
                    <div className="mt-2">
                      <Input
                        id="phone-number"
                        name="phone-number"
                        type="tel"
                        autoComplete="tel"
                        placeholder="09123456789"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <Label htmlFor="username">نام کاربری</Label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white pr-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="نام کاربری"
                          className="border-0 outline-0 focus:ring-0 focus:outline-0 flex-1"
                        />
                        <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 me-1">
                          example.com/
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <TimezoneSelect />
                  </div>
                </div>

                <div className="mt-8 flex">
                  <Button type="submit">ذخیره</Button>
                </div>
              </form>
            </div>

            {/* Change Password Section */}
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900">تغییر رمز عبور</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  رمز عبور مرتبط با حساب کاربری خود را به‌روزرسانی کنید.
                </p>
              </div>

              <form className="md:col-span-2" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full">
                    <Label htmlFor="current-password">رمز عبور فعلی</Label>
                    <div className="mt-2">
                      <Input
                        id="current-password"
                        name="current_password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="رمز عبور فعلی"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <Label htmlFor="new-password">رمز عبور جدید</Label>
                    <div className="mt-2">
                      <Input
                        id="new-password"
                        name="new_password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="رمز عبور جدید"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <Label htmlFor="confirm-password">تکرار رمز عبور جدید</Label>
                    <div className="mt-2">
                      <Input
                        id="confirm-password"
                        name="confirm_password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="تکرار رمز عبور جدید"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex">
                  <Button type="submit">ذخیره</Button>
                </div>
              </form>
            </div>

            {/* Log out other sessions Section */}
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900">خروج از سایر جلسات</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  لطفاً رمز عبور خود را وارد کنید تا تأیید کنید که می‌خواهید از سایر جلسات خود در
                  تمام دستگاه‌هایتان خارج شوید.
                </p>
              </div>

              <form className="md:col-span-2" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full">
                    <Label htmlFor="logout-password">رمز عبور شما</Label>
                    <div className="mt-2">
                      <Input
                        id="logout-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="رمز عبور"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex">
                  <Button type="submit">خروج از سایر جلسات</Button>
                </div>
              </form>
            </div>

            {/* Delete account Section */}
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900">حذف حساب کاربری</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  دیگر نمی‌خواهید از سرویس ما استفاده کنید؟ می‌توانید حساب کاربری خود را اینجا
                  حذف کنید. این عمل قابل بازگشت نیست. تمام اطلاعات مرتبط با این حساب به طور
                  دائمی حذف خواهد شد.
                </p>
              </div>

              <form className="flex items-start md:col-span-2" onSubmit={handleSubmit}>
                <Button type="submit" variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-300">
                  بله، حساب کاربری من را حذف کن
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

