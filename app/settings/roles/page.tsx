"use client";

import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PlayerRoleForm } from "./player";
import { CoachRoleForm } from "./coach";
import { RefereeRoleForm } from "./referee";
import { ClubOwnerRoleForm } from "./club-owner";
import { SupervisorRoleForm } from "./supervisor";
import { getPlayerMe } from "@/lib/api/services/player";
import type { PlayerResponse, ApprovalStatus } from "@/lib/api/types";

type RoleStatus = "pending" | "approved" | "rejected";

interface Role {
  id: string;
  name: string;
  claimed: boolean;
  status: RoleStatus;
  data?: PlayerResponse | null; // Store role-specific data
}

// Map ApprovalStatus to RoleStatus
function mapApprovalStatus(status: ApprovalStatus): RoleStatus {
  switch (status) {
    case "Pending":
      return "pending";
    case "Approved":
      return "approved";
    case "Rejected":
      return "rejected";
    default:
      return "pending";
  }
}

// All available roles (both claimed and unclaimed)
const allAvailableRoles: Role[] = [
  { id: "player", name: "بازیکن", claimed: false, status: "pending" },
  { id: "coach", name: "مربی", claimed: false, status: "pending" },
  { id: "club-owner", name: "مالک باشگاه", claimed: false, status: "pending" },
  { id: "supervisor", name: "سرپرست", claimed: false, status: "pending" },
  { id: "referee", name: "داور", claimed: false, status: "pending" },
];

function RoleStatusBadge({ status }: { status: RoleStatus }) {
  const statusConfig = {
    pending: {
      label: "در انتظار بررسی",
      className: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    },
    approved: {
      label: "تایید شده",
      className: "bg-green-50 text-green-700 ring-green-600/20",
    },
    rejected: {
      label: "رد شده",
      className: "bg-red-50 text-red-700 ring-red-600/20",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

function renderRoleForm(
  roleId: string,
  roleData?: PlayerResponse | null,
  onSuccess?: () => void,
  isNew?: boolean
) {
  switch (roleId) {
    case "player":
      return (
        <PlayerRoleForm
          existingData={roleData || null}
          onSuccess={onSuccess}
          isNew={isNew}
        />
      );
    case "coach":
      return <CoachRoleForm />;
    case "referee":
      return <RefereeRoleForm />;
    case "club-owner":
      return <ClubOwnerRoleForm />;
    case "supervisor":
      return <SupervisorRoleForm />;
    default:
      return null;
  }
}

export default function RolesPage() {
  const [openRoleId, setOpenRoleId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>(allAvailableRoles);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(true);

  // Load player role on mount
  useEffect(() => {
    const loadPlayerRole = async () => {
      setIsLoadingPlayer(true);
      try {
        const playerData = await getPlayerMe();
        if (playerData) {
          // Player role exists - mark as claimed and set status
          setRoles((prevRoles) =>
            prevRoles.map((role) =>
              role.id === "player"
                ? {
                    ...role,
                    claimed: true,
                    status: mapApprovalStatus(playerData.approvalStatus),
                    data: playerData,
                  }
                : role
            )
          );
        } else {
          // 404 or no data - player doesn't exist yet (normal flow, not an error)
          // Keep player as unclaimed so it appears in dropdown
          setRoles((prevRoles) =>
            prevRoles.map((role) =>
              role.id === "player"
                ? {
                    ...role,
                    claimed: false,
                    status: "pending",
                    data: null,
                  }
                : role
            )
          );
        }
      } catch (error) {
        // Only log actual errors (not 404s)
        console.error("Error loading player role:", error);
        // On error, keep player as unclaimed
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === "player"
              ? {
                  ...role,
                  claimed: false,
                  status: "pending",
                  data: null,
                }
              : role
          )
        );
      } finally {
        setIsLoadingPlayer(false);
      }
    };

    loadPlayerRole();
  }, []);

  const handleRoleToggle = (roleId: string) => {
    setOpenRoleId(openRoleId === roleId ? null : roleId);
  };

  const handleClaimRole = (roleId: string) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId
          ? { ...role, claimed: true, status: "pending", data: null }
          : role
      )
    );
    // Auto-open the role form when claimed
    setOpenRoleId(roleId);
  };

  const handlePlayerSuccess = async () => {
    // Reload player data after successful create/update
    try {
      const playerData = await getPlayerMe();
      if (playerData) {
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === "player"
              ? {
                  ...role,
                  claimed: true,
                  status: mapApprovalStatus(playerData.approvalStatus),
                  data: playerData,
                }
              : role
          )
        );
      }
    } catch (error) {
      console.error("Error reloading player role:", error);
    }
  };

  // Filter roles: show only unclaimed in dropdown, only claimed in cards
  const unclaimedRoles = roles.filter((role) => !role.claimed);
  const claimedRoles = roles.filter((role) => role.claimed);

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900">نقش‌های من</h2>
        <p className="mt-1 text-sm/6 text-gray-500">
          نقش‌های تعریف‌شده برای حساب کاربری خود را مدیریت کنید.
        </p>
        <div className="mt-6">
          <Menu as="div" className="relative inline-block">
            <div>
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                افزودن نقش
                <ChevronDown aria-hidden="true" className="-ml-1 size-5 text-gray-400" />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                {unclaimedRoles.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    همه نقش‌ها اضافه شده‌اند
                  </div>
                ) : (
                  unclaimedRoles.map((role) => (
                    <MenuItem key={role.id}>
                      <button
                        type="button"
                        onClick={() => handleClaimRole(role.id)}
                        className="block w-full text-right px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        {role.name}
                      </button>
                    </MenuItem>
                  ))
                )}
              </div>
            </MenuItems>
          </Menu>
        </div>
        <div className="mt-6">
          {claimedRoles.length === 0 ? (
            <>
              <p className="text-sm/6 text-gray-900">شما هیچ نقش تعریف‌شده‌ای ندارید.</p>
            </>
          ) : (
            <div className="space-y-4">
              {claimedRoles.map((role) => {
                const isOpen = openRoleId === role.id;
                return (
                  <div
                    key={role.id}
                    className="rounded-lg border border-gray-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => handleRoleToggle(role.id)}
                      className="flex w-full items-center justify-between px-4 py-4 text-right hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                        <div>
                          <RoleStatusBadge status={role.status} />
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="size-5 text-gray-400" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="size-5 text-gray-400" aria-hidden="true" />
                      )}
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200 ease-in-out",
                        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="border-t border-gray-200 px-4 py-4">
                        {renderRoleForm(
                          role.id,
                          role.data,
                          handlePlayerSuccess,
                          !role.data // isNew = true if no existing data
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

