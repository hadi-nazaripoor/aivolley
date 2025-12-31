"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/components/shared/notification";
import { createClubOwner } from "@/lib/api/services/club-owner";
import type { ClubOwnerResponse } from "@/lib/api/types";
import { ApprovalStatus } from "@/lib/api/types";

interface ClubOwnerRoleFormProps {
  onSuccess?: () => void;
  existingData?: ClubOwnerResponse | null;
  isNew?: boolean;
}

export function ClubOwnerRoleForm({ onSuccess, existingData, isNew = false }: ClubOwnerRoleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      // Only create if this is a new role (no existing data)
      if (isNew || !existingData) {
        await createClubOwner({});
        setNotification({
          type: "success",
          message: "درخواست نقش مالک باشگاه با موفقیت ثبت شد",
        });

        // Call onSuccess callback to refresh parent component
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      } else {
        // Club Owner role has no update functionality - only create
        setNotification({
          type: "error",
          message: "این نقش قبلاً ثبت شده است",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در ثبت درخواست نقش مالک باشگاه";
      setNotification({
        type: "error",
        message: errorMessage,
      });
      console.error("Error creating club owner:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If role already exists, show status-based message
  if (existingData && !isNew) {
    const status = existingData.approvalStatus;
    
    // Determine message and styling based on approval status
    let message = "";
    let bgColor = "";
    let textColor = "";
    
    if (status === ApprovalStatus.Pending) {
      message = "درخواست نقش مالک باشگاه شما ثبت شده است و در حال بررسی می‌باشد.";
      bgColor = "bg-gray-50";
      textColor = "text-gray-700";
    } else if (status === ApprovalStatus.Approved) {
      message = "نقش مالک باشگاه شما با موفقیت تأیید شده است.";
      bgColor = "bg-green-50";
      textColor = "text-green-700";
    } else if (status === ApprovalStatus.Rejected) {
      message = "درخواست نقش مالک باشگاه تأیید نشد.";
      bgColor = "bg-red-50";
      textColor = "text-red-700";
    }
    
    return (
      <div className="space-y-6">
        {notification && (
          <div className="mb-4">
            <Notification
              type={notification.type}
              message={notification.message}
              onDismiss={() => setNotification(null)}
            />
          </div>
        )}
        <div className={`rounded-md ${bgColor} p-4`}>
          <p className={`text-sm ${textColor}`}>
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {notification && (
        <div className="mb-4">
          <Notification
            type={notification.type}
            message={notification.message}
            onDismiss={() => setNotification(null)}
          />
        </div>
      )}

      <div className="rounded-md bg-blue-50 p-4">
        <p className="text-sm text-gray-700">
          با ثبت این درخواست، شما تقاضای نقش مالک باشگاه را ثبت می‌کنید.
        </p>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:bg-gray-400 sm:mr-3 sm:w-auto"
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت درخواست"}
        </Button>
      </div>
    </form>
  );
}


