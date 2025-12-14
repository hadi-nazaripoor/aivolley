"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/contexts/auth-context";
import { registerSchema, type RegisterFormData } from "@/lib/utils/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, authLoading, router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerUser(
        data.phoneNumber,
        data.firstName,
        data.lastName,
        data.password
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "ثبت‌نام با خطا مواجه شد";
      setError(errorMessage);
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-xl font-bold tracking-tight text-gray-900">
          ایجاد حساب کاربری جدید
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="phoneNumber">شماره تلفن</Label>
              <div className="mt-2">
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="09123456789"
                  autoComplete="tel"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="firstName">نام</Label>
              <div className="mt-2">
                <Input
                  id="firstName"
                  type="text"
                  placeholder="نام"
                  autoComplete="given-name"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="lastName">نام خانوادگی</Label>
              <div className="mt-2">
                <Input
                  id="lastName"
                  type="text"
                  placeholder="نام خانوادگی"
                  autoComplete="family-name"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="password">رمز عبور</Label>
              <div className="mt-2">
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
              <div className="mt-2">
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          قبلاً عضو شده‌اید؟{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            ورود
          </Link>
        </p>
      </div>
    </div>
  );
}

