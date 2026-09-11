# BrewQuest - Production-Ready Monorepo Foundation

BrewQuest is an AI-powered coffee recommendation platform engineered for enterprise scalability, type safety, and maintainability. This repository houses the foundation architecture built as a **PNPM Workspace Monorepo**, separating the frontend application, backend service, and shared database package.

---

## 🏛️ Monorepo Architecture & Enterprise Folder Structure

```
BrewQuest/
├── apps/
│   ├── web/                         # Frontend Application (Next.js 14+ App Router)
│   │   ├── src/
│   │   │   ├── app/                 # Next.js App Router routes & page shells
│   │   │   │   ├── (auth)/          # Authentication route group (Login, Register)
│   │   │   │   ├── (dashboard)/     # Authenticated application route group
│   │   │   │   ├── api/             # Next.js API Route Handlers (Auth Proxy)
│   │   │   │   ├── globals.css      # Global CSS with Tailwind directives
│   │   │   │   ├── layout.tsx       # Root html/body layout wrapper
│   │   │   │   └── page.tsx         # Root landing placeholder
│   │   │   ├── components/          # Global presentation components & UI library
│   │   │   │   ├── ui/              # Reusable design system primitives (Button, Input, Card)
│   │   │   │   ├── layout/          # Structural page components (Navbar, Sidebar, Footer)
│   │   │   │   └── feedback/        # Loaders, toasts, skeletons, error boundaries
│   │   │   ├── features/            # Feature-based / Domain-driven modules
│   │   │   │   ├── auth/            # Authentication domain components, hooks, services, types
│   │   │   │   ├── coffees/         # Coffee catalog domain components, hooks, services, types
│   │   │   │   ├── recommendations/ # AI engine domain components, hooks, services, types
│   │   │   │   └── user-profile/    # User preferences domain components, hooks, services, types
│   │   │   ├── hooks/               # Global cross-cutting custom hooks
│   │   │   ├── lib/                 # Infrastructure & client instances (api-client, auth-client, utils)
│   │   │   ├── providers/           # React Context Providers (AppProvider, Theme, Query)
│   │   │   └── types/               # Global shared frontend TypeScript interfaces
│   │   ├── .env.example            # Next.js environment configuration template
│   │   ├── .eslintrc.js            # ESLint config extending monorepo preset
│   │   ├── next.config.mjs         # Next.js build & transpilation settings
│   │   ├── package.json            # Dependencies & scripts for web app
│   │   ├── postcss.config.js       # PostCSS configuration for Tailwind CSS
│   │   ├── tailwind.config.js      # Theme extensions & design tokens
│   │   └── tsconfig.json           # TypeScript config extending shared preset
│   │
│   └── api/                        # Backend API Service (NestJS Framework)
│       ├── src/
│       │   ├── common/              # Cross-cutting concerns & shared infrastructure
│       │   │   ├── decorators/      # Custom NestJS decorators (@CurrentUser)
│       │   │   ├── dto/             # Shared pagination & response DTOs
│       │   │   ├── exceptions/      # Base domain exception classes
│       │   │   ├── filters/         # Global HTTP exception filters
│       │   │   ├── guards/          # Auth & authorization guards
│       │   │   ├── interceptors/    # Response transformation interceptors
│       │   │   ├── middleware/      # HTTP request logging middleware
│       │   │   └── pipes/           # Custom payload validation pipes
│       │   ├── config/              # Type-safe environment configuration modules
│       │   │   ├── app.config.ts    # Application & server port configuration
│       │   │   ├── auth.config.ts   # Better Auth secret & URL configuration
│       │   │   └── database.config.ts # Database connection schema configuration
│       │   ├── lib/                 # Third-party SDK setup
│       │   │   └── auth.ts          # Better Auth Server instance with Prisma adapter
│       │   ├── modules/             # Encapsulated NestJS Feature Modules
│       │   │   ├── auth/            # Auth controllers, services, DTOs & module
│       │   │   ├── coffees/         # Coffee catalog controllers, services, DTOs & module
│       │   │   ├── recommendations/ # AI recommendation controllers, services, DTOs & module
│       │   │   └── users/           # User management controllers, services, DTOs & module
│       │   ├── prisma/              # Global Prisma Client lifecycle service & module
│       │   ├── app.module.ts        # Root NestJS application module
│       │   └── main.ts              # Server bootstrap, CORS setup & middleware
│       ├── .env.example            # NestJS environment configuration template
│       ├── .eslintrc.js            # Backend ESLint configuration
│       ├── nest-cli.json           # NestJS CLI build tool options
│       ├── package.json            # NestJS dependencies & scripts
│       ├── tsconfig.json           # NestJS TypeScript compilation settings
│       └── tsconfig.build.json     # Production build inclusion scope
│
├── packages/
│   ├── db/                         # Database Access Package (Prisma ORM)
│   │   ├── prisma/
│   │   │   └── schema.prisma       # PostgreSQL schema & Better Auth core models
│   │   ├── src/
│   │   │   └── index.ts            # Singleton PrismaClient instance & exports
│   │   ├── package.json            # Database package definitions & scripts
│   │   └── tsconfig.json           # DB package TypeScript configuration
│   │
│   ├── config-typescript/          # Shared TypeScript Base Configurations
│   │   ├── base.json               # General strict TS options
│   │   ├── nextjs.json             # TS options tailored for React/Next.js App Router
│   │   ├── nestjs.json             # TS options tailored for NestJS decorators & Node
│   │   └── package.json            # Package declaration
│   │
│   └── eslint-config/              # Shared ESLint Configuration Package
│       ├── index.js                # Base ESLint rules for TypeScript & code style
│       └── package.json            # Package declaration
│
├── .env.example                    # Monorepo master environment template
├── .gitignore                      # Global Git ignore rules
├── .prettierignore                 # Prettier format exclusion rules
├── package.json                    # Root package configuration & monorepo scripts
├── pnpm-workspace.yaml             # PNPM workspace package declarations
├── prettier.config.js              # Unified code formatting configuration
└── README.md                       # Platform documentation
```

