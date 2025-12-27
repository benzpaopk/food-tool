# Food Cost Calculator - Architecture Documentation

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript** (Strict Mode)
- **Tailwind CSS**
- **Shadcn UI**
- **State Management**: Zustand (or React Context when needed)
- **Forms**: React Hook Form + Zod

## Project Structure (Feature-Based Architecture)

This project follows a **strict feature-based architecture** to ensure scalability and maintainability.

### Directory Structure

```
/
├── app/                    # Next.js App Router - ONLY routing pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── [routes]/          # Route pages (no business logic)
│
├── components/
│   └── ui/                # ONLY generic Shadcn UI components
│                          # No business logic, reusable across features
│
├── features/              # Domain logic organized by feature
│   ├── ingredients/
│   │   ├── components/    # Feature-specific components
│   │   ├── types/         # Feature-specific TypeScript types
│   │   ├── hooks/         # Feature-specific React hooks
│   │   └── services/      # Feature-specific business logic/services
│   │
│   └── recipes/
│       ├── components/
│       ├── types/
│       ├── hooks/
│       └── services/
│
├── lib/                   # Shared utilities
│   ├── utils.ts          # Helper functions (cn, formatters, etc.)
│   └── [helpers]/        # Math helpers, formatters, etc.
│
└── types/                 # Global shared types
    └── [global-types].ts
```

## Architecture Rules (STRICT ENFORCEMENT)

### 1. `app/` Directory
- **ONLY** for routing pages (`page.tsx`, `layout.tsx`)
- **NO** business logic
- **NO** feature-specific components
- Pages should be thin wrappers that import from `features/`

### 2. `components/ui/` Directory
- **ONLY** generic Shadcn UI components
- **NO** business logic
- **NO** feature-specific code
- Reusable across all features

### 3. `features/` Directory
- Contains **ALL** domain logic
- Each feature is self-contained:
  - `components/`: Feature-specific UI components
  - `types/`: Feature-specific TypeScript interfaces/types
  - `hooks/`: Feature-specific React hooks
  - `services/`: Feature-specific business logic, API calls, calculations
- Features should be independent and loosely coupled

### 4. `lib/` Directory
- Shared utilities that are **not** feature-specific
- Math helpers, formatters, validators
- Generic helper functions

### 5. `types/` Directory
- **ONLY** global shared types
- Types used across multiple features
- Feature-specific types belong in `features/[feature]/types/`

## Example Usage

### Creating a New Feature

When adding a new feature (e.g., `ingredients`):

1. Create feature directory: `features/ingredients/`
2. Add subdirectories: `components/`, `types/`, `hooks/`, `services/`
3. Implement feature logic within these directories
4. Import in `app/` pages as needed

### Adding a Page

```tsx
// app/ingredients/page.tsx
import { IngredientsList } from "@/features/ingredients/components/IngredientsList";

export default function IngredientsPage() {
  return <IngredientsList />;
}
```

### Adding a Component

```tsx
// features/ingredients/components/IngredientForm.tsx
import { useIngredientForm } from "../hooks/useIngredientForm";
import { Button } from "@/components/ui/button";

export function IngredientForm() {
  // Feature-specific logic
}
```

## Code Generation Guidelines

When generating code:

1. **Always** place feature code in `features/[feature-name]/`
2. **Never** put business logic in `app/`
3. **Never** put feature-specific components in `components/ui/`
4. **Always** use TypeScript strict mode
5. **Always** validate forms with Zod schemas
6. **Always** use React Hook Form for form handling

## State Management

- Use **Zustand** for global state that spans multiple features
- Use **React Context** for feature-specific state that needs to be shared within a feature
- Prefer local state (useState) when possible

## Forms

- **Always** use React Hook Form
- **Always** validate with Zod schemas
- Place schemas in `features/[feature]/types/` or `features/[feature]/hooks/`

---

**This architecture will be strictly enforced for all future code generation.**

