/**
 * JWT Token Utilities
 * Handles JWT token decoding and role extraction
 */

/**
 * Decode JWT token without verification (client-side only)
 * Note: This does NOT verify the token signature - it only decodes the payload
 * Token verification should be done on the server side
 */
export function decodeJwtToken(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

/**
 * Extract roles from JWT token
 * Handles the Microsoft claims format: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
 * Returns a normalized array of role strings
 */
export function extractRolesFromToken(token: string | null): string[] {
  if (!token) {
    return [];
  }

  try {
    const decoded = decodeJwtToken(token);
    if (!decoded) {
      return [];
    }

    // Check for Microsoft claims format
    const roleClaim =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (Array.isArray(roleClaim)) {
      return roleClaim;
    }

    if (typeof roleClaim === "string") {
      return [roleClaim];
    }

    // Fallback: check for standard "role" or "roles" claim
    if (decoded.role) {
      return Array.isArray(decoded.role) ? decoded.role : [decoded.role];
    }

    if (decoded.roles) {
      return Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
    }

    return [];
  } catch (error) {
    console.error("Error extracting roles from token:", error);
    return [];
  }
}

/**
 * Get roles from stored auth user
 * Reads from localStorage and extracts roles from token
 */
export function getRolesFromStorage(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedUser = localStorage.getItem("auth_user");
    if (!storedUser) {
      return [];
    }

    const user = JSON.parse(storedUser);
    const token = user?.token;

    if (!token) {
      return [];
    }

    return extractRolesFromToken(token);
  } catch (error) {
    console.error("Error getting roles from storage:", error);
    return [];
  }
}

