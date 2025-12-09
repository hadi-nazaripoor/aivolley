# Project Architecture & Guidelines

## Design Reference

This project follows the visual design language of **football360.ir** as aesthetic inspiration:
- Layout structure and content organization
- Spacing and typography hierarchy  
- Card structure and content density
- Visual hierarchy and information architecture
- Clean, modern sports-news UI style

**Important**: We do NOT copy code or assets from football360.ir. We use it purely as visual reference for design decisions.

See `DESIGN_SYSTEM.md` for detailed design specifications.

## 1. Folder Structure

```
volley/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   └── settings/
│   ├── api/                      # API routes
│   │   └── [route]/
│   │       └── route.ts
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── loading.tsx               # Global loading UI
│
├── components/                   # React components
│   ├── ui/                       # ShadCN components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── navigation.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   └── dashboard/
│   │       └── stats-card.tsx
│   └── shared/                   # Shared/reusable components
│       ├── logo.tsx
│       ├── loading-spinner.tsx
│       └── error-boundary.tsx
│
├── lib/                          # Utilities & configurations
│   ├── api/                      # API client layer
│   │   ├── client.ts             # API client instance
│   │   ├── endpoints.ts          # API endpoint definitions
│   │   └── types.ts              # API request/response types
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # className utility (ShadCN)
│   │   ├── format.ts             # Formatting utilities
│   │   └── validation.ts         # Validation schemas
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-api.ts
│   │   └── use-debounce.ts
│   ├── constants/                # Constants & configs
│   │   ├── routes.ts
│   │   └── config.ts
│   └── types/                    # Global TypeScript types
│       ├── api.ts
│       └── common.ts
│
├── styles/                       # Additional styles
│   └── rtl.css                   # RTL-specific overrides
│
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local                    # Environment variables
├── .env.example
├── components.json               # ShadCN config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json
├── next.config.ts
└── package.json
```

## 2. Naming Conventions

### Files & Folders
- **Components**: `kebab-case.tsx` (e.g., `user-profile.tsx`, `stats-card.tsx`)
- **Pages/Routes**: `kebab-case` folders, `page.tsx` inside
- **API Routes**: `kebab-case` folders, `route.ts` inside
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`, `validate-email.ts`)
- **Types**: `kebab-case.ts` (e.g., `user-types.ts`, `api-types.ts`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-api.ts`, `use-debounce.ts`)
- **Constants**: `kebab-case.ts` (e.g., `api-endpoints.ts`)

### Code
- **Components**: `PascalCase` (e.g., `UserProfile`, `StatsCard`)
- **Functions**: `camelCase` (e.g., `formatDate`, `validateEmail`)
- **Variables**: `camelCase` (e.g., `userData`, `isLoading`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_RETRIES`)
- **Types/Interfaces**: `PascalCase` (e.g., `UserProfile`, `ApiResponse`)
- **Enums**: `PascalCase` with `PascalCase` values (e.g., `UserRole.Admin`)

### CSS Classes
- Use Tailwind utility classes
- Custom classes: `kebab-case` (e.g., `custom-button`, `rtl-override`)
- Follow BEM for complex components if needed: `block__element--modifier`

## 3. ShadCN + RTL Integration

### Setup Steps

1. **Install ShadCN UI**
   ```bash
   npx shadcn@latest init
   ```
   - Choose: TypeScript, Tailwind CSS, Default style, CSS variables
   - Set component path: `components/ui`

2. **Configure RTL in `tailwind.config.ts`**
   ```typescript
   import type { Config } from "tailwindcss";

   const config: Config = {
     content: [
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

3. **Update Root Layout for RTL**
   ```typescript
   // app/layout.tsx
   <html lang="ar" dir="rtl">
   ```

4. **Create RTL Utility in `lib/utils/rtl.ts`**
   ```typescript
   export const rtl = {
     left: "right",
     right: "left",
     ml: "mr",
     mr: "ml",
     pl: "pr",
     pr: "pl",
     borderL: "borderR",
     borderR: "borderL",
   };
   ```

5. **ShadCN Component Overrides**
   - All ShadCN components work with RTL by default via Tailwind
   - Use logical properties: `ms-*`, `me-*`, `ps-*`, `pe-*` instead of `ml-*`, `mr-*`
   - Or use `rtl:` variant: `rtl:ml-4` for specific RTL overrides

6. **Global RTL Styles in `app/globals.css`**
   ```css
   [dir="rtl"] {
     direction: rtl;
   }
   
   [dir="rtl"] * {
     text-align: right;
   }
   ```

### Component Pattern
```typescript
// components/ui/button.tsx (ShadCN auto-generated)
// Use logical spacing: ms-*, me-*, ps-*, pe-*
// Or use rtl: variant for specific cases
```

## 4. Global UI/UX Guidelines

### Design Principles
1. **Consistency**: All components follow the same design language (inspired by football360.ir)
2. **Sports News Aesthetic**: Clean, modern sports-news UI style with appropriate content density
3. **Visual Hierarchy**: Clear typography and spacing hierarchy for scannable content
4. **Card-Based Layout**: Consistent card structure for articles, news items, and content blocks
5. **Accessibility**: WCAG 2.1 AA compliance
6. **Responsiveness**: Mobile-first approach with responsive grid layouts
7. **Performance**: Optimized loading and interactions

### Spacing System
- Use Tailwind spacing scale: `4, 8, 12, 16, 24, 32, 48, 64`
- Consistent padding: `p-4`, `p-6`, `p-8`
- Consistent margins: `mb-4`, `mb-6`, `mb-8`

### Typography
- **Headings**: `text-2xl`, `text-3xl`, `text-4xl` with `font-semibold` or `font-bold`
- **Body**: `text-base` (16px) default, `text-sm` for secondary
- **Line height**: `leading-relaxed` for body, `leading-tight` for headings
- **RTL**: Use `text-right` by default, `text-left` only when needed

### Colors
- Use CSS variables from ShadCN theme
- Semantic colors: `primary`, `secondary`, `destructive`, `muted`
- Dark mode: Automatic via `prefers-color-scheme` or theme toggle

### Components
- **Buttons**: Consistent sizes (`sm`, `md`, `lg`), clear states (hover, active, disabled)
- **Forms**: Clear labels, helpful error messages, proper validation feedback
- **Cards**: Consistent padding, subtle shadows, rounded corners
- **Navigation**: Clear hierarchy, active states, smooth transitions

### Interactions
- **Hover**: Subtle scale or color transitions (`transition-all duration-200`)
- **Focus**: Visible focus rings for accessibility
- **Loading**: Skeleton loaders or spinners
- **Errors**: Clear, actionable error messages

### RTL Considerations
- **Icons**: Flip horizontally when needed (e.g., arrows, chevrons)
- **Animations**: Reverse direction for RTL
- **Text alignment**: Right-aligned by default
- **Navigation**: Start from right side
- **Forms**: Labels on the right, inputs flow right-to-left

### Performance
- **Images**: Use Next.js `Image` component with proper sizing
- **Code splitting**: Route-based automatic splitting
- **Lazy loading**: For below-the-fold content
- **Optimization**: Minimize bundle size, use dynamic imports

### Accessibility
- **Semantic HTML**: Use proper HTML elements
- **ARIA labels**: When needed for screen readers
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Color contrast**: Minimum 4.5:1 for text
- **Focus management**: Clear focus indicators

