# RTL (Right-to-Left) Implementation Guide

## Overview

This project uses RTL layout by default. All components and styles should be RTL-aware.

## Best Practices

### 1. Use Logical Properties (Recommended)

Tailwind CSS v4 supports logical properties that automatically adapt to RTL:

```tsx
// ✅ Good - Use logical properties
<div className="ms-4 me-2 ps-6 pe-4">
  {/* ms = margin-start, me = margin-end */}
  {/* ps = padding-start, pe = padding-end */}
</div>

// ❌ Avoid - Physical properties
<div className="ml-4 mr-2 pl-6 pr-4">
</div>
```

**Logical Properties Mapping:**
- `ms-*` = margin-start (left in LTR, right in RTL)
- `me-*` = margin-end (right in LTR, left in RTL)
- `ps-*` = padding-start
- `pe-*` = padding-end
- `start-*` = left in LTR, right in RTL
- `end-*` = right in LTR, left in RTL

### 2. Use RTL Variant for Specific Overrides

When you need RTL-specific styles:

```tsx
// ✅ Good - RTL variant
<div className="ml-4 rtl:mr-4">
  {/* Left margin in LTR, right margin in RTL */}
</div>
```

### 3. Text Alignment

```tsx
// ✅ Good - RTL-aware
<div className="text-start">  {/* Right in RTL */}
<div className="text-end">    {/* Left in RTL */}
<div className="text-right">  {/* Always right */}
```

### 4. Icons and Images

Flip icons that have directional meaning:

```tsx
// ✅ Good - Flip directional icons
<ChevronLeft className="rtl:rotate-180" />
<ArrowRight className="rtl:rotate-180" />

// ✅ Good - Use transform for flipping
<img src="/arrow.svg" className="rtl:scale-x-[-1]" />
```

### 5. Flexbox and Grid

```tsx
// ✅ Good - Logical properties
<div className="flex items-start justify-start">
  {/* start aligns to right in RTL */}
</div>

// ✅ Good - RTL-aware flex direction
<div className="flex-row rtl:flex-row-reverse">
</div>
```

### 6. Borders

```tsx
// ✅ Good - Logical borders
<div className="border-s-2 border-e-4">
  {/* border-s = border-start, border-e = border-end */}
</div>
```

### 7. Positioning

```tsx
// ✅ Good - Logical positioning
<div className="start-0 end-auto">
  {/* start = left in LTR, right in RTL */}
</div>
```

## Component Examples

### Button Component

```tsx
import { cn } from "@/lib/utils/cn";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md",
        "ms-2", // margin-start (right in RTL)
        className
      )}
    >
      {children}
    </button>
  );
}
```

### Card Component

```tsx
import { cn } from "@/lib/utils/cn";

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-lg border",
        "text-start", // Right-aligned in RTL
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Navigation Component

```tsx
export function Navigation() {
  return (
    <nav className="flex items-center justify-start gap-4">
      {/* Items flow from right to left in RTL */}
      <a href="/" className="ms-4">Home</a>
      <a href="/about" className="ms-4">About</a>
    </nav>
  );
}
```

## Testing RTL

1. **Visual Testing**: Check all components render correctly in RTL
2. **Interaction Testing**: Ensure hover, focus, and click states work
3. **Icon Testing**: Verify directional icons are flipped correctly
4. **Animation Testing**: Check animations flow in the correct direction

## Common Pitfalls

1. ❌ **Don't use** `ml-*`, `mr-*`, `pl-*`, `pr-*` without RTL variant
2. ❌ **Don't assume** left/right positioning without considering RTL
3. ❌ **Don't hardcode** text alignment to `left` or `right`
4. ❌ **Don't forget** to flip directional icons and arrows

## ShadCN Components

ShadCN components work with RTL by default when using:
- Logical properties (`ms-*`, `me-*`, etc.)
- `text-start` / `text-end` instead of `text-left` / `text-right`
- RTL variants when needed

When adding ShadCN components, review and update any hardcoded directional styles.

