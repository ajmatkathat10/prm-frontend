# Design Principles — PRM Tool

Design principles are high-level guidelines for writing maintainable code. Two core principles are applied throughout PRM: **DRY** and **Separation of Concerns**.

---

## DRY — Don't Repeat Yourself

> *Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.*

If you change a rule in one place and have to remember to change it in another — that's a DRY violation.

---

### DRY in the Backend

#### Before: JWT_SECRET duplicated
```typescript
// routes/auth.ts — defined here
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_prm_tool_2026_super_secure';

// middleware/auth.ts — SAME string, redefined separately
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_prm_tool_2026_super_secure';
```

If someone changed the default fallback in `routes/auth.ts` but forgot `middleware/auth.ts`, the app would break silently.

#### After: single source of truth
```typescript
// config/env.ts — defined ONCE
export const env = {
  jwtSecret: requireEnv('JWT_SECRET', 'jwt_secret_prm_tool_2026_super_secure'),
};

// middleware/auth.ts — imports, never redefines
import { env } from '../config/env.js';
jwt.verify(token, env.jwtSecret); // 👈 one reference

// services/AuthService.ts — same import
import { env } from '../config/env.js';
jwt.sign(payload, env.jwtSecret, { expiresIn: env.session.expiresIn });
```

#### Before: Cookie config duplicated
The cookie options (httpOnly, secure, sameSite, maxAge, path) were repeated verbatim in BOTH the login handler AND the change-password handler.

#### After: one function
```typescript
// AuthService.ts — defined once
issueSessionCookie(res: Response, payload: TokenPayload): void {
  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.session.expiresIn });
  res.cookie(env.session.cookieName, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
    maxAge: env.session.maxAgeMs,
    path: '/',
  });
}

// login route — just calls the function
authService.issueSessionCookie(res, userPayload);

// change-password route — same function, no duplication
authService.issueSessionCookie(res, updatedPayload);
```

---

### DRY in the Frontend

#### Before: raw fetch duplicated across components
```typescript
// LoginPage.tsx
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

// DashboardLayout.tsx
const r = await fetch('/api/auth/me'); // different error handling

// ChangePasswordPage.tsx — yet another variation
const res = await fetch('/api/auth/change-password', { ... });
```

#### After: centralized layers
```typescript
// lib/apiClient.ts — HTTP config defined once
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

// services/authService.ts — API calls defined once per endpoint
export async function login(username: string, password: string): Promise<SessionUser> {
  const data = await apiPost<AuthResponse>('/auth/login', { username, password });
  return data.user;
}

// LoginPage.tsx — just uses the function
const user = await login(username, password);
```

#### Before: SessionUser type duplicated
The `SessionUser` interface was written in both `DashboardLayout.tsx` and inline in `LoginPage.tsx`.

#### After: defined once
```typescript
// src/types/auth.ts — defined once
export interface SessionUser {
  id: string; username: string; email: string;
  role: UserRole; forcePasswordChange: boolean;
}

// src/types/auth.ts — role routes defined once too
export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  ADMIN: '/dashboard/admin',
  MANAGER: '/dashboard/manager',
  EMPLOYEE: '/dashboard/employee',
};
```

---

## Separation of Concerns (SoC)

> *A program should be separated into distinct sections, each addressing a separate concern.*

---

### SoC in the Backend

**Before:** `server.ts` did 3 things: start Express, connect to MongoDB, and define routes.

**After:** each concern is in its own module:

| Concern | File |
|---------|------|
| HTTP server setup | `server.ts` |
| Database connection | `config/database.ts` |
| Environment configuration | `config/env.ts` |
| Auth business logic | `services/AuthService.ts` |
| DB queries for users | `repositories/UserRepository.ts` |
| HTTP routing | `routes/auth.ts` |
| Request authentication | `middleware/auth.ts` |

**The 4-layer stack:**
```
routes/auth.ts          — concerns: parse request, send response
services/AuthService.ts — concerns: business rules, domain logic
repositories/UserRepo   — concerns: database queries
models/User.ts          — concerns: data shape, schema constraints
```

Each layer only touches the layer directly below it. Routes don't import models. Services don't import express.

---

### SoC in the Frontend

**Before:** `LoginPage.tsx` did: UI rendering + fetch configuration + HTTP error parsing + role-based routing logic.

**After:**

| Concern | File |
|---------|------|
| UI rendering | `pages/LoginPage.tsx` |
| API contract | `services/authService.ts` |
| HTTP transport | `lib/apiClient.ts` |
| Type definitions | `types/auth.ts` |
| Route constants | `types/auth.ts` (ROLE_DASHBOARD_ROUTES) |
| Navigation | React Router (via `useNavigate`) |

**LoginPage after SoC:**
```typescript
// LoginPage only handles: form state + calling the service + navigating on result
const user = await login(username, password);   // ← service handles API
navigate(ROLE_DASHBOARD_ROUTES[user.role]);      // ← constant handles route mapping
```
