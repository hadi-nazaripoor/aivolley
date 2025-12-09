/**
 * Design system constants
 * Based on football360.ir visual design language (as reference only)
 */

export const DESIGN_TOKENS = {
  // Spacing scale (Tailwind defaults)
  spacing: {
    xs: "0.5rem", // 8px
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Border radius
  radius: {
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px - most common for cards
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
  },

  // Card specifications
  card: {
    padding: {
      mobile: "1rem", // p-4
      desktop: "1.5rem", // p-6
    },
    gap: "1rem", // gap-4
    shadow: {
      default: "shadow-sm",
      hover: "shadow-md",
    },
  },

  // Typography scale
  typography: {
    hero: {
      size: "2.25rem", // text-4xl
      weight: "bold",
      lineHeight: "tight",
    },
    h1: {
      size: "1.875rem", // text-3xl
      weight: "bold",
      lineHeight: "tight",
    },
    h2: {
      size: "1.5rem", // text-2xl
      weight: "bold",
      lineHeight: "tight",
    },
    h3: {
      size: "1.25rem", // text-xl
      weight: "semibold",
      lineHeight: "snug",
    },
    body: {
      size: "1rem", // text-base
      weight: "normal",
      lineHeight: "relaxed",
    },
    small: {
      size: "0.875rem", // text-sm
      weight: "normal",
      lineHeight: "relaxed",
    },
    xs: {
      size: "0.75rem", // text-xs
      weight: "normal",
      lineHeight: "normal",
    },
  },

  // Content density
  content: {
    cardImageAspectRatio: "16/9", // aspect-video
    excerptLineClamp: 2,
    headlineLineClamp: 3,
  },

  // Grid layouts
  grid: {
    desktop: {
      columns: 3,
      gap: "1.5rem", // gap-6
    },
    tablet: {
      columns: 2,
      gap: "1rem", // gap-4
    },
    mobile: {
      columns: 1,
      gap: "1rem", // gap-4
    },
  },
} as const;

/**
 * Design system class name helpers
 * Use these for consistent styling across components
 */
export const DESIGN_CLASSES = {
  card: {
    container: "rounded-lg shadow-sm border overflow-hidden",
    padding: "p-4 md:p-6",
    hover: "hover:shadow-md transition-shadow duration-200",
  },
  headline: {
    large: "text-2xl md:text-3xl font-bold leading-tight",
    medium: "text-xl md:text-2xl font-semibold leading-tight",
    small: "text-lg md:text-xl font-semibold leading-snug",
  },
  excerpt: "text-sm text-muted-foreground leading-relaxed line-clamp-2",
  metadata: "flex items-center gap-4 text-xs text-muted-foreground",
  sectionHeader: "text-2xl font-bold mb-6",
  categoryBadge: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
} as const;

