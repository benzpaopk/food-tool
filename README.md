# Food Cost Calculator

A Next.js application for calculating food costs for recipes and ingredients.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript** (Strict Mode)
- **Tailwind CSS**
- **Shadcn UI**
- **Zustand** (State Management)
- **React Hook Form + Zod** (Forms & Validation)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Architecture

This project follows a **Feature-Based Architecture** for scalability and maintainability.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

### Key Principles

- **`app/`**: Only routing pages, no business logic
- **`components/ui/`**: Only generic Shadcn UI components
- **`features/`**: All domain logic organized by feature
- **`lib/`**: Shared utilities
- **`types/`**: Global shared types

## Adding Shadcn UI Components

```bash
npx shadcn@latest add [component-name]
```

Components will be automatically placed in `components/ui/`.

## Project Structure

```
/
├── app/                    # Next.js App Router (routing only)
├── components/
│   └── ui/                # Shadcn UI components
├── features/              # Feature-based modules
├── lib/                   # Shared utilities
└── types/                 # Global types
```

---

**Note**: This architecture is strictly enforced. All future code generation will follow this structure.

