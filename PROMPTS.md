# AI Tooling Prompt History (PROMPTS.md)

This document contains the chronological record of AI interaction prompts and development workflows for the **Car Dealership Inventory System** project, as required by the project's AI Usage Policy.

---

## Session 1: Project Initialization & Database Troubleshooting

### Prompt 1: Initial Error Diagnosis
> **User**: `npx prisma migrate dev --name init` failed with `Error: P1001: Can't reach database server at localhost:51214`.
> 
> **AI Action**: Diagnosed Prisma 6 default `prisma+postgres://` protocol issue expecting a local `npx prisma dev` proxy server. Identified solutions for standard PostgreSQL vs local dev server.

### Prompt 2: Neon PostgreSQL Setup
> **User**: "i have neon tech postgresql" & provided Neon connection string.
> 
> **AI Action**: Configured `backend/.env` with Neon PostgreSQL connection string (`sslmode=require`), adjusted `tsconfig.json` for ES module interop, ran `npx prisma migrate dev --name init`, connected to Neon DB, and generated Prisma Client.

---

## Session 2: TDD & Core Requirements Alignment

### Prompt 3: Technical Guidelines & Kata Specification
> **User**: Shared TDD Kata requirements including RESTful API endpoints, vehicle inventory model (`make`, `model`, `category`, `price`, `quantity`), purchase/restock endpoints, React + TailwindCSS SPA frontend, TDD Red-Green-Refactor workflow, Git AI co-authorship tags, `README.md`, and `PROMPTS.md`.
> 
> **AI Action**: Formulated detailed TDD implementation plan adhering strictly to Red-Green-Refactor, Git commit formatting with AI trailers, Express + Prisma + Jest backend, and React + Tailwind SPA frontend.

---

## Session 3: Backend TDD Development

### Prompt 4: Database Schema & Test Setup
> **User**: Approved implementation plan.
> 
> **AI Action**: Defined `User`, `Vehicle`, and `Transaction` models in `prisma/schema.prisma`. Installed `jest`, `ts-jest`, and `supertest`. Configured `jest.config.ts`.

### Prompt 5: TDD - Authentication Module (`/api/auth`)
> **AI Action**:
> - **[RED]**: Created `tests/auth.test.ts` with failing tests for `/api/auth/register` and `/api/auth/login`.
> - **[GREEN]**: Implemented `AuthService`, `AuthController`, and `auth.middleware.ts` with `bcryptjs` password hashing and JWT token generation.
> - Verified all 5 Auth tests passed.
> - **Git Commit**: Committed with trailer `Co-authored-by: Google DeepMind Antigravity <antigravity@users.noreply.github.com>`.

### Prompt 6: TDD - Vehicle Inventory CRUD & Search Module (`/api/vehicles`)
> **AI Action**:
> - **[RED]**: Created `tests/vehicles.test.ts` with failing tests for vehicle creation, listing, searching by make/model/category/price, getting by ID, updating, and deleting.
> - **[GREEN]**: Implemented `VehicleService`, `VehicleController`, and search filters.
> - Verified all 15 tests passed.
> - **Git Commit**: Committed with trailer `Co-authored-by: Google DeepMind Antigravity <antigravity@users.noreply.github.com>`.

### Prompt 7: TDD - Inventory Purchase & Restock Module (`/api/vehicles/:id/purchase` & `/restock`)
> **AI Action**:
> - **[RED]**: Created `tests/inventory.test.ts` with failing tests for stock deduction on purchase, 0 quantity rejection, and admin restock.
> - **[GREEN]**: Implemented `InventoryService` using Prisma `$transaction` for atomic stock updates and audit logging.
> - Verified all 20 tests across 3 suites passed.
> - **Git Commit**: Committed with trailer `Co-authored-by: Google DeepMind Antigravity <antigravity@users.noreply.github.com>`.

### Prompt 8: Database Seeding
> **AI Action**: Created `prisma/seed.ts` populating Neon DB with sample vehicles (Tesla, Porsche, Toyota, Ford, BMW, Audi) and default Admin & Customer user credentials.

---

## Session 4: Frontend SPA Development & Build

### Prompt 9: React + TailwindCSS SPA Implementation
> **AI Action**:
> - Initialized Vite React TypeScript app in `frontend/`.
> - Installed `@tailwindcss/vite`, `lucide-react`.
> - Built components: `Navbar`, `StatsBar`, `FilterBar`, `VehicleCard` (with disabled purchase button for zero quantity), `PurchaseModal`, `AdminModal`, and `AuthModal`.
> - Configured `vite.config.ts` proxy to Express backend.
> - Tested `npm run build` (0 TypeScript / build errors).
> - **Git Commit**: Committed with trailer `Co-authored-by: Google DeepMind Antigravity <antigravity@users.noreply.github.com>`.

---

## Session 5: Documentation & Final Verification

### Prompt 10: Deliverables Finalization
> **AI Action**: Generated comprehensive `README.md` containing project details, setup guides, test execution report, and mandatory **"My AI Usage"** section. Updated `PROMPTS.md`.
