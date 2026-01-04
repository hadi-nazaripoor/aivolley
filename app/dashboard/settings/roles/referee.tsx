"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function RefereeRoleForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Form submission logic will be added later
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Label htmlFor="referee-license">گواهینامه داوری</Label>
          <div className="mt-2">
            <Input
              id="referee-license"
              type="text"
              placeholder="شماره گواهینامه"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="referee-level">سطح داوری</Label>
          <div className="mt-2">
            <Input
              id="referee-level"
              type="text"
              placeholder="سطح"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:bg-gray-400 sm:mr-3 sm:w-auto"
        >
          ذخیره تغییرات
        </Button>
      </div>
    </form>
  );
}

