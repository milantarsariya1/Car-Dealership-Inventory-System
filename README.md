# Car Dealership Inventory System

A full-stack, enterprise-grade **Car Dealership Inventory Management System** built with **Node.js, Express, TypeScript, Prisma (Neon PostgreSQL)**, and **React + TailwindCSS**. 

Developed using **Test-Driven Development (TDD)** following the strict **Red-Green-Refactor** pattern and **SOLID design principles**.

---

## Key Features

### 🚗 Backend API (RESTful)
- **Token-Based Authentication**: Secure JWT authentication with Role-Based Access Control (`ADMIN` and `USER`).
- **Vehicle Inventory CRUD**: Complete vehicle management (`VIN`, `make`, `model`, `category`, `price`, `quantity`, `imageUrl`, `description`).
- **Real-Time Inventory Search & Filtering**: Multi-parameter search supporting make, model, vehicle category (`SEDAN`, `SUV`, `TRUCK`, `COUPE`, `EV`, `HYBRID`), and price range.
- **Atomic Stock Management**:
  - `POST /api/vehicles/:id/purchase`: Decreases vehicle stock quantity by 1. Rejects purchase if `quantity === 0`.
  - `POST /api/vehicles/:id/restock`: Increases vehicle stock quantity (Admin only).
- **Prisma & Neon Cloud PostgreSQL**: Serverless PostgreSQL database hosted on Neon Tech.

### 🎨 Frontend Application (React SPA + TailwindCSS)
- **Modern Luxury Automotive UI**: Glassmorphism design system, dark-mode luxury theme, glowing category badges, and subtle micro-animations.
- **Interactive Inventory Grid**: Real-time stock counters (`IN STOCK` vs `OUT OF STOCK`).
- **Disabled Purchase Button for Out-of-Stock**: Purchase button is automatically disabled when stock quantity reaches `0`.
- **Checkout & Order Calculator Modal**: Order preview, quantity selector, and live total price calculation.
- **Admin Management Panel**: Dashboard to Add New Vehicles, Edit Vehicle Specs, Restock Inventory, and Delete Vehicles.
- **Preset Quick Logins**: One-click demo logins for both Admin and Customer roles.

---

## API Endpoints Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`USER` or `ADMIN`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/vehicles` | Public | List all vehicles in inventory |
| `GET` | `/api/vehicles/search` | Public | Search vehicles by make, model, category, or price range |
| `GET` | `/api/vehicles/:id` | Public | Get single vehicle details |
| `POST` | `/api/vehicles` | Admin | Create a new vehicle |
| `PUT` | `/api/vehicles/:id` | Admin | Update vehicle details |
| `DELETE` | `/api/vehicles/:id` | Admin | Delete vehicle from inventory |
| `POST` | `/api/vehicles/:id/purchase` | Protected | Purchase vehicle (Decrements stock quantity) |
| `POST` | `/api/vehicles/:id/restock` | Admin | Restock vehicle (Increases stock quantity) |

---

## Local Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Environment Configuration
# The .env file is pre-configured with Neon PostgreSQL and JWT secret.
# DATABASE_URL="postgresql://neondb_owner:..."
# JWT_SECRET="car_dealership_super_secret_key_2026"
# PORT=5000

# Push Prisma Schema to Neon Database & Generate Client
npx prisma db push

# Seed Sample Data (Vehicles & Users)
npm run seed

# Run Backend Unit & Integration Tests (TDD Suite)
npm test

# Start Backend Dev Server
npm run dev
```
Backend will run at `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
# In a separate terminal tab, navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Build & Verify TypeScript Compilation
npm run build

# Start Frontend Dev Server
npm run dev
```
Frontend SPA will open at `http://localhost:3000`.

---

## Preset Demo Logins

You can test the application using the pre-seeded credentials or 1-click buttons in the Sign In modal:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@dealership.com` | `admin123` | Full access (Add, Edit, Delete, Restock, Purchase) |
| **Customer** | `customer@gmail.com` | `user123` | Standard access (Browse, Search, Filter, Purchase) |

---

## Test Execution Report (TDD Suite)

All 20 test cases across 3 test suites passed cleanly with **100% success rate**:

```text
PASS tests/inventory.test.ts (21.368 s)
  Inventory Management Endpoints (/api/vehicles/:id/purchase & /restock)
    POST /api/vehicles/:id/purchase
      ✓ should allow an authenticated user to purchase a vehicle and decrement quantity by 1
      ✓ should decrement stock to 0 on second purchase
      ✓ should reject purchase when stock quantity is 0
    POST /api/vehicles/:id/restock
      ✓ should reject restock attempt by non-admin user
      ✓ should allow admin to restock vehicle and increase quantity

PASS tests/vehicles.test.ts (13.819 s)
  Vehicles Endpoints (/api/vehicles)
    POST /api/vehicles
      ✓ should allow admin to create a new vehicle
      ✓ should reject vehicle creation without authorization token
      ✓ should reject vehicle creation by regular non-admin user
    GET /api/vehicles
      ✓ should return a list of all vehicles
    GET /api/vehicles/search
      ✓ should filter vehicles by make, model, category, and price range
    GET /api/vehicles/:id
      ✓ should return vehicle details for a valid ID
      ✓ should return 404 for a non-existent vehicle ID
    PUT /api/vehicles/:id
      ✓ should update vehicle details
    DELETE /api/vehicles/:id
      ✓ should forbid non-admin user from deleting vehicle
      ✓ should allow admin to delete a vehicle

PASS tests/auth.test.ts (8.164 s)
  Auth Endpoints (/api/auth)
    POST /api/auth/register
      ✓ should register a new user successfully and return user details (excluding password)
      ✓ should reject registration if email is already registered
      ✓ should reject registration if required fields are missing
    POST /api/auth/login
      ✓ should authenticate user with valid credentials and return JWT token
      ✓ should reject login with incorrect password

Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        43.446 s
```

To re-run backend tests at any time:
```bash
cd backend && npm test
```

---

## My AI Usage

### 🤖 AI Tools Used
- **Google DeepMind Antigravity AI**: Used as pair programming assistant for system architecture, TDD test suite generation, Prisma 6 configuration, and React component design.

### 🛠️ How AI Was Used Throughout Development
1. **Database & Configuration Setup**:
   - Diagnosed Prisma 6 connection error `P1001` and resolved environment variable loading.
   - Configured Neon PostgreSQL datasource schema and generated Prisma client.
2. **Test-Driven Development (TDD)**:
   - Generated initial failing test suites (**Red phase**) for Auth, Vehicle CRUD, Search filters, and Inventory transaction endpoints in Jest and Supertest.
   - Implemented service and controller layers (**Green phase**) to pass all assertions.
3. **AI Co-authorship in Git**:
   - Automated git commits with descriptive messages and appended the mandatory AI co-author trailer to every commit:
     ```text
     Co-authored-by: Google DeepMind Antigravity <antigravity@users.noreply.github.com>
     ```
4. **Frontend Architecture & Design System**:
   - Assisted in designing glassmorphism UI components, responsive layout cards, state hooks, and Tailwind v4 styling.
5. **Prompt History Logging**:
   - Maintained full transparent session records in [`PROMPTS.md`](./PROMPTS.md).

### 💡 Reflection on AI Impact on Workflow
Using AI as a pair programmer significantly accelerated the **Red-Green-Refactor** development cycle. It ensured strict adherence to SOLID principles, handled repetitive test boilerplate effortlessly, and prevented runtime errors by catching schema mismatches early. Transparent co-authorship trailers and prompt history logging maintained complete integrity and accountability throughout the project.
