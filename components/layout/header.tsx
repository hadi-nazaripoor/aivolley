"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bell, Search, ChevronDown, Menu as MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

const userNavigation = [
  { name: "پروفایل شما", href: "#" },
  { name: "خروج", href: "#" },
];

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        >
        <span className="sr-only">باز کردن منو</span>
        <MenuIcon aria-hidden="true" className="size-6" />
      </button>

      {/* Separator */}
      <div aria-hidden="true" className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form action="#" method="GET" className="grid flex-1 grid-cols-1">
          <input
            name="search"
            type="search"
            placeholder="جستجو"
            aria-label="Search"
            className="row-start-1 col-start-1 block size-full bg-white dark:bg-gray-800 ps-8 text-base text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm/6"
          />
          <Search
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400 me-3"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
          >
            <span className="sr-only">مشاهده اعلان‌ها</span>
            <Bell aria-hidden="true" className="size-6" />
          </button>

          {/* Separator */}
          <div
            aria-hidden="true"
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700"
          />

          {/* Auth UI */}
          {isAuthenticated && user ? (
            <Menu as="div" className="relative">
              <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">باز کردن منوی کاربر</span>
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-8 rounded-full bg-gray-50"
                />
                <span className="hidden lg:flex lg:items-center">
                  <span
                    aria-hidden="true"
                    className="ms-4 text-sm/6 font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {user.phoneNumber}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="ms-2 size-5 text-gray-400 dark:text-gray-500"
                  />
                </span>
              </MenuButton>
              <MenuItems
                transition
                className="absolute end-0 z-10 mt-2.5 w-32 origin-top-end rounded-md bg-white dark:bg-gray-800 py-2 ring-1 shadow-lg ring-gray-900/5 dark:ring-gray-700 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-3 py-1 text-sm/6 text-gray-900 dark:text-gray-100 data-[focus]:bg-gray-50 dark:data-[focus]:bg-gray-700 data-[focus]:outline-none"
                  >
                    پروفایل شما
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={logout}
                    className="block w-full text-right px-3 py-1 text-sm/6 text-gray-900 dark:text-gray-100 data-[focus]:bg-gray-50 dark:data-[focus]:bg-gray-700 data-[focus]:outline-none"
                  >
                    خروج
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Button
              onClick={() => router.push(ROUTES.LOGIN)}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              ورود / ثبت‌نام
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

