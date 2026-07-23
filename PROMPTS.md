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
> - Verified all backend Jest test cases pass cleanly.
> - Updated `README.md` with complete architecture details, setup instructions, test execution reports, and mandatory "My AI Usage" section.
> - Updated `PROMPTS.md` with complete chronological prompt history.
> - Performed Git commits following AI co-authorship guidelines.

---

## Session 6: Customer Delivery Address & Checkout Page

### Prompt 12: Dedicated Checkout Page with Car Image & Spec Layout
> **User**: "after clicking the purchase option it should open another page that reflect the payment option and the image of car should be big if needed then assign to left and detailes to right"
> 
> **AI Action**:
> - Created `CheckoutPage.tsx` component featuring split view (left: large vehicle image + specs, right: payment method selection & delivery address).
> - Added dedicated `checkout` tab state in `App.tsx` with seamless navigation.

### Prompt 13: Delivery Address & Location Database Fields
> **User**: "user needs to add all the required data like address and location and more etc that r required to deliver the product to the customer add that database into use accounts this also should be editable"
> 
> **AI Action**:
> - Expanded Prisma `User` schema with delivery fields (`phone`, `address`, `city`, `state`, `pincode`, `country`).
> - Updated backend auth controller/service & routes with `PUT /api/auth/profile` and `PUT /api/auth/users/:id`.
> - Added address editor in user Profile View, Checkout Form, and Admin User Manager.

---

## Session 7: Dedicated Inventory Page Video Banner & Edge Smoothing

### Prompt 14: Dedicated Inventory Page & Lenis Smooth Scroll Lag Fix
> **User**: "this inventory scrolling feels buggy or not feeling smooth fix this issue, also first this video should come like home page, above the video and all the inventory after that on that video write the best styled possible website name + inventory and some other text"
> 
> **AI Action**:
> - Restructured dedicated Inventory view with a top HTML5 video hero banner displaying "ApexMotors Inventory" overlay styling.
> - Fixed Lenis smooth scroll performance by removing heavy layout recalculation transforms.

### Prompt 15: Dual-Layer Edge Gradient Dissolve
> **User**: "smooth out the edges of video and the other section given in this image"
> 
> **AI Action**:
> - Added dual-layer gradient overlays (`from-black/30 via-transparent to-[#0b0914]` and a 192px bottom fade `from-[#0b0914]`) on both Home hero and Inventory video banners for seamless transition into content cards.

---

## Session 8: My Purchases & Customer Dispatch Tracking

### Prompt 16: Customer Purchases & Dispatch Tracking Page
> **User**: "look i have purchase some car but where can i see my purchases car after purchasing so make the purchased or something like this page that shows my car and dispatched details"
> 
> **AI Action**:
> - Built backend endpoint `GET /api/vehicles/my-orders/list` returning user's purchased transactions with vehicle specs, price breakdown, and real-time dispatch progress.
> - Created `MyOrdersPage.tsx` with vehicle image cards, financial breakdown, 4-step dispatch progress bar (`Order Confirmed` ➔ `Processing` ➔ `Dispatched` ➔ `Out for Delivery`), and delivery address banner.
> - Connected "My Orders" tab to Navbar and Checkout success screen.

### Prompt 17: Navigation Bar Item Reordering
> **User**: "service should be at last after contact us what do you think?"
> 
> **AI Action**:
> - Reordered Navbar links to: **Home** ➔ **Inventory** ➔ **My Orders** ➔ **Contact us** ➔ **Services ˅** at the far right.

---

## Session 9: Admin Pending Orders Manager & Seller Role Constraints

### Prompt 18: Admin Customer Orders & Pending Dispatches Table
> **User**: "in main admin panel it should reflect the all the orders details from all the user who have purchased the car that should reflect in main admin panel = pending orders"
> 
> **AI Action**:
> - Implemented backend admin endpoint `GET /api/vehicles/admin/orders` (Admin restricted) returning all customer transactions with purchaser profile & delivery address details.
> - Created `AdminOrdersTable.tsx` and integrated it inside the main Admin Management Dashboard.

### Prompt 19: Admin Seller Role Rules (Hide Purchase Button for Admin)
> **User**: "this not reflecting the all customers pending order. and for main admin purchase should not be there because he is the main admin who supposed to sell the car button for all the car product"
> 
> **AI Action**:
> - Updated `VehicleCard.tsx` to hide the Purchase button for Admin roles, replacing it with a `🛡️ Dealer Seller` badge and Admin Inventory Toolbar.
> - Replaced Admin Navbar link with **"Customer Orders (Admin)"** leading directly to the Admin Orders Manager.
> - Blocked purchase flow for Admin with notification: *"Admin accounts are dealership managers. Only customer accounts can place purchase orders."*

