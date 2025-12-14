import { cn } from "@/lib/utils/cn";

interface StatusBadgeProps {
  isValid: boolean;
  className?: string;
}

export function StatusBadge({ isValid, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        isValid
          ? "bg-green-50 text-green-700 ring-green-600/20"
          : "bg-red-50 text-red-700 ring-red-600/20",
        className
      )}
    >
      {isValid ? "معتبر" : "غیر معتبر"}
    </span>
  );
}

