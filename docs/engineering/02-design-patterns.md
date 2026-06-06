# Design Patterns — PRM Tool

Design patterns are proven solutions to recurring software design problems. This document describes the patterns applied in the PRM codebase, where they live, and why each was chosen.

---

## 1. Repository Pattern

### What it is
An abstraction layer between the domain (business logic) and the data source (MongoDB). Services ask the repository for data — they never talk to Mongoose directly.

### Where it's applied
- `src/repositories/BaseRepository.ts` — Abstract base + read/write interfaces
- `src/repositories/UserRepository.ts` — Concrete implementation for the User entity

### Why this pattern for PRM
- The BRD explicitly requires the Repository Pattern as a design pattern
- Keeps `AuthService` testable in isolation — you can pass a mock repository
- If MongoDB is ever replaced (unlikely for this internal tool, but architecturally correct), only repositories change — not services or routes

### How to add a new repository (pattern)
```typescript
// 1. Create src/repositories/EmployeeRepository.ts
import { BaseRepository } from './BaseRepository.js';
import { Employee, IEmployee } from '../models/Employee.js';

export class EmployeeRepository extends BaseRepository<IEmployee> {
  constructor() { super(Employee); }

  // Domain-specific query
  async findByManagerId(managerId: string): Promise<IEmployee[]> {
    return this.findAll({ managerId, isActive: true });
  }
}

export const employeeRepository = new EmployeeRepository();
```

---

## 2. Singleton Pattern

### What it is
Ensures a class has exactly one instance and provides a global point of access to it.

### Where it's applied
Two singletons in the backend:

**`src/config/env.ts`** — The `env` object is the single instance of all configuration. Every module imports `env` — none of them read `process.env` directly.

```typescript
// env.ts — one object, read everywhere
export const env = {
  port: parseInt(process.env.PORT ?? '5001', 10),
  jwtSecret: requireEnv('JWT_SECRET', '...'),
  session: { cookieName: 'session', maxAgeMs: 28800000, expiresIn: '8h' },
} as const;

// middleware/auth.ts — imports the singleton, doesn't redefine
import { env } from '../config/env.js';
const decoded = jwt.verify(token, env.jwtSecret);  // not process.env.JWT_SECRET
```

**`SystemConfig` model** — The BRD specifies SystemConfig as a singleton (exactly one DB row, `id = 1`). This is enforced at the schema level.

**Frontend:** `authService.ts` exports plain functions (not a class), but these functions are backed by the single `apiClient` module instance — same singleton effect.

### Why this pattern for PRM
- The BRD explicitly requires the Singleton Pattern for SystemConfig
- Prevents `JWT_SECRET` from being accidentally redefined in multiple places (was the bug before refactoring)
- Centralizes configuration — any env var change needs updating in exactly one file

---

## 3. Service Layer Pattern

### What it is
A layer of the application that contains business logic, sitting between the HTTP layer (routes) and the data layer (repositories). Services orchestrate domain rules without knowing about HTTP or databases directly.

### Where it's applied
**Backend:** `src/services/AuthService.ts`
- `login()` — validates credentials against business rules, returns a token payload
- `changePassword()` — validates strength rules, hashes, updates DB via repository
- `issueSessionCookie()` — builds and sets the JWT + cookie (DRY: used by both login and change-password)
- `clearSessionCookie()` — logout (DRY: cookie config defined once)

**Frontend:** `src/services/authService.ts`
- `login()`, `logout()`, `getMe()`, `changePassword()` — API functions with typed inputs/outputs

### The Request Flow

```
HTTP Request
    ↓
routes/auth.ts          ← HTTP parsing, status codes, JSON formatting
    ↓
services/AuthService.ts ← Business rules, validation, domain logic
    ↓
repositories/UserRepository.ts ← MongoDB queries only
    ↓
models/User.ts          ← Mongoose schema definition
```

### Why this pattern for PRM
- Route handlers become trivially simple — easy to read and test
- Business rules are in one place — the service — so BRD rule changes only touch one file
- Services are reusable — a future `AdminService` could call `authService.changePassword()` for the Reset Password flow

### How to add a new service (pattern)
```typescript
// src/services/EmployeeService.ts
import { employeeRepository } from '../repositories/EmployeeRepository.js';

export class EmployeeService {
  constructor(private readonly repo: typeof employeeRepository) {}

  async getTeamMembers(managerId: string) {
    return this.repo.findByManagerId(managerId);
  }
}

export const employeeService = new EmployeeService(employeeRepository);
```
