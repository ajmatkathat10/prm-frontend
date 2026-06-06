# PRM Tool — AI Engineering Context

> **Instructions for AI assistants:**
> Read this file at the start of every session. It defines the architecture, patterns, naming conventions, and rules that must be followed in ALL code changes. When the user asks you to add a feature, fix a bug, or refactor code — follow this context exactly. Update this file when new patterns are established.

---

## Project Overview

- **Name:** Project & Resource Management (PRM) Tool
- **Type:** Internal company tool — NOT deployed publicly
- **BRD version:** V4 (active) — see `docs/PRM_BRD_V4.md`
- **Stack:** Node.js + Express + MongoDB (backend) / React + Vite + TypeScript (frontend)
- **Repos:** `prm-backend` and `prm-frontend` are separate repositories

---

## Backend Architecture

### Layer Stack (follow this order for every new feature)

```
Route Handler  →  Service  →  Repository  →  Model
(HTTP only)      (logic)      (DB only)     (schema)
```

### File Structure

```
prm-backend/src/
├── config/
│   ├── env.ts              ← ALL env vars live here (Singleton pattern)
│   └── database.ts         ← DB connect/disconnect (SoC)
├── models/                 ← Mongoose schemas only — no business logic
├── repositories/
│   ├── BaseRepository.ts   ← Abstract base + IReadRepository + IWriteRepository
│   └── UserRepository.ts   ← Concrete repo — extends BaseRepository<IUser>
├── services/
│   └── AuthService.ts      ← Business logic — no express/mongoose imports
├── middleware/
│   └── auth.ts             ← JWT verification only
├── routes/
│   └── auth.ts             ← Thin HTTP adapters — calls service, returns JSON
└── server.ts               ← Bootstrap only
```

### Rules for Backend Code

1. **Never read `process.env.*` directly** — always import `env` from `config/env.ts`
2. **Never import Mongoose models in route handlers** — always go through a repository
3. **Never put business logic in route handlers** — put it in the service layer
4. **Never put DB queries in services** — put them in repositories
5. **Throw `AuthError` for domain errors** — route handlers catch it and set the HTTP status
6. **All error responses must be `{ error: "message" }`**
7. **All success responses must include `{ success: true }`**

### How to Add a New Entity

1. Create `src/models/EntityName.ts` — schema and interface only
2. Create `src/repositories/EntityNameRepository.ts` — extends `BaseRepository<IEntity>`
3. Create `src/services/EntityNameService.ts` — business logic, depends on repository interface
4. Create `src/routes/entityname.ts` — thin HTTP adapter calling the service
5. Mount the route in `server.ts`

---

## Frontend Architecture

### Layer Stack

```
Page/Component  →  RTK Query Hooks  →  Base API Slice  →  Backend API
(UI only)         (endpoints hooks) (transport config)
```

### File Structure

```
prm-frontend/src/
├── types/
│   └── auth.ts             ← Shared TypeScript interfaces (SessionUser, UserRole, etc.)
├── store/
│   ├── apiSlice.ts         ← Base RTK Query slice (baseUrl, credentials)
│   ├── services/           ← Domain-specific API services (endpoints injection)
│   │   └── authApiSlice.ts ← Auth endpoints injection & hooks
│   └── index.ts            ← Redux Store configuration
├── lib/
│   ├── utils.ts            ← Utility functions (cn for class merging)
├── components/
│   ├── AuthLayout.tsx      ← Layout wrapper for auth pages
│   ├── DashboardLayout.tsx ← Role-aware sidebar + session guard & RTK Query session hook
│   └── ui/                 ← Reusable primitive components (Button, Input, Card)
├── pages/                  ← One file per screen
├── constants/              ← Strings, colors, route constants
└── App.tsx                 ← React Router configuration
```

### Rules for Frontend Code

1. **Never use raw `fetch()` or manually instantiate services in components or pages** — always use RTK Query mutation/query hooks generated in `src/store/services/`.
2. **Never define `SessionUser` or other shared types inline** — import from `types/auth.ts`.
3. **Never hardcode role route strings** — use `ROLE_DASHBOARD_ROUTES` from `types/auth.ts`.
4. **All API calls go through the central `apiSlice` or endpoint injections** — do not write independent client requests.
5. **Handle errors by unwrapping mutations or checking query results** (`err?.data?.error`) — do not write manual HTTP parsing.

