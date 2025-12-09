/**
 * RTL utility helpers for directional properties
 * Use these when you need to conditionally apply RTL-aware styles
 */

export const rtl = {
  left: "right",
  right: "left",
  ml: "mr",
  mr: "ml",
  pl: "pr",
  pr: "pl",
  borderL: "borderR",
  borderR: "borderL",
} as const;

/**
 * Get RTL-aware class name
 * @param ltrClass - LTR class name (e.g., "ml-4")
 * @param rtlClass - RTL class name (e.g., "mr-4")
 * @returns The appropriate class based on direction
 */
export function getRtlClass(ltrClass: string, rtlClass: string): string {
  // In RTL mode, return RTL class
  // Note: This is a helper - prefer using Tailwind's logical properties (ms-*, me-*) or rtl: variant
  return rtlClass;
}

/**
 * Prefer using Tailwind's logical properties:
 * - ms-* (margin-start) instead of ml-* or mr-*
 * - me-* (margin-end) instead of mr-* or ml-*
 * - ps-* (padding-start) instead of pl-* or pr-*
 * - pe-* (padding-end) instead of pr-* or pl-*
 * 
 * Or use the rtl: variant for specific RTL overrides:
 * - rtl:ml-4 for margin-left in RTL mode
 */

