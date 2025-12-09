# Volley - Sports News Platform

A modern, full-stack sports news platform built with Next.js, TypeScript, TailwindCSS, and ShadCN UI.

## Design Philosophy

This project follows the visual design language of **football360.ir** as aesthetic inspiration:
- Clean, modern sports-news UI style
- Card-based content layout
- Clear typography and spacing hierarchy
- Medium to high content density
- RTL-first design

**Note**: We do NOT copy code or assets from football360.ir. We use it purely as visual reference.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: ShadCN UI
- **Layout**: RTL (Right-to-Left) by default

## Project Structure

```
volley/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # ShadCN components
│   ├── layout/      # Layout components
│   ├── features/    # Feature-specific components
│   └── shared/      # Shared components
├── lib/             # Utilities & configurations
│   ├── api/         # API client layer
│   ├── utils/       # Utility functions
│   ├── hooks/       # Custom hooks
│   ├── constants/   # Constants
│   └── types/       # TypeScript types
└── public/          # Static assets
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize ShadCN UI

```bash
npx shadcn@latest init
```

### 3. Add ShadCN Components

```bash
npx shadcn@latest add button card input label
```

### 4. Run Development Server

```bash
npm run dev
```

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete architecture and folder structure
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Design system and visual guidelines
- **[RTL_GUIDE.md](./RTL_GUIDE.md)** - RTL implementation guide
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions

## Key Features

- ✅ RTL-first layout
- ✅ TypeScript strict mode
- ✅ ShadCN UI components
- ✅ TailwindCSS utility-first styling
- ✅ Clean, scalable architecture
- ✅ Sports news UI aesthetic
- ✅ Responsive design
- ✅ Performance optimized

## Development Guidelines

1. Follow the folder structure defined in `ARCHITECTURE.md`
2. Use naming conventions as specified
3. Follow design system guidelines from `DESIGN_SYSTEM.md`
4. Ensure all components are RTL-aware
5. Use Tailwind utilities and ShadCN components
6. Maintain consistent spacing and typography
7. Write clean, typed, reusable components

## License

Private project