### How to Add a New API Domain (e.g., employees)

1. Create `src/types/employee.ts` — interfaces for `Employee`, request/response types.
2. Create `src/store/services/employeeApiSlice.ts` to inject endpoints into `apiSlice`:
   ```typescript
   import { apiSlice } from '../apiSlice';

   export const employeeApiSlice = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
       getEmployees: builder.query<Employee[], void>({
         query: () => '/employees',
         providesTags: ['Employee'],
       }),
     }),
   });
   ```
3. Use the hook in pages: `const { data: employees } = useGetEmployeesQuery();`

---

## Applied Principles (summary)

| Principle | Applied Where |
|-----------|--------------|
| **SRP** (Single Responsibility) | Each file has one job — routes parse HTTP, services handle logic, repos handle DB |
| **OCP** (Open/Closed) | New entities extend `BaseRepository` — base is never modified |
| **LSP** (Liskov Substitution) | `UserRepository` is substitutable for `BaseRepository<IUser>` |
| **ISP** (Interface Segregation) | `IReadRepository` and `IWriteRepository` are separate interfaces |
| **DIP** (Dependency Inversion) | Services depend on repository interfaces, not concrete classes |
| **DRY** | `env.ts` (JWT secret), `AuthService.issueSessionCookie()` (cookie config), `types/auth.ts` (types), `apiClient.ts` (fetch config) |
| **SoC** | HTTP/business/DB layers separated; frontend UI/service/HTTP layers separated |

## Applied Patterns

| Pattern | File | Notes |
|---------|------|-------|
| **Repository Pattern** | `repositories/BaseRepository.ts`, `UserRepository.ts` | Decouples DB from logic |
| **Singleton Pattern** | `config/env.ts`, `SystemConfig` model | One source of truth |
| **Service Layer Pattern** | `services/AuthService.ts`, `services/authService.ts` (frontend) | Business logic isolation |

---

## BRD V4 Data Model (current active)

### New fields added in V4 (must be respected in all code)

| Model | Field | Type | Purpose |
|-------|-------|------|---------|
| `Employee` | `managerId` | ObjectId (nullable) | Links employee to their manager for team scoping |
| `Project` | `totalStoryPoints` | Number | Total SP for the project |
| `Milestone` | `storyPoints` | Number | SP allocated to this milestone |

### Manager Visibility Scope (V4)
All queries for employees in Manager-role screens must filter by `{ managerId: currentManagerUserId }`. This is enforced at the service/repository level — not just in the UI.

---

## Naming Conventions

### Backend
- Files: `PascalCase` for classes (`AuthService.ts`, `UserRepository.ts`), `camelCase` for non-class modules (`env.ts`, `database.ts`)
- Classes: `PascalCase`
- Interfaces: `I` prefix (`IUser`, `IEmployee`, `IRepository<T>`)
- Functions: `camelCase` with verb prefix (`findById`, `validatePasswordStrength`, `issueSessionCookie`)
- Constants: `UPPER_SNAKE_CASE` for module-level constants (`PASSWORD_MIN_LENGTH`)
- Exported singletons: `camelCase` (`authService`, `userRepository`, `env`)

### Frontend
- Components: `PascalCase` (`LoginPage.tsx`, `DashboardLayout.tsx`)
- Service functions: `camelCase` with verb prefix (`login`, `getMe`, `changePassword`)
- Types/interfaces: `PascalCase` (`SessionUser`, `AuthResponse`)
- Constants: `UPPER_SNAKE_CASE` (`ROLE_DASHBOARD_ROUTES`)

---

## What to Check Before Every Code Change

- [ ] Am I putting business logic in the right layer? (service, not route/component)
- [ ] Am I going through the repository for DB access? (not importing models in services/routes)
- [ ] Am I reading env vars from `config/env.ts`? (not `process.env.*` directly)
- [ ] Am I using shared types from `types/auth.ts`? (not redefining inline)
- [ ] Am I using `authService` functions? (not raw `fetch()` in components)
- [ ] Does the new code follow the naming conventions above?
- [ ] Does the new entity/feature follow the full layer stack?

---

## Document Maintenance

When you establish a new pattern, add or update:
1. This `CONTEXT.md` file — add the pattern to the relevant section
2. The relevant doc in `docs/engineering/` (SOLID, patterns, or principles)
3. A code example showing before/after if a refactor was done
