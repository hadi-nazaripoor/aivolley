/**
 * Application route constants
 * Centralized route definitions for type safety and consistency
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

