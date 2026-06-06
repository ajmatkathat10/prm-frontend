# SOLID Principles — PRM Tool

SOLID is a set of five object-oriented design principles that make software easier to maintain and extend. This document maps each principle to a specific file in the PRM codebase.

---

## S — Single Responsibility Principle

> *A module should have one, and only one, reason to change.*

### Before (violation)

`src/routes/auth.ts` previously did **everything** in one function:
- Parsed HTTP request body
- Queried MongoDB directly
- Ran bcrypt password comparison
- Created JWT tokens
- Set cookies
- Formatted JSON responses

That's 6 responsibilities in one file. If the business rule for passwords changes, the HTTP formatting code is at risk of being accidentally broken.

### After (applied)

The auth domain is now split into four modules, each with exactly one responsibility:

| File | Responsibility |
|------|---------------|
| `src/routes/auth.ts` | Parse HTTP request → call service → send HTTP response |
| `src/services/AuthService.ts` | Business logic: validate credentials, hash passwords, build token payloads |
| `src/repositories/UserRepository.ts` | Database access: find, update, deactivate users |
| `src/middleware/auth.ts` | JWT verification and request augmentation |

**Code example — routes/auth.ts (now thin):**
```typescript
router.post('/login', async (req, res): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }
  try {
    const userPayload = await authService.login(username, password); // delegates to service
    authService.issueSessionCookie(res, userPayload);
    res.json({ success: true, user: userPayload });
  } catch (error) {
    handleAuthError(error, res);
  }
});
```

**Frontend SRP:**

| File | Responsibility |
|------|---------------|
| `src/lib/apiClient.ts` | HTTP transport (fetch config, headers, error parsing) |
| `src/services/authService.ts` | API contract (what endpoints exist and what data they take) |
| `src/types/auth.ts` | Type definitions only |
| `src/pages/LoginPage.tsx` | UI rendering and user interaction |

---

## O — Open/Closed Principle

> *Software entities should be open for extension, but closed for modification.*

### Applied in

`src/repositories/BaseRepository.ts`

The `BaseRepository<T>` provides common CRUD operations. When we need a new entity (e.g., `Employee`, `Project`, `Allocation`), we **extend** the base — we do NOT modify it.

```typescript
// BaseRepository.ts — defined once, never modified for new entities
export abstract class BaseRepository<T extends Document> implements IRepository<T> {
  async findById(id: string): Promise<T | null> { ... }
  async create(data: Partial<T>): Promise<T> { ... }
  // ...
}

// UserRepository.ts — extends without modifying BaseRepository
export class UserRepository extends BaseRepository<IUser> {
  // ADD domain-specific methods here
  async findByUsernameOrEmail(identifier: string): Promise<IUser | null> { ... }
  async deactivate(userId: string): Promise<IUser | null> { ... }
}

// Future: EmployeeRepository extends BaseRepository<IEmployee> — no changes to base
// Future: ProjectRepository extends BaseRepository<IProject> — no changes to base
```

---

## L — Liskov Substitution Principle

> *Objects of a subclass should be substitutable for objects of their superclass.*

### Applied in

`UserRepository` extends `BaseRepository<IUser>`. Anywhere the code expects a `BaseRepository<IUser>`, a `UserRepository` can be passed — and the behavior is correct and expected.

```typescript
// AuthService constructor accepts the INTERFACE, not the concrete class
export class AuthService {
  constructor(private readonly userRepo: AuthRepository) {} // interface
}

// At wire-up, we pass the concrete UserRepository — fully substitutable
export const authService = new AuthService(userRepository);
```

Because `UserRepository` respects all contracts of `IRepository<IUser>`, this substitution is safe.

---

## I — Interface Segregation Principle

> *Clients should not be forced to depend on interfaces they don't use.*

### Applied in

`src/repositories/BaseRepository.ts` — the repository contract is split into two interfaces:

```typescript
// Read-only interface — use when you only need reads
export interface IReadRepository<T> {
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findAll(filter?: FilterQuery<T>): Promise<T[]>;
}

// Write interface — use when you only need writes
export interface IWriteRepository<T> {
  create(data: Partial<T>): Promise<T>;
  updateById(id: string, data: UpdateQuery<T>): Promise<T | null>;
  deleteById(id: string): Promise<boolean>;
}

// Combined for normal use
export interface IRepository<T> extends IReadRepository<T>, IWriteRepository<T> {}
```

A future read-only reporting service would depend only on `IReadRepository<T>` — it wouldn't be forced to implement or import write methods it doesn't use.

---

## D — Dependency Inversion Principle

> *High-level modules should not depend on low-level modules. Both should depend on abstractions.*

### Applied in

`src/services/AuthService.ts` depends on the `AuthRepository` interface — NOT on `UserRepository` (the concrete Mongoose implementation):

```typescript
// ✅ Correct — depends on abstraction
export type AuthRepository = IReadRepository<IUser> & IWriteRepository<IUser> & {
  findByUsernameOrEmail(identifier: string): Promise<IUser | null>;
};

export class AuthService {
  constructor(private readonly userRepo: AuthRepository) {} // 👈 interface, not class
}
```

If we needed to swap MongoDB for PostgreSQL, only the `UserRepository` implementation changes — `AuthService` is completely untouched.

**Frontend DIP:**

`LoginPage.tsx` depends on `authService` (the service abstraction) — NOT on `fetch()` or `apiClient` directly. The concrete HTTP mechanism is irrelevant to the page component.

```typescript
// ✅ LoginPage only knows the contract: "give me username and password, get a user back"
const user = await login(username, password);
```
