# Quick Setup Guide

## Design Reference

This project follows the visual design language of **football360.ir** as aesthetic inspiration. See `DESIGN_SYSTEM.md` for detailed specifications.

## 1. Install Dependencies

```bash
npm install
```

## 2. Install ShadCN UI

```bash
npx shadcn@latest init
```

When prompted:
- ✅ TypeScript: Yes
- ✅ Style: Default
- ✅ Base color: Slate
- ✅ CSS variables: Yes
- ✅ Components path: `@/components/ui`
- ✅ Utils path: `@/lib/utils`

## 3. Add ShadCN Components

```bash
# Example: Add button component
npx shadcn@latest add button

# Add more components as needed
npx shadcn@latest add card input label
```

## 4. Verify RTL Setup

- Check `app/layout.tsx` has `dir="rtl"` and `lang="ar"`
- Check `app/globals.css` has RTL styles
- Test with a component using logical properties (`ms-*`, `me-*`)

## 5. Project Structure

The architecture follows the structure defined in `ARCHITECTURE.md`:

```
app/              # Next.js App Router pages
components/       # React components
  ├── ui/         # ShadCN components
  ├── layout/     # Layout components
  ├── features/   # Feature-specific components
  └── shared/     # Shared components
lib/              # Utilities & configurations
  ├── api/        # API client layer
  ├── utils/      # Utility functions
  ├── hooks/      # Custom hooks
  ├── constants/  # Constants
  └── types/      # TypeScript types
```

## 6. Development

```bash
npm run dev
```

## 7. Next Steps

1. Review `DESIGN_SYSTEM.md` for design specifications
2. Check `COMPONENT_GUIDE.md` for component patterns
3. Create your first feature component in `components/features/`
4. Set up API endpoints in `lib/api/endpoints.ts`
5. Add custom hooks in `lib/hooks/`
6. Follow naming conventions from `ARCHITECTURE.md`
7. Use design tokens from `lib/constants/design.ts`

