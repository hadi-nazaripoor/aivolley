"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useRole } from "@/lib/contexts/role-context";
import { SystemRoles } from "@/lib/contexts/role-context";

export function RoleSwitcher() {
  const { availableRoles, activeRole, setActiveRole, isLoading } = useRole();

  // Don't show switcher if user has only one role or no roles
  if (isLoading || availableRoles.length <= 1 || !activeRole) {
    return null;
  }

  const handleRoleChange = (roleId: SystemRoles) => {
    setActiveRole(roleId);
  };

  const SelectedIcon = activeRole.icon;

  return (
    <div className="flex flex-col w-full">
      <Menu as="div" className="relative w-full">
        <MenuButton className="cursor-default flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-right text-base/6 font-medium text-gray-900 dark:text-white sm:py-2 sm:text-sm/5 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-800 focus:outline-none">
          <span className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden" aria-hidden="true"></span>
          <span className="flex min-w-0 items-center gap-3">
            <span className="size-10 inline-grid shrink-0 align-middle outline -outline-offset-1 outline-gray-200 dark:outline-gray-700 rounded-[20%]">
              <div className="col-start-1 row-start-1 flex size-full items-center justify-center rounded-[20%] bg-indigo-600 text-white">
                <SelectedIcon aria-hidden="true" className="size-6 sm:size-5" />
              </div>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm/5 font-medium text-gray-900 dark:text-white">
                {activeRole.name}
              </span>
              <span className="block truncate text-xs/5 font-normal text-gray-500 dark:text-gray-400">
                {activeRole.description}
              </span>
            </span>
          </span>
          <ChevronUp
            aria-hidden="true"
            className="size-5 shrink-0 ms-auto text-gray-500 dark:text-gray-400 sm:size-4"
          />
        </MenuButton>
        <MenuItems
          transition
          className="absolute end-0 z-10 mt-2 w-full origin-top-end rounded-md bg-white dark:bg-gray-800 py-1 ring-1 shadow-lg ring-gray-900/5 dark:ring-gray-700 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
        >
          {availableRoles.map((role) => {
            const RoleIcon = role.icon;
            const isSelected = role.id === activeRole.id;
            return (
              <MenuItem key={role.id}>
                <button
                  onClick={() => handleRoleChange(role.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2 text-right text-sm/6",
                    isSelected
                      ? "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 data-[focus]:bg-gray-50 dark:data-[focus]:bg-gray-700 data-[focus]:outline-none"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-md",
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    )}
                  >
                    <RoleIcon aria-hidden="true" className="size-4" />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{role.name}</span>
                    <span className="block truncate text-xs/5 text-gray-500 dark:text-gray-400">
                      {role.description}
                    </span>
                  </span>
                </button>
              </MenuItem>
            );
          })}
        </MenuItems>
      </Menu>
    </div>
  );
}

