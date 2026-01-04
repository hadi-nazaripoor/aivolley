"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./auth-context";
import { ROUTES } from "@/lib/constants/routes";

/**
 * Available roles in the system (matching backend enum)
 */
export enum SystemRoles {
  Member = "Member",
  Player = "Player",
  Coach = "Coach",
  ClubOwner = "ClubOwner",
  Supervisor = "Supervisor",
  Referee = "Referee",
  Admin = "Admin",
  NewsPublisher = "NewsPublisher",
}

/**
 * Role configuration with display info
 */
export interface RoleConfig {
  id: SystemRoles;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  defaultRoute?: string; // Default route when switching to this role
}

interface RoleContextType {
  availableRoles: RoleConfig[];
  activeRole: RoleConfig | null;
  setActiveRole: (role: SystemRoles) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = "active_role";

/**
 * Map role strings from JWT to SystemRoles enum
 */
function mapRoleStringToEnum(roleString: string): SystemRoles | null {
  // Normalize role string (handle case variations)
  const normalized = roleString.trim();
  
  // Direct mapping
  const roleMap: Record<string, SystemRoles> = {
    Member: SystemRoles.Member,
    Player: SystemRoles.Player,
    Coach: SystemRoles.Coach,
    ClubOwner: SystemRoles.ClubOwner,
    Supervisor: SystemRoles.Supervisor,
    Referee: SystemRoles.Referee,
    Admin: SystemRoles.Admin,
    NewsPublisher: SystemRoles.NewsPublisher,
  };

  return roleMap[normalized] || null;
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { roles: userRoles, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [availableRoles, setAvailableRoles] = useState<RoleConfig[]>([]);
  const [activeRole, setActiveRoleState] = useState<RoleConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Import icons dynamically to avoid issues
  const [roleIcons, setRoleIcons] = useState<Record<SystemRoles, React.ComponentType<any>> | null>(null);

  useEffect(() => {
    // Dynamically import icons
    import("lucide-react").then((icons) => {
      setRoleIcons({
        [SystemRoles.Member]: icons.User,
        [SystemRoles.Player]: icons.User,
        [SystemRoles.Coach]: icons.Shield,
        [SystemRoles.ClubOwner]: icons.Building2,
        [SystemRoles.Supervisor]: icons.UserCog || icons.User,
        [SystemRoles.Referee]: icons.Gavel || icons.Scale,
        [SystemRoles.Admin]: icons.ShieldCheck || icons.Shield,
        [SystemRoles.NewsPublisher]: icons.FileText || icons.Newspaper || icons.File,
      });
    });
  }, []);

  // Build available roles from user's JWT roles
  useEffect(() => {
    if (!isAuthenticated || !roleIcons) {
      setAvailableRoles([]);
      setActiveRoleState(null);
      // Clear stored role when not authenticated
      localStorage.removeItem(STORAGE_KEY);
      setIsLoading(false);
      return;
    }

    // Map user roles to SystemRoles and create role configs
    const mappedRoles: RoleConfig[] = [];
    
    userRoles.forEach((roleString) => {
      const systemRole = mapRoleStringToEnum(roleString);
      if (systemRole && roleIcons[systemRole]) {
        const roleConfig: RoleConfig = {
          id: systemRole,
          name: getRoleDisplayName(systemRole),
          description: getRoleDescription(systemRole),
          icon: roleIcons[systemRole],
          defaultRoute: getDefaultRouteForRole(systemRole),
        };
        mappedRoles.push(roleConfig);
      }
    });

    setAvailableRoles(mappedRoles);

    // If no valid roles, clear state
    if (mappedRoles.length === 0) {
      console.warn("User has no valid roles");
      setAvailableRoles([]);
      setActiveRoleState(null);
      localStorage.removeItem(STORAGE_KEY);
      setIsLoading(false);
      return;
    }

    // Load or set active role
    const storedRoleId = localStorage.getItem(STORAGE_KEY);
    let roleToActivate: RoleConfig | null = null;

    if (storedRoleId) {
      // Try to restore stored role
      const storedSystemRole = mapRoleStringToEnum(storedRoleId);
      if (storedSystemRole) {
        roleToActivate = mappedRoles.find((r) => r.id === storedSystemRole) || null;
      }
    }

    // If stored role is invalid or doesn't exist, use first available role
    if (!roleToActivate && mappedRoles.length > 0) {
      roleToActivate = mappedRoles[0];
    }

    setActiveRoleState(roleToActivate);
    if (roleToActivate) {
      localStorage.setItem(STORAGE_KEY, roleToActivate.id);
    }

    setIsLoading(false);
  }, [userRoles, isAuthenticated, roleIcons]);

  const setActiveRole = useCallback(
    (roleId: SystemRoles) => {
      const role = availableRoles.find((r) => r.id === roleId);
      if (!role) {
        console.warn(`Role ${roleId} is not available`);
        return;
      }

      setActiveRoleState(role);
      localStorage.setItem(STORAGE_KEY, role.id);

      // Redirect to default route if current page is not accessible
      // This is a simple check - can be enhanced later
      if (role.defaultRoute && pathname !== role.defaultRoute) {
        router.push(role.defaultRoute);
      }
    },
    [availableRoles, pathname, router]
  );

  const value: RoleContextType = {
    availableRoles,
    activeRole,
    setActiveRole,
    isLoading,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

/**
 * Get display name for role
 */
function getRoleDisplayName(role: SystemRoles): string {
  const names: Record<SystemRoles, string> = {
    [SystemRoles.Member]: "عضو",
    [SystemRoles.Player]: "بازیکن",
    [SystemRoles.Coach]: "مربی",
    [SystemRoles.ClubOwner]: "مالک باشگاه",
    [SystemRoles.Supervisor]: "سرپرست",
    [SystemRoles.Referee]: "داور",
    [SystemRoles.Admin]: "مدیر",
    [SystemRoles.NewsPublisher]: "ناشر خبر",
  };
  return names[role] || role;
}

/**
 * Get description for role
 */
function getRoleDescription(role: SystemRoles): string {
  const descriptions: Record<SystemRoles, string> = {
    [SystemRoles.Member]: "نقش عضو",
    [SystemRoles.Player]: "نقش بازیکن",
    [SystemRoles.Coach]: "نقش مربی",
    [SystemRoles.ClubOwner]: "نقش مالک باشگاه",
    [SystemRoles.Supervisor]: "نقش سرپرست",
    [SystemRoles.Referee]: "نقش داور",
    [SystemRoles.Admin]: "نقش مدیر",
    [SystemRoles.NewsPublisher]: "امکان درج و ارسال خبر برای بررسی و انتشار",
  };
  return descriptions[role] || "";
}

/**
 * Get default route for role
 */
function getDefaultRouteForRole(role: SystemRoles): string {
  const routes: Record<SystemRoles, string> = {
    [SystemRoles.Member]: ROUTES.DASHBOARD,
    [SystemRoles.Player]: ROUTES.DASHBOARD,
    [SystemRoles.Coach]: ROUTES.DASHBOARD,
    [SystemRoles.ClubOwner]: ROUTES.CLUBS,
    [SystemRoles.Supervisor]: ROUTES.DASHBOARD,
    [SystemRoles.Referee]: ROUTES.DASHBOARD,
    [SystemRoles.Admin]: ROUTES.DASHBOARD,
    [SystemRoles.NewsPublisher]: ROUTES.DASHBOARD,
  };
  return routes[role] || ROUTES.DASHBOARD;
}