---

## 📂 Detailed Folder Breakdown

### Frontend (`apps/web/src`)

- **`app/`**: Contains Next.js App Router page routes, layouts, and route handlers. Uses route groups like `(auth)` and `(dashboard)` to isolate layout behaviors without affecting URL paths.
- **`components/`**: Houses global presentation components.
  - **`components/ui/`**: Atomic, unstyled or base UI primitives (Buttons, Inputs, Cards, Modals).
  - **`components/layout/`**: Page layout containers (Navbar, Sidebar, Footer).
  - **`components/feedback/`**: Feedback primitives (Spinners, Skeletons, Alert Toasts).
- **`features/`**: Feature-driven / Domain-driven modules (`auth`, `coffees`, `recommendations`, `user-profile`). Each domain module encapsulates its own:
  - **`components/`**: Feature-specific React components.
  - **`hooks/`**: Custom hooks for that domain.
  - **`services/`**: API fetching logic related to the domain.
  - **`types/`**: TypeScript interfaces and types specific to that domain.
- **`hooks/`**: Global reusable React hooks shared across multiple features (e.g. `useMediaQuery`).
- **`lib/`**: Infrastructure utilities and third-party SDK clients (`api-client.ts`, `auth-client.ts`, `utils.ts`).
- **`providers/`**: React Context providers wrapping application state (Root `AppProvider`, Theme, Toast).
- **`types/`**: Global TypeScript definitions shared across the frontend application.

---

### Backend (`apps/api/src`)

- **`common/`**: Cross-cutting concerns and reusable infrastructure layer.
  - **`decorators/`**: Custom NestJS parameter and method decorators (`@CurrentUser`).
  - **`dto/`**: Reusable request/response Data Transfer Objects (`PaginationDto`).
  - **`exceptions/`**: Custom base domain exception classes (`DomainException`).
  - **`filters/`**: Global exception filters formatting error responses (`GlobalHttpExceptionFilter`).
  - **`guards/`**: Authentication and authorization guards (`AuthGuard`).
  - **`interceptors/`**: Global interceptors transforming responses (`TransformInterceptor`).
  - **`middleware/`**: Express/NestJS middlewares (`LoggerMiddleware`).
  - **`pipes/`**: Request validation and payload transformation pipes (`CustomValidationPipe`).
- **`config/`**: Type-safe configuration factories (`app.config.ts`, `auth.config.ts`, `database.config.ts`).
- **`lib/`**: Third-party initialization modules (`auth.ts` for Better Auth server setup).
- **`modules/`**: Modular domain features (`auth`, `coffees`, `recommendations`, `users`). Each module encapsulates:
  - **`controllers/`**: HTTP route handlers parsing requests and returning responses.
  - **`services/`**: Business logic implementations interacting with Prisma DB.
  - **`dto/`**: Input validation and output serialization DTOs.
  - **`*.module.ts`**: NestJS dependency injection manifest.
- **`prisma/`**: Global database service module encapsulating `PrismaClient` lifecycle connection hooks.

---

## 🚀 Technology Stack Rationale

1. **Frontend: Next.js (App Router)**: Server Components (RSC), automatic route optimization, streaming rendering, and SEO superiority.
2. **Frontend: TypeScript**: Strict type-checking eliminating runtime errors and enabling safe refactoring.
3. **Frontend: Tailwind CSS**: Utility-first styling with zero JS runtime overhead and custom theme token customization.
4. **Backend: NestJS**: Modular, enterprise Node.js architecture with robust Dependency Injection (DI) ensuring testability as the application grows beyond 100+ files.
5. **Database ORM: Prisma ORM**: Auto-generated type-safe queries directly derived from PostgreSQL schema definitions.
6. **Database: PostgreSQL**: Enterprise relational database with spatial capabilities, JSON support, and ACID guarantees.
7. **Authentication: Better Auth**: Modern, framework-agnostic session management with standard token and Prisma adapter support.
8. **Monorepo: PNPM**: Fast, disk-space efficient package manager with clean workspace linking.

---

## 🛠️ Getting Started & Commands

```bash
# Install all dependencies across monorepo
pnpm install

# Generate Prisma Client
pnpm run db:generate

# Format code with Prettier
pnpm run format

# Verify formatting compliance
pnpm run format:check

# Run ESLint across all projects
pnpm run lint

# Build all applications and packages
pnpm run build

# Start parallel development servers
pnpm run dev
```
