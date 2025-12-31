"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Notification } from "@/components/shared/notification";
import { createCoach, updateCoach } from "@/lib/api/services/coach";
import { CoachingLevels } from "@/lib/api/types";
import type { CoachResponse } from "@/lib/api/types";
import DatePicker from "@/components/ui/date-picker";
import { getImageUrl } from "@/lib/utils/image-url";

// Default form values - always ensure controlled inputs
const defaultCoachForm = {
  coachingLevel: CoachingLevels.Beginner,
  coachingCertificateIssuedAt: null as Date | null,
  coachingCertificateImage: null as File | null,
};

interface CoachFormData {
  coachingLevel: CoachingLevels;
  coachingCertificateIssuedAt: Date | null;
  coachingCertificateImage: File | null;
}

interface CoachRoleFormProps {
  onSuccess?: () => void;
  existingData?: CoachResponse | null;
  isNew?: boolean; // Explicit flag to indicate if this is a new role
}

export function CoachRoleForm({ onSuccess, existingData, isNew = false }: CoachRoleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [certificateDate, setCertificateDate] = useState<Date | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [selectedCertificateFile, setSelectedCertificateFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with defaults, then update if existingData is provided
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CoachFormData>({
    defaultValues: defaultCoachForm,
  });

  // Update form when existingData changes or when component mounts
  useEffect(() => {
    if (existingData) {
      // Map existing data to form format
      const issuedDate = existingData.coachingCertificateIssuedAt
        ? new Date(existingData.coachingCertificateIssuedAt)
        : null;
      
      setCertificateDate(issuedDate);
      reset({
        coachingLevel: existingData.coachingLevel,
        coachingCertificateIssuedAt: issuedDate,
        coachingCertificateImage: null, // Don't set file from existing data
      });
      
      // Set preview if image exists
      if (existingData.coachingCertificateImage) {
        setCertificatePreview(getImageUrl(existingData.coachingCertificateImage));
      }
    } else {
      // Ensure defaults are set even if no existing data
      setCertificateDate(null);
      setCertificatePreview(null);
      reset(defaultCoachForm);
    }
  }, [existingData, reset]);

  const handleCertificateClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setNotification({
        type: "error",
        message: "لطفاً یک فایل تصویری انتخاب کنید",
      });
      return;
    }

    // Check file size (2MB = 2097152 bytes)
    if (file.size > 2097152) {
      setNotification({
        type: "error",
        message: "حجم فایل باید کمتر از 2MB باشد",
      });
      return;
    }

    // Store the file for submission
    setSelectedCertificateFile(file);
    setValue("coachingCertificateImage", file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCertificatePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: CoachFormData) => {
    setIsSubmitting(true);
    setNotification(null);

    try {
      // Validate date
      if (!certificateDate) {
        throw new Error("تاریخ صدور گواهینامه الزامی است");
      }

      // Format date as ISO string (YYYY-MM-DD)
      const certificateDateStr = certificateDate.toISOString().split("T")[0];

      const coachData = {
        coachingLevel: data.coachingLevel,
        coachingCertificateIssuedAt: certificateDateStr,
        coachingCertificateImage: selectedCertificateFile || undefined,
      };

      if (existingData || !isNew) {
        // Update existing coach
        await updateCoach(coachData);
        setNotification({
          type: "success",
          message: "اطلاعات مربی با موفقیت به‌روزرسانی شد",
        });
      } else {
        // Create new coach
        await createCoach(coachData);
        setNotification({
          type: "success",
          message: "نقش مربی با موفقیت اضافه شد",
        });
      }

      // Clear file selection after successful submission (only if new file was uploaded)
      if (selectedCertificateFile) {
        setSelectedCertificateFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Keep preview if existing image exists, otherwise clear it
        if (!existingData?.coachingCertificateImage) {
          setCertificatePreview(null);
        }
      }

      // Call onSuccess callback to refresh parent component
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در ذخیره اطلاعات مربی";
      setNotification({
        type: "error",
        message: errorMessage,
      });
      console.error("Error saving coach:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const coachingLevelValue = watch("coachingLevel") || CoachingLevels.Beginner;

  // Map enum values to Persian labels
  const coachingLevelLabels: Record<CoachingLevels, string> = {
    [CoachingLevels.Beginner]: "مبتدی",
    [CoachingLevels.AssistantCoach]: "مربی دستیار",
    [CoachingLevels.Level3]: "سطح 3",
    [CoachingLevels.Level2]: "سطح 2",
    [CoachingLevels.Level1]: "سطح 1",
    [CoachingLevels.NationalCoach]: "مربی ملی",
    [CoachingLevels.InternationalCoach]: "مربی بین‌المللی",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {notification && (
        <div className="mb-4">
          <Notification
            type={notification.type}
            message={notification.message}
            onDismiss={() => setNotification(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Label htmlFor="coach-level">سطح مربیگری</Label>
          <div className="mt-2">
            <select
              id="coach-level"
              {...register("coachingLevel", {
                required: "سطح مربیگری الزامی است",
              })}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={coachingLevelValue}
              onChange={(e) => {
                setValue("coachingLevel", e.target.value as CoachingLevels);
              }}
            >
              {Object.values(CoachingLevels).map((level) => (
                <option key={level} value={level}>
                  {coachingLevelLabels[level]}
                </option>
              ))}
            </select>
            {errors.coachingLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.coachingLevel.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="coach-certificate-date">تاریخ صدور گواهینامه</Label>
          <div className="mt-2">
            <DatePicker
              value={certificateDate}
              onChange={(date) => {
                setCertificateDate(date);
                setValue("coachingCertificateIssuedAt", date);
              }}
              placeholder="تاریخ صدور گواهینامه"
            />
            {errors.coachingCertificateIssuedAt && (
              <p className="mt-1 text-sm text-red-600">
                {errors.coachingCertificateIssuedAt.message}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-full">
          <Label htmlFor="coach-certificate-image">تصویر گواهینامه مربیگری</Label>
          <div className="mt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {certificatePreview && (
              <div className="mb-4">
                <img
                  alt="گواهینامه مربیگری"
                  src={certificatePreview}
                  className="h-32 w-auto rounded-lg border border-gray-300 object-contain"
                />
                {existingData?.coachingCertificateImage && !selectedCertificateFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    تصویر فعلی - برای تغییر، تصویر جدیدی انتخاب کنید
                  </p>
                )}
              </div>
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCertificateClick}
            >
              {certificatePreview ? "تغییر تصویر" : "انتخاب تصویر"}
            </Button>
            <p className="mt-2 text-xs/5 text-gray-500">
              JPG، PNG یا WEBP. حداکثر 2MB.
            </p>
            {errors.coachingCertificateImage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.coachingCertificateImage.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:bg-gray-400 sm:mr-3 sm:w-auto"
        >
          {isSubmitting ? "در حال ذخیره..." : existingData ? "ذخیره تغییرات" : "افزودن نقش"}
        </Button>
      </div>
    </form>
  );
}
