# Authentication & Landing Screens Implementation

This document tracks the creation of the user-facing authentication screens, translating the BRD V4 requirements into responsive React pages.

## 1. Landing Page (`src/pages/WelcomePage.tsx`)
We built a visually striking Welcome page to serve as the entry point.
- **Design Elements**: Absolute-positioned `div` elements with `blur-[120px]` and indigo/violet gradient overlays to create ambient glowing background orbs.
- **Framer Motion**: Wrapped the main card in a `<motion.div>` so it smoothly slides up and fades in on load.
- **Routing**: Uses `react-router-dom`'s `<Link>` to navigate to `/login`.

## 2. Login Screen (`src/pages/LoginPage.tsx`)
Implements **Screen 1 — Application Start / Login** from BRD V4.
- **State Management**: React `useState` tracks `isLoading` (disables button during API call) and `forcePasswordChange` flag.
- **Force Password Reset Flow**: Per BRD V4, Admin-created accounts must reset their password on first login.
  - **Implementation**: `handleLogin` calls `POST /api/auth/login`. If the response includes `forcePasswordChange: true`, the user is redirected to `/change-password`.
  - The Change Password route is only accessible with a `force_password_change` JWT — all other API endpoints reject it.
- **Error Handling**: Shows inline error messages for invalid credentials.

## 3. Change Password Screen (`src/pages/ChangePasswordPage.tsx`)
Implements the **Forced Password Change** flow from BRD V4.
- **Cannot be skipped**: The page is shown after login when `forcePasswordChange = true`. Navigating away without saving does not clear the flag.
- **Validation**: Password must meet strength requirements — 8+ characters, one uppercase, one number (validated server-side, displayed client-side).
- **On Success**: Calls `PATCH /api/auth/change-password`. Server sets `force_password_change = false` and issues a new full-access token.

## 4. Sign Up Screen (`src/pages/SignUpPage.tsx`)
Per BRD V4, **there is no self-registration**. This page is a placeholder that informs the user:
> "Account creation is managed by the Admin. Contact your system administrator to create an account."

No form submission exists here. All accounts are created by Admin via `Manage Users → Create User Account`.

## 5. Role-Based Dashboard Routing
After a successful login, the server response includes the user's role (`ADMIN`, `MANAGER`, `EMPLOYEE`). The frontend `App.tsx` router maps this to the correct dashboard:

| Role | Route | Component |
|------|-------|-----------|
| ADMIN | `/admin/dashboard` | `AdminDashboard.tsx` |
| MANAGER | `/manager/dashboard` | `ManagerDashboard.tsx` |
| EMPLOYEE | `/employee/dashboard` | `EmployeeDashboard.tsx` |

Protected route guards check the stored JWT role before rendering any dashboard page. If role doesn't match, the user is redirected to `/login`.

## 6. Session Storage
- JWT token is stored in `localStorage` under the key `prm_token`.
- On each API call, `axios` interceptors automatically attach the `Authorization: Bearer <token>` header.
- On logout (`POST /api/auth/logout`), the token is removed and the user is redirected to `/login`.
