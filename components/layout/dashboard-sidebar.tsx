"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Sun,
  Moon,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/lib/contexts/theme-context";
import { RoleSwitcher } from "@/components/shared/role-switcher";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRole } from "@/lib/contexts/role-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getMenuItemsForRole, SETTINGS_MENU_ITEM } from "@/lib/config/role-menus";
import { ROUTES } from "@/lib/constants/routes";

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

function DashboardSidebarContent() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { activeRole } = useRole();
  const pathname = usePathname();

  // Get menu items for active role (without settings - settings is added separately)
  const roleMenuItems = isAuthenticated && activeRole ? getMenuItemsForRole(activeRole.id) : [];

  // Check if current path is active
  const isActivePath = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Don't show sidebar content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-e border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 pb-4 lg:border-e scrollbar-hide">
      <div className="flex h-16 shrink-0 items-center -mx-4">
        <RoleSwitcher />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-3">
          {/* Role-specific menu items */}
          {roleMenuItems.length > 0 && (
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {roleMenuItems.map((item) => {
                  const isActive = isActivePath(item.path);
                  const ItemIcon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={cn(
                          isActive
                            ? "bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                        )}
                      >
                        <ItemIcon
                          aria-hidden={true}
                          className={cn(
                            isActive
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
                            "size-6 shrink-0"
                          )}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          )}

          {/* Divider before Settings and Logout */}
          <li className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <ul role="list" className="-mx-2 space-y-1">
              {/* Settings - always visible regardless of role */}
              <li>
                <Link
                  href={SETTINGS_MENU_ITEM.path}
                  className={cn(
                    isActivePath(SETTINGS_MENU_ITEM.path)
                      ? "bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400",
                    "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                  )}
                >
                  <SETTINGS_MENU_ITEM.icon
                    aria-hidden={true}
                    className={cn(
                      isActivePath(SETTINGS_MENU_ITEM.path)
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
                      "size-6 shrink-0"
                    )}
                  />
                  {SETTINGS_MENU_ITEM.label}
                </Link>
              </li>
              {/* Divider before logout */}
              <li className="border-gray-200 dark:border-gray-700">
                <button
                  onClick={logout}
                  className="group flex w-full items-center gap-x-3 p-2 rounded-md text-sm/6 font-semibold text-red-400 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-800 hover:text-red-600 dark:hover:text-red-400"
                >
                  <LogOut
                    aria-hidden="true"
                    className="size-6 shrink-0 text-red-400 dark:text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400"
                  />
                  خروج
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export function DashboardSidebar({ sidebarOpen, setSidebarOpen }: DashboardSidebarProps) {
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
            <DashboardSidebarContent />
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-5 lg:flex lg:w-72 lg:flex-col">
        <DashboardSidebarContent />
      </div>
    </>
  );
}

