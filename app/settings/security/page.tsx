"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900">تغییر رمز عبور</h2>
        <p className="mt-1 text-sm/6 text-gray-500">
          رمز عبور مرتبط با حساب کاربری خود را به‌روزرسانی کنید.
        </p>

        <form className="mt-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <Label htmlFor="current-password">رمز عبور فعلی</Label>
              <div className="mt-2">
                <Input
                  id="current-password"
                  name="current_password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="رمز عبور فعلی"
                />
              </div>
            </div>

            <div className="col-span-full">
              <Label htmlFor="new-password">رمز عبور جدید</Label>
              <div className="mt-2">
                <Input
                  id="new-password"
                  name="new_password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="رمز عبور جدید"
                />
              </div>
            </div>

            <div className="col-span-full">
              <Label htmlFor="confirm-password">تکرار رمز عبور جدید</Label>
              <div className="mt-2">
                <Input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="تکرار رمز عبور جدید"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <Button type="submit">ذخیره</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

