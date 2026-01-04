"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Notification } from "@/components/shared/notification";
import { createPlayer, updatePlayer } from "@/lib/api/services/player";
import { Handedness, PlayerPositions } from "@/lib/api/types";
import type { PlayerResponse } from "@/lib/api/types";

// Default form values - always ensure controlled inputs
const defaultPlayerForm = {
  height: "",
  weight: "",
  handedness: Handedness.Right,
  playerPosition: PlayerPositions.OutsideHitter,
};

interface PlayerFormData {
  height: string; // Use string for form, convert to number on submit
  weight: string; // Use string for form, convert to number on submit
  handedness: Handedness;
  playerPosition: PlayerPositions;
}

interface PlayerRoleFormProps {
  onSuccess?: () => void;
  existingData?: PlayerResponse | null;
  isNew?: boolean; // Explicit flag to indicate if this is a new role
}

export function PlayerRoleForm({ onSuccess, existingData, isNew = false }: PlayerRoleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Initialize form with defaults, then update if existingData is provided
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PlayerFormData>({
    defaultValues: defaultPlayerForm,
  });

  // Update form when existingData changes or when component mounts
  useEffect(() => {
    if (existingData) {
      // Map existing data to form format (numbers to strings)
      reset({
        height: existingData.height.toString(),
        weight: existingData.weight.toString(),
        handedness: existingData.handedness,
        playerPosition: existingData.playerPosition,
      });
    } else {
      // Ensure defaults are set even if no existing data
      reset(defaultPlayerForm);
    }
  }, [existingData, reset]);

  const onSubmit = async (data: PlayerFormData) => {
    setIsSubmitting(true);
    setNotification(null);

    try {
      // Convert string inputs to numbers
      const height = parseFloat(data.height);
      const weight = parseFloat(data.weight);

      // Validate numbers
      if (isNaN(height) || height <= 0) {
        throw new Error("قد باید یک عدد معتبر باشد");
      }
      if (isNaN(weight) || weight <= 0) {
        throw new Error("وزن باید یک عدد معتبر باشد");
      }

      const playerData = {
        height,
        weight,
        handedness: data.handedness,
        playerPosition: data.playerPosition,
      };

      if (existingData || !isNew) {
        // Update existing player
        await updatePlayer(playerData);
        setNotification({
          type: "success",
          message: "اطلاعات بازیکن با موفقیت به‌روزرسانی شد",
        });
      } else {
        // Create new player
        await createPlayer(playerData);
        setNotification({
          type: "success",
          message: "نقش بازیکن با موفقیت اضافه شد",
        });
      }

      // Call onSuccess callback to refresh parent component
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در ذخیره اطلاعات بازیکن";
      setNotification({
        type: "error",
        message: errorMessage,
      });
      console.error("Error saving player:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handednessValue = watch("handedness") || Handedness.Right;
  const playerPositionValue = watch("playerPosition") || PlayerPositions.OutsideHitter;
  const heightValue = watch("height") || "";
  const weightValue = watch("weight") || "";

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
          <Label htmlFor="player-height">قد (سانتی‌متر)</Label>
          <div className="mt-2">
            <Input
              id="player-height"
              type="number"
              placeholder="قد"
              value={heightValue}
              {...register("height", {
                required: "قد الزامی است",
                min: { value: 100, message: "قد باید حداقل 100 سانتی‌متر باشد" },
                max: { value: 250, message: "قد باید حداکثر 250 سانتی‌متر باشد" },
                onChange: (e) => {
                  setValue("height", e.target.value);
                },
              })}
            />
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="player-weight">وزن (کیلوگرم)</Label>
          <div className="mt-2">
            <Input
              id="player-weight"
              type="number"
              step="0.1"
              placeholder="وزن"
              value={weightValue}
              {...register("weight", {
                required: "وزن الزامی است",
                min: { value: 30, message: "وزن باید حداقل 30 کیلوگرم باشد" },
                max: { value: 200, message: "وزن باید حداکثر 200 کیلوگرم باشد" },
                onChange: (e) => {
                  setValue("weight", e.target.value);
                },
              })}
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="player-handedness">دست غالب</Label>
          <div className="mt-2">
            <select
              id="player-handedness"
              {...register("handedness", {
                required: "دست غالب الزامی است",
              })}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={handednessValue}
              onChange={(e) => {
                setValue("handedness", e.target.value as Handedness);
              }}
            >
              <option value={Handedness.Right}>راست</option>
              <option value={Handedness.Left}>چپ</option>
            </select>
            {errors.handedness && (
              <p className="mt-1 text-sm text-red-600">{errors.handedness.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="player-position">پست</Label>
          <div className="mt-2">
            <select
              id="player-position"
              {...register("playerPosition", {
                required: "پست الزامی است",
              })}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={playerPositionValue}
              onChange={(e) => {
                setValue("playerPosition", e.target.value as PlayerPositions);
              }}
            >
              <option value={PlayerPositions.OutsideHitter}>پاسور</option>
              <option value={PlayerPositions.OppositeHitter}>پاسور مخالف</option>
              <option value={PlayerPositions.MiddleBlocker}>مدافع میانی</option>
              <option value={PlayerPositions.Setter}>ست</option>
              <option value={PlayerPositions.Libero}>لیبرو</option>
            </select>
            {errors.playerPosition && (
              <p className="mt-1 text-sm text-red-600">{errors.playerPosition.message}</p>
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
