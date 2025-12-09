/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  NAME: "Volley",
  VERSION: "0.1.0",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  IS_RTL: true, // Default RTL layout
} as const;

