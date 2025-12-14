/**
 * Image URL Helper Utility
 * Converts relative image paths from the API to full absolute URLs
 */

/**
 * Default placeholder avatar image
 * Used when avatar path is missing or empty
 */
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

/**
 * Get the base URL for images from environment variable
 */
function getImageBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5083";
  // Remove trailing slash if present
  return baseUrl.replace(/\/$/, "");
}

/**
 * Converts a relative image path to a full absolute URL
 *
 * @param imagePath - Relative path from API (e.g., "uploads/players/ali.jpg")
 * @param fallback - Optional fallback URL if imagePath is missing (defaults to DEFAULT_AVATAR)
 * @returns Full absolute URL or fallback
 *
 * @example
 * getImageUrl("uploads/players/ali.jpg")
 * // Returns: "http://localhost:5083/uploads/players/ali.jpg"
 *
 * @example
 * getImageUrl("https://example.com/image.jpg")
 * // Returns: "https://example.com/image.jpg" (already absolute)
 *
 * @example
 * getImageUrl(null)
 * // Returns: DEFAULT_AVATAR
 */
export function getImageUrl(
  imagePath: string | null | undefined,
  fallback: string = DEFAULT_AVATAR
): string {
  // Handle null, undefined, or empty string
  if (!imagePath || imagePath.trim() === "") {
    return fallback;
  }

  // If path already starts with "http" (http:// or https://), return as-is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  // Combine base URL with relative path
  const baseUrl = getImageBaseUrl();
  return `${baseUrl}/${cleanPath}`;
}

