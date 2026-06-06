# Engineering Standards — PRM Tool

This folder documents all engineering principles, design patterns, and coding standards applied in the PRM codebase. Every file here maps directly to real code — not theory.

## Table of Contents

| # | Document | What it covers |
|---|----------|----------------|
| 01 | [SOLID Principles](./01-solid-principles.md) | S, O, L, I, D — with exact file references |
| 02 | [Design Patterns](./02-design-patterns.md) | Repository, Singleton, Service Layer |
| 03 | [Design Principles](./03-design-principles.md) | DRY and Separation of Concerns |
| 04 | [Clean Code](./04-clean-code.md) | Naming, functions, error handling, comments |
| 🤖 | [AI Context File](./CONTEXT.md) | **Read this first** — the persistent context for AI assistants |

---

## Architecture Overview

```
prm-backend/src/
├── config/
│   ├── env.ts              ← Singleton: all env vars in one place
│   └── database.ts         ← SoC: DB connection separated from server.ts
├── models/                 ← Mongoose schemas (data shape only)
├── repositories/
│   ├── BaseRepository.ts   ← Abstract base + I/O interfaces (SOLID I, D, O, L)
│   └── UserRepository.ts   ← Concrete repo for User (extends base)
├── services/
│   └── AuthService.ts      ← Business logic (SOLID S, D) + AuthError
├── middleware/
│   └── auth.ts             ← JWT verification middleware (SOLID S)
├── routes/
│   └── auth.ts             ← Thin HTTP adapters (SOLID S, SoC)
└── server.ts               ← Bootstrap only (SOLID S)

prm-frontend/src/
├── types/
│   └── auth.ts             ← Shared type definitions (DRY)
├── lib/
│   ├── apiClient.ts        ← HTTP transport layer (DRY, SoC, SOLID S)
│   └── utils.ts            ← Utility functions
├── services/
│   └── authService.ts      ← API contract layer (SOLID S, D, DRY)
├── components/             ← Reusable UI components
├── pages/                  ← Page-level React components
└── constants/              ← Strings, colors, route constants
```

## Rule of Thumb

When adding new features, follow this layering:

**Backend:**
```
Route Handler  →  Service  →  Repository  →  Model
(HTTP only)      (logic)      (DB only)     (schema)
```

**Frontend:**
```
Page/Component  →  Service  →  apiClient  →  Backend API
(UI only)          (API fn)    (HTTP layer)
```

Each layer should only know about the layer directly below it.
