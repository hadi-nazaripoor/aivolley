# Design System - Sports News UI

## Design Reference

This project follows the visual design language of **football360.ir** as aesthetic inspiration:
- Layout structure and content organization
- Spacing and typography hierarchy
- Card structure and content density
- Visual hierarchy and information architecture
- Clean, modern sports-news UI style

**Important**: We do NOT copy code or assets from football360.ir. We use it purely as visual reference for design decisions.

## Visual Principles

### 1. Layout Structure

**Header/Navigation**
- Fixed or sticky header with clear navigation
- Logo on the right (RTL)
- Main navigation items with clear hierarchy
- Search functionality prominently placed
- Category/topic navigation below main nav

**Content Area**
- Multi-column layout (responsive grid)
- Main content area (2/3 width on desktop)
- Sidebar for additional content (1/3 width on desktop)
- Clear section separation with consistent spacing

**Footer**
- Organized links and information
- Social media links
- Copyright and legal information

### 2. Card Structure

**News Article Cards**
- Image at top (16:9 or 4:3 aspect ratio)
- Category/tag badge above or on image
- Headline (prominent, bold, 2-3 lines max)
- Excerpt/summary (2-3 lines, muted color)
- Metadata row: author, date, read time
- Hover effect: subtle lift or shadow increase
- Border radius: `rounded-lg` or `rounded-xl`
- Padding: `p-4` or `p-6`

**Card Variants**
- **Featured/Large**: Full width or 2-column span, larger image
- **Standard**: Single column, standard image size
- **Compact**: Smaller image, condensed information
- **List**: Horizontal layout, image on side

### 3. Typography Hierarchy

**Headlines**
- **Hero/Featured**: `text-3xl` or `text-4xl`, `font-bold`, `leading-tight`
- **Section Headers**: `text-2xl`, `font-bold`, `leading-tight`
- **Article Headlines**: `text-xl` or `text-2xl`, `font-semibold`, `leading-tight`
- **Card Headlines**: `text-lg` or `text-xl`, `font-semibold`, `leading-snug`

**Body Text**
- **Article Body**: `text-base`, `leading-relaxed`, `text-muted-foreground`
- **Excerpts**: `text-sm`, `leading-relaxed`, `text-muted-foreground`
- **Metadata**: `text-xs` or `text-sm`, `text-muted-foreground`

**Font Weights**
- Headlines: `font-bold` or `font-semibold`
- Body: `font-normal`
- Emphasis: `font-medium`

### 4. Spacing System

**Card Spacing**
- Card padding: `p-4` (mobile), `p-6` (desktop)
- Card gap: `gap-4` or `gap-6` between cards
- Section spacing: `mb-8` or `mb-12` between sections

**Content Spacing**
- Image to headline: `mt-4` or `mt-6`
- Headline to excerpt: `mt-2` or `mt-3`
- Excerpt to metadata: `mt-3` or `mt-4`
- Section margins: `mb-6`, `mb-8`, `mb-12`

**Container Spacing**
- Page padding: `px-4` (mobile), `px-6` (tablet), `px-8` (desktop)
- Max width containers: `max-w-7xl` or `max-w-6xl`, `mx-auto`

### 5. Content Density

**Information Architecture**
- Medium to high content density
- Clear visual separation between items
- Scannable layout with consistent patterns
- Multiple content types: articles, images, videos, stats

**Grid Layouts**
- **Desktop**: 3-column grid for cards, 2-column for featured
- **Tablet**: 2-column grid
- **Mobile**: 1-column stack

### 6. Visual Hierarchy

**Color Usage**
- Primary color for CTAs and highlights
- Muted colors for secondary text and backgrounds
- Clear contrast for readability
- Category/tag colors for organization

**Image Treatment**
- Consistent aspect ratios
- Object-fit: cover for card images
- Overlay gradients for text readability when needed
- Lazy loading for performance

**Shadows & Borders**
- Cards: `shadow-sm` or `shadow-md`, `border` with subtle color
- Hover: `shadow-lg` or `shadow-xl`
- Sections: Subtle borders or background color separation

### 7. Component Patterns

**Category/Tag Badges**
- Small, rounded badges
- Color-coded by category
- Positioned on image overlay or above content
- `text-xs` or `text-sm`, `px-2` or `px-3`, `py-1`

**Metadata Display**
- Icon + text pattern
- Small, muted text
- Consistent spacing between items
- `flex items-center gap-2`

**Image Placeholders**
- Skeleton loaders during image load
- Consistent aspect ratio containers
- Background color: `bg-muted`

**Section Headers**
- Clear typography hierarchy
- Optional "View All" link on the right (RTL: left)
- Underline or border accent
- `mb-6` or `mb-8` spacing below

## Tailwind Design Tokens

### Colors (ShadCN Theme)
```typescript
// Use ShadCN color system
primary        // Main brand color
secondary      // Secondary actions
destructive    // Errors/destructive actions
muted          // Backgrounds, borders, secondary text
accent         // Highlights, tags
foreground     // Main text
background     // Page background
```

### Spacing Scale
```typescript
// Use Tailwind spacing scale consistently
2, 4, 6, 8, 12, 16, 20, 24, 32, 48, 64
```

### Border Radius
```typescript
rounded-sm   // 2px - small elements
rounded      // 4px - default
rounded-md   // 6px - buttons, inputs
rounded-lg   // 8px - cards (most common)
rounded-xl   // 12px - large cards, modals
rounded-2xl  // 16px - special cases
```

### Shadows
```typescript
shadow-sm    // Subtle elevation
shadow       // Default card shadow
shadow-md    // Medium elevation
shadow-lg    // Hover states
shadow-xl    // Modals, overlays
```

## Component Specifications

### News Card Component
```typescript
// Structure
- Container: rounded-lg, shadow-sm, border, overflow-hidden
- Image: w-full, aspect-video, object-cover
- Content: p-4 or p-6
- Category badge: absolute top-2 start-2 or above image
- Headline: text-lg font-semibold, mb-2
- Excerpt: text-sm text-muted-foreground, mb-3, line-clamp-2
- Metadata: flex items-center gap-4, text-xs text-muted-foreground
- Hover: shadow-md transition-shadow duration-200
```

### Section Header Component
```typescript
// Structure
- Container: flex items-center justify-between mb-6
- Title: text-2xl font-bold
- Link (optional): text-sm text-muted-foreground hover:text-foreground
```

### Category Badge Component
```typescript
// Structure
- Container: inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
- Background: bg-primary/10 text-primary or category-specific color
```

## Responsive Breakpoints

```typescript
// Tailwind default breakpoints
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large desktop
```

## RTL Considerations

- All spacing uses logical properties (`ms-*`, `me-*`)
- Text alignment: `text-start` (right in RTL)
- Navigation flows right-to-left
- Icons flip when directional (arrows, chevrons)
- Images maintain aspect ratio, no flipping

## Implementation Rules

1. **Never copy** styles directly from football360.ir
2. **Always use** Tailwind utilities and ShadCN components
3. **Maintain** consistent spacing and typography scale
4. **Follow** the card structure patterns defined above
5. **Ensure** all components are responsive and RTL-aware
6. **Keep** content density balanced - not too sparse, not too crowded
7. **Use** clear visual hierarchy for scannability

