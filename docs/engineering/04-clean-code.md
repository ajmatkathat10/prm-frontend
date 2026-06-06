# Clean Code — PRM Tool

Clean code is code that is easy to read, understand, and change. This document covers the specific rules applied in the PRM codebase and why they matter.

---

## 1. Meaningful Names

Names should reveal intent. If you need a comment to explain a variable name, the name is wrong.

### Examples in PRM

```typescript
// ❌ Bad
const u = await User.findOne({ $or: [{ username: x }, { email: x }] });
const r = await bcrypt.compare(p, u.passwordHash);

// ✅ Good (UserRepository.ts)
const user = await this.findByUsernameOrEmail(identifier);
const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
```

```typescript
// ❌ Bad
const t = jwt.sign(payload, s, { expiresIn: '8h' });

// ✅ Good (AuthService.ts)
const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.session.expiresIn });
```

```typescript
// ❌ Bad
function chk(p: string): string | null { ... }

// ✅ Good (AuthService.ts)
function validatePasswordStrength(password: string): string | null { ... }
```

---

## 2. Small, Focused Functions

Each function should do one thing and do it well. If you can't name a function without using "and", it's doing too much.

### Examples in PRM

```typescript
// ❌ Before — login route handler was ~70 lines doing everything
router.post('/login', async (req, res) => {
  // validate input
  // query DB
  // compare password
  // generate JWT
  // set cookie
  // build response
});

// ✅ After — each concern is its own small function
// AuthService.login() — validates + returns payload (20 lines)
// AuthService.issueSessionCookie() — signs token + sets cookie (10 lines)
// route handler — calls these and responds (10 lines)
```

```typescript
// ✅ Small focused function in AuthService.ts
export function validatePasswordStrength(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH)  return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  if (!/[A-Z]/.test(password))               return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password))               return 'Password must contain at least one number';
  return null;
}
```

---

## 3. No Magic Strings or Numbers

Constants should be named, not embedded inline.

### Examples in PRM

```typescript
// ❌ Bad — magic number
if (password.length < 8) { ... }
res.cookie('session', token, { maxAge: 28800000 });

// ✅ Good — named constants (config/env.ts + AuthService.ts)
const PASSWORD_MIN_LENGTH = 8;
if (password.length < PASSWORD_MIN_LENGTH) { ... }

res.cookie(env.session.cookieName, token, { maxAge: env.session.maxAgeMs });
```

```typescript
// ❌ Bad — magic string role routes
const roleRoutes = {
  ADMIN: '/dashboard/admin',
  MANAGER: '/dashboard/manager',
  EMPLOYEE: '/dashboard/employee',
};

// ✅ Good — named constant in types/auth.ts, used everywhere
export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  ADMIN: '/dashboard/admin',
  MANAGER: '/dashboard/manager',
  EMPLOYEE: '/dashboard/employee',
};
```

---

## 4. Typed Error Handling

Never swallow errors silently. Use typed, descriptive errors.

### AuthError class (AuthService.ts)
```typescript
// ✅ Typed error carries HTTP status code
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ✅ Service throws typed errors
if (!user) throw new AuthError('Invalid username or password', 401);
if (!user.isActive) throw new AuthError('Account is deactivated.', 403);

// ✅ Route handler catches typed errors cleanly
function handleAuthError(error: unknown, res: Response): void {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  console.error('[AuthRoute] Unexpected error:', error);
  res.status(500).json({ error: 'An unexpected error occurred' });
}
```

### ApiError class (lib/apiClient.ts)
```typescript
// ✅ Frontend typed error
export class ApiError extends Error {
  constructor(message: string, public readonly statusCode: number) { ... }
}

// ✅ Component handles it cleanly
} catch (err) {
  if (err instanceof ApiError) {
    setError(err.message);     // show user-friendly message
  } else {
    setError('Network error.'); // unknown error fallback
  }
}
```

---

## 5. Comments Explain WHY, Not WHAT

Code already shows what it does. Comments should explain non-obvious decisions.

### Examples in PRM

```typescript
// ❌ Useless comment
// Hash the password
const passwordHash = await bcrypt.hash(newPassword, 10);

// ✅ Useful comment — explains the business rule
// BRD V4: Password must be changed on first login before accessing any screen.
// We issue a restricted token (forcePasswordChange=true) so only /change-password
// is accessible until the requirement is fulfilled.
if (user.forcePasswordChange) {
  navigate('/auth/change-password');
}
```

```typescript
// ✅ Useful comment in BaseRepository — explains why interfaces are split
// SOLID (I — Interface Segregation): Split into IReadRepository and
// IWriteRepository so that read-only use cases can depend only on
// IReadRepository without being forced to implement write methods.
```

---

## 6. Consistent Error Response Shape

All API errors in the backend return the same JSON shape:

```json
{ "error": "Human-readable message" }
```

All API successes return:
```json
{ "success": true, ... }
```

This consistency means the frontend `parseResponse()` function in `apiClient.ts` can reliably extract the error message regardless of which endpoint failed.

---

## 7. No Dead Code

No commented-out code, no unused variables, no unreachable branches.

```typescript
// ❌ Bad
// const oldToken = generateLegacyToken(user); // TODO: remove this
const token = jwt.sign(payload, env.jwtSecret);

// ✅ Good — if it's not needed, it doesn't exist
const token = jwt.sign(payload, env.jwtSecret);
```

---

## Checklist — Before Committing Code

- [ ] Every function name describes what it does (not how)
- [ ] No magic strings or numbers — use named constants
- [ ] No raw `process.env.*` calls — import from `config/env.ts`
- [ ] No raw `fetch()` in React components — use `authService` or other service files
- [ ] Business logic is in a service, not a route handler or component
- [ ] DB queries are in a repository, not a service or route
- [ ] Errors are typed — use `AuthError` (backend) or `ApiError` (frontend)
- [ ] New entity? Create `Model → Repository → Service → Route` (follow the pattern)
