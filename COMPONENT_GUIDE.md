# Component Development Guide

Quick reference for building components following the football360.ir design language.

## Component Checklist

When creating a new component, ensure:

- [ ] Uses TypeScript with proper types
- [ ] Follows RTL layout (uses logical properties: `ms-*`, `me-*`)
- [ ] Uses ShadCN components when possible
- [ ] Follows design system spacing and typography
- [ ] Is responsive (mobile-first)
- [ ] Has proper hover/focus states
- [ ] Uses design tokens from `lib/constants/design.ts`

## Common Component Patterns

### News Card Component

```tsx
import { cn } from "@/lib/utils/cn";
import { DESIGN_CLASSES } from "@/lib/constants/design";
import Image from "next/image";

interface NewsCardProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  author?: string;
}

export function NewsCard({
  title,
  excerpt,
  imageUrl,
  category,
  date,
  author,
}: NewsCardProps) {
  return (
    <article
      className={cn(
        DESIGN_CLASSES.card.container,
        DESIGN_CLASSES.card.padding,
        DESIGN_CLASSES.card.hover
      )}
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        {/* Category Badge */}
        <span className="absolute top-2 start-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className={DESIGN_CLASSES.card.padding}>
        <h3 className={cn(DESIGN_CLASSES.headline.small, "mb-2")}>
          {title}
        </h3>
        <p className={cn(DESIGN_CLASSES.excerpt, "mb-3")}>{excerpt}</p>
        <div className={DESIGN_CLASSES.metadata}>
          <span>{date}</span>
          {author && <span>{author}</span>}
        </div>
      </div>
    </article>
  );
}
```

### Section Header Component

```tsx
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
}

export function SectionHeader({
  title,
  href,
  linkText = "View All",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className={cn(DESIGN_CLASSES.sectionHeader)}>{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
```

### Category Badge Component

```tsx
import { cn } from "@/lib/utils/cn";
import { DESIGN_CLASSES } from "@/lib/constants/design";

interface CategoryBadgeProps {
  label: string;
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export function CategoryBadge({
  label,
  variant = "default",
  className,
}: CategoryBadgeProps) {
  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary-foreground",
  };

  return (
    <span
      className={cn(
        DESIGN_CLASSES.categoryBadge,
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
```

## Spacing Guidelines

```tsx
// Card spacing
p-4        // Mobile card padding
p-6        // Desktop card padding
gap-4      // Gap between cards (mobile)
gap-6      // Gap between cards (desktop)

// Section spacing
mb-6       // Small section margin
mb-8       // Medium section margin
mb-12      // Large section margin

// Content spacing within cards
mt-2       // Headline to excerpt
mt-3       // Excerpt to metadata
mt-4       // Image to headline
```

## Typography Classes

```tsx
// Use design system classes
DESIGN_CLASSES.headline.large    // Hero/Featured headlines
DESIGN_CLASSES.headline.medium   // Section headers
DESIGN_CLASSES.headline.small    // Card headlines
DESIGN_CLASSES.excerpt           // Article excerpts
DESIGN_CLASSES.metadata          // Date, author, etc.
```

## RTL Considerations

```tsx
// ✅ Use logical properties
ms-4       // margin-start (right in RTL)
me-4       // margin-end (left in RTL)
ps-4       // padding-start
pe-4       // padding-end
start-2    // positioning start
end-2      // positioning end

// ✅ Text alignment
text-start // Right in RTL
text-end   // Left in RTL

// ❌ Avoid physical properties without RTL variant
ml-4       // Use ms-4 instead
mr-4       // Use me-4 instead
```

## Image Handling

```tsx
import Image from "next/image";

// Card images
<div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
  <Image
    src={imageUrl}
    alt={description}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>
```

## Grid Layouts

```tsx
// Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {items.map((item) => (
    <NewsCard key={item.id} {...item} />
  ))}
</div>

// Featured + Standard layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
  <div className="lg:col-span-2">
    <FeaturedCard {...featured} />
  </div>
  <div className="space-y-4">
    {standardItems.map((item) => (
      <NewsCard key={item.id} {...item} />
    ))}
  </div>
</div>
```

## Hover States

```tsx
// Card hover
hover:shadow-md transition-shadow duration-200

// Link hover
hover:text-foreground transition-colors

// Button hover (ShadCN handles this)
// Use ShadCN Button component
```

## Loading States

```tsx
// Skeleton loader for cards
<div className="rounded-lg border p-4 animate-pulse">
  <div className="w-full aspect-video bg-muted rounded-lg mb-4" />
  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
  <div className="h-4 bg-muted rounded w-1/2" />
</div>
```

## Best Practices

1. **Always use** `cn()` utility for className merging
2. **Import** design constants from `@/lib/constants/design`
3. **Use** ShadCN components as base, extend when needed
4. **Ensure** all interactive elements have hover/focus states
5. **Test** components in RTL mode
6. **Keep** components focused and reusable
7. **Type** all props with TypeScript interfaces
8. **Use** Next.js Image component for all images

