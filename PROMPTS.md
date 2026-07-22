# AI Tooling Prompt History (PROMPTS.md)

This document contains the chronological record of AI interaction prompts and development workflows for the **Car Dealership Inventory System** project, as required by the project's AI Usage Policy.

---

## Session 1: Project Initialization & Database Setup

### Prompt 1: Initial Error Diagnosis
> **User**: `npx prisma migrate dev --name init` failed with `Error: P1001: Can't reach database server at localhost:51214`.
> 
> **AI Action**: Diagnosed Prisma 6 default `prisma+postgres://` protocol issue expecting a local `npx prisma dev` proxy server. Identified solutions for standard PostgreSQL vs local dev server.

### Prompt 2: Neon PostgreSQL Configuration
> **User**: "i have neon tech postgresql" & provided Neon connection string.
> 
> **AI Action**: Updated `backend/.env` with Neon connection string (`sslmode=require`), adjusted `tsconfig.json` for ES module interop, ran `npx prisma migrate dev --name init`, connected to Neon DB, and generated Prisma Client.

---

## Session 2: TDD & Core Requirements Alignment

### Prompt 3: Technical Guidelines & Kata Specification
> **User**: Shared TDD Kata requirements including RESTful API endpoints, vehicle inventory model (`make`, `model`, `category`, `price`, `quantity`), purchase/restock endpoints, React + TailwindCSS SPA frontend, TDD Red-Green-Refactor workflow, Git AI co-authorship tags, `README.md`, and `PROMPTS.md`.
> 
> **AI Action**: Formulated detailed TDD implementation plan adhering strictly to Red-Green-Refactor, Git commit formatting with AI trailers, Express + Prisma + Jest backend, and React + Tailwind SPA frontend.

---

## Session 3: TDD Execution & Backend Implementation

*(Subsequent prompts and development steps will be recorded below as features are built using TDD.)*
