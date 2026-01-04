/**
 * Role-based menu configuration
 * Centralized configuration for sidebar menus based on active role
 */

import {
  Building2,
  User,
  Shield,
  Users,
  BarChart3,
  Settings,
  Lock,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { SystemRoles } from "@/lib/contexts/role-context";

export interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

export interface RoleMenuConfig {
  role: SystemRoles;
  items: MenuItem[];
}

/**
 * Role-based menu configurations
 * Each role has its own set of menu items
 */
export const ROLE_MENUS: RoleMenuConfig[] = [
  {
    role: SystemRoles.ClubOwner,
    items: [
      {
        label: "باشگاه‌های من",
        path: "/dashboard/club-owner/clubs",
        icon: Building2,
      },
    ],
  },
  {
    role: SystemRoles.Player,
    items: [
      {
        label: "پروفایل بازیکن",
        path: "/dashboard/player/profile",
        icon: User,
      },
      // Future: Player Statistics, etc.
    ],
  },
  {
    role: SystemRoles.Coach,
    items: [
      {
        label: "پروفایل مربی",
        path: "/dashboard/coach/profile",
        icon: Shield,
      },
      // Future: Teams, etc.
    ],
  },
  {
    role: SystemRoles.Admin,
    items: [
      {
        label: "کاربران",
        path: "/dashboard/admin/users",
        icon: Users,
      },
      {
        label: "باشگاه‌ها",
        path: "/dashboard/club-owner/clubs",
        icon: Building2,
      },
      {
        label: "گزارشات",
        path: "/dashboard/admin/reports",
        icon: BarChart3,
      },
      {
        label: "تنظیمات",
        path: "/dashboard/admin/settings",
        icon: Settings,
      },
    ],
  },
  {
    role: SystemRoles.Supervisor,
    items: [
      {
        label: "داشبورد",
        path: ROUTES.DASHBOARD,
        icon: User,
      },
    ],
  },
  {
    role: SystemRoles.Referee,
    items: [
      {
        label: "داشبورد",
        path: ROUTES.DASHBOARD,
        icon: User,
      },
    ],
  },
  {
    role: SystemRoles.Member,
    items: [
      {
        label: "داشبورد",
        path: ROUTES.DASHBOARD,
        icon: User,
      },
    ],
  },
];

/**
 * Settings menu item (shown in dashboard sidebar after role-specific items)
 * This is a single item that links to the main settings page
 */
export const SETTINGS_MENU_ITEM: MenuItem = {
  label: "تنظیمات",
  path: "/dashboard/settings",
  icon: Settings,
};

/**
 * Get menu items for a specific role
 */
export function getMenuItemsForRole(role: SystemRoles | null): MenuItem[] {
  if (!role) {
    return [];
  }

  const roleMenu = ROLE_MENUS.find((config) => config.role === role);
  return roleMenu?.items || [];
}

