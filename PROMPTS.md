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
> - **Git Commit**: Committed with trailer `Co-authored-by: Antigravity <AI@users.noreply.github.com>`.

### Prompt 6: TDD - Vehicle Inventory CRUD & Search Module (`/api/vehicles`)
> **AI Action**:
> - **[RED]**: Created `tests/vehicles.test.ts` with failing tests for vehicle creation, listing, searching by make/model/category/price, getting by ID, updating, and deleting.
> - **[GREEN]**: Implemented `VehicleService`, `VehicleController`, and search filters.
> - Verified all 15 tests passed.
> - **Git Commit**: Committed with trailer `Co-authored-by: Antigravity <AI@users.noreply.github.com>`.

### Prompt 7: TDD - Inventory Purchase & Restock Module (`/api/vehicles/:id/purchase` & `/restock`)
> **AI Action**:
> - **[RED]**: Created `tests/inventory.test.ts` with failing tests for stock deduction on purchase, 0 quantity rejection, and admin restock.
> - **[GREEN]**: Implemented `InventoryService` using Prisma `$transaction` for atomic stock updates and audit logging.
> - Verified all 20 tests across 3 suites passed.
> - **Git Commit**: Committed with trailer `Co-authored-by: Antigravity <AI@users.noreply.github.com>`.

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
> - **Git Commit**: Committed with trailer `Co-authored-by: Antigravity <AI@users.noreply.github.com>`.

---

## Session 5: Hero Section Design Integration & Process Compliance

### Prompt 10: Hero Section Prompt Implementation
> **User**: Shared detailed UI prompt for full-screen HTML5 video hero section with specific typography (Manrope, Cabin, Instrument Serif, Inter), purple color scheme (`#7b39fc`), glassmorphic tagline pill, custom headline with italicized "and", and specific action buttons.
> 
> **AI Action**:
> - Loaded Google Fonts (Manrope, Cabin, Instrument Serif, Inter) in `frontend/index.html` and `src/index.css`.
> - Built `Hero.tsx` component with full-screen HTML5 video background, glassmorphism tagline pill (`#7b39fc` badge, `backdrop-blur-md`), Instrument Serif headline with italicized "and", Inter subtext, and Cabin font action buttons.
> - Updated `Navbar.tsx` to display white SVG logo, center links, and custom action buttons (white "Sign In", purple "Get Started"), with mobile full-screen black overlay menu.
> - Maintained full functionality of existing inventory catalog, statistics, filtering, admin dashboard, auth modals, and purchase modals.

### Prompt 11: Process & Technical Guidelines Alignment
> **User**: Shared technical process guidelines (TDD pattern, clean code, Git version control with AI trailers, README "My AI Usage" section, PROMPTS.md history file, live app links).
> 
> **AI Action**:
> - Verified all 15 backend Jest test cases pass cleanly.
> - Updated `README.md` with complete architecture details, setup instructions, test execution reports, and mandatory "My AI Usage" section.
> - Updated `PROMPTS.md` with complete chronological prompt history.
> - Performed Git commits following AI co-authorship guidelines.
