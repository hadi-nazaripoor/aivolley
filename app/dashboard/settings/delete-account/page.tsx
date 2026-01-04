"use client";

import { Button } from "@/components/ui/button";

export default function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900">حذف حساب کاربری</h2>
        <p className="mt-1 text-sm/6 text-gray-500">
          دیگر نمی‌خواهید از سرویس ما استفاده کنید؟ می‌توانید حساب کاربری خود را اینجا
          حذف کنید. این عمل قابل بازگشت نیست. تمام اطلاعات مرتبط با این حساب به طور
          دائمی حذف خواهد شد.
        </p>

        <form className="mt-6 flex items-start" onSubmit={(e) => { e.preventDefault(); }}>
          <Button type="submit" variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-300">
            بله، حساب کاربری من را حذف کن
          </Button>
        </form>
      </div>
    </div>
  );
}

