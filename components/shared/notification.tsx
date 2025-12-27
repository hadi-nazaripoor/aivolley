"use client";

import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect } from "react";

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

export function Notification({
  type,
  message,
  onDismiss,
  autoDismiss = true,
  duration = 5000,
}: NotificationProps) {
  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration, onDismiss]);

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-50" : "bg-red-50";
  const textColor = isSuccess ? "text-green-800" : "text-red-800";
  const iconColor = isSuccess ? "text-green-400" : "text-red-400";
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div className={`rounded-md ${bgColor} p-4`}>
      <div className="flex">
        <div className="shrink-0">
          <Icon aria-hidden="true" className={`size-5 ${iconColor}`} />
        </div>
        <div className="mr-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        {onDismiss && (
          <div className="shrink-0">
            <button
              type="button"
              onClick={onDismiss}
              className={`inline-flex rounded-md ${bgColor} ${textColor} hover:opacity-75 focus:outline-hidden focus:ring-2 focus:ring-offset-2 ${
                isSuccess
                  ? "focus:ring-green-600 focus:ring-offset-green-50"
                  : "focus:ring-red-600 focus:ring-offset-red-50"
              }`}
            >
              <span className="sr-only">بستن</span>
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

